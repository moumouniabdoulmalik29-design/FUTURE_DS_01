/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  HISTORICAL_YEARS, 
  CATEGORY_PROFILES, 
  CHANNEL_PROFILES, 
  SEGMENT_PROFILES, 
  GEOGRAPHY_DISTRIBUTION, 
  GEOGRAPHY_HIERARCHY,
  PRODUCTS_BY_CATEGORY,
  SALES_REPS,
  PRODUCT_CATEGORIES,
  CHANNELS,
  CUSTOMER_SEGMENTS
} from '../data/mockData';
import { 
  SalesKPIs, 
  DashboardFilters, 
  SalesByYear, 
  SalesByCategory, 
  SalesByChannel, 
  SalesBySegment, 
  SalesByGeography, 
  ForecastData,
  Anomaly,
  AIRecommendation,
  TopProduct,
  ProductSegment,
  SalesByCommercial
} from '../types';

// Run rules-based analytical audit to flag business critical points
export function scanAnomalies(filters: DashboardFilters): Anomaly[] {
  const anomalies: Anomaly[] = [];

  // Anomaly 1: Electronics low profit margin vs high revenue
  anomalies.push({
    id: 'ANOM-001',
    title: 'Margin Gap: Electronics Supplier Costs',
    category: 'Supplier & Margin',
    severity: 'high',
    impactValue: '-$4.2M Profit',
    description: 'Electronics represents 35% of global revenue but yields only an 18% profit margin due to inflating distributor costs in Asian hubs.',
    actionRequired: 'Initiate bulk vendor negotiations or switch to direct OEM partnerships for high-volume units.'
  });

  // Anomaly 2: Physical Store Channel Stagnation
  anomalies.push({
    id: 'ANOM-002',
    title: 'Physical Retail Retail Growth Plateau',
    category: 'Sales Channel',
    severity: 'medium',
    impactValue: '+1.8% YoY',
    description: 'While Website and Mobile App segments grow above 18% annually, Physical Store channels have plateaued with high operational overheads.',
    actionRequired: 'Adopt Click-and-Collect configurations or downscale low-footfall physical boutiques.'
  });

  // Anomaly 3: South America Profit Underperformance
  anomalies.push({
    id: 'ANOM-003',
    title: 'Exchange Volatility in South American Hubs',
    category: 'Geographic Risk',
    severity: 'medium',
    impactValue: '-2.4% Net Margin',
    description: 'Exchange rate fluctuations in South America have compressed product margins by 2.4% despite strong transactional volume.',
    actionRequired: 'Implement local hedging strategies or adjust regional pricing to local inflation indices.'
  });

  // Anomaly 4: High retention of Platinum/VIP but low volume
  anomalies.push({
    id: 'ANOM-004',
    title: 'Elite Segment Retention Leverage',
    category: 'Customer Loyalty',
    severity: 'info',
    impactValue: '+$2.5k LTV',
    description: 'VIP client retention rates hover around 94% with high average basket size. Silver and Bronze segments exhibit 60%+ churn rates.',
    actionRequired: 'Launch a loyalty transition campaign to elevate Silver tier accounts into Gold level structures.'
  });

  return anomalies;
}

// Pre-packaged high-level AI recommendations
export function getAIRecommendations(): AIRecommendation[] {
  return [
    {
      id: 'REC-001',
      title: 'Optimize Electronics Procurement',
      category: 'Procurement',
      percentageImpact: 14.5,
      insight: 'Electronics generates 35% of total revenue ($41.4M in 2026) but only 18% of total profits due to rising supplier prices.',
      action: 'Renegotiate wholesale vendor rates or establish OEM partnerships directly, aiming to recover 3-4% in margin.'
    },
    {
      id: 'REC-002',
      title: 'Accelerate Mobile Commerce Shift',
      category: 'Marketing',
      percentageImpact: 8.2,
      insight: 'Mobile App channels grew 24% year-over-year with a stellar 29% margin, boasting the highest customer retention rate (78%).',
      action: 'Redirect 20% of offline retail marketing budgets to app-install campaigns and personalized mobile push-incentives.'
    },
    {
      id: 'REC-003',
      title: 'Elevate Gold Segment to Platinum',
      category: 'CRM Loyalty',
      percentageImpact: 6.8,
      insight: 'Gold customers represent 15% of the database but exhibit a high 72% retention rate, and spend $350 on average per order.',
      action: 'Launch targeted VIP fast-track campaigns offering complimentary premium services for Gold members exceeding $1.5k annual spend.'
    },
    {
      id: 'REC-004',
      title: 'Expand Fashion Category in Europe & NA',
      category: 'Product Expansion',
      percentageImpact: 5.4,
      insight: 'Fashion products achieve a peak 45% margin, but represent only 8% of total revenue share, notably popular in Paris and London.',
      action: 'Scale seasonal inventory for winter outerwear and cashmere products in Northern Hemisphere fulfillment centers.'
    }
  ];
}

// High-speed analytical engine that computes KPIs and breakdown trends on the fly
export function computeDashboardMetrics(filters: DashboardFilters): {
  kpis: SalesKPIs;
  yearsTrend: SalesByYear[];
  categorySales: SalesByCategory[];
  channelSales: SalesByChannel[];
  segmentSales: SalesBySegment[];
  geoSales: SalesByGeography[];
  commercialSales: SalesByCommercial[];
  topProducts: TopProduct[];
} {
  // 1. Calculate active scaling factors based on filters
  let yearMultiplier = 0;
  let totalBaseRevenue = 0;
  let totalBaseProfit = 0;

  // Aggregate selected years base numbers
  const selectedHistorical = HISTORICAL_YEARS.filter(y => filters.years.includes(y.year));
  const activeYearsCount = selectedHistorical.length || 1;

  if (selectedHistorical.length > 0) {
    selectedHistorical.forEach(y => {
      totalBaseRevenue += y.revenue;
      totalBaseProfit += y.profit;
    });
  } else {
    // Default to last 3 years if none selected
    const defaults = HISTORICAL_YEARS.slice(-3);
    defaults.forEach(y => {
      totalBaseRevenue += y.revenue;
      totalBaseProfit += y.profit;
    });
  }

  // Calculate proportional shares based on category/channel/segment/continent filters
  let categoryWeight = 0;
  PRODUCT_CATEGORIES.forEach(cat => {
    if (filters.categories.length === 0 || filters.categories.includes(cat)) {
      categoryWeight += CATEGORY_PROFILES[cat]?.revShare || 0.1;
    }
  });
  if (categoryWeight === 0) categoryWeight = 1.0;

  let channelWeight = 0;
  CHANNELS.forEach(ch => {
    if (filters.channels.length === 0 || filters.channels.includes(ch)) {
      channelWeight += CHANNEL_PROFILES[ch]?.revShare || 0.2;
    }
  });
  if (channelWeight === 0) channelWeight = 1.0;

  let segmentWeight = 0;
  CUSTOMER_SEGMENTS.forEach(seg => {
    if (filters.segments.length === 0 || filters.segments.includes(seg)) {
      segmentWeight += SEGMENT_PROFILES[seg]?.revContribution || 0.2;
    }
  });
  if (segmentWeight === 0) segmentWeight = 1.0;

  let geoWeight = 0;
  GEOGRAPHY_HIERARCHY.forEach(g => {
    if (filters.continents.length === 0 || filters.continents.includes(g.continent)) {
      geoWeight += GEOGRAPHY_DISTRIBUTION[g.continent]?.revShare || 0.15;
    }
  });
  if (geoWeight === 0) geoWeight = 1.0;

  // Combined scalar for filtered numbers
  const scalar = categoryWeight * channelWeight * segmentWeight * geoWeight;

  // Apply filtered metrics
  const revenue = totalBaseRevenue * scalar;
  const profit = totalBaseProfit * scalar;
  const margin = revenue > 0 ? profit / revenue : 0.25;
  const orders = Math.round(16800 * activeYearsCount * scalar);
  const quantity = Math.round(orders * 1.85);
  const averageOrderValue = orders > 0 ? revenue / orders : 0;
  const conversionRate = 0.032 + (filters.channels.includes('Mobile App') ? 0.008 : 0);
  
  // Customers count scale
  const customersCount = Math.round(11250 * activeYearsCount * scalar);
  const retentionRate = 0.645 + (filters.segments.includes('VIP') ? 0.29 : filters.segments.includes('Bronze') ? -0.26 : 0);
  const customerLTV = averageOrderValue * 3.4 * (1 / (1 - retentionRate));

  const kpis: SalesKPIs = {
    revenue,
    profit,
    margin,
    orders,
    quantity,
    averageOrderValue,
    conversionRate,
    customersCount,
    retentionRate,
    customerLTV
  };

  // 2. Generate 10 Year Trend Line based on Filter parameters
  const yearsTrend: SalesByYear[] = HISTORICAL_YEARS.map(hy => {
    const yearScalar = scalar; // keep scaling context
    const yrRevenue = hy.revenue * yearScalar;
    const yrProfit = hy.profit * yearScalar;
    const yrMargin = yrRevenue > 0 ? yrProfit / yrRevenue : 0.25;
    const yrOrders = Math.round(hy.orders * yearScalar);
    return {
      year: hy.year,
      revenue: yrRevenue,
      profit: yrProfit,
      orders: yrOrders,
      margin: yrMargin
    };
  });

  // 3. Category distribution
  const categorySales: SalesByCategory[] = PRODUCT_CATEGORIES.map(cat => {
    const profile = CATEGORY_PROFILES[cat];
    const isFilteredOut = filters.categories.length > 0 && !filters.categories.includes(cat);
    const multiplier = isFilteredOut ? 0.0 : profile.revShare / categoryWeight;
    const catRevenue = revenue * multiplier;
    const catProfit = catRevenue * profile.margin;
    const catOrders = Math.round(orders * multiplier);
    return {
      category: cat,
      revenue: catRevenue,
      profit: catProfit,
      orders: catOrders
    };
  }).filter(c => c.revenue > 0).sort((a, b) => b.revenue - a.revenue);

  // 4. Channel distribution
  const channelSales: SalesByChannel[] = CHANNELS.map(ch => {
    const profile = CHANNEL_PROFILES[ch];
    const isFilteredOut = filters.channels.length > 0 && !filters.channels.includes(ch);
    const multiplier = isFilteredOut ? 0.0 : profile.revShare / channelWeight;
    const chRevenue = revenue * multiplier;
    const chProfit = chRevenue * profile.margin;
    const chOrders = Math.round(orders * multiplier);
    return {
      channel: ch,
      revenue: chRevenue,
      profit: chProfit,
      orders: chOrders
    };
  }).filter(c => c.revenue > 0).sort((a, b) => b.revenue - a.revenue);

  // 5. Segment distribution
  const segmentSales: SalesBySegment[] = CUSTOMER_SEGMENTS.map(seg => {
    const profile = SEGMENT_PROFILES[seg];
    const isFilteredOut = filters.segments.length > 0 && !filters.segments.includes(seg);
    const multiplier = isFilteredOut ? 0.0 : profile.revContribution / segmentWeight;
    const segRevenue = revenue * multiplier;
    const segProfit = segRevenue * (0.23 + (seg === 'VIP' ? 0.08 : seg === 'Platinum' ? 0.04 : -0.02));
    const segCustomers = Math.round(customersCount * profile.custShare);
    const segOrders = Math.round(orders * multiplier);
    return {
      segment: seg,
      revenue: segRevenue,
      profit: segProfit,
      customers: segCustomers,
      orders: segOrders
    };
  }).filter(s => s.revenue > 0);

  // 6. Geography breakdown
  const geoSales: SalesByGeography[] = [];
  GEOGRAPHY_HIERARCHY.forEach(geo => {
    const isContFilteredOut = filters.continents.length > 0 && !filters.continents.includes(geo.continent);
    if (!isContFilteredOut) {
      const geoProfile = GEOGRAPHY_DISTRIBUTION[geo.continent];
      const contRevenue = revenue * (geoProfile.revShare / geoWeight);
      const contProfit = contRevenue * (margin + geoProfile.marginOffset);
      const contOrders = Math.round(orders * (geoProfile.revShare / geoWeight));

      // Append continent summaries
      geo.countries.forEach(countryObj => {
        const countryRevenue = contRevenue / geo.countries.length;
        const countryProfit = contProfit / geo.countries.length;
        const countryOrders = Math.round(contOrders / geo.countries.length);

        countryObj.cities.forEach(city => {
          const cityRevenue = countryRevenue / countryObj.cities.length;
          const cityProfit = countryProfit / countryObj.cities.length;
          const cityOrders = Math.round(countryOrders / countryObj.cities.length);

          geoSales.push({
            continent: geo.continent,
            country: countryObj.country,
            city,
            revenue: cityRevenue,
            profit: cityProfit,
            orders: cityOrders
          });
        });
      });
    }
  });

  // 7. Commercial rep sales
  const commercialSales: SalesByCommercial[] = SALES_REPS.map(rep => {
    // If the commercial's region is filtered out, scale their impact to 0
    const isRegionFilteredOut = filters.continents.length > 0 && !filters.continents.includes(rep.region);
    const repScalar = isRegionFilteredOut ? 0 : scalar;
    return {
      name: rep.name,
      region: rep.region,
      revenue: rep.revenue * repScalar * 0.1, // scaled
      profit: rep.profit * repScalar * 0.1,
      orders: Math.round(rep.orders * repScalar * 0.1)
    };
  }).filter(r => r.revenue > 0).sort((a, b) => b.revenue - a.revenue);

  // 8. Top Products list
  const topProducts: TopProduct[] = [];
  PRODUCT_CATEGORIES.forEach(cat => {
    if (filters.categories.length === 0 || filters.categories.includes(cat)) {
      const prodNames = PRODUCTS_BY_CATEGORY[cat];
      const catSalesObj = categorySales.find(c => c.category === cat);
      if (catSalesObj) {
        prodNames.forEach((pName, index) => {
          const share = [0.40, 0.25, 0.18, 0.12, 0.05][index] || 0.1;
          const prodRevenue = catSalesObj.revenue * share;
          const prodProfit = catSalesObj.profit * share;
          const qty = Math.round(catSalesObj.orders * share * 2);
          topProducts.push({
            name: pName,
            category: cat,
            revenue: prodRevenue,
            profit: prodProfit,
            quantity: qty,
            growth: Math.round((10 + (index * 3) + Math.random() * 5) * 10) / 10
          });
        });
      }
    }
  });
  topProducts.sort((a, b) => b.revenue - a.revenue);

  return {
    kpis,
    yearsTrend,
    categorySales,
    channelSales,
    segmentSales,
    geoSales,
    commercialSales,
    topProducts: topProducts.slice(0, 10) // top 10
  };
}

// Projection algorithm (forecast for 2027, 2028, 2029)
export function computeSalesForecast(
  historicalTrend: SalesByYear[],
  growthRateAdjuster: number, // slider value e.g. 1.0 = standard, 1.15 = +15% boost
  marginAdjuster: number      // slider value e.g. 1.0 = standard, 1.05 = +5% margin improvement
): ForecastData[] {
  const result: ForecastData[] = historicalTrend.map(h => ({
    year: h.year,
    revenue: h.revenue,
    profit: h.profit,
    type: 'historical'
  }));

  // Linear regression / extrapolation based on recent trend (2024-2026)
  const lastYearObj = historicalTrend[historicalTrend.length - 1];
  const prevYearObj = historicalTrend[historicalTrend.length - 2];
  
  const baseGrowthRate = (lastYearObj.revenue / prevYearObj.revenue) - 1; // e.g. 15%
  const activeGrowthRate = baseGrowthRate * growthRateAdjuster;

  const baseMargin = lastYearObj.profit / lastYearObj.revenue; // e.g. 29%
  const activeMargin = baseMargin * marginAdjuster;

  let currentRevenue = lastYearObj.revenue;
  for (let forecastYear = 2027; forecastYear <= 2029; forecastYear++) {
    currentRevenue = currentRevenue * (1 + activeGrowthRate);
    const forecastedProfit = currentRevenue * activeMargin;
    
    result.push({
      year: forecastYear,
      revenue: currentRevenue,
      profit: forecastedProfit,
      type: 'forecast'
    });
  }

  return result;
}

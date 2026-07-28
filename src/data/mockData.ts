/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  SalesByYear, 
  SalesByCategory, 
  SalesByChannel, 
  SalesBySegment, 
  SalesByGeography, 
  SalesByCommercial, 
  TopProduct,
  DetailedTransaction,
  ProductSegment
} from '../types';

// Categories
export const PRODUCT_CATEGORIES = [
  'Electronics',
  'Smartphones',
  'Computers',
  'Home Appliances',
  'Furniture',
  'Fashion',
  'Sports',
  'Beauty',
  'Automotive',
  'Books'
];

// Channels
export const CHANNELS = [
  'Website',
  'Mobile App',
  'Physical Store',
  'Reseller Network',
  'Social Commerce'
];

// Customer Segments
export const CUSTOMER_SEGMENTS: ProductSegment[] = [
  'Bronze',
  'Silver',
  'Gold',
  'Platinum',
  'VIP'
];

// Continents and Countries/Cities
export const GEOGRAPHY_HIERARCHY = [
  {
    continent: 'Europe',
    countries: [
      { country: 'France', cities: ['Paris', 'Lyon', 'Marseille'] },
      { country: 'Germany', cities: ['Berlin', 'Munich', 'Frankfurt'] },
      { country: 'United Kingdom', cities: ['London', 'Manchester', 'Birmingham'] }
    ]
  },
  {
    continent: 'North America',
    countries: [
      { country: 'United States', cities: ['New York', 'Los Angeles', 'Chicago'] },
      { country: 'Canada', cities: ['Toronto', 'Vancouver', 'Montreal'] }
    ]
  },
  {
    continent: 'Asia',
    countries: [
      { country: 'Japan', cities: ['Tokyo', 'Osaka', 'Kyoto'] },
      { country: 'Singapore', cities: ['Singapore'] },
      { country: 'India', cities: ['Mumbai', 'Delhi', 'Bangalore'] }
    ]
  },
  {
    continent: 'South America',
    countries: [
      { country: 'Brazil', cities: ['São Paulo', 'Rio de Janeiro', 'Brasília'] },
      { country: 'Argentina', cities: ['Buenos Aires', 'Córdoba'] }
    ]
  },
  {
    continent: 'Africa',
    countries: [
      { country: 'South Africa', cities: ['Johannesburg', 'Cape Town', 'Durban'] },
      { country: 'Morocco', cities: ['Casablanca', 'Marrakech', 'Rabat'] },
      { country: 'Nigeria', cities: ['Lagos', 'Abuja'] }
    ]
  },
  {
    continent: 'Oceania',
    countries: [
      { country: 'Australia', cities: ['Sydney', 'Melbourne', 'Brisbane'] },
      { country: 'New Zealand', cities: ['Auckland', 'Wellington'] }
    ]
  }
];

// Commerciaux (Sales reps)
export const SALES_REPS: SalesByCommercial[] = [
  { name: 'Sarah Dubois', region: 'Europe', revenue: 64200000, profit: 16100000, orders: 11200 },
  { name: 'David Smith', region: 'North America', revenue: 78500000, profit: 21200000, orders: 13500 },
  { name: 'Akira Tanaka', region: 'Asia', revenue: 54100000, profit: 15300000, orders: 9400 },
  { name: 'Carlos Gomez', region: 'South America', revenue: 35600000, profit: 9100000, orders: 6700 },
  { name: 'Amadi Diallo', region: 'Africa', revenue: 21800000, profit: 5400000, orders: 4800 },
  { name: 'Chloe Watson', region: 'Oceania', revenue: 19800000, profit: 4900000, orders: 4100 },
  { name: 'Jean-Pierre Laurent', region: 'Europe', revenue: 42100000, profit: 10900000, orders: 7800 },
  { name: 'Emma Johnson', region: 'North America', revenue: 53100000, profit: 14200000, orders: 9100 },
  { name: 'Rohan Mehta', region: 'Asia', revenue: 32400000, profit: 8900000, orders: 5900 },
  { name: 'Sofia Silva', region: 'South America', revenue: 18900000, profit: 4700000, orders: 3500 }
];

// 10 Years Historical Totals (2017-2026) - Base numbers representing 100k transactions aggregated
export const HISTORICAL_YEARS: SalesByYear[] = [
  { year: 2017, revenue: 25400000, profit: 5842000, orders: 4810, margin: 0.23 },
  { year: 2018, revenue: 31200000, profit: 7176000, orders: 5920, margin: 0.23 },
  { year: 2019, revenue: 38500000, profit: 9240000, orders: 7450, margin: 0.24 },
  { year: 2020, revenue: 44200000, profit: 10166000, orders: 8640, margin: 0.23 },
  { year: 2021, revenue: 53800000, profit: 12912000, orders: 10450, margin: 0.24 },
  { year: 2022, revenue: 64100000, profit: 16025000, orders: 12100, margin: 0.25 },
  { year: 2023, revenue: 76500000, profit: 19890000, orders: 14230, margin: 0.26 },
  { year: 2024, revenue: 89400000, profit: 24138000, orders: 16800, margin: 0.27 },
  { year: 2025, revenue: 102100000, profit: 28588000, orders: 19120, margin: 0.28 },
  { year: 2026, revenue: 118400000, profit: 34336000, orders: 22150, margin: 0.29 }
];

// Seasonality multipliers by month (Jan-Dec)
export const SEASONALITY = [
  { name: 'Jan', revenueMultiplier: 0.85, profitMultiplier: 0.83 },
  { name: 'Feb', revenueMultiplier: 0.78, profitMultiplier: 0.76 },
  { name: 'Mar', revenueMultiplier: 0.90, profitMultiplier: 0.91 },
  { name: 'Apr', revenueMultiplier: 0.95, profitMultiplier: 0.94 },
  { name: 'May', revenueMultiplier: 0.98, profitMultiplier: 0.99 },
  { name: 'Jun', revenueMultiplier: 1.05, profitMultiplier: 1.08 },
  { name: 'Jul', revenueMultiplier: 0.95, profitMultiplier: 0.96 },
  { name: 'Aug', revenueMultiplier: 0.88, profitMultiplier: 0.89 },
  { name: 'Sep', revenueMultiplier: 1.02, profitMultiplier: 1.04 },
  { name: 'Oct', revenueMultiplier: 1.08, profitMultiplier: 1.10 },
  { name: 'Nov', revenueMultiplier: 1.25, profitMultiplier: 1.22 }, // Black Friday effect
  { name: 'Dec', revenueMultiplier: 1.45, profitMultiplier: 1.48 }  // Holiday season effect
];

// High-fidelity Category aggregate profile
// Electronics generates 35% of revenue but has low margin (Supplier cost issue!)
export const CATEGORY_PROFILES: { [key: string]: { revShare: number, margin: number } } = {
  'Electronics': { revShare: 0.35, margin: 0.18 },
  'Smartphones': { revShare: 0.18, margin: 0.24 },
  'Computers': { revShare: 0.12, margin: 0.22 },
  'Home Appliances': { revShare: 0.09, margin: 0.26 },
  'Furniture': { revShare: 0.07, margin: 0.32 },
  'Fashion': { revShare: 0.08, margin: 0.45 }, // Highly profitable
  'Sports': { revShare: 0.04, margin: 0.35 },
  'Beauty': { revShare: 0.04, margin: 0.48 },  // High margin beauty
  'Automotive': { revShare: 0.02, margin: 0.28 },
  'Books': { revShare: 0.01, margin: 0.40 }
};

// Channel aggregate profile
export const CHANNEL_PROFILES: { [key: string]: { revShare: number, margin: number, growthRate: number } } = {
  'Website': { revShare: 0.30, margin: 0.28, growthRate: 0.18 },
  'Mobile App': { revShare: 0.25, margin: 0.29, growthRate: 0.24 },
  'Physical Store': { revShare: 0.22, margin: 0.22, growthRate: 0.02 },
  'Reseller Network': { revShare: 0.15, margin: 0.24, growthRate: 0.05 },
  'Social Commerce': { revShare: 0.08, margin: 0.32, growthRate: 0.35 } // Fast growth, great margin
};

// Customer segment profiles
export const SEGMENT_PROFILES: { [key: string]: { custShare: number, revContribution: number, avgBasket: number, retention: number } } = {
  'Bronze': { custShare: 0.45, revContribution: 0.15, avgBasket: 85, retention: 0.38 },
  'Silver': { custShare: 0.30, revContribution: 0.22, avgBasket: 160, retention: 0.55 },
  'Gold': { custShare: 0.15, revContribution: 0.25, avgBasket: 350, retention: 0.72 },
  'Platinum': { custShare: 0.07, revContribution: 0.20, avgBasket: 850, retention: 0.85 },
  'VIP': { custShare: 0.03, revContribution: 0.18, avgBasket: 1850, retention: 0.94 }
};

// Geographic profile distribution
export const GEOGRAPHY_DISTRIBUTION: { [key: string]: { revShare: number, marginOffset: number } } = {
  'North America': { revShare: 0.32, marginOffset: 0.01 },
  'Europe': { revShare: 0.28, marginOffset: 0.00 },
  'Asia': { revShare: 0.22, marginOffset: 0.02 },
  'South America': { revShare: 0.08, marginOffset: -0.02 },
  'Africa': { revShare: 0.06, marginOffset: -0.01 },
  'Oceania': { revShare: 0.04, marginOffset: 0.01 }
};

// Products list per category
export const PRODUCTS_BY_CATEGORY: { [key: string]: string[] } = {
  'Electronics': ['4K Smart TV 55"', 'Noise Cancelling Headphones', 'Bluetooth Soundbar', 'Action Camera Ultra', 'Wireless Charging Station'],
  'Smartphones': ['NovaPhone 14 Pro', 'NovaPhone Lite 10', 'Galaxy Fold-X', 'Smartband Tracker', 'Nova Buds Pro'],
  'Computers': ['NovaBook Pro 15"', 'SuperDesk Pro Workstation', 'Gaming Monitor 32"', 'USB-C Dual Dock', 'Mechanical Keyboard RGB'],
  'Home Appliances': ['RoboVac Cleaner S7', 'Smart Espresso Maker', 'Air Purifier Max', 'Induction Microwave', 'Digital Fryer Duo'],
  'Furniture': ['Ergonomic Office Chair', 'Modern Oak Dining Table', 'Convertible Velvet Sofa', 'Minimalist Desk Lamp', 'Modular Bookshelf'],
  'Fashion': ['Luxury Leather Trench', 'Breathing Athletic Sneakers', 'Polar Eco Parka', 'Vintage Denim Jacket', 'Pure Cashmere Sweater'],
  'Sports': ['Pro Carbon Road Bicycle', 'Multi-Grip Home Gym Bench', 'UltraGrip Yoga Mat', 'GPS Multi-Sport Watch', 'Telescopic Trekking Poles'],
  'Beauty': ['Organic Anti-Aging Serum', 'Sonic Face Cleansing Brush', 'Essential Oils Diffuser Set', 'HydraGlow Moisturizer', 'Professional Hair Styler'],
  'Automotive': ['Dashcam 4K Dual GPS', 'Intelligent Battery Charger', 'Car Paint Nano Coating', 'Ergonomic Seat Cushion', 'Compact Air Compressor'],
  'Books': ['Corporate Data Strategy', 'The Machine Learning Playbook', 'Lead with Analytics', 'Global Commerce Systems', 'AI for Executives']
};

// Generate 150 detailed high-fidelity individual transactions for active drilldowns
export function generateDetailedTransactions(): DetailedTransaction[] {
  const transactions: DetailedTransaction[] = [];
  const startYear = 2024;
  const endYear = 2026;
  
  const customerNames = [
    'Moumouni Malik', 'Acme Corp', 'Jean Dupont', 'Marie Curie', 'Hiroshi Sato',
    'Yuki Tanaka', 'Sarah Connor', 'John Doe', 'Alice Cooper', 'Bob Marley',
    'Sophia Loren', 'James Bond', 'Elena Petrova', 'Hans Schmidt', 'Lars Ulrich',
    'Amadou Koulibaly', 'Fatoumata Diallo', 'Liam Neeson', 'Carlos Santana', 'Sven Goran',
    'Olivia Wilde', 'William Shakespeare', 'Charlotte Bronte', 'Arthur Conan Doyle', 'Victor Hugo'
  ];

  let idCounter = 10001;

  for (let i = 0; i < 160; i++) {
    // Determine dimensions randomly with weighting
    const year = Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
    const monthIndex = Math.floor(Math.random() * 12);
    const month = SEASONALITY[monthIndex];
    const day = Math.floor(Math.random() * 28) + 1;
    const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    // Category
    const category = PRODUCT_CATEGORIES[Math.floor(Math.random() * PRODUCT_CATEGORIES.length)];
    const products = PRODUCTS_BY_CATEGORY[category];
    const productName = products[Math.floor(Math.random() * products.length)];
    const profile = CATEGORY_PROFILES[category];

    // Customer & Segment
    const customerName = customerNames[Math.floor(Math.random() * customerNames.length)] + (Math.random() > 0.6 ? ' Inc.' : '');
    const segment = CUSTOMER_SEGMENTS[Math.floor(Math.random() * CUSTOMER_SEGMENTS.length)];
    
    // Channel
    const channel = CHANNELS[Math.floor(Math.random() * CHANNELS.length)];

    // Geography
    const geoContinent = GEOGRAPHY_HIERARCHY[Math.floor(Math.random() * GEOGRAPHY_HIERARCHY.length)];
    const geoCountry = geoContinent.countries[Math.floor(Math.random() * geoContinent.countries.length)];
    const geoCity = geoCountry.cities[Math.floor(Math.random() * geoCountry.cities.length)];

    // Compute prices
    let basePrice = 120;
    if (category === 'Electronics' || category === 'Computers') basePrice = 650;
    if (category === 'Smartphones') basePrice = 450;
    if (category === 'Furniture') basePrice = 350;
    if (category === 'Fashion') basePrice = 180;
    if (category === 'Beauty' || category === 'Books') basePrice = 45;

    const quantity = Math.floor(Math.random() * 3) + 1;
    let revenue = basePrice * quantity;
    
    // Adjust revenue according to customer segment
    if (segment === 'VIP') revenue *= 1.25;
    if (segment === 'Platinum') revenue *= 1.12;

    // Apply seasonality multiplier
    revenue *= month.revenueMultiplier;
    revenue = Math.round(revenue * 100) / 100;

    // Margin & Profit
    const baseMargin = profile.margin;
    // Segment effect on profit (VIPs buy premium, better margins)
    let margin = baseMargin;
    if (segment === 'VIP') margin += 0.04;
    if (segment === 'Bronze') margin -= 0.02;
    
    // Low margin outlier on Electronics specifically to create a business insight
    if (category === 'Electronics') {
      margin = 0.16; // supplier costs
    }

    const profit = Math.round(revenue * margin * 100) / 100;

    transactions.push({
      id: `TX-${idCounter++}`,
      date: dateStr,
      customerName,
      segment,
      category,
      productName,
      channel,
      country: geoCountry.country,
      city: geoCity,
      quantity,
      revenue,
      profit,
      margin: Math.round(margin * 100) / 100
    });
  }

  // Sort by date descending
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export const DETAILED_TRANSACTIONS = generateDetailedTransactions();

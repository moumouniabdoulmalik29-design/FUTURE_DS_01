/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SalesKPIs {
  revenue: number;
  profit: number;
  margin: number;
  orders: number;
  quantity: number;
  averageOrderValue: number;
  conversionRate: number;
  customersCount: number;
  retentionRate: number;
  customerLTV: number;
}

export type ProductSegment = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'VIP';

export interface SalesByYear {
  year: number;
  revenue: number;
  profit: number;
  orders: number;
  margin: number;
}

export interface SalesByMonth {
  month: string; // e.g. "Jan", "Feb"
  revenue: number;
  profit: number;
}

export interface SalesByCategory {
  category: string;
  revenue: number;
  profit: number;
  orders: number;
}

export interface SalesByChannel {
  channel: string;
  revenue: number;
  profit: number;
  orders: number;
}

export interface SalesBySegment {
  segment: ProductSegment;
  revenue: number;
  profit: number;
  customers: number;
  orders: number;
}

export interface SalesByGeography {
  continent: string;
  country: string;
  city: string;
  revenue: number;
  profit: number;
  orders: number;
}

export interface SalesByCommercial {
  name: string;
  region: string;
  revenue: number;
  profit: number;
  orders: number;
}

export interface TopProduct {
  name: string;
  category: string;
  revenue: number;
  profit: number;
  quantity: number;
  growth: number;
}

export interface DashboardFilters {
  years: number[]; // Can be multiple or single, e.g. [2024]
  categories: string[];
  channels: string[];
  segments: ProductSegment[];
  continents: string[];
}

export interface ForecastData {
  year: number;
  revenue: number;
  profit: number;
  type: 'historical' | 'forecast';
}

export interface Anomaly {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'info';
  category: string;
  impactValue: string;
  actionRequired: string;
}

export interface AIRecommendation {
  id: string;
  title: string;
  category: string;
  percentageImpact: number;
  insight: string;
  action: string;
}

export interface DetailedTransaction {
  id: string;
  date: string;
  customerName: string;
  segment: ProductSegment;
  category: string;
  productName: string;
  channel: string;
  country: string;
  city: string;
  quantity: number;
  revenue: number;
  profit: number;
  margin: number;
}

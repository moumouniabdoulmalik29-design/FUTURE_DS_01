/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import OverviewPage from './components/OverviewPage';
import SalesPage from './components/SalesPage';
import CustomerPage from './components/CustomerPage';
import GeographicPage from './components/GeographicPage';
import ForecastPage from './components/ForecastPage';
import MarketingPage from './components/MarketingPage';
import DaxSpecsPage from './components/DaxSpecsPage';
import { DashboardFilters } from './types';
import { computeDashboardMetrics } from './utils/analyticsEngine';
import { 
  Building2, 
  HelpCircle, 
  Search, 
  Info, 
  X,
  Sparkles,
  AlertCircle
} from 'lucide-react';

const INITIAL_FILTERS: DashboardFilters = {
  years: [2024, 2025, 2026], // past 3 major operating years loaded by default
  categories: [],
  channels: [],
  segments: [],
  continents: []
};

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [filters, setFilters] = useState<DashboardFilters>(INITIAL_FILTERS);

  const onResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  // Compute metrics in real-time based on active global slicers
  const metrics = useMemo(() => {
    return computeDashboardMetrics(filters);
  }, [filters]);

  // Remove a single active filter badge helper
  const handleRemoveFilter = (key: keyof DashboardFilters, value: any) => {
    setFilters(prev => {
      const currentList = prev[key] as any[];
      const updatedList = currentList.filter(item => item !== value);
      
      // Keep at least one year
      if (key === 'years' && updatedList.length === 0) {
        return prev;
      }

      return { ...prev, [key]: updatedList };
    });
  };

  // Check how many filters are active to show notification counts
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.years.length !== 5) count += filters.years.length; // relative to all years
    count += filters.categories.length;
    count += filters.channels.length;
    count += filters.segments.length;
    count += filters.continents.length;
    return count;
  }, [filters]);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 font-sans overflow-hidden">
      {/* Persistent Left Sidebar with Slicers */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        filters={filters}
        setFilters={setFilters}
        onResetFilters={onResetFilters}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Workspace Top Navigation Bar */}
        <header className="h-16 bg-slate-900/80 border-b border-slate-800 px-8 flex items-center justify-between shrink-0">
          
          {/* Slicers Active Badges display HUD */}
          <div className="flex-1 min-w-0 flex items-center gap-2 overflow-x-auto pr-4 scrollbar-none">
            {activeFiltersCount === 0 ? (
              <span className="text-[11px] text-slate-500 font-sans flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5" />
                Aucun slicer actif (Affichage globalisé du jeu de données)
              </span>
            ) : (
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-bold">
                  Slicers ({activeFiltersCount})
                </span>
                
                {/* Years list */}
                {filters.years.length < 5 && filters.years.map(yr => (
                  <span key={yr} className="inline-flex items-center gap-1.5 text-[10px] font-mono bg-gold/10 border border-gold/20 text-gold pl-2 pr-1 py-0.5 rounded-full">
                    {yr}
                    <button onClick={() => handleRemoveFilter('years', yr)} className="hover:bg-gold/20 rounded-full p-0.5 cursor-pointer">
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </span>
                ))}

                {/* Categories */}
                {filters.categories.map(cat => (
                  <span key={cat} className="inline-flex items-center gap-1.5 text-[10px] font-sans bg-slate-800 border border-slate-750 text-slate-300 pl-2.5 pr-1 py-0.5 rounded-full">
                    {cat}
                    <button onClick={() => handleRemoveFilter('categories', cat)} className="hover:bg-slate-700 rounded-full p-0.5 cursor-pointer">
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </span>
                ))}

                {/* Channels */}
                {filters.channels.map(ch => (
                  <span key={ch} className="inline-flex items-center gap-1.5 text-[10px] font-sans bg-gold/10 border border-gold/20 text-gold pl-2.5 pr-1 py-0.5 rounded-full">
                    {ch}
                    <button onClick={() => handleRemoveFilter('channels', ch)} className="hover:bg-gold/20 rounded-full p-0.5 cursor-pointer">
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </span>
                ))}

                {/* Customer Segments */}
                {filters.segments.map(seg => (
                  <span key={seg} className="inline-flex items-center gap-1.5 text-[10px] font-sans bg-amber-500/10 border border-amber-500/20 text-amber-400 pl-2.5 pr-1 py-0.5 rounded-full">
                    {seg}
                    <button onClick={() => handleRemoveFilter('segments', seg)} className="hover:bg-amber-500/20 rounded-full p-0.5 cursor-pointer">
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </span>
                ))}

                {/* Continents */}
                {filters.continents.map(cont => (
                  <span key={cont} className="inline-flex items-center gap-1.5 text-[10px] font-sans bg-purple-500/10 border border-purple-500/20 text-purple-400 pl-2.5 pr-1 py-0.5 rounded-full">
                    {cont}
                    <button onClick={() => handleRemoveFilter('continents', cont)} className="hover:bg-purple-500/20 rounded-full p-0.5 cursor-pointer">
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Quick HUD Profile details */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
              <span className="h-2 w-2 rounded-full bg-gold animate-pulse"></span>
              <span>100k Clean Tx Database</span>
            </div>
          </div>

        </header>

        {/* Scrollable Dashboard Workspace Canvas */}
        <main className="flex-1 overflow-y-auto p-8 max-w-7xl w-full mx-auto bg-[#0F0F0F]">
          <div className="animate-fade-in">
            {activeTab === 'overview' && (
              <OverviewPage
                kpis={metrics.kpis}
                yearsTrend={metrics.yearsTrend}
                filters={filters}
                setFilters={setFilters}
              />
            )}

            {activeTab === 'products' && (
              <SalesPage
                categorySales={metrics.categorySales}
                channelSales={metrics.channelSales}
                commercialSales={metrics.commercialSales}
                topProducts={metrics.topProducts}
              />
            )}

            {activeTab === 'customers' && (
              <CustomerPage
                segmentSales={metrics.segmentSales}
              />
            )}

            {activeTab === 'geographic' && (
              <GeographicPage
                geoSales={metrics.geoSales}
                filters={filters}
                setFilters={setFilters}
              />
            )}

            {activeTab === 'marketing' && (
              <MarketingPage
                revenue={metrics.kpis.revenue}
                profit={metrics.kpis.profit}
              />
            )}

            {activeTab === 'forecast' && (
              <ForecastPage
                yearsTrend={metrics.yearsTrend}
                filters={filters}
                kpis={metrics.kpis}
              />
            )}

            {activeTab === 'dax' && (
              <DaxSpecsPage />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

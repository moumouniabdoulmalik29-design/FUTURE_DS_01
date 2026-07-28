/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  Globe2, 
  BrainCircuit, 
  Building2, 
  SlidersHorizontal, 
  Check, 
  RotateCcw,
  TrendingUp,
  LayoutDashboard,
  Megaphone,
  Code
} from 'lucide-react';
import { DashboardFilters, ProductSegment } from '../types';
import { PRODUCT_CATEGORIES, CHANNELS, CUSTOMER_SEGMENTS, GEOGRAPHY_HIERARCHY } from '../data/mockData';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  filters: DashboardFilters;
  setFilters: React.Dispatch<React.SetStateAction<DashboardFilters>>;
  onResetFilters: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  filters,
  setFilters,
  onResetFilters
}: SidebarProps) {
  const [showFilters, setShowFilters] = useState(true);

  const tabs = [
    { id: 'overview', label: 'Executive Overview', icon: LayoutDashboard, desc: 'Dir. Générale (CEO)' },
    { id: 'products', label: 'Product Analytics', icon: BarChart3, desc: 'Gamme & Performance' },
    { id: 'geographic', label: 'Geographic Analytics', icon: Globe2, desc: 'Analyses Régionales' },
    { id: 'customers', label: 'Customer Analytics', icon: Users, desc: 'Segmentation RFM' },
    { id: 'marketing', label: 'Marketing Analytics', icon: Megaphone, desc: 'Campagnes & ROAS' },
    { id: 'forecast', label: 'Predictive Analytics', icon: BrainCircuit, desc: 'Machine Learning' },
    { id: 'dax', label: 'BI Specs & DAX Studio', icon: Code, desc: 'Blueprints & Code' }
  ];

  const handleYearToggle = (year: number) => {
    setFilters(prev => {
      const exists = prev.years.includes(year);
      let updatedYears = [...prev.years];
      if (exists) {
        updatedYears = updatedYears.filter(y => y !== year);
      } else {
        updatedYears.push(year);
      }
      // Guarantee at least one year remains active
      if (updatedYears.length === 0) updatedYears = [2026];
      return { ...prev, years: updatedYears.sort() };
    });
  };

  const handleFilterToggle = <K extends keyof DashboardFilters>(
    key: K,
    value: DashboardFilters[K] extends (infer T)[] ? T : never
  ) => {
    setFilters(prev => {
      const currentList = prev[key] as any[];
      const exists = currentList.includes(value);
      const updatedList = exists
        ? currentList.filter(item => item !== value)
        : [...currentList, value];
      return { ...prev, [key]: updatedList };
    });
  };

  const isAllSelected = (key: keyof DashboardFilters, allItems: any[]) => {
    return (filters[key] as any[]).length === 0 || (filters[key] as any[]).length === allItems.length;
  };

  const selectAll = (key: keyof DashboardFilters) => {
    setFilters(prev => ({ ...prev, [key]: [] }));
  };

  return (
    <aside className="w-80 bg-[#121212] border-r border-slate-800/80 flex flex-col h-screen shrink-0 sticky top-0 overflow-y-auto">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800/80 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gold flex items-center justify-center text-black shadow-lg shadow-gold/20">
          <Building2 className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-display font-bold text-base leading-none text-white tracking-wide">NovaRetail</h1>
          <span className="text-[10px] uppercase tracking-widest font-mono text-gold">Executive Hub</span>
        </div>
      </div>

      {/* Pages Navigation */}
      <div className="p-4 flex-1 flex flex-col gap-1 overflow-y-auto">
        <span className="px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-slate-500">
          Tableaux de bord (BI)
        </span>
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group border-r-4 ${
                isActive
                  ? 'bg-gold/10 text-gold-light border-gold font-semibold shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 border-transparent'
              }`}
            >
              <Icon className={`h-5 w-5 shrink-0 transition-transform group-hover:scale-105 ${isActive ? 'text-gold' : 'text-slate-500 group-hover:text-slate-300'}`} />
              <div className="flex-1 min-w-0">
                <p className="font-sans font-semibold text-xs truncate leading-tight">{tab.label}</p>
                <p className={`text-[10px] font-mono leading-none mt-0.5 ${isActive ? 'text-gold/80' : 'text-slate-500'}`}>{tab.desc}</p>
              </div>
            </button>
          );
        })}

        {/* Global Slicers panel */}
        <div className="mt-6 border-t border-slate-800 pt-5">
          <div className="flex items-center justify-between px-3 mb-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 hover:text-slate-200"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Slicers Globaux
            </button>
            <button
              onClick={onResetFilters}
              title="Reset all filters"
              className="p-1 rounded-md hover:bg-slate-800 text-slate-500 hover:text-slate-200 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>

          {showFilters && (
            <div className="flex flex-col gap-4 px-1 animate-fade-in">
              {/* Year Slicer */}
              <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
                <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-2">
                  Année d'analyse
                </span>
                <div className="grid grid-cols-5 gap-1">
                  {[2022, 2023, 2024, 2025, 2026].map(yr => {
                    const isSel = filters.years.includes(yr);
                    return (
                      <button
                        key={yr}
                        onClick={() => handleYearToggle(yr)}
                        className={`text-[10px] font-mono font-medium py-1.5 rounded transition-colors text-center cursor-pointer ${
                          isSel
                            ? 'bg-gold text-black font-semibold shadow-md shadow-gold/10'
                            : 'bg-slate-950/60 border border-slate-850 hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        {yr}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Category Slicer */}
              <div>
                <div className="flex items-center justify-between px-2 mb-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                    Catégories
                  </span>
                  <button
                    onClick={() => selectAll('categories')}
                    className={`text-[9px] font-mono ${isAllSelected('categories', PRODUCT_CATEGORIES) ? 'text-slate-600 cursor-not-allowed' : 'text-slate-400 hover:text-slate-200 cursor-pointer'}`}
                    disabled={isAllSelected('categories', PRODUCT_CATEGORIES)}
                  >
                    Toutes
                  </button>
                </div>
                <div className="max-h-28 overflow-y-auto pr-1 flex flex-col gap-1 border-b border-slate-800/60 pb-2">
                  {PRODUCT_CATEGORIES.map(cat => {
                    const isSel = filters.categories.includes(cat);
                    return (
                      <button
                        key={cat}
                        onClick={() => handleFilterToggle('categories', cat)}
                        className="flex items-center justify-between w-full text-left text-[11px] text-slate-400 py-1 px-2 rounded-lg hover:bg-slate-800/40 hover:text-slate-200 cursor-pointer"
                      >
                        <span className={isSel ? 'font-medium text-gold-light' : ''}>{cat}</span>
                        {isSel && <Check className="h-3.5 w-3.5 text-gold" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sales Channels Slicer */}
              <div>
                <div className="flex items-center justify-between px-2 mb-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                    Canaux de vente
                  </span>
                  <button
                    onClick={() => selectAll('channels')}
                    className={`text-[9px] font-mono ${isAllSelected('channels', CHANNELS) ? 'text-slate-600 cursor-not-allowed' : 'text-slate-400 hover:text-slate-200 cursor-pointer'}`}
                    disabled={isAllSelected('channels', CHANNELS)}
                  >
                    Tous
                  </button>
                </div>
                <div className="flex flex-col gap-0.5">
                  {CHANNELS.map(ch => {
                    const isSel = filters.channels.includes(ch);
                    return (
                      <button
                        key={ch}
                        onClick={() => handleFilterToggle('channels', ch)}
                        className="flex items-center justify-between w-full text-left text-[11px] text-slate-400 py-0.5 px-2 rounded-lg hover:bg-slate-800/40 hover:text-slate-200 cursor-pointer"
                      >
                        <span className={isSel ? 'font-medium text-gold-light' : ''}>{ch}</span>
                        {isSel && <Check className="h-3.5 w-3.5 text-gold" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Segment Slicer */}
              <div>
                <div className="flex items-center justify-between px-2 mb-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                    Segmentation client
                  </span>
                  <button
                    onClick={() => selectAll('segments')}
                    className={`text-[9px] font-mono ${isAllSelected('segments', CUSTOMER_SEGMENTS) ? 'text-slate-600 cursor-not-allowed' : 'text-slate-400 hover:text-slate-200 cursor-pointer'}`}
                    disabled={isAllSelected('segments', CUSTOMER_SEGMENTS)}
                  >
                    Toutes
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {CUSTOMER_SEGMENTS.map(seg => {
                    const isSel = filters.segments.includes(seg);
                    return (
                      <button
                        key={seg}
                        onClick={() => handleFilterToggle('segments', seg)}
                        className={`text-[10px] font-sans px-2.5 py-0.5 rounded-full border transition-colors cursor-pointer ${
                          isSel
                            ? 'bg-gold border-gold text-black font-semibold'
                            : 'bg-slate-950/60 border-slate-850 hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        {seg}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Slogan & Corporate Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/20">
        <p className="text-[10px] font-mono text-gold uppercase tracking-wider text-center font-semibold">
          "Driving Global Commerce"
        </p>
        <p className="text-[9px] text-slate-500 text-center mt-1">
          NovaRetail Global Analytics © 2026
        </p>
      </div>
    </aside>
  );
}

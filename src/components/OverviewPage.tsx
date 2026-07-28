/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  SalesKPIs, 
  SalesByYear, 
  DashboardFilters 
} from '../types';
import { 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  Briefcase, 
  Percent, 
  ShoppingBag, 
  Activity,
  Globe,
  Plus
} from 'lucide-react';

interface OverviewPageProps {
  kpis: SalesKPIs;
  yearsTrend: SalesByYear[];
  filters: DashboardFilters;
  setFilters: React.Dispatch<React.SetStateAction<DashboardFilters>>;
}

export default function OverviewPage({
  kpis,
  yearsTrend,
  filters,
  setFilters
}: OverviewPageProps) {
  const [hoveredPoint, setHoveredPoint] = useState<any | null>(null);
  const [hoveredContinent, setHoveredContinent] = useState<string | null>(null);

  // SVG dimensions for 10-year chart
  const chartWidth = 720;
  const chartHeight = 260;
  const paddingLeft = 65;
  const paddingRight = 30;
  const paddingTop = 25;
  const paddingBottom = 40;

  const maxRevenue = Math.max(...yearsTrend.map(y => y.revenue)) * 1.1;
  const years = yearsTrend.map(y => y.year);
  const totalYears = years.length;

  const getCoordinates = (index: number, value: number) => {
    const x = paddingLeft + (index / (totalYears - 1)) * (chartWidth - paddingLeft - paddingRight);
    const y = chartHeight - paddingBottom - (value / maxRevenue) * (chartHeight - paddingTop - paddingBottom);
    return { x, y };
  };

  // Generate SVG Path for Revenue Line (smooth spline or clean straight lines)
  let revenuePathStr = '';
  let profitPathStr = '';
  let revenueAreaStr = '';

  yearsTrend.forEach((yData, index) => {
    const revCoords = getCoordinates(index, yData.revenue);
    const profCoords = getCoordinates(index, yData.profit);

    if (index === 0) {
      revenuePathStr = `M ${revCoords.x} ${revCoords.y}`;
      profitPathStr = `M ${profCoords.x} ${profCoords.y}`;
      revenueAreaStr = `M ${revCoords.x} ${chartHeight - paddingBottom} L ${revCoords.x} ${revCoords.y}`;
    } else {
      revenuePathStr += ` L ${revCoords.x} ${revCoords.y}`;
      profitPathStr += ` L ${profCoords.x} ${profCoords.y}`;
      revenueAreaStr += ` L ${revCoords.x} ${revCoords.y}`;
    }

    if (index === yearsTrend.length - 1) {
      revenueAreaStr += ` L ${revCoords.x} ${chartHeight - paddingBottom} Z`;
    }
  });

  // Dynamic growth comparison 2026 vs 2017
  const initialYear = yearsTrend[0]?.revenue || 1;
  const currentYear = yearsTrend[yearsTrend.length - 1]?.revenue || 1;
  const overallGrowth = ((currentYear - initialYear) / initialYear) * 100;

  // Custom Continent Data
  const continents = [
    { id: 'North America', name: 'Amérique du Nord', x: '22%', y: '30%', share: '32%', color: 'fill-sky-500' },
    { id: 'Europe', name: 'Europe', x: '50%', y: '25%', share: '28%', color: 'fill-emerald-500' },
    { id: 'Asia', name: 'Asie', x: '75%', y: '35%', share: '22%', color: 'fill-indigo-500' },
    { id: 'South America', name: 'Amérique du Sud', x: '35%', y: '65%', share: '8%', color: 'fill-amber-500' },
    { id: 'Africa', name: 'Afrique', x: '52%', y: '58%', share: '6%', color: 'fill-orange-500' },
    { id: 'Oceania', name: 'Océanie', x: '85%', y: '72%', share: '4%', color: 'fill-purple-500' }
  ];

  const handleContinentClick = (continentId: string) => {
    setFilters(prev => {
      const isSelected = prev.continents.includes(continentId);
      let updatedContinents = [...prev.continents];
      if (isSelected) {
        updatedContinents = updatedContinents.filter(c => c !== continentId);
      } else {
        updatedContinents.push(continentId);
      }
      return { ...prev, continents: updatedContinents };
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
            NovaRetail Executive Suite
          </span>
          <h2 className="font-display font-bold text-2xl text-slate-100 leading-tight">
            Executive Overview
          </h2>
        </div>
        <div className="text-right flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-850 text-slate-300 font-mono text-[10px]">
            <Activity className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
            Temps Réel Actif
          </span>
        </div>
      </div>

      {/* Main KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1: Chiffre d'affaires */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-sans text-slate-500 font-semibold uppercase tracking-wider">Chiffre d'Affaires</span>
            <div className="p-2 bg-slate-800 rounded-xl text-slate-300">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-display font-bold text-lg text-slate-100">
              ${kpis.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
            <p className="text-[10px] text-slate-400 font-sans mt-1 flex items-center gap-1">
              <span className="inline-flex items-center text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                +{overallGrowth.toFixed(0)}%
              </span>
              <span>sur 10 ans</span>
            </p>
          </div>
        </div>

        {/* KPI 2: Profit Total */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-sans text-slate-500 font-semibold uppercase tracking-wider">Profit Total</span>
            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-display font-bold text-lg text-emerald-400">
              ${kpis.profit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
            <p className="text-[10px] text-slate-400 font-sans mt-1 flex items-center gap-1">
              <span className="inline-flex items-center text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                +${(kpis.profit / (kpis.orders || 1)).toFixed(0)} / cmd
              </span>
            </p>
          </div>
        </div>

        {/* KPI 3: Marge */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-sans text-slate-500 font-semibold uppercase tracking-wider">Marge Bénéficiaire</span>
            <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400">
              <Percent className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-display font-bold text-lg text-slate-100">
              {(kpis.margin * 100).toFixed(1)}%
            </p>
            <p className="text-[10px] text-slate-500 font-sans mt-1 flex items-center gap-1">
              <span className="text-slate-400 font-medium">Saine rentabilité globale</span>
            </p>
          </div>
        </div>

        {/* KPI 4: Orders */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-sans text-slate-500 font-semibold uppercase tracking-wider">Commandes</span>
            <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-display font-bold text-lg text-slate-100">
              {kpis.orders.toLocaleString()}
            </p>
            <p className="text-[10px] text-slate-400 font-sans mt-1 flex items-center gap-1">
              <span className="font-mono text-slate-500">Panier moyen: ${kpis.averageOrderValue.toFixed(0)}</span>
            </p>
          </div>
        </div>

        {/* KPI 5: Retention */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-sans text-slate-500 font-semibold uppercase tracking-wider">Rétention Client</span>
            <div className="p-2 bg-purple-500/10 rounded-xl text-purple-400">
              <Globe className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-display font-bold text-lg text-slate-100">
              {(kpis.retentionRate * 100).toFixed(1)}%
            </p>
            <p className="text-[10px] text-slate-400 font-sans mt-1 flex items-center gap-1">
              <span className="font-mono text-slate-500">LTV: ${kpis.customerLTV.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 10-Year historical sales trend */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-bold text-sm text-slate-100">
                Évolution des Ventes sur 10 ans
              </h3>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-0.5">
                Chiffre d'affaires vs Profit Total (2017 – 2026)
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-blue-500 inline-block"></span>
                <span className="text-slate-400">Chiffre d'Affaires</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-emerald-500 inline-block"></span>
                <span className="text-slate-400">Profit</span>
              </div>
            </div>
          </div>

          {/* SVG Line / Area Chart */}
          <div className="relative">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto">
              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1.0].map((ratio, idx) => {
                const yVal = paddingTop + ratio * (chartHeight - paddingTop - paddingBottom);
                const label = maxRevenue * (1 - ratio);
                return (
                  <g key={idx} className="opacity-100">
                    <line 
                      x1={paddingLeft} 
                      y1={yVal} 
                      x2={chartWidth - paddingRight} 
                      y2={yVal} 
                      stroke="#1e293b" 
                      strokeWidth="1" 
                      strokeDasharray="4,4"
                    />
                    <text 
                      x={paddingLeft - 8} 
                      y={yVal + 4} 
                      className="font-mono text-[9px] fill-slate-500 text-right"
                      textAnchor="end"
                    >
                      ${(label / 1000000).toFixed(0)}M
                    </text>
                  </g>
                );
              })}

              {/* X Axis Labels */}
              {yearsTrend.map((yData, idx) => {
                const coords = getCoordinates(idx, yData.revenue);
                return (
                  <g key={idx}>
                    <line 
                      x1={coords.x} 
                      y1={chartHeight - paddingBottom} 
                      x2={coords.x} 
                      y2={chartHeight - paddingBottom + 4} 
                      stroke="#1e293b"
                    />
                    <text 
                      x={coords.x} 
                      y={chartHeight - paddingBottom + 16} 
                      className="font-mono text-[10px] fill-slate-500 text-center"
                      textAnchor="middle"
                    >
                      {yData.year}
                    </text>
                  </g>
                );
              })}

              {/* Gradient definition */}
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.00" />
                </linearGradient>
              </defs>

              {/* Revenue Area */}
              <path d={revenueAreaStr} fill="url(#areaGradient)" />

              {/* Revenue Line */}
              <path 
                d={revenuePathStr} 
                fill="none" 
                stroke="#3b82f6" 
                strokeWidth="3.5" 
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Profit Line */}
              <path 
                d={profitPathStr} 
                fill="none" 
                stroke="#10b981" 
                strokeWidth="2.5" 
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="4,4" // dotted/dashed profit
              />

              {/* Interactive Circles / Hover */}
              {yearsTrend.map((yData, idx) => {
                const revCoords = getCoordinates(idx, yData.revenue);
                const profCoords = getCoordinates(idx, yData.profit);
                return (
                  <g key={idx}>
                    {/* Revenue Circle */}
                    <circle 
                      cx={revCoords.x} 
                      cy={revCoords.y} 
                      r={hoveredPoint?.idx === idx ? "7" : "4.5"} 
                      fill="#0f172a" 
                      stroke="#3b82f6" 
                      strokeWidth={hoveredPoint?.idx === idx ? "3" : "2"}
                      className="cursor-pointer transition-all duration-150"
                      onMouseEnter={() => setHoveredPoint({ ...yData, idx, revX: revCoords.x, revY: revCoords.y })}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                    {/* Profit Circle */}
                    <circle 
                      cx={profCoords.x} 
                      cy={profCoords.y} 
                      r={hoveredPoint?.idx === idx ? "6" : "3.5"} 
                      fill="#0f172a" 
                      stroke="#10b981" 
                      strokeWidth="2"
                      className="cursor-pointer transition-all"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Custom Tooltip */}
            {hoveredPoint && (
              <div 
                className="absolute bg-slate-900 text-white rounded-xl p-3 text-xs shadow-2xl border border-slate-800 animate-fade-in transition-all pointer-events-none"
                style={{
                  left: `${(hoveredPoint.revX / chartWidth) * 100}%`,
                  top: `${(hoveredPoint.revY / chartHeight) * 100 - 45}%`,
                  transform: 'translateX(-50%)'
                }}
              >
                <p className="font-bold text-[10px] font-mono text-slate-400 mb-1">{hoveredPoint.year}</p>
                <p className="flex justify-between gap-4">
                  <span className="text-slate-400">Revenue :</span>
                  <span className="font-mono font-bold text-slate-200">${hoveredPoint.revenue.toLocaleString()}</span>
                </p>
                <p className="flex justify-between gap-4 text-emerald-400">
                  <span>Profit :</span>
                  <span className="font-mono font-bold">${hoveredPoint.profit.toLocaleString()}</span>
                </p>
                <p className="flex justify-between gap-4 text-blue-400">
                  <span>Marge :</span>
                  <span className="font-mono font-bold">{(hoveredPoint.margin * 100).toFixed(1)}%</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Interactive World Map & Continents selection */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-sm text-slate-100">
              Couverture Géographique
            </h3>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-0.5">
              Cliquez pour filtrer par continent
            </p>
          </div>

          {/* Clean minimal abstract SVG world map */}
          <div className="relative h-48 my-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 400 200" className="w-full h-full text-slate-800">
              {/* High-level abstract map grids to simulate grid structure */}
              <pattern id="gridPattern" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#1e293b" strokeWidth="0.5" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#gridPattern)" className="opacity-40" />

              {/* Minimal geometric continents shapes */}
              {/* North America */}
              <path d="M 50 40 L 110 30 L 130 50 L 100 85 L 80 90 L 55 65 Z" 
                className={`transition-colors duration-200 cursor-pointer ${
                  filters.continents.includes('North America') 
                    ? 'fill-sky-500/70 stroke-sky-400' 
                    : hoveredContinent === 'North America' ? 'fill-slate-700/80' : 'fill-slate-800'
                }`}
                onClick={() => handleContinentClick('North America')}
                onMouseEnter={() => setHoveredContinent('North America')}
                onMouseLeave={() => setHoveredContinent(null)}
              />

              {/* South America */}
              <path d="M 100 95 L 125 100 L 140 130 L 110 180 L 95 140 Z" 
                className={`transition-colors duration-200 cursor-pointer ${
                  filters.continents.includes('South America') 
                    ? 'fill-amber-500/70 stroke-amber-400' 
                    : hoveredContinent === 'South America' ? 'fill-slate-700/80' : 'fill-slate-800'
                }`}
                onClick={() => handleContinentClick('South America')}
                onMouseEnter={() => setHoveredContinent('South America')}
                onMouseLeave={() => setHoveredContinent(null)}
              />

              {/* Europe */}
              <path d="M 170 35 L 220 25 L 230 45 L 210 65 L 180 55 Z" 
                className={`transition-colors duration-200 cursor-pointer ${
                  filters.continents.includes('Europe') 
                    ? 'fill-emerald-500/70 stroke-emerald-400' 
                    : hoveredContinent === 'Europe' ? 'fill-slate-700/80' : 'fill-slate-800'
                }`}
                onClick={() => handleContinentClick('Europe')}
                onMouseEnter={() => setHoveredContinent('Europe')}
                onMouseLeave={() => setHoveredContinent(null)}
              />

              {/* Africa */}
              <path d="M 175 70 L 220 65 L 235 90 L 215 140 L 195 135 L 175 90 Z" 
                className={`transition-colors duration-200 cursor-pointer ${
                  filters.continents.includes('Africa') 
                    ? 'fill-orange-500/70 stroke-orange-400' 
                    : hoveredContinent === 'Africa' ? 'fill-slate-700/80' : 'fill-slate-800'
                }`}
                onClick={() => handleContinentClick('Africa')}
                onMouseEnter={() => setHoveredContinent('Africa')}
                onMouseLeave={() => setHoveredContinent(null)}
              />

              {/* Asia */}
              <path d="M 235 25 L 320 20 L 335 55 L 310 100 L 250 85 L 235 50 Z" 
                className={`transition-colors duration-200 cursor-pointer ${
                  filters.continents.includes('Asia') 
                    ? 'fill-indigo-500/70 stroke-indigo-400' 
                    : hoveredContinent === 'Asia' ? 'fill-slate-700/80' : 'fill-slate-800'
                }`}
                onClick={() => handleContinentClick('Asia')}
                onMouseEnter={() => setHoveredContinent('Asia')}
                onMouseLeave={() => setHoveredContinent(null)}
              />

              {/* Oceania */}
              <path d="M 315 125 L 350 115 L 360 140 L 330 155 Z" 
                className={`transition-colors duration-200 cursor-pointer ${
                  filters.continents.includes('Oceania') 
                    ? 'fill-purple-500/70 stroke-purple-400' 
                    : hoveredContinent === 'Oceania' ? 'fill-slate-700/80' : 'fill-slate-800'
                }`}
                onClick={() => handleContinentClick('Oceania')}
                onMouseEnter={() => setHoveredContinent('Oceania')}
                onMouseLeave={() => setHoveredContinent(null)}
              />

              {/* Pulsing indicator pins on major hubs */}
              <circle cx="105" cy="45" r="3" fill="#3b82f6" className="animate-ping" />
              <circle cx="195" cy="40" r="3" fill="#10b981" className="animate-ping" />
              <circle cx="280" cy="40" r="3" fill="#6366f1" className="animate-ping" />
            </svg>

            {/* Float HUD */}
            {hoveredContinent && (
              <div className="absolute top-2 right-2 bg-slate-900 text-slate-200 border border-slate-800 rounded px-2 py-0.5 text-[9px] font-mono leading-none">
                {hoveredContinent}
              </div>
            )}
          </div>

          {/* Continents checklist list */}
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {continents.map(c => {
              const isSel = filters.continents.includes(c.id);
              return (
                <button
                  key={c.id}
                  onClick={() => handleContinentClick(c.id)}
                  className={`flex items-center justify-between w-full text-left p-2 rounded-xl border text-xs transition-all ${
                    isSel 
                      ? 'bg-blue-600/10 border-blue-500/30 text-blue-400 shadow-sm'
                      : 'bg-slate-950/40 border-slate-850 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${isSel ? 'bg-blue-400' : c.id === 'North America' ? 'bg-sky-500' : c.id === 'Europe' ? 'bg-emerald-500' : c.id === 'Asia' ? 'bg-indigo-500' : c.id === 'South America' ? 'bg-amber-500' : c.id === 'Africa' ? 'bg-orange-500' : 'bg-purple-500'}`}></span>
                    <span className="font-semibold">{c.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[10px]">
                    <span className={isSel ? 'text-blue-500/80' : 'text-slate-500'}>Share: {c.share}</span>
                    {isSel && <span className="text-[10px] bg-blue-500/20 px-1 py-0.2 rounded font-bold">Actif</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

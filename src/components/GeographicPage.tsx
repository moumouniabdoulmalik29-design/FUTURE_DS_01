/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { SalesByGeography, DashboardFilters } from '../types';
import { 
  Globe2, 
  MapPin, 
  Compass, 
  DollarSign, 
  TrendingUp, 
  Percent, 
  Search,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

interface GeographicPageProps {
  geoSales: SalesByGeography[];
  filters: DashboardFilters;
  setFilters: React.Dispatch<React.SetStateAction<DashboardFilters>>;
}

export default function GeographicPage({
  geoSales,
  filters,
  setFilters
}: GeographicPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContinent, setSelectedContinent] = useState<string>('All');

  // Handle active continent click
  const handleContinentFilterClick = (continent: string) => {
    setSelectedContinent(continent);
    setFilters(prev => {
      if (continent === 'All') {
        return { ...prev, continents: [] };
      } else {
        return { ...prev, continents: [continent] };
      }
    });
  };

  // Group geographically on the fly
  const continentAggregates = useMemo(() => {
    const aggregates: { [key: string]: { revenue: number; profit: number; orders: number } } = {};
    
    geoSales.forEach(item => {
      if (!aggregates[item.continent]) {
        aggregates[item.continent] = { revenue: 0, profit: 0, orders: 0 };
      }
      aggregates[item.continent].revenue += item.revenue;
      aggregates[item.continent].profit += item.profit;
      aggregates[item.continent].orders += item.orders;
    });

    return Object.entries(aggregates).map(([continent, data]) => ({
      continent,
      revenue: data.revenue,
      profit: data.profit,
      margin: data.revenue > 0 ? data.profit / data.revenue : 0,
      orders: data.orders
    })).sort((a, b) => b.revenue - a.revenue);
  }, [geoSales]);

  // Country aggregations
  const countryAggregates = useMemo(() => {
    const aggregates: { [key: string]: { continent: string; revenue: number; profit: number; orders: number } } = {};
    
    geoSales.forEach(item => {
      const key = `${item.continent}-${item.country}`;
      if (!aggregates[key]) {
        aggregates[key] = { continent: item.continent, revenue: 0, profit: 0, orders: 0 };
      }
      aggregates[key].revenue += item.revenue;
      aggregates[key].profit += item.profit;
      aggregates[key].orders += item.orders;
    });

    return Object.entries(aggregates).map(([key, data]) => {
      const country = key.split('-')[1];
      return {
        country,
        continent: data.continent,
        revenue: data.revenue,
        profit: data.profit,
        margin: data.revenue > 0 ? data.profit / data.revenue : 0,
        orders: data.orders
      };
    }).filter(c => {
      const matchesSearch = c.country.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesContinent = selectedContinent === 'All' || c.continent === selectedContinent;
      return matchesSearch && matchesContinent;
    }).sort((a, b) => b.revenue - a.revenue);
  }, [geoSales, searchTerm, selectedContinent]);

  // Cities list
  const filteredCities = useMemo(() => {
    return geoSales.filter(item => {
      const matchesSearch = item.city.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.country.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesContinent = selectedContinent === 'All' || item.continent === selectedContinent;
      return matchesSearch && matchesContinent;
    }).sort((a, b) => b.revenue - a.revenue).slice(0, 15); // Top 15 cities
  }, [geoSales, searchTerm, selectedContinent]);

  const totalGeoRevenue = continentAggregates.reduce((acc, c) => acc + c.revenue, 0) || 1;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
          NovaRetail Regional Hubs
        </span>
        <h2 className="font-display font-bold text-2xl text-slate-100 leading-tight">
          Geographic Analytics
        </h2>
      </div>

      {/* Slicers Quick Bar */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800/80 pb-4">
        {['All', 'North America', 'Europe', 'Asia', 'South America', 'Africa', 'Oceania'].map(c => {
          const isActive = (c === 'All' && selectedContinent === 'All') || (selectedContinent === c);
          return (
            <button
              key={c}
              onClick={() => handleContinentFilterClick(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium font-sans transition-all border cursor-pointer ${
                isActive
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                  : 'bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300'
              }`}
            >
              {c === 'All' ? 'Tous les Continents' : c}
            </button>
          );
        })}
      </div>

      {/* Continent KPI Scorecard cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {continentAggregates.map(c => {
          const share = (c.revenue / totalGeoRevenue) * 100;
          return (
            <div key={c.continent} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Compass className="h-4 w-4 text-slate-500" />
                  {c.continent}
                </span>
                <span className="font-mono text-[10px] font-semibold bg-slate-950/60 text-slate-400 border border-slate-800/50 px-2 py-0.5 rounded">
                  Share: {share.toFixed(0)}%
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] font-mono uppercase text-slate-500">Revenue</span>
                  <p className="font-display font-bold text-sm text-slate-200">${(c.revenue / 1000000).toFixed(2)}M</p>
                </div>
                <div>
                  <span className="text-[9px] font-mono uppercase text-slate-500">Profit</span>
                  <p className="font-display font-bold text-sm text-emerald-400">${(c.profit / 1000000).toFixed(2)}M</p>
                </div>
              </div>

              <div className="mt-4 border-t border-slate-800/60 pt-3 flex justify-between text-[10px] font-mono text-slate-400">
                <span>Margin: {(c.margin * 100).toFixed(1)}%</span>
                <span>Orders: {c.orders.toLocaleString()}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Country and City Breakdown drilldowns */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Country aggregates table */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h3 className="font-display font-bold text-sm text-slate-100">
                Performance Nationale par Pays
              </h3>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-0.5">
                Chiffre d'affaires et rentabilité cumulée
              </p>
            </div>

            {/* Quick Country search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Filtrer pays..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[9px] font-mono text-slate-500 uppercase tracking-wider pb-2">
                  <th className="py-2.5 font-medium">Pays</th>
                  <th className="py-2.5 font-medium">Continent</th>
                  <th className="py-2.5 font-medium text-right">Revenue</th>
                  <th className="py-2.5 font-medium text-right">Profit</th>
                  <th className="py-2.5 font-medium text-right">Marge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-xs">
                {countryAggregates.map(c => (
                  <tr key={c.country} className="hover:bg-slate-850/40 transition-colors">
                    <td className="py-2.5 font-semibold text-slate-200">{c.country}</td>
                    <td className="py-2.5 text-slate-400 font-sans text-[11px]">{c.continent}</td>
                    <td className="py-2.5 text-right font-mono font-semibold text-slate-200">${(c.revenue / 1000000).toFixed(2)}M</td>
                    <td className="py-2.5 text-right font-mono text-emerald-400 font-semibold">${(c.profit / 1000000).toFixed(2)}M</td>
                    <td className="py-2.5 text-right font-mono text-slate-400">{(c.margin * 100).toFixed(1)}%</td>
                  </tr>
                ))}

                {countryAggregates.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-500 text-xs">Aucun pays trouvé.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* City Breakdown Leaderboard */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-sm text-slate-100">
              Top Villes à Forte Densité
            </h3>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-0.5">
              Classement des 15 meilleures villes de distribution
            </p>
          </div>

          <div className="mt-4 space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
            {filteredCities.map((cityObj, idx) => (
              <div key={cityObj.city} className="flex items-center justify-between p-2 rounded-xl bg-slate-950/40 hover:bg-slate-800/40 transition-colors border border-slate-800/60">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-slate-500 w-5">#{idx + 1}</span>
                  <MapPin className="h-4 w-4 text-indigo-400" />
                  <div>
                    <span className="text-xs font-semibold text-slate-200">{cityObj.city}</span>
                    <span className="text-[9px] font-mono text-slate-500 block uppercase tracking-wider">{cityObj.country}</span>
                  </div>
                </div>
                <div className="text-right font-mono">
                  <span className="text-xs font-bold text-slate-200 block">${(cityObj.revenue / 1000).toFixed(0)}k</span>
                  <span className="text-[9px] text-emerald-400 font-semibold block">P: ${(cityObj.profit / 1000).toFixed(0)}k</span>
                </div>
              </div>
            ))}

            {filteredCities.length === 0 && (
              <p className="text-center text-slate-500 text-xs py-10">Aucune ville trouvée.</p>
            )}
          </div>

          <div className="mt-4 p-3 bg-indigo-950/20 rounded-2xl border border-indigo-900/30 flex items-center justify-between gap-3">
            <div className="text-indigo-200 font-sans text-[11px] leading-tight">
              <strong>Audit Métropoles :</strong> Paris, Londres et New York restent les 3 pôles mondiaux de distribution les plus profitables de la décennie.
            </div>
            <ArrowRight className="h-4 w-4 text-indigo-400 shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
}

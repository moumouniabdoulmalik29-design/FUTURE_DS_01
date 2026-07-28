/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  SalesByCategory, 
  SalesByChannel, 
  SalesByCommercial, 
  TopProduct 
} from '../types';
import { 
  DollarSign, 
  User, 
  Smartphone, 
  ShoppingBag, 
  Monitor, 
  Percent, 
  Layers, 
  Flame,
  Award,
  Globe
} from 'lucide-react';

interface SalesPageProps {
  categorySales: SalesByCategory[];
  channelSales: SalesByChannel[];
  commercialSales: SalesByCommercial[];
  topProducts: TopProduct[];
}

export default function SalesPage({
  categorySales,
  channelSales,
  commercialSales,
  topProducts
}: SalesPageProps) {

  // Channel custom rendering icons/colors
  const getChannelConfig = (channel: string) => {
    switch (channel) {
      case 'Website': return { color: 'bg-indigo-600', text: 'text-indigo-600', icon: Monitor };
      case 'Mobile App': return { color: 'bg-emerald-500', text: 'text-emerald-500', icon: Smartphone };
      case 'Physical Store': return { color: 'bg-amber-500', text: 'text-amber-500', icon: ShoppingBag };
      case 'Reseller Network': return { color: 'bg-slate-700', text: 'text-slate-700', icon: Layers };
      default: return { color: 'bg-purple-500', text: 'text-purple-500', icon: Flame }; // Social Commerce
    }
  };

  const totalChannelRevenue = channelSales.reduce((acc, c) => acc + c.revenue, 0) || 1;

  // Find max category revenue for bar sizing
  const maxCategoryRevenue = Math.max(...categorySales.map(c => c.revenue)) || 1;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
          NovaRetail Performance Dashboard
        </span>
        <h2 className="font-display font-bold text-2xl text-slate-100 leading-tight">
          Sales Performance Analytics
        </h2>
      </div>

      {/* Top Section: Category Margins Matrix & Channel Shares */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Category Performance Matrix */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg">
          <div>
            <h3 className="font-display font-bold text-sm text-slate-100">
              Rentabilité et Volume par Catégorie
            </h3>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-0.5">
              Optimisation des marges vs Part de chiffre d'affaires
            </p>
          </div>

          <div className="mt-5 space-y-4">
            {categorySales.map(cat => {
              const sharePercent = (cat.revenue / maxCategoryRevenue) * 100;
              const marginPercent = (cat.profit / cat.revenue) * 100;
              const isLowMargin = marginPercent < 20;

              return (
                <div key={cat.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-200">{cat.category}</span>
                      <span className="font-mono text-[10px] text-slate-500">
                        ${(cat.revenue / 1000000).toFixed(1)}M CA
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                        isLowMargin 
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                          : marginPercent > 35 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-slate-800 text-slate-300 border border-slate-700/60'
                      }`}>
                        <Percent className="h-3 w-3" />
                        {marginPercent.toFixed(0)}% Marge
                      </span>
                      <span className="font-mono font-medium text-slate-300">
                        ${(cat.profit / 1000000).toFixed(1)}M Profit
                      </span>
                    </div>
                  </div>
                  {/* Performance Double-Bar */}
                  <div className="relative h-2.5 bg-slate-950/60 rounded-full overflow-hidden flex">
                    {/* Revenue share block */}
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${isLowMargin ? 'bg-slate-700' : 'bg-blue-600'}`}
                      style={{ width: `${sharePercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Channels Breakdown */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-sm text-slate-100">
              Canaux de Distribution
            </h3>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-0.5">
              Répartition des ventes et marge brute
            </p>
          </div>

          <div className="my-5 space-y-4">
            {channelSales.map(ch => {
              const config = getChannelConfig(ch.channel);
              const ChannelIcon = config.icon;
              const revShare = (ch.revenue / totalChannelRevenue) * 100;
              const margin = (ch.profit / ch.revenue) * 100;

              return (
                <div key={ch.channel} className="flex items-center gap-3.5">
                  <div className={`p-2 rounded-xl bg-slate-800 ${config.text}`}>
                    <ChannelIcon className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-200">{ch.channel}</span>
                      <span className="font-mono text-slate-400">
                        {revShare.toFixed(0)}% du CA
                      </span>
                    </div>
                    {/* Channel gauge */}
                    <div className="h-2 bg-slate-950/60 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${config.color}`} style={{ width: `${revShare}%` }} />
                    </div>
                    <p className="text-[10px] font-mono text-slate-400 mt-1 flex justify-between">
                      <span>Marge: {margin.toFixed(0)}%</span>
                      <span>Vol: ${(ch.revenue / 1000000).toFixed(1)}M</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 bg-slate-950/30 rounded-2xl border border-slate-800/80">
            <p className="text-[10px] font-mono text-blue-400 uppercase tracking-wider mb-1 flex items-center gap-1.5 font-bold">
              <Award className="h-3.5 w-3.5" />
              Canal Leader
            </p>
            <p className="text-xs font-sans text-slate-300 leading-snug">
              L'application mobile détient la plus forte croissance et un taux de marge de 29%.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Section: Sales Team Scoreboard & Leaderboard products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Sales Reps score table */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg">
          <div>
            <h3 className="font-display font-bold text-sm text-slate-100">
              Force de Vente Internationale
            </h3>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-0.5">
              Classement de la performance par commercial
            </p>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] font-mono text-slate-500 uppercase tracking-wider pb-2">
                  <th className="py-2.5 font-medium">Commercial</th>
                  <th className="py-2.5 font-medium">Zone</th>
                  <th className="py-2.5 font-medium text-right">CA Total</th>
                  <th className="py-2.5 font-medium text-right">Commandes</th>
                  <th className="py-2.5 font-medium text-right">Marge Éq.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {commercialSales.map((rep, idx) => (
                  <tr key={rep.name} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-slate-800 flex items-center justify-center font-bold text-[10px] text-slate-300">
                        {idx + 1}
                      </div>
                      <span className="font-semibold text-slate-200">{rep.name}</span>
                    </td>
                    <td className="py-2.5">
                      <span className="inline-flex items-center gap-1 text-[10px] bg-slate-800 border border-slate-700/60 text-slate-300 px-2 py-0.5 rounded font-mono">
                        <Globe className="h-3 w-3 text-slate-500" />
                        {rep.region}
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-mono font-semibold text-slate-200">
                      ${(rep.revenue / 1000000).toFixed(2)}M
                    </td>
                    <td className="py-2.5 text-right font-mono text-slate-400">
                      {rep.orders.toLocaleString()}
                    </td>
                    <td className="py-2.5 text-right font-mono text-emerald-400 font-semibold">
                      {((rep.profit / rep.revenue) * 100).toFixed(0)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top 10 Products scoreboard */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg">
          <div>
            <h3 className="font-display font-bold text-sm text-slate-100">
              Top 10 Produits Leaders
            </h3>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-0.5">
              Les meilleures ventes par chiffre d'affaires
            </p>
          </div>

          <div className="mt-4 space-y-3 max-h-[340px] overflow-y-auto pr-1">
            {topProducts.map((p, idx) => (
              <div key={p.name} className="flex items-center justify-between p-2.5 bg-slate-950/40 border border-slate-850 rounded-2xl hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="h-8 w-8 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-center text-xs font-bold font-mono">
                    #{idx + 1}
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-slate-200">{p.name}</p>
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">{p.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold font-mono text-slate-200">
                    ${(p.revenue / 1000).toFixed(0)}k
                  </p>
                  <p className="text-[10px] font-mono text-emerald-400 font-bold">
                    +{p.growth}% YoY
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

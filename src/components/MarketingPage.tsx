/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Megaphone, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target, 
  Percent, 
  Award, 
  BarChart3, 
  ArrowUpRight,
  ShieldAlert,
  Zap
} from 'lucide-react';

interface MarketingPageProps {
  revenue: number;
  profit: number;
}

export default function MarketingPage({ revenue, profit }: MarketingPageProps) {
  // Compute some realistic dynamic marketing metrics based on current active revenue
  const marketingSpend = revenue * 0.12; // 12% of revenue allocated to marketing
  const CAC = 45; // average customer acquisition cost $45
  const conversionRate = 3.24; // 3.24% conversion rate
  const marketingROI = ((revenue * 0.35 - marketingSpend) / marketingSpend) * 100; // ROI of marketing sales

  const campaigns = [
    { name: 'VIP Exclusive Autumn Gold', channel: 'Email Privilège', spend: marketingSpend * 0.2, conversion: '12.8%', roi: '450%', status: 'Fini' },
    { name: 'Luxury Fashion Fall Influencers', channel: 'Social/Instagram', spend: marketingSpend * 0.3, conversion: '4.8%', roi: '280%', status: 'Actif' },
    { name: 'Smartphones Display Campaign', channel: 'Google Ads Search', spend: marketingSpend * 0.25, conversion: '3.1%', roi: '190%', status: 'Actif' },
    { name: 'Retargeting Mechanical Keyboards', channel: 'Meta Retargeting', spend: marketingSpend * 0.15, conversion: '5.2%', roi: '310%', status: 'Actif' },
    { name: 'Home Automation Smart Espresso', channel: 'Newsletter', spend: marketingSpend * 0.1, conversion: '8.4%', roi: '520%', status: 'Fini' }
  ];

  const promotedProducts = [
    { name: 'Pure Cashmere Sweater', category: 'Fashion', spend: '$124k', revenue: '$410k', roas: '3.3x' },
    { name: 'NovaPhone 14 Pro', category: 'Smartphones', spend: '$250k', revenue: '$820k', roas: '3.28x' },
    { name: 'Ergonomic Office Chair', category: 'Furniture', spend: '$80k', revenue: '$290k', roas: '3.6x' },
    { name: 'Noise Cancelling Headphones', category: 'Electronics', spend: '$110k', revenue: '$340k', roas: '3.1x' },
    { name: 'Organic Anti-Aging Serum', category: 'Beauty', spend: '$45k', revenue: '$210k', roas: '4.6x' }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
          NovaRetail Global Marketing Operations
        </span>
        <h2 className="font-display font-bold text-2xl text-slate-100 leading-tight flex items-center gap-2">
          <Megaphone className="h-6 w-6 text-gold" />
          Marketing Analytics & ROI
        </h2>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Budget Marketing */}
        <div className="bg-dark-card border border-slate-800 p-5 rounded-2xl flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-sans text-slate-500 font-semibold uppercase tracking-wider">Investissement Global</span>
            <div className="p-2 bg-gold/10 rounded-xl text-gold">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-display font-bold text-lg text-slate-100">
              ${marketingSpend.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
            <p className="text-[10px] text-slate-400 font-sans mt-1">
              <span className="text-gold font-bold">~12%</span> du chiffre d'affaires total
            </p>
          </div>
        </div>

        {/* KPI 2: ROI Marketing */}
        <div className="bg-dark-card border border-slate-800 p-5 rounded-2xl flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-sans text-slate-500 font-semibold uppercase tracking-wider">ROI Estimé (ROAS)</span>
            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-display font-bold text-lg text-emerald-400">
              {marketingROI.toFixed(1)}%
            </p>
            <p className="text-[10px] text-slate-400 font-sans mt-1">
              Sur ventes incrémentales attribuées
            </p>
          </div>
        </div>

        {/* KPI 3: CAC */}
        <div className="bg-dark-card border border-slate-800 p-5 rounded-2xl flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-sans text-slate-500 font-semibold uppercase tracking-wider">Coût d'Acquisition (CAC)</span>
            <div className="p-2 bg-slate-800 rounded-xl text-slate-300">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-display font-bold text-lg text-slate-100">
              ${CAC} <span className="text-xs text-slate-500 font-normal">/ client</span>
            </p>
            <p className="text-[10px] text-slate-400 font-sans mt-1">
              Optimisé par rapport à $58 en 2024
            </p>
          </div>
        </div>

        {/* KPI 4: Conversion Rate */}
        <div className="bg-dark-card border border-slate-800 p-5 rounded-2xl flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-sans text-slate-500 font-semibold uppercase tracking-wider">Taux de Conversion</span>
            <div className="p-2 bg-gold-light/10 rounded-xl text-gold-light">
              <Percent className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-display font-bold text-lg text-slate-100">
              {conversionRate.toFixed(2)}%
            </p>
            <p className="text-[10px] text-slate-400 font-sans mt-1">
              Moyenne omnicanale (web, mobile, social)
            </p>
          </div>
        </div>
      </div>

      {/* Main Breakdown Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Campaigns Table */}
        <div className="lg:col-span-2 bg-dark-card border border-slate-800 p-6 rounded-3xl shadow-lg">
          <div>
            <h3 className="font-display font-bold text-sm text-slate-100">
              Performances des Campagnes Actives & Clôturées
            </h3>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-0.5">
              Suivi budgétaire, attribution et retour sur investissement
            </p>
          </div>
          
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] font-mono text-slate-500 uppercase tracking-wider pb-2">
                  <th className="py-2.5 font-medium">Campagne</th>
                  <th className="py-2.5 font-medium">Canal</th>
                  <th className="py-2.5 font-medium text-right">Budget</th>
                  <th className="py-2.5 font-medium text-right">Conv.</th>
                  <th className="py-2.5 font-medium text-right text-gold">ROI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs text-slate-400">
                {campaigns.map((c, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 font-semibold text-slate-200">
                      {c.name}
                    </td>
                    <td className="py-2.5 font-mono text-[11px] text-slate-400">{c.channel}</td>
                    <td className="py-2.5 text-right font-mono font-medium text-slate-300">
                      ${c.spend.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </td>
                    <td className="py-2.5 text-right font-mono font-medium text-slate-300">
                      {c.conversion}
                    </td>
                    <td className="py-2.5 text-right font-mono font-bold text-gold">
                      {c.roi}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Most Promoted Products (Merchandising) */}
        <div className="bg-dark-card border border-slate-800 p-6 rounded-3xl shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-sm text-slate-100">
              Impact Merchandising & Produits Promus
            </h3>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-0.5">
              Top 5 des produits par allocation marketing
            </p>
          </div>

          <div className="mt-4 space-y-3">
            {promotedProducts.map((p, idx) => (
              <div key={idx} className="p-2.5 bg-slate-950/40 border border-slate-800 rounded-2xl hover:bg-slate-800/40 transition-colors flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-200">{p.name}</p>
                  <p className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">{p.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-gold">ROAS {p.roas}</p>
                  <p className="text-[9px] text-slate-400 font-mono">Investi : {p.spend}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-gold/5 border border-gold/20 rounded-xl">
            <p className="text-[10px] font-mono text-gold uppercase tracking-wider mb-1 flex items-center gap-1.5 font-bold">
              <Zap className="h-3.5 w-3.5" />
              Insight Acquisition
            </p>
            <p className="text-xs font-sans text-slate-300 leading-snug">
              La campagne d'influenceurs sur la catégorie <strong>Fashion</strong> enregistre un ROAS exceptionnel de 4.6x grâce à une forte rétention sur les paniers VIP.
            </p>
          </div>
        </div>

      </div>

      {/* Campaign Spend vs Incremental Revenue (Visual layout) */}
      <div className="bg-dark-card border border-slate-800 p-6 rounded-3xl shadow-lg">
        <div>
          <h3 className="font-display font-bold text-sm text-slate-100">
            Attribution & Corrélation : Budget vs CA Incrémental
          </h3>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-0.5">
            Analyse d'impact du mix marketing omnicanal sur les 4 derniers trimestres
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { quarter: 'Q3 2025', spend: '$2.1M', rev: '$6.8M', perf: 'Excellente', efficiency: '85%' },
            { quarter: 'Q4 2025', spend: '$3.5M', rev: '$12.4M', perf: 'Pic Saisonnier', efficiency: '92%' },
            { quarter: 'Q1 2026', spend: '$1.8M', rev: '$5.2M', perf: 'Stable', efficiency: '78%' },
            { quarter: 'Q2 2026', spend: '$2.4M', rev: '$8.1M', perf: 'Forte Croissance', efficiency: '88%' }
          ].map((q, idx) => (
            <div key={idx} className="bg-slate-950/60 border border-slate-850 p-4 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="font-mono text-[10px] text-slate-500 block uppercase font-bold">{q.quarter}</span>
                <span className="text-xs font-sans text-slate-200 mt-1 block">{q.perf}</span>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/60">
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>Spend : {q.spend}</span>
                  <span className="text-gold">CA : {q.rev}</span>
                </div>
                {/* Horizontal bar */}
                <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-gold rounded-full" style={{ width: q.efficiency }} />
                </div>
                <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-1">
                  <span>Efficacité Média</span>
                  <span className="text-slate-300">{q.efficiency}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

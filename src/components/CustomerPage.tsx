/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  SalesBySegment, 
  DetailedTransaction 
} from '../types';
import { 
  Users, 
  Search, 
  Download, 
  ArrowUpDown, 
  Crown, 
  ShieldCheck, 
  Check, 
  X,
  Sparkles,
  ShoppingBag,
  Percent
} from 'lucide-react';
import { DETAILED_TRANSACTIONS } from '../data/mockData';

interface CustomerPageProps {
  segmentSales: SalesBySegment[];
}

export default function CustomerPage({ segmentSales }: CustomerPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSegmentFilter, setSelectedSegmentFilter] = useState<string>('All');
  const [sortField, setSortField] = useState<keyof DetailedTransaction>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Segment design helpers
  const getSegmentStyles = (segment: string) => {
    switch (segment) {
      case 'Bronze': return { bg: 'bg-orange-950/15 border-orange-900/30 text-orange-400', badge: 'bg-orange-500/10 text-orange-400 border border-orange-500/20', desc: "Clients occasionnels ou nouveaux, panier d'achat modéré." };
      case 'Silver': return { bg: 'bg-slate-900/40 border-slate-800 text-slate-300', badge: 'bg-slate-800 text-slate-300 border border-slate-700', desc: 'Clients réguliers à croissance stable.' };
      case 'Gold': return { bg: 'bg-yellow-950/15 border-yellow-900/30 text-yellow-400', badge: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20', desc: 'Valeur solide, engagement élevé et paniers récurrents.' };
      case 'Platinum': return { bg: 'bg-sky-950/15 border-sky-900/30 text-sky-400', badge: 'bg-sky-500/10 text-sky-400 border border-sky-500/20', desc: 'Acheteurs élites, contributeurs clés de marge brute.' };
      default: return { bg: 'bg-purple-950/15 border-purple-900/30 text-purple-400', badge: 'bg-purple-500/10 text-purple-400 border border-purple-500/20', desc: "Partenaires VIP, ambassadeurs à panier d'achat exceptionnel." }; // VIP
    }
  };

  // Detailed filters & sorting on client transactions list
  const filteredTransactions = useMemo(() => {
    return DETAILED_TRANSACTIONS.filter(tx => {
      const matchesSearch = 
         tx.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
         tx.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
         tx.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
         tx.city.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSegment = selectedSegmentFilter === 'All' || tx.segment === selectedSegmentFilter;

      return matchesSearch && matchesSegment;
    }).sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === 'string') {
        return sortDirection === 'asc' 
          ? valA.localeCompare(valB as string) 
          : (valB as string).localeCompare(valA);
      } else {
        return sortDirection === 'asc'
          ? (valA as number) - (valB as number)
          : (valB as number) - (valA as number);
      }
    });
  }, [searchTerm, selectedSegmentFilter, sortField, sortDirection]);

  // Pagination bounds
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1;

  const handleSort = (field: keyof DetailedTransaction) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    setCurrentPage(1);
  };

  // CSV Exporter for local Excel/Power BI load simulation
  const exportToCSV = () => {
    const headers = ['TX_ID', 'Date', 'Customer', 'Segment', 'Category', 'Product', 'Channel', 'Country', 'City', 'Qty', 'Revenue_USD', 'Profit_USD', 'Margin_Pct'];
    const rows = filteredTransactions.map(t => [
      t.id, t.date, `"${t.customerName}"`, t.segment, t.category, `"${t.productName}"`, t.channel, `"${t.country}"`, `"${t.city}"`, t.quantity, t.revenue, t.profit, t.margin
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `novaretail_clean_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
            NovaRetail CRM Analytics
          </span>
          <h2 className="font-display font-bold text-2xl text-slate-100 leading-tight">
            Customer Segmentation & Behavior
          </h2>
        </div>
      </div>

      {/* Segment cards row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {segmentSales.map(seg => {
          const config = getSegmentStyles(seg.segment);
          const totalRevenue = segmentSales.reduce((acc, s) => acc + s.revenue, 0) || 1;
          const share = (seg.revenue / totalRevenue) * 100;

          return (
            <div 
              key={seg.segment} 
              className={`border p-4 rounded-2xl flex flex-col justify-between hover:shadow-lg transition-shadow bg-slate-900 border-slate-800 ${config.bg}`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full font-bold ${config.badge}`}>
                    {seg.segment}
                  </span>
                  <Users className="h-4 w-4 text-slate-500" />
                </div>
                <p className="text-[10px] font-sans text-slate-400 mt-2 leading-relaxed">
                  {config.desc}
                </p>
              </div>

              <div className="mt-4">
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-0.5">Contribution</p>
                <p className="font-display font-bold text-base text-slate-100">
                  ${(seg.revenue / 1000000).toFixed(1)}M
                </p>
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1.5 border-t border-slate-800 pt-1.5">
                  <span>Share: {share.toFixed(0)}%</span>
                  <span>Clients: {seg.customers.toLocaleString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Client-Side Transaction Slicer & Explorer Table */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h3 className="font-display font-bold text-sm text-slate-100">
              Registre d'Audit des Transactions (100k Cleaned Register Sample)
            </h3>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-0.5">
              Recherche interactive et exportation pour Power BI / Excel
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Chercher client, produit, ville..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="pl-9 pr-4 py-1.5 w-60 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Segment filter dropdown */}
            <select
              value={selectedSegmentFilter}
              onChange={(e) => { setSelectedSegmentFilter(e.target.value); setCurrentPage(1); }}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-sans focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">Tous segments</option>
              <option value="Bronze">Bronze</option>
              <option value="Silver">Silver</option>
              <option value="Gold">Gold</option>
              <option value="Platinum">Platinum</option>
              <option value="VIP">VIP</option>
            </select>

            {/* Export CSV Button */}
            <button
              onClick={exportToCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-[10px] font-semibold shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              CSV Cleaned Export ({filteredTransactions.length})
            </button>
          </div>
        </div>

        {/* The data table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-mono text-slate-500 uppercase tracking-wider pb-2">
                <th className="py-2.5 font-medium">Tx ID</th>
                <th className="py-2.5 font-medium cursor-pointer hover:text-slate-200" onClick={() => handleSort('date')}>
                  Date <ArrowUpDown className="h-3 w-3 inline ml-0.5 text-slate-600" />
                </th>
                <th className="py-2.5 font-medium">Client</th>
                <th className="py-2.5 font-medium">Palier</th>
                <th className="py-2.5 font-medium">Produit</th>
                <th className="py-2.5 font-medium">Canal</th>
                <th className="py-2.5 font-medium">Localisation</th>
                <th className="py-2.5 font-medium cursor-pointer hover:text-slate-200 text-right" onClick={() => handleSort('revenue')}>
                  CA <ArrowUpDown className="h-3 w-3 inline ml-0.5 text-slate-600" />
                </th>
                <th className="py-2.5 font-medium cursor-pointer hover:text-slate-200 text-right" onClick={() => handleSort('profit')}>
                  Profit <ArrowUpDown className="h-3 w-3 inline ml-0.5 text-slate-600" />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs text-slate-400">
              {paginatedTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-2.5 font-mono text-slate-500 text-[10px]">{tx.id}</td>
                  <td className="py-2.5 font-mono">{tx.date}</td>
                  <td className="py-2.5 font-semibold text-slate-200 truncate max-w-[120px]" title={tx.customerName}>
                    {tx.customerName}
                  </td>
                  <td className="py-2.5">
                    <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold ${
                      tx.segment === 'VIP' ? 'bg-purple-500/15 text-purple-400 border border-purple-500/20' :
                      tx.segment === 'Platinum' ? 'bg-sky-500/15 text-sky-400 border border-sky-500/20' :
                      tx.segment === 'Gold' ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20' :
                      tx.segment === 'Silver' ? 'bg-slate-850 text-slate-300 border border-slate-700/60' : 'bg-orange-500/15 text-orange-400 border border-orange-500/20'
                    }`}>
                      {tx.segment}
                    </span>
                  </td>
                  <td className="py-2.5 truncate max-w-[150px] text-slate-300" title={tx.productName}>{tx.productName}</td>
                  <td className="py-2.5 text-slate-400 font-sans">{tx.channel}</td>
                  <td className="py-2.5">
                    <span className="text-slate-400">{tx.city}, </span>
                    <span className="font-semibold text-slate-200">{tx.country}</span>
                  </td>
                  <td className="py-2.5 text-right font-mono font-semibold text-slate-200">${tx.revenue.toFixed(0)}</td>
                  <td className="py-2.5 text-right font-mono text-emerald-400 font-semibold">${tx.profit.toFixed(0)}</td>
                </tr>
              ))}

              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500 text-xs font-sans">
                    Aucun enregistrement correspondant à votre recherche.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination HUD */}
        {filteredTransactions.length > 0 && (
          <div className="flex items-center justify-between border-t border-slate-800 mt-4 pt-4 text-xs font-sans text-slate-400">
            <div>
              Affichage de <span className="font-semibold text-slate-200">{((currentPage - 1) * itemsPerPage) + 1}</span> à{' '}
              <span className="font-semibold text-slate-200">
                {Math.min(currentPage * itemsPerPage, filteredTransactions.length)}
              </span>{' '}
              sur <span className="font-semibold text-slate-200">{filteredTransactions.length}</span> transactions
            </div>
            <div className="flex gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950/40 hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed text-xs transition-colors cursor-pointer"
              >
                Précédent
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950/40 hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed text-xs transition-colors cursor-pointer"
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

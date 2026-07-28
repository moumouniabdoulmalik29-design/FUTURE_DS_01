/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  SalesByYear, 
  DashboardFilters, 
  SalesKPIs, 
  ForecastData, 
  Anomaly, 
  AIRecommendation 
} from '../types';
import { 
  scanAnomalies, 
  getAIRecommendations, 
  computeSalesForecast 
} from '../utils/analyticsEngine';
import { 
  BrainCircuit, 
  TrendingUp, 
  Percent, 
  Sliders, 
  AlertTriangle, 
  ArrowRight, 
  Bot, 
  Send, 
  ChevronRight, 
  Sparkles,
  Info,
  Lightbulb,
  CornerDownRight,
  ShieldAlert
} from 'lucide-react';

interface ForecastPageProps {
  yearsTrend: SalesByYear[];
  filters: DashboardFilters;
  kpis: SalesKPIs;
}

export default function ForecastPage({
  yearsTrend,
  filters,
  kpis
}: ForecastPageProps) {
  // Simulator states
  const [growthAdjuster, setGrowthAdjuster] = useState(1.10); // +10% compound annual growth adjuster
  const [marginAdjuster, setMarginAdjuster] = useState(1.05); // +5% supplier procurement margin improvement
  
  // Rules-based audits
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);

  // AI chat states
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    { 
      sender: 'ai', 
      text: "Bonjour. Je suis votre Analyste d'Affaires Senior propulsé par l'IA Google Gemini. J'ai audité l'historique de 10 ans et 100 000 transactions de NovaRetail.\n\nQuelle question stratégique souhaitez-vous aborder aujourd'hui ?" 
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Scan anomalies and recommendations
  useEffect(() => {
    setAnomalies(scanAnomalies(filters));
    setRecommendations(getAIRecommendations());
  }, [filters]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isLoadingAI]);

  // Compute projection
  const forecastData = computeSalesForecast(yearsTrend, growthAdjuster, marginAdjuster);

  // SVG parameters for 13-year chart (10 historical + 3 forecast)
  const chartWidth = 720;
  const chartHeight = 260;
  const paddingLeft = 65;
  const paddingRight = 30;
  const paddingTop = 25;
  const paddingBottom = 45;

  const maxForecastRevenue = Math.max(...forecastData.map(f => f.revenue)) * 1.1;
  const totalPeriods = forecastData.length;

  const getCoordinates = (index: number, value: number) => {
    const x = paddingLeft + (index / (totalPeriods - 1)) * (chartWidth - paddingLeft - paddingRight);
    const y = chartHeight - paddingBottom - (value / maxForecastRevenue) * (chartHeight - paddingTop - paddingBottom);
    return { x, y };
  };

  // Generate paths
  let histRevenuePath = '';
  let foreRevenuePath = '';
  let histProfitPath = '';
  let foreProfitPath = '';

  forecastData.forEach((f, idx) => {
    const coords = getCoordinates(idx, f.revenue);
    const pCoords = getCoordinates(idx, f.profit);

    if (f.type === 'historical') {
      if (idx === 0) {
        histRevenuePath = `M ${coords.x} ${coords.y}`;
        histProfitPath = `M ${pCoords.x} ${pCoords.y}`;
      } else {
        histRevenuePath += ` L ${coords.x} ${coords.y}`;
        histProfitPath += ` L ${pCoords.x} ${pCoords.y}`;
      }
      
      // Connect historical endpoint to forecast start
      if (idx === yearsTrend.length - 1) {
        foreRevenuePath = `M ${coords.x} ${coords.y}`;
        foreProfitPath = `M ${pCoords.x} ${pCoords.y}`;
      }
    } else {
      foreRevenuePath += ` L ${coords.x} ${coords.y}`;
      foreProfitPath += ` L ${pCoords.x} ${pCoords.y}`;
    }
  });

  // Handle AI send
  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || userInput;
    if (!textToSend.trim()) return;

    // Append user message
    setChatMessages(prev => [...prev, { sender: 'user', text: textToSend }]);
    if (!customPrompt) setUserInput('');
    setIsLoadingAI(true);

    try {
      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          kpis,
          filters
        })
      });

      const data = await response.json();
      
      if (data.analysis) {
        setChatMessages(prev => [...prev, { sender: 'ai', text: data.analysis }]);
      } else if (data.error) {
        setChatMessages(prev => [...prev, { sender: 'ai', text: `Désolé, j'ai rencontré un problème : ${data.error}` }]);
      } else {
        setChatMessages(prev => [...prev, { sender: 'ai', text: "Désolé, une réponse vide a été retournée par le consultant." }]);
      }
    } catch (err: any) {
      setChatMessages(prev => [...prev, { sender: 'ai', text: `Erreur réseau : Impossible de contacter le consultant senior. (${err.message})` }]);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const quickPrompts = [
    { label: "📊 Audit de performance de l'électronique", query: "Veuillez analyser en détail pourquoi la catégorie Electronics a une si faible marge brute (18%) par rapport à son gros volume, et que recommander ?" },
    { label: "🚀 Stratégie de croissance 2027-2029", query: "Quels sont les meilleurs leviers pour atteindre nos objectifs de croissance pour la période 2027-2029 selon les données géographiques ?" },
    { label: "💎 Fidéliser les segments Bronze & Silver", query: "Comment optimiser la Lifetime Value (LTV) de nos clients Bronze et Silver pour qu'ils migrent vers les paliers Gold/VIP ?" }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
            NovaRetail Forecast & Artificial Intelligence Hub
          </span>
          <h2 className="font-display font-bold text-2xl text-slate-100 leading-tight flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-blue-500" />
            Forecast & AI Simulation
          </h2>
        </div>
      </div>

      {/* Grid: Simulator & Projection Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Simulator Knobs Inputs */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="h-5 w-5 text-blue-500" />
              <h3 className="font-display font-bold text-sm text-slate-100">
                Paramètres de Simulation
              </h3>
            </div>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-1">
              Ajustez les leviers pour projeter 2027 – 2029
            </p>
          </div>

          <div className="my-6 space-y-6">
            {/* Knob 1: Compound Annual Sales Growth Modifier */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-slate-500" />
                  Croissance des Ventes Annuelle
                </span>
                <span className="font-mono font-bold text-blue-400">
                  {((growthAdjuster - 1) * 100 >= 0 ? '+' : '') + ((growthAdjuster - 1) * 100).toFixed(0)}%
                </span>
              </div>
              <input 
                type="range" 
                min="0.80" 
                max="1.40" 
                step="0.05"
                value={growthAdjuster} 
                onChange={(e) => setGrowthAdjuster(parseFloat(e.target.value))}
                className="w-full accent-blue-500 cursor-ew-resize"
              />
              <p className="text-[10px] text-slate-400 leading-normal font-sans">
                Ajuste le coefficient de régression linéaire de croissance pour la décennie à venir.
              </p>
            </div>

            {/* Knob 2: Supplier Margin Improvement */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Percent className="h-4 w-4 text-slate-500" />
                  Optimisation Coûts Fournisseurs
                </span>
                <span className="font-mono font-bold text-emerald-400">
                  {((marginAdjuster - 1) * 100 >= 0 ? '+' : '') + ((marginAdjuster - 1) * 100).toFixed(0)}% de marge
                </span>
              </div>
              <input 
                type="range" 
                min="0.90" 
                max="1.25" 
                step="0.01"
                value={marginAdjuster} 
                onChange={(e) => setMarginAdjuster(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 cursor-ew-resize"
              />
              <p className="text-[10px] text-slate-400 leading-normal font-sans">
                Simule les gains de marge brute suite aux renégociations d'approvisionnement mondiales.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-slate-950/40 border border-slate-800 rounded-2xl">
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">
              Résultat Simulé (2029)
            </p>
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-semibold text-slate-400">CA Projeté :</span>
              <span className="font-mono font-extrabold text-slate-200 text-sm">
                ${(forecastData[forecastData.length - 1].revenue / 1000000).toFixed(1)}M
              </span>
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xs font-semibold text-slate-400 text-emerald-400">Profit Projeté :</span>
              <span className="font-mono font-extrabold text-emerald-400 text-sm">
                ${(forecastData[forecastData.length - 1].profit / 1000000).toFixed(1)}M
              </span>
            </div>
          </div>
        </div>

        {/* 13-Year Spline Forecast Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-sm text-slate-100">
                Courbe Globale de Prévision (13 Ans)
              </h3>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-0.5">
                Historique (2017 – 2026) vs Prédictions (2027 – 2029)
              </p>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-mono">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-200 inline-block"></span>
                <span className="text-slate-300">Réel</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500 inline-block"></span>
                <span className="text-slate-300">Prévision</span>
              </div>
            </div>
          </div>

          {/* SVG representation */}
          <div className="my-2 relative">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto">
              {/* Y Axis Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1.0].map((ratio, idx) => {
                const yVal = paddingTop + ratio * (chartHeight - paddingTop - paddingBottom);
                const label = maxForecastRevenue * (1 - ratio);
                return (
                  <g key={idx} className="opacity-40">
                    <line x1={paddingLeft} y1={yVal} x2={chartWidth - paddingRight} y2={yVal} stroke="#334155" strokeWidth="0.75" strokeDasharray="3,3" />
                    <text x={paddingLeft - 8} y={yVal + 3} className="font-mono text-[9px] fill-slate-500 text-right" textAnchor="end">
                      ${(label / 1000000).toFixed(0)}M
                    </text>
                  </g>
                );
              })}

              {/* X Axis labels */}
              {forecastData.map((f, idx) => {
                const coords = getCoordinates(idx, f.revenue);
                // Show every alternate year to keep tidy
                const shouldShowLabel = idx % 2 === 0 || idx === forecastData.length - 1;
                return (
                  <g key={idx}>
                    <line x1={coords.x} y1={chartHeight - paddingBottom} x2={coords.x} y2={chartHeight - paddingBottom + 4} stroke="#334155" />
                    {shouldShowLabel && (
                      <text x={coords.x} y={chartHeight - paddingBottom + 16} className={`font-mono text-[9px] text-center ${f.type === 'forecast' ? 'fill-blue-400 font-bold' : 'fill-slate-500'}`} textAnchor="middle">
                        {f.year}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Forecast Area Separator line */}
              <line 
                x1={getCoordinates(yearsTrend.length - 1, 0).x} 
                y1={paddingTop} 
                x2={getCoordinates(yearsTrend.length - 1, 0).x} 
                y2={chartHeight - paddingBottom} 
                stroke="#3b82f6" 
                strokeWidth="1.5" 
                strokeDasharray="5,5" 
                className="opacity-50"
              />
              <text 
                x={getCoordinates(yearsTrend.length - 1, 0).x + 6} 
                y={paddingTop + 12} 
                className="font-mono text-[8px] uppercase tracking-wider fill-blue-400 font-bold"
              >
                Début Prévisions
              </text>

              {/* Path - Historical Revenue */}
              <path d={histRevenuePath} fill="none" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" />
              {/* Path - Forecasted Revenue */}
              <path d={foreRevenuePath} fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray="4,4" strokeLinecap="round" />

              {/* Path - Historical Profit */}
              <path d={histProfitPath} fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
              {/* Path - Forecasted Profit */}
              <path d={foreProfitPath} fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="4,4" strokeLinecap="round" />
            </svg>
          </div>

          <div className="text-[10px] font-sans text-slate-400 leading-relaxed border-t border-slate-800/80 pt-3">
            La prévision est basée sur un algorithme de régression pondéré par les coefficients de saisonnalité de la distribution mondiale de NovaRetail.
          </div>
        </div>
      </div>

      {/* Grid: AI Anomaly Center & Senior BI Assistant Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Left Column: AI Anomaly & Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Rules-Based Anomaly box */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-4.5 w-4.5 text-amber-500" />
              <h3 className="font-display font-bold text-sm text-slate-100">
                Détection d'Anomalies Financières
              </h3>
            </div>

            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
              {anomalies.map(anom => (
                <div key={anom.id} className="p-3 bg-slate-950/40 rounded-2xl border border-slate-800/60 flex gap-2.5 text-xs">
                  {anom.severity === 'high' ? (
                    <ShieldAlert className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                  ) : (
                    <Info className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="flex items-baseline justify-between mb-1 gap-2">
                      <span className="font-bold text-slate-200 leading-snug">{anom.title}</span>
                      <span className={`text-[8px] font-mono uppercase font-bold px-1.5 py-0.2 rounded shrink-0 ${anom.severity === 'high' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                        {anom.impactValue}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{anom.description}</p>
                    <p className="text-[10px] text-slate-300 font-semibold mt-2 border-t border-slate-800/80 pt-1.5 flex items-start gap-1">
                      <CornerDownRight className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                      <span>Action : {anom.actionRequired}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Executive Assistant Console (Chat powered server-side) */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-3xl shadow-lg flex flex-col h-[520px] overflow-hidden">
          
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-200 border border-slate-700/60">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-xs text-slate-100">
                  Assistant Stratégique Google Gemini
                </h3>
                <p className="text-[9px] font-mono text-emerald-400 flex items-center gap-1 leading-none mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                  Modèle gemini-2.5-flash opérationnel
                </p>
              </div>
            </div>
            <Sparkles className="h-4.5 w-4.5 text-blue-400" />
          </div>

          {/* Quick templates prompt box */}
          <div className="p-3 border-b border-slate-800/60 bg-slate-950/20">
            <p className="text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-2">Sujets d'Analyse Recommandés :</p>
            <div className="flex flex-wrap gap-1.5">
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  disabled={isLoadingAI}
                  onClick={() => handleSendMessage(qp.query)}
                  className="text-[10px] text-slate-300 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg px-2.5 py-1 text-left transition-all shadow-sm leading-tight font-sans disabled:opacity-50 cursor-pointer"
                >
                  {qp.label}
                </button>
              ))}
            </div>
          </div>

          {/* Messages Display */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                <div className={`h-7 w-7 rounded-lg flex items-center justify-center text-white shrink-0 ${msg.sender === 'user' ? 'bg-blue-600' : 'bg-slate-850 border border-slate-750'}`}>
                  {msg.sender === 'user' ? 'ME' : <Bot className="h-4 w-4 text-slate-200" />}
                </div>
                <div className={`p-3 rounded-2xl border text-xs leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-blue-950/20 border-blue-900/40 text-slate-200 rounded-tr-none' 
                    : 'bg-slate-950/40 border-slate-800 text-slate-300 rounded-tl-none whitespace-pre-line'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {isLoadingAI && (
              <div className="flex gap-3 max-w-[80%]">
                <div className="h-7 w-7 rounded-lg bg-slate-850 border border-slate-750 text-white flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-slate-200" />
                </div>
                <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                  <span className="flex gap-1">
                    <span className="h-1.5 w-1.5 bg-slate-500 rounded-full animate-bounce"></span>
                    <span className="h-1.5 w-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="h-1.5 w-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </span>
                  Le Consultant Senior rédige le rapport d'analyse...
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Input Chat panel */}
          <div className="p-3 border-t border-slate-800 bg-slate-900">
            <div className="flex gap-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isLoadingAI && handleSendMessage()}
                placeholder="Posez une question sur les chiffres d'affaires ou les marges..."
                className="flex-1 px-3.5 py-2 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-950/40 focus:bg-slate-950"
                disabled={isLoadingAI}
              />
              <button
                onClick={() => !isLoadingAI && handleSendMessage()}
                disabled={isLoadingAI || !userInput.trim()}
                className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-40 transition-colors shrink-0 cursor-pointer"
              >
                <Send className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

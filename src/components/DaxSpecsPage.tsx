/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Code, 
  Database, 
  Copy, 
  Check, 
  BookOpen, 
  Layers, 
  FileText, 
  Sparkles,
  HelpCircle,
  Table,
  Cpu
} from 'lucide-react';

export default function DaxSpecsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'dax' | 'model' | 'dictionary' | 'docs'>('dax');

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const daxMeasures = [
    {
      id: 'dax-rev',
      name: 'Total Revenue (CA)',
      description: 'Somme totale des revenus générés sur l’ensemble des ventes.',
      formula: `Total Revenue = SUM(FactSales[Revenue])`
    },
    {
      id: 'dax-prof',
      name: 'Total Profit',
      description: 'Calcul du profit net total après déduction des coûts d’achat.',
      formula: `Total Profit = SUM(FactSales[Profit])`
    },
    {
      id: 'dax-margin',
      name: 'Profit Margin (%)',
      description: 'Pourcentage de rentabilité brute sur l’ensemble du chiffre d’affaires.',
      formula: `Profit Margin = \nDIVIDE(\n    [Total Profit],\n    [Total Revenue],\n    0\n)`
    },
    {
      id: 'dax-basket',
      name: 'Average Basket (Panier Moyen)',
      description: 'Valeur moyenne d’une commande unitaire passée par le client.',
      formula: `Average Basket = \nDIVIDE(\n    [Total Revenue],\n    DISTINCTCOUNT(FactSales[OrderID]),\n    0\n)`
    },
    {
      id: 'dax-growth',
      name: 'YoY Revenue Growth Rate',
      description: 'Taux de croissance annuel du chiffre d’affaires comparé à l’année précédente (Time Intelligence).',
      formula: `YoY Revenue Growth = \nVAR CurrentYearRevenue = [Total Revenue]\nVAR PreviousYearRevenue = \n    CALCULATE(\n        [Total Revenue],\n        SAMEPERIODLASTYEAR(DimDate[Date])\n    )\nRETURN\nDIVIDE(\n    CurrentYearRevenue - PreviousYearRevenue,\n    PreviousYearRevenue,\n    0\n)`
    },
    {
      id: 'dax-retention',
      name: 'Customer Retention Rate',
      description: 'Taux de rétention des clients actifs effectuant un rachat d’une année sur l’autre.',
      formula: `Customer Retention Rate = \nVAR ActiveCustomersThisYear = \n    VALUES(FactSales[CustomerID])\nVAR ActiveCustomersLastYear = \n    CALCULATE(\n        VALUES(FactSales[CustomerID]),\n        SAMEPERIODLASTYEAR(DimDate[Date])\n    )\nRETURN\nDIVIDE(\n    COUNTROWS(\n        INTERSECT(ActiveCustomersThisYear, ActiveCustomersLastYear)\n    ),\n    COUNTROWS(ActiveCustomersLastYear),\n    0\n)`
    },
    {
      id: 'dax-clv',
      name: 'Customer Lifetime Value (CLV)',
      description: 'Espérance de gain financier généré par un client sur sa durée de vie.',
      formula: `Customer Lifetime Value = \nVAR AvgOrderVal = [Average Basket]\nVAR PurchaseFreq = 3.4\nVAR RetentionRate = [Customer Retention Rate]\nRETURN\nDIVIDE(\n    AvgOrderVal * PurchaseFreq,\n    1 - RetentionRate,\n    0\n)`
    },
    {
      id: 'dax-roi',
      name: 'ROI Marketing (%)',
      description: 'Retour sur investissement des campagnes marketing d’acquisition.',
      formula: `ROI Marketing = \nVAR MarketingSales = \n    CALCULATE([Total Revenue], FactSales[Channel] = "Marketing Campaigns")\nVAR MarketingCost = SUM(FactSales[MarketingSpend])\nRETURN\nDIVIDE(\n    (MarketingSales * 0.35) - MarketingCost,\n    MarketingCost,\n    0\n)`
    },
    {
      id: 'dax-sat',
      name: 'Satisfaction Score (CSAT)',
      description: 'Moyenne pondérée des scores de retour d’expérience et d’enquêtes clients.',
      formula: `Satisfaction Score = AVERAGE(FactSales[SatisfactionScore])`
    }
  ];

  const dictionary = [
    { table: 'FactSales', field: 'OrderID', type: 'Integer / Key', desc: 'Identifiant unique de la transaction de vente.' },
    { table: 'FactSales', field: 'OrderDate', type: 'Date / Key', desc: 'Date de validation de la transaction.' },
    { table: 'FactSales', field: 'CustomerID', type: 'Integer / Key', desc: 'Référence au client acheteur dans DimCustomer.' },
    { table: 'FactSales', field: 'ProductID', type: 'Integer / Key', desc: 'Référence au produit vendu dans DimProduct.' },
    { table: 'FactSales', field: 'RegionID', type: 'Integer / Key', desc: 'Référence à la localisation géographique.' },
    { table: 'FactSales', field: 'Quantity', type: 'Integer', desc: 'Nombre d’unités facturées lors de la commande.' },
    { table: 'FactSales', field: 'UnitPrice', type: 'Decimal (Currency)', desc: 'Tarif unitaire brut applicable au produit.' },
    { table: 'FactSales', field: 'Revenue', type: 'Decimal (Currency)', desc: 'Chiffre d’affaires calculé (Quantity * UnitPrice après remises).' },
    { table: 'FactSales', field: 'Cost', type: 'Decimal (Currency)', desc: 'Coût total de revient / fabrication du produit.' },
    { table: 'FactSales', field: 'Profit', type: 'Decimal (Currency)', desc: 'Marge bénéficiaire nette totale (Revenue - Cost).' },
    
    { table: 'DimDate', field: 'Date', type: 'Date / PK', desc: 'Date calendaire unitaire (Clé primaire).' },
    { table: 'DimDate', field: 'Jour / Mois / Trimestre / Année', type: 'String / Int', desc: 'Hiérarchie temporelle d’analyse chronologique.' },
    
    { table: 'DimCustomer', field: 'CustomerID', type: 'Integer / PK', desc: 'Code d’identification unique du client.' },
    { table: 'DimCustomer', field: 'Nom / Segment / Pays', type: 'String', desc: 'Informations démographiques, segmentation RFM et profil.' },
    
    { table: 'DimProduct', field: 'ProductID', type: 'Integer / PK', desc: 'Code d’identification unique du produit.' },
    { table: 'DimProduct', field: 'Produit / Catégorie / Sous-catégorie', type: 'String', desc: 'Nomenclature et taxonomie de la gamme catalogue.' }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
          Modèle d’Architecture & DAX Studio d’Entreprise
        </span>
        <h2 className="font-display font-bold text-2xl text-slate-100 leading-tight flex items-center gap-2">
          <Code className="h-6 w-6 text-gold" />
          BI Modeling & DAX Measures
        </h2>
      </div>

      {/* Navigation Sub-tabs */}
      <div className="flex border-b border-slate-800 pb-2 gap-4">
        <button 
          onClick={() => setActiveSubTab('dax')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono tracking-wide transition-all ${
            activeSubTab === 'dax' 
              ? 'bg-gold/10 text-gold border border-gold/30' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Cpu className="h-4 w-4" />
          Mesures DAX (Copie Rapide)
        </button>
        <button 
          onClick={() => setActiveSubTab('model')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono tracking-wide transition-all ${
            activeSubTab === 'model' 
              ? 'bg-gold/10 text-gold border border-gold/30' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Database className="h-4 w-4" />
          Star Schema (Modèle en Étoile)
        </button>
        <button 
          onClick={() => setActiveSubTab('dictionary')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono tracking-wide transition-all ${
            activeSubTab === 'dictionary' 
              ? 'bg-gold/10 text-gold border border-gold/30' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Table className="h-4 w-4" />
          Dictionnaire des Données
        </button>
        <button 
          onClick={() => setActiveSubTab('docs')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono tracking-wide transition-all ${
            activeSubTab === 'docs' 
              ? 'bg-gold/10 text-gold border border-gold/30' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="h-4 w-4" />
          Cahier des Charges & Stratégie
        </button>
      </div>

      {/* Render Dynamic Content */}
      {activeSubTab === 'dax' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {daxMeasures.map((measure) => (
            <div key={measure.id} className="bg-dark-card border border-slate-800 p-5 rounded-2xl flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-sm text-slate-200">{measure.name}</h4>
                  <button 
                    onClick={() => handleCopy(measure.id, measure.formula)}
                    className="p-1.5 bg-slate-950/40 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg transition-all"
                    title="Copier la formule DAX"
                  >
                    {copiedId === measure.id ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-snug">{measure.description}</p>
              </div>
              <div className="mt-4 bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 font-mono text-[10px] text-gold-light overflow-x-auto whitespace-pre">
                {measure.formula}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSubTab === 'model' && (
        <div className="bg-dark-card border border-slate-800 p-6 rounded-3xl shadow-lg space-y-6">
          <div>
            <h3 className="font-display font-bold text-sm text-slate-100">
              Modèle d'Évaluation en Étoile (Star Schema)
            </h3>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-0.5">
              1 Table de Faits centrale connectée à 4 tables de dimensions (Relations 1 à plusieurs)
            </p>
          </div>

          {/* Graphical Abstract representation of Star Schema using Flexbox */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-8 bg-slate-950/40 rounded-2xl border border-slate-800/60 overflow-x-auto">
            
            {/* Dimension Left side */}
            <div className="flex flex-col gap-4">
              {/* DimCustomer */}
              <div className="bg-dark-card border border-slate-800 p-3.5 rounded-xl w-48 text-center shadow-md">
                <span className="text-[10px] font-mono text-gold uppercase tracking-wider block font-bold mb-1">DimCustomer</span>
                <p className="text-[10px] text-slate-400 font-sans">CustomerID (PK)</p>
                <p className="text-[9px] text-slate-500 font-mono">Nom, Segment, Pays</p>
              </div>
              
              {/* DimProduct */}
              <div className="bg-dark-card border border-slate-800 p-3.5 rounded-xl w-48 text-center shadow-md">
                <span className="text-[10px] font-mono text-gold uppercase tracking-wider block font-bold mb-1">DimProduct</span>
                <p className="text-[10px] text-slate-400 font-sans">ProductID (PK)</p>
                <p className="text-[9px] text-slate-500 font-mono">Produit, Catégorie, Sous-catégorie</p>
              </div>
            </div>

            {/* Relationship Lines (Abstract HTML Indicator) */}
            <div className="hidden md:flex flex-col justify-center gap-16 font-mono text-slate-600 text-xs text-center shrink-0">
              <span>(1:*) ───▶</span>
              <span>(1:*) ───▶</span>
            </div>

            {/* Central Fact Table */}
            <div className="bg-dark-card border border-gold/40 p-5 rounded-2xl w-56 text-center shadow-xl ring-1 ring-gold/20">
              <span className="text-[11px] font-mono text-gold uppercase tracking-wider block font-extrabold mb-2">FactSales</span>
              <div className="text-[10px] text-slate-300 font-sans space-y-1">
                <p className="border-b border-slate-800 pb-1 font-bold">Clés d’analyse :</p>
                <p>OrderID, OrderDate</p>
                <p>CustomerID (FK)</p>
                <p>ProductID (FK)</p>
                <p>RegionID (FK)</p>
                <p className="border-t border-slate-800 pt-1 font-bold mt-1 text-slate-400">Métriques de Faits :</p>
                <p>Quantity, UnitPrice</p>
                <p className="text-gold">Revenue, Cost, Profit</p>
              </div>
            </div>

            {/* Relationship Lines Right */}
            <div className="hidden md:flex flex-col justify-center gap-16 font-mono text-slate-600 text-xs text-center shrink-0">
              <span>◀─── (1:*)</span>
              <span>◀─── (1:*)</span>
            </div>

            {/* Dimension Right side */}
            <div className="flex flex-col gap-4">
              {/* DimDate */}
              <div className="bg-dark-card border border-slate-800 p-3.5 rounded-xl w-48 text-center shadow-md">
                <span className="text-[10px] font-mono text-gold uppercase tracking-wider block font-bold mb-1">DimDate</span>
                <p className="text-[10px] text-slate-400 font-sans">Date (PK)</p>
                <p className="text-[9px] text-slate-500 font-mono">Mois, Trimestre, Année</p>
              </div>

              {/* DimRegion */}
              <div className="bg-dark-card border border-slate-800 p-3.5 rounded-xl w-48 text-center shadow-md">
                <span className="text-[10px] font-mono text-gold uppercase tracking-wider block font-bold mb-1">DimRegion</span>
                <p className="text-[10px] text-slate-400 font-sans">RegionID (PK)</p>
                <p className="text-[9px] text-slate-500 font-mono">Ville, Pays, Continent</p>
              </div>
            </div>

          </div>

          <p className="text-xs text-slate-400 leading-relaxed max-w-2xl mx-auto text-center font-sans">
            Ce schéma en étoile est entièrement optimisé pour l'utilisation de l'engin <strong>VertiPaq</strong> de Microsoft Power BI, assurant un chargement instantané en cache mémoire et une compression maximale des 100k transactions historiques.
          </p>
        </div>
      )}

      {activeSubTab === 'dictionary' && (
        <div className="bg-dark-card border border-slate-800 p-6 rounded-3xl shadow-lg">
          <div>
            <h3 className="font-display font-bold text-sm text-slate-100">
              Dictionnaire Technique des Tables & Champs
            </h3>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-0.5">
              Spécifications des formats, clés relationnelles et formules métier
            </p>
          </div>

          <div className="mt-4 overflow-x-auto max-h-[420px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] font-mono text-slate-500 uppercase tracking-wider pb-2">
                  <th className="py-2.5 font-medium">Table</th>
                  <th className="py-2.5 font-medium">Nom du Champ</th>
                  <th className="py-2.5 font-medium">Type de Donnée</th>
                  <th className="py-2.5 font-medium">Description et Rôle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs text-slate-400">
                {dictionary.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 font-mono text-gold font-bold">{row.table}</td>
                    <td className="py-2.5 font-semibold text-slate-200">{row.field}</td>
                    <td className="py-2.5 font-mono text-[10px] text-slate-500">{row.type}</td>
                    <td className="py-2.5 text-slate-400 leading-normal">{row.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'docs' && (
        <div className="bg-dark-card border border-slate-800 p-6 rounded-3xl shadow-lg space-y-6 text-sm text-slate-300 leading-relaxed">
          <div>
            <h3 className="font-display font-bold text-sm text-slate-100 mb-2">
              Cahier des Charges - Business Sales Performance Analytics
            </h3>
            <p className="text-xs text-slate-400">
              Ce projet met en place un entrepôt de données décisionnel (Data Warehouse) pour surveiller de manière granulaire les performances de distribution de NovaRetail.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-800 pt-4">
            <div>
              <h4 className="font-display font-bold text-xs text-gold uppercase tracking-wider mb-2">1. Problématique & Contexte</h4>
              <p className="text-xs text-slate-400">
                En tant que leader mondial du commerce en ligne, NovaRetail gère un catalogue de plusieurs milliers de références distribuées à l’échelle internationale. Les décideurs avaient besoin d'une interface unique pour fusionner l’analyse des ventes, du marketing, et de la fidélisation client tout en incorporant des simulations prédictives de marge brute et de croissance.
              </p>
            </div>

            <div>
              <h4 className="font-display font-bold text-xs text-gold uppercase tracking-wider mb-2">2. Enjeux Business & Indicateurs clés</h4>
              <p className="text-xs text-slate-400">
                L’enjeu majeur réside dans la détection précoce de baisse de marge fournisseur (notamment sur la catégorie Electronics) et la ré-attribution efficace du mix marketing (ROAS) vers les canaux à fort taux de rachat comme le Mobile App ou le Social Commerce.
              </p>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-4">
            <h4 className="font-display font-bold text-xs text-gold uppercase tracking-wider mb-2">3. Recommandations de Déploiement Power BI Service</h4>
            <ul className="list-disc pl-5 text-xs text-slate-400 space-y-1.5">
              <li><strong>Passerelle de données (Gateway) :</strong> Configurer un rafraîchissement planifié 4 fois par jour (08:00, 12:00, 16:00, 20:00).</li>
              <li><strong>Sécurité au niveau des lignes (RLS) :</strong> Mettre en œuvre des rôles régionaux (par exemple, filtrer <code>DimRegion[Continent] = "Europe"</code> pour le Directeur Commercial Europe).</li>
              <li><strong>Déploiement Mobile :</strong> Mise en page mobile optimisée sous Power BI App avec des visuels condensés pour le Comex.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

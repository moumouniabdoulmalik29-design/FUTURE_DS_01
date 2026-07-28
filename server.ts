/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini client server-side safely to prevent startup crash if key is missing
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    aiClient = new GoogleGenAI({
      apiKey: apiKey || 'MOCK_KEY',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// API endpoint for health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

// AI Business Consultant endpoint
app.post('/api/gemini/analyze', async (req, res) => {
  try {
    const { prompt, kpis, filters } = req.body;
    
    // Check if real API key is available
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MY_GEMINI_API_KEY') {
      // Beautiful default consultative analysis when API key is not configured yet
      return res.json({
        analysis: `### 📊 Diagnostic Stratégique - NovaRetail Global Corporation

> **Note de l'Assistant :** Pour activer des audits personnalisés en temps réel via l'IA Google Gemini, configurez votre clé API dans le panneau **Settings > Secrets** avec la variable d'environnement **GEMINI_API_KEY**.

Voici un diagnostic consultatif basé sur les indicateurs actuels :

#### 1. Analyse du Chiffre d'Affaires et Volume d'Activité
* **Performance Globale :** Le volume d'activité de **$${(kpis.revenue / 1000000).toFixed(2)}M** témoigne d'un ancrage mondial robuste de **NovaRetail**.
* **Marge Brute Globalisée :** La marge de **${(kpis.margin * 100).toFixed(2)}%** est très compétitive, mais cache de profondes disparités catégorielles.

#### 2. Disparité "Volume vs Profit" : Le Cas d'Écoles de l'Électronique
* **Anomalie de l'Électronique :** Bien que la catégorie **Electronics** représente environ 35% de notre volume d'affaires global, sa marge brute plafonne à **18%** à cause d'une flambée récente des coûts fournisseurs.
* **Moteurs de Rentabilité Silencieux :** Les catégories **Beauty** (${(48).toFixed(1)}% de marge) et **Fashion** (${(45).toFixed(1)}% de marge) surperforment largement en profit net par transaction, bien qu'elles n'occupent respectivement que 4% et 8% du CA global.

#### 3. Recommandations Stratégiques Clés
1. 🔧 **Renégociation Fournisseurs (Electronics) :** Lancer immédiatement un audit de la chaîne d'approvisionnement asiatique pour économiser 3.5% sur les coûts unitaires.
2. 📱 **Expansion Mobile Commerce :** Réorienter 15% du budget d'acquisition client vers l'application mobile de NovaRetail, qui affiche les taux de rétention les plus sains (${(78).toFixed(1)}%).
3. 💎 **Loyauté Clientèle :** Promouvoir un plan d'accélération relationnelle pour inciter la clientèle "Gold" à intégrer les paliers "Platinum" et "VIP", maximisant ainsi la Lifetime Value (LTV) moyenne actuellement évaluée à **$${kpis.customerLTV.toLocaleString(undefined, { maximumFractionDigits: 2 })}**.`
      });
    }

    const systemInstruction = `Tu es un consultant expert en Business Intelligence et Directeur Stratégique Principal pour NovaRetail Global Corporation.
Ton but est d'analyser les indicateurs de performance commerciale (KPIs), d'identifier les anomalies d'affaires, et de donner des recommandations de haut niveau.

Adopte un ton extrêmement professionnel, précis, analytique et constructif. Exprime-toi en français de manière claire et structurée en utilisant des titres, des sous-titres et des listes à puces.

Les filtres actuels appliqués sur le tableau de bord par l'utilisateur sont :
- Années analysées : ${JSON.stringify(filters.years)}
- Catégories sélectionnées : ${JSON.stringify(filters.categories)}
- Canaux de distribution : ${JSON.stringify(filters.channels)}
- Segments clients : ${JSON.stringify(filters.segments)}
- Continents concernés : ${JSON.stringify(filters.continents)}

Voici les données opérationnelles en cours de calcul :
- Chiffre d'Affaires Total : $${kpis.revenue.toLocaleString()}
- Profit Total : $${kpis.profit.toLocaleString()}
- Marge Bénéficiaire Brute : ${(kpis.margin * 100).toFixed(2)}%
- Nombre de Commandes : ${kpis.orders.toLocaleString()}
- Panier Moyen : $${kpis.averageOrderValue.toFixed(2)}
- Taux de Conversion : ${(kpis.conversionRate * 100).toFixed(2)}%
- Nombre de Clients Actifs : ${kpis.customersCount.toLocaleString()}
- Taux de Rétention Client : ${(kpis.retentionRate * 100).toFixed(2)}%
- Lifetime Value Moyenne (LTV) : $${kpis.customerLTV.toFixed(2)}

Formule une analyse rigoureuse et axée sur l'impact financier. Cite des chiffres précis. Adresse-toi au DG / Comité de direction de NovaRetail. Si l'utilisateur pose une question spécifique, réponds-y directement en intégrant ces données de contexte.`;

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt || 'Donnez-moi une analyse executive globale et des recommandations.',
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({
      analysis: response.text,
    });
  } catch (error: any) {
    console.error('Gemini Request Error:', error);
    res.status(500).json({ error: error.message || 'Error processing AI analysis' });
  }
});

// Start Express Server and mount Vite or serve static production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite dev middleware mounted.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Serving production static assets.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NovaRetail corporate server running on http://localhost:${PORT}`);
  });
}

startServer();

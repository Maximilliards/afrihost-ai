import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { MOCK_PROPERTIES } from './src/data/mockData';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize Google Gen AI client
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;

if (apiKey) {
  try {
    ai = new GoogleGenAI({ apiKey });
    console.log('✅ Google GenAI SDK initialized with provided GEMINI_API_KEY');
  } catch (err) {
    console.warn('⚠️ Could not initialize Google GenAI SDK:', err);
  }
} else {
  console.log('ℹ️ No GEMINI_API_KEY found in environment. Server will use intelligent Cameroonian heuristic fallbacks.');
}

const CAMEROON_SYSTEM_INSTRUCTION = `
Tu es "AfriBot", le concierge IA d'AfriHostAI, la plateforme de référence pour la gestion de meublés de haut standing au Cameroun (Douala, Yaoundé, Kribi, Limbé).
Tu t'adresses aussi bien aux voyageurs locaux d'affaires qu'à la diaspora camerounaise (France, USA, Canada, Belgique, Royaume-Uni, etc.).

Règles de communication et atouts indispensables :
1. ⚡ ÉNERGIE CONTINUE : Tous nos logements disposent d'un groupe électrogène automatique puissant (30 à 80 kVA) avec réserve de carburant assurant 0 coupure même en cas de délestage Eneo.
2. 💧 EAU GARANTIE : Forage autonome avec cuve de réserve (2000L à 8000L), filtre antibactérien et surpresseur avec eau chaude.
3. 🛰️ INTERNET STARLINK : Connexion satellite Starlink ou Fibre optique (100-250 Mbps) parfaite pour le télétravail et les visios Zoom.
4. 🚗 NAVETTE AÉROPORT : Navette privée disponible pour les arrivées à Douala International (DLA) et Yaoundé-Nsimalen (NSI).
5. 💳 PAIEMENT MOBILE SÉCURISÉ : Tarifs en Francs CFA (FCFA / XAF). Paiements acceptés par MTN Mobile Money (*126#) et Orange Money (*150#) avec reçu fiscal conforme DGI (TTA 0.2% incluse).
6. 📍 LOCALISATIONS VIP : Douala (Bonapriso, Akwa), Yaoundé (Bastos, Omnisports), Kribi (Ngoye Plage bord de mer), Limbé (Bota vue volcan).

Adopte un ton courtois, accueillant ("Bienvenue au pays / Bienvenue chez AfriHostAI"), rassurant sur la logistique et précis sur les tarifs en FCFA.
`;

// GET /api/health
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'AfriHostAI Backend',
    hasGeminiApiKey: Boolean(apiKey),
    geminiModel: 'gemini-2.5-flash',
    timestamp: new Date().toISOString(),
    currency: 'FCFA (XAF)',
    jurisdiction: 'Cameroon (TTA 0.2%)',
  });
});

// POST /api/gemini/chat
app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  try {
    const { messages, userMessage, selectedCity } = req.body;
    const prompt = userMessage || (messages && messages[messages.length - 1]?.text) || 'Bonjour';

    // If Gemini client is active, use Gemini 2.5 Flash / 3.7 Flash
    if (ai && apiKey) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `${CAMEROON_SYSTEM_INSTRUCTION}\n\nContexte actuel de l'utilisateur:\nVille filtrée: ${selectedCity || 'Toutes'}\n\nHistorique / Message client:\n${prompt}`
                }
              ]
            }
          ]
        });

        const replyText = response.text || "Bonjour, comment puis-je vous aider pour votre séjour au Cameroun ?";
        
        // Find suggested property based on content
        const suggestedProp = findBestMatchingProperty(prompt + ' ' + replyText, selectedCity);

        return res.json({
          reply: replyText,
          suggestedProperty: suggestedProp,
          provider: 'Gemini 2.5 Flash (Google Gen AI)',
          status: 'success'
        });
      } catch (geminiError) {
        console.error('Gemini API execution error, falling back to heuristic engine:', geminiError);
      }
    }

    // Heuristic Cameroonian Concierge Engine Fallback
    const heuristicResponse = generateHeuristicReply(prompt, selectedCity);
    return res.json(heuristicResponse);

  } catch (error) {
    console.error('Error in /api/gemini/chat:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/gemini/qualify
app.post('/api/gemini/qualify', async (req: Request, res: Response) => {
  try {
    const { conversationText, leadName, phone } = req.body;
    const text = conversationText || '';

    if (ai && apiKey) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `Tu es l'algorithme d'évaluation de leads pour AfriHostAI Cameroun.
Analyse cette conversation WhatsApp et retourne UNIQUEMENT un objet JSON valide (sans markdown) avec cette structure:
{
  "intentScore": number (0 à 100),
  "status": "hot" | "warm" | "cold",
  "budgetEstimatedFCFA": number,
  "targetCity": "Douala" | "Yaoundé" | "Kribi" | "Limbé",
  "durationNights": number,
  "isDiaspora": boolean,
  "summary": string,
  "detectedNeeds": string[],
  "suggestedPropertyId": string
}

Propriétés disponibles:
- prop-douala-01: Villa Royale Bonapriso (120 000 FCFA/nuit, piscine, groupe 60kVA, Douala)
- prop-douala-02: Executive Penthouse Akwa (85 000 FCFA/nuit, affaires, groupe 40kVA, Douala)
- prop-yaounde-01: Résidence Diplomatique Bastos (135 000 FCFA/nuit, groupe 80kVA, Yaoundé)
- prop-yaounde-02: Smart Loft Omnisports (45 000 FCFA/nuit, Starlink, Yaoundé)
- prop-kribi-01: Lodge Pieds-dans-l'Eau Ngoye (95 000 FCFA/nuit, plage, Kribi)
- prop-limbe-01: Atlantic View Villa Bota (70 000 FCFA/nuit, Limbé)

Conversation:
Nom du prospect: ${leadName || 'Inconnu'}
Téléphone: ${phone || ''}
${text}`
                }
              ]
            }
          ]
        });

        const raw = response.text || '{}';
        const cleanJson = raw.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJson);
        return res.json({ qualification: parsed, provider: 'Gemini' });
      } catch (err) {
        console.warn('Gemini qualification failed, applying heuristic qualification:', err);
      }
    }

    // Heuristic Lead Qualification
    const qualification = generateHeuristicQualification(text, leadName, phone);
    res.json({ qualification, provider: 'Heuristic Engine' });

  } catch (error) {
    console.error('Error in /api/gemini/qualify:', error);
    res.status(500).json({ error: 'Failed to qualify lead' });
  }
});

// Helper: Match best property
function findBestMatchingProperty(text: string, selectedCity?: string) {
  const lower = text.toLowerCase();
  
  if (lower.includes('bastos') || (lower.includes('yaoundé') && (lower.includes('villa') || lower.includes('ambassade') || lower.includes('135')))) {
    return MOCK_PROPERTIES.find(p => p.id === 'prop-yaounde-01');
  }
  if (lower.includes('omnisport') || lower.includes('loft') || (lower.includes('yaoundé') && lower.includes('45'))) {
    return MOCK_PROPERTIES.find(p => p.id === 'prop-yaounde-02');
  }
  if (lower.includes('bonapriso') || (lower.includes('douala') && (lower.includes('piscine') || lower.includes('120')))) {
    return MOCK_PROPERTIES.find(p => p.id === 'prop-douala-01');
  }
  if (lower.includes('akwa') || (lower.includes('douala') && lower.includes('penthouse'))) {
    return MOCK_PROPERTIES.find(p => p.id === 'prop-douala-02');
  }
  if (lower.includes('kribi') || lower.includes('plage') || lower.includes('ngoye') || lower.includes('crevette')) {
    return MOCK_PROPERTIES.find(p => p.id === 'prop-kribi-01');
  }
  if (lower.includes('limb') || lower.includes('bota') || lower.includes('volcan')) {
    return MOCK_PROPERTIES.find(p => p.id === 'prop-limbe-01');
  }

  if (selectedCity && selectedCity !== 'All') {
    return MOCK_PROPERTIES.find(p => p.city === selectedCity) || MOCK_PROPERTIES[0];
  }

  return MOCK_PROPERTIES[0];
}

// Heuristic response generator
function generateHeuristicReply(prompt: string, selectedCity?: string) {
  const lower = prompt.toLowerCase();
  let reply = '';
  let suggestedProperty = findBestMatchingProperty(prompt, selectedCity);

  if (lower.includes('bonjour') || lower.includes('salut') || lower.includes('hello') || lower.includes('bonsoir')) {
    reply = `Bonjour et bienvenue chez **AfriHostAI Cameroun** 🇨🇲 !\n\nNous mettons à votre disposition des hébergements meublés grand standing avec autonomie totale garantie :\n⚡ **Groupe électrogène automatique** (0 coupure)\n💧 **Forage & réserve d'eau filtrée**\n🛰️ **Internet Starlink Très Haut Débit**\n\nDans quelle ville préparez-vous votre séjour (Douala, Yaoundé, Kribi, Limbé) ?`;
  } else if (lower.includes('bastos') || lower.includes('yaounde') || lower.includes('yaoundé')) {
    suggestedProperty = MOCK_PROPERTIES.find(p => p.id === 'prop-yaounde-01') || MOCK_PROPERTIES[2];
    reply = `Excellente option ! À **Yaoundé**, nous vous recommandons notre **${suggestedProperty?.name}** à Bastos (proche ambassades).\n\n✨ **Tarif :** 135 000 FCFA / nuit\n⚡ Groupe électrogène 80 kVA insonorisé\n💧 Cuve 8000L + forage automatique\n🛰️ Starlink 250 Mbps & Piscine\n🚗 Navette aéroport Yaoundé-Nsimalen disponible.\n\nSouhaitez-vous bloquer vos dates ou lancer une réservation par MTN MoMo / Orange Money ?`;
  } else if (lower.includes('bonapriso') || lower.includes('douala') || lower.includes('akwa')) {
    suggestedProperty = MOCK_PROPERTIES.find(p => p.id === 'prop-douala-01') || MOCK_PROPERTIES[0];
    reply = `Pour votre séjour à **Douala**, la **${suggestedProperty?.name}** à Bonapriso est notre hébergement le plus prisé !\n\n✨ **Tarif :** 120 000 FCFA / nuit (3 chambres climatisées, piscine)\n⚡ Groupe automatique 60 kVA (relais immédiat sans coupure)\n💧 Réserve d'eau 5000L avec surpresseur\n🚗 Navette direct aéroport de Douala (DLA)\n\nNous acceptons les paiements instantanés MTN MoMo, Orange Money et virements internationaux.`;
  } else if (lower.includes('kribi') || lower.includes('plage') || lower.includes('mer')) {
    suggestedProperty = MOCK_PROPERTIES.find(p => p.id === 'prop-kribi-01') || MOCK_PROPERTIES[4];
    reply = `Une escapade à la mer ? Notre **${suggestedProperty?.name}** à Kribi (Ngoye Plage) dispose d'un accès direct au sable blanc 🏖️.\n\n✨ **Tarif :** 95 000 FCFA / nuit\n⚡ Groupe électrogène 45 kVA\n💧 Forage et eau douce assurés\n🦞 Barbecue de crevettes face à l'océan\n\nCombien de nuits souhaitez-vous réserver pour votre séjour ?`;
  } else if (lower.includes('groupe') || lower.includes('eneo') || lower.includes('lumiere') || lower.includes('courant') || lower.includes('electricité')) {
    reply = `⚡ **Zéro souci d'électricité chez AfriHostAI !**\n\nToutes nos résidences sont équipées de groupes électrogènes diesel automatiques (30kVA à 80kVA) reliés à un inverseur de source automatique. Dès qu'Eneo coupe, le groupe démarre en moins de 10 secondes. Vos appareils, climatiseurs et connexions Starlink restent alimentés en continu.`;
  } else if (lower.includes('eau') || lower.includes('forage') || lower.includes('camwater')) {
    reply = `💧 **Autonomie totale en eau garantie !**\n\nChaque propriété possède son propre forage avec cuve de stockage (2000L à 8000L), filtre antitartre/antibactérien et surpresseur pour garantir une pression d'eau optimale et de l'eau chaude 24h/24 dans toutes les salles de bains.`;
  } else if (lower.includes('paiement') || lower.includes('momo') || lower.includes('orange') || lower.includes('prix') || lower.includes('payer')) {
    reply = `💳 **Modalités de paiement au Cameroun :**\n\n1. **MTN Mobile Money (*126#)** - 1% de frais opérateur + 0.2% TTA (Taxe sur les Transferts Électroniques)\n2. **Orange Money (*150#)** - 1% de frais opérateur + 0.2% TTA\n3. **Virement bancaire / Cartes internationales** pour la diaspora\n\nChaque paiement génère un reçu fiscal certifié AfriHostAI conforme aux normes DGI Cameroun.`;
  } else if (lower.includes('navette') || lower.includes('aeroport') || lower.includes('nsimalen') || lower.includes('dla')) {
    reply = `🚗 **Accueil & Navette Aéroport VIP :**\n\nNotre chauffeur privé vous attend à la sortie des terminaux de Douala International (DLA) ou Yaoundé-Nsimalen (NSI) avec pancarte nominative et véhicule climatisé avec Wi-Fi à bord. Service inclus pour tout séjour de 5 nuits et plus !`;
  } else {
    reply = `Merci pour votre message ! Chez **AfriHostAI**, nous garantissons votre confort absolu à Douala, Yaoundé, Kribi et Limbé avec groupe électrogène automatique, forage autonome et Wi-Fi Starlink.\n\n✨ Nous proposons des appartements et villas de 45 000 FCFA à 135 000 FCFA / nuit. Quel est votre budget et vos dates souhaitées ?`;
  }

  return {
    reply,
    suggestedProperty,
    provider: 'AfriHost Heuristic AI Engine (Cameroun)',
    status: 'success'
  };
}

// Heuristic qualification generator
function generateHeuristicQualification(text: string, name?: string, phone?: string) {
  const lower = text.toLowerCase();
  const isDiaspora = Boolean(
    phone?.startsWith('+33') || 
    phone?.startsWith('+1') || 
    phone?.startsWith('+49') || 
    phone?.startsWith('+32') || 
    phone?.startsWith('+44') ||
    lower.includes('france') || 
    lower.includes('paris') || 
    lower.includes('diaspora') || 
    lower.includes('euro') || 
    lower.includes('canada') || 
    lower.includes('usa')
  );

  let intentScore = 65;
  let status: 'hot' | 'warm' | 'cold' = 'warm';
  let targetCity = 'Douala';
  let durationNights = 3;
  let budgetEstimatedFCFA = 300000;
  let suggestedPropertyId = 'prop-douala-01';

  if (lower.includes('bastos') || lower.includes('yaoundé') || lower.includes('yaounde')) {
    targetCity = 'Yaoundé';
    suggestedPropertyId = lower.includes('loft') || lower.includes('omnisport') ? 'prop-yaounde-02' : 'prop-yaounde-01';
  } else if (lower.includes('kribi') || lower.includes('plage')) {
    targetCity = 'Kribi';
    suggestedPropertyId = 'prop-kribi-01';
  } else if (lower.includes('limb')) {
    targetCity = 'Limbé';
    suggestedPropertyId = 'prop-limbe-01';
  } else if (lower.includes('akwa')) {
    targetCity = 'Douala';
    suggestedPropertyId = 'prop-douala-02';
  }

  if (lower.includes('tout de suite') || lower.includes('reserver') || lower.includes('bloquer') || lower.includes('acompte') || lower.includes('payer') || lower.includes('momo') || lower.includes('orange money')) {
    intentScore = Math.min(98, intentScore + 28);
    status = 'hot';
  }

  if (isDiaspora) {
    intentScore = Math.min(99, intentScore + 10);
    durationNights = 7;
    budgetEstimatedFCFA = 750000;
  }

  const detectedNeeds: string[] = [];
  if (lower.includes('groupe') || lower.includes('eneo') || lower.includes('lumiere')) detectedNeeds.push('Groupe électrogène garanti');
  if (lower.includes('starlink') || lower.includes('wifi') || lower.includes('internet')) detectedNeeds.push('Starlink / Fibre haut débit');
  if (lower.includes('navette') || lower.includes('aeroport') || lower.includes('nsimalen')) detectedNeeds.push('Navette aéroport');
  if (lower.includes('piscine')) detectedNeeds.push('Piscine privée');
  if (lower.includes('eau') || lower.includes('forage')) detectedNeeds.push('Forage / Réserve d\'eau');

  return {
    intentScore,
    status,
    budgetEstimatedFCFA,
    targetCity,
    durationNights,
    isDiaspora,
    summary: `Lead ${isDiaspora ? 'Diaspora' : 'Local'} intéressé par ${targetCity}. Forte sensibilité à l'autonomie énergétique et à la connexion internet.`,
    detectedNeeds: detectedNeeds.length > 0 ? detectedNeeds : ['Groupe électrogène', 'Forage', 'Climatisation'],
    suggestedPropertyId
  };
}

app.listen(PORT, () => {
  console.log(`🚀 AfriHostAI Server running at http://localhost:${PORT}`);
});

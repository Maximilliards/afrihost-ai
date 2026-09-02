import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  Sparkles, 
  CheckCheck, 
  Smartphone, 
  MapPin, 
  Zap, 
  Droplets, 
  Wifi, 
  ShieldCheck, 
  Flame, 
  RefreshCw,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  Mic,
  ArrowRight
} from 'lucide-react';
import { ChatMessage, Property, City, LeadQualification } from '../types';
import { formatFCFA } from '../utils/formatters';

interface WhatsAppSimulatorProps {
  selectedCity: City;
  initialProperty?: Property | null;
  onOpenUSSD: (property?: Property) => void;
  onLeadQualified?: (qual: LeadQualification) => void;
}

export const WhatsAppSimulator: React.FC<WhatsAppSimulatorProps> = ({
  selectedCity,
  initialProperty,
  onOpenUSSD,
  onLeadQualified,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: `Bonjour et bienvenue chez **AfriHostAI Cameroun** 🇨🇲 !\n\nJe suis **AfriBot**, votre concierge IA dédié aux séjours haut de gamme à Douala, Yaoundé, Kribi et Limbé.\n\n⚡ **Autonomie 100% garantie :** Groupe électrogène automatique puissant, forage avec réserve d'eau filtrée et Wi-Fi Starlink dans tous nos meublés.\n\nComment puis-je vous orienter aujourd'hui ?`,
      timestamp: '14:20',
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isQualifying, setIsQualifying] = useState(false);
  const [leadQualification, setLeadQualification] = useState<LeadQualification | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle initial property recommendation if passed
  useEffect(() => {
    if (initialProperty) {
      const userTxt = `Bonjour, je suis intéressé par ${initialProperty.name} à ${initialProperty.neighborhood} (${initialProperty.city}). Pouvez-vous me confirmer les disponibilités et l'autonomie en cas de coupure Eneo ?`;
      handleSendMessage(userTxt);
    }
  }, [initialProperty]);

  const quickPrompts = [
    {
      label: '🇨🇲 Bastos Yaoundé (Diaspora)',
      text: 'Bonjour, je rentre de Paris pour 10 jours à Yaoundé. Je cherche une villa sécurisée à Bastos avec groupe 80kVA, Starlink et navette Nsimalen.',
    },
    {
      label: '🌊 Villa Kribi Plage',
      text: 'Avez-vous une villa disponible les pieds dans l\'eau à Kribi Ngoye pour un weekend en famille ? Quel est le prix en FCFA ?',
    },
    {
      label: '⚡ Garantie Coupures Eneo',
      text: 'Comment gérez-vous les coupures d\'électricité et d\'eau ? Est-ce que le groupe tourne automatiquement ?',
    },
    {
      label: '💳 Paiement MTN MoMo / OM',
      text: 'Je veux réserver 3 nuits à Bonapriso Douala. Comment payer par MTN Mobile Money ou Orange Money avec facture DGI ?',
    },
  ];

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: textToSend,
          messages: [...messages, userMsg],
          selectedCity: selectedCity !== 'All' ? selectedCity : undefined,
        }),
      });

      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();
      
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || "Bonjour, comment puis-je vous assister pour votre séjour au Cameroun ?",
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        propertySuggestion: data.suggestedProperty || undefined,
      };

      setMessages(prev => [...prev, botMsg]);

    } catch (err) {
      console.error('Chat error:', err);
      // Fallback
      const fallbackMsg: ChatMessage = {
        id: `bot-fallback-${Date.now()}`,
        sender: 'assistant',
        text: `Parfait ! Chez **AfriHostAI**, toutes nos résidences à **${selectedCity !== 'All' ? selectedCity : 'Douala et Yaoundé'}** disposent d'un groupe électrogène automatique et d'une cuve de réserve d'eau avec filtre.\n\nNous acceptons les paiements instantanés par MTN Mobile Money (*126#) et Orange Money (*150#) avec quittance DGI (TTA 0.2%).\n\nSouhaitez-vous déclencher une réservation ?`,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQualifyLead = async () => {
    setIsQualifying(true);
    try {
      const conversationText = messages.map(m => `${m.sender.toUpperCase()}: ${m.text}`).join('\n');
      const response = await fetch('/api/gemini/qualify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationText,
          leadName: 'Visiteur WhatsApp',
          phone: '+237 699 00 11 22',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setLeadQualification(data.qualification);
        if (onLeadQualified) onLeadQualified(data.qualification);
      }
    } catch (err) {
      console.error('Failed to qualify lead:', err);
    } finally {
      setIsQualifying(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">💬</span>
            <h1 className="text-xl font-black text-white">
              Simulateur WhatsApp Concierge IA AfriHost
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Gemini 3.7 Flash Engine
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Testez l'agent conversationnel autonome en conditions réelles (tarifs FCFA, navettes aéroports, autonomie groupe électrogène).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleQualifyLead}
            disabled={isQualifying || messages.length < 2}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-purple-950/50 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isQualifying ? 'Analyse du Lead...' : 'Évaluer le Lead (AI Scoring)'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: WhatsApp Phone Simulation */}
        <div className="lg:col-span-2 flex flex-col h-[650px] bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
          
          {/* WhatsApp Header */}
          <div className="bg-[#075E54] px-4 py-3 flex items-center justify-between text-white shadow-md z-10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-white shadow-inner">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#075E54]"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm">AfriHostAI Concierge 🇨🇲</span>
                  <span className="text-[10px] bg-emerald-400/20 text-emerald-200 px-1 rounded font-mono">OFFICIEL</span>
                </div>
                <p className="text-[11px] text-emerald-100/80 flex items-center gap-1">
                  <span>En ligne</span>
                  <span>•</span>
                  <span>+237 699 00 00 00</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-emerald-100">
              <Phone className="w-4 h-4 cursor-pointer hover:text-white" />
              <Video className="w-4 h-4 cursor-pointer hover:text-white" />
              <MoreVertical className="w-4 h-4 cursor-pointer hover:text-white" />
            </div>
          </div>

          {/* WhatsApp Chat Messages Container */}
          <div 
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/95"
            style={{
              backgroundImage: 'radial-gradient(#1e293b 0.75px, transparent 0.75px)',
              backgroundSize: '16px 16px',
            }}
          >
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[90%] sm:max-w-[80%] ${isUser ? 'ml-auto' : 'mr-auto'}`}
                >
                  <div
                    className={`rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-md ${
                      isUser
                        ? 'bg-[#005c4b] text-white rounded-tr-none'
                        : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none'
                    }`}
                  >
                    <div className="whitespace-pre-line font-sans">
                      {msg.text}
                    </div>

                    {/* Rich Property Suggestion Card inside Chat */}
                    {msg.propertySuggestion && (
                      <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 space-y-2">
                        <div className="relative h-28 rounded-lg overflow-hidden">
                          <img
                            src={msg.propertySuggestion.imageUrl}
                            alt={msg.propertySuggestion.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-950/80 text-white">
                            📍 {msg.propertySuggestion.neighborhood}
                          </div>
                          <div className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-500 text-slate-950">
                            {formatFCFA(msg.propertySuggestion.pricePerNight)} /nuit
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-xs text-white">{msg.propertySuggestion.name}</h4>
                          <span className="text-[10px] text-emerald-400 font-semibold">⚡ Groupe {msg.propertySuggestion.amenities.generatorKva}kVA</span>
                        </div>

                        <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
                          <button
                            onClick={() => onOpenUSSD(msg.propertySuggestion)}
                            className="w-full py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-[11px] flex items-center justify-center gap-1 shadow"
                          >
                            <Smartphone className="w-3.5 h-3.5" />
                            <span>Payer par MoMo / OM (USSD Push)</span>
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-400">
                      <span>{msg.timestamp}</span>
                      {isUser && <CheckCheck className="w-3.5 h-3.5 text-sky-400" />}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900 px-3 py-2 rounded-xl w-fit border border-slate-800">
                <RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                <span>AfriBot est en train d'écrire...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="bg-slate-900/90 px-3 py-2 border-t border-slate-800 flex gap-2 overflow-x-auto no-scrollbar">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(qp.text)}
                disabled={isLoading}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] font-medium border border-slate-700/60 transition-colors flex items-center gap-1 shrink-0"
              >
                <span>{qp.label}</span>
                <ArrowRight className="w-3 h-3 text-emerald-400" />
              </button>
            ))}
          </div>

          {/* WhatsApp Input Bar */}
          <div className="bg-slate-900 p-3 border-t border-slate-800 flex items-center gap-2">
            <button className="text-slate-400 hover:text-slate-200 p-1">
              <Smile className="w-5 h-5" />
            </button>
            <button className="text-slate-400 hover:text-slate-200 p-1">
              <Paperclip className="w-5 h-5" />
            </button>

            <input
              type="text"
              placeholder="Écrivez votre message WhatsApp..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || isLoading}
              className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white transition-colors shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Right Column: AI Lead Scoring & Intent Insights */}
        <div className="space-y-4">
          
          <div className="glass-panel p-5 rounded-2xl border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Qualification IA du Lead (Gemini)
              </h3>
              <span className="text-[10px] font-mono uppercase bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">
                Score 0-100
              </span>
            </div>

            {leadQualification ? (
              <div className="space-y-4 animate-fade-in">
                {/* Score Gauge */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">
                    Score d'Intention d'Achat
                  </div>
                  <div className="text-4xl font-extrabold font-mono text-purple-400">
                    {leadQualification.intentScore}<span className="text-lg text-slate-400">/100</span>
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <Flame className="w-3.5 h-3.5 text-emerald-400" />
                    Statut : {leadQualification.status.toUpperCase()} ({leadQualification.isDiaspora ? 'Diaspora VIP' : 'Client Local'})
                  </div>
                </div>

                {/* Detected Details */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Ville ciblée :</span>
                    <strong className="text-white">📍 {leadQualification.targetCity}</strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Budget estimé :</span>
                    <strong className="text-amber-300 font-mono">{formatFCFA(leadQualification.budgetEstimatedFCFA)}</strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Durée estimée :</span>
                    <strong className="text-white">{leadQualification.durationNights} nuit(s)</strong>
                  </div>
                </div>

                {/* Detected Needs */}
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Besoins critiques détectés :
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {leadQualification.detectedNeeds?.map((need, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md text-[11px] bg-slate-800 text-slate-200 border border-slate-700">
                        ✓ {need}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs text-purple-200 leading-relaxed">
                  <span className="font-bold text-purple-300 block mb-1">Résumé IA :</span>
                  {leadQualification.summary}
                </div>

                {/* Direct Action */}
                <button
                  onClick={() => onOpenUSSD()}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40"
                >
                  <Smartphone className="w-4 h-4 text-slate-950" />
                  <span>Envoyer demande de paiement USSD</span>
                </button>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 space-y-3">
                <Bot className="w-8 h-8 mx-auto text-slate-500 opacity-60" />
                <p className="text-xs">
                  Envoyez des messages dans le simulateur WhatsApp puis cliquez sur <strong>"Évaluer le Lead"</strong> pour générer l'analyse prédictive.
                </p>
              </div>
            )}
          </div>

          {/* Autonomy Guarantees Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/20 text-xs space-y-2">
            <h4 className="font-bold text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Argumentaire Cameroun Intégré à l'IA
            </h4>
            <ul className="space-y-1.5 text-slate-300 text-[11px]">
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">⚡</span>
                <span>Inverseur automatique 10s pour groupe électrogène.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-blue-400 font-bold">💧</span>
                <span>Forage avec cuve de réserve & filtration d'eau.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-purple-400 font-bold">🛰️</span>
                <span>Starlink Maritime / Résidentiel 250 Mbps.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">💳</span>
                <span>Paiement MoMo/OM conforme DGI avec taxe TTA 0.2%.</span>
              </li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
};

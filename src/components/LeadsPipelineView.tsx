import React, { useState } from 'react';
import { 
  Users, 
  Flame, 
  Sparkles, 
  MapPin, 
  Phone, 
  DollarSign, 
  Calendar, 
  MessageSquare, 
  Smartphone, 
  Search, 
  Filter, 
  ShieldCheck,
  Globe,
  ArrowRight
} from 'lucide-react';
import { Lead, City, Property } from '../types';
import { formatFCFA, formatPhoneNumber } from '../utils/formatters';

interface LeadsPipelineViewProps {
  leads: Lead[];
  properties: Property[];
  selectedCity: City;
  onOpenWhatsApp: (lead: Lead) => void;
  onOpenUSSD: (property?: Property) => void;
}

export const LeadsPipelineView: React.FC<LeadsPipelineViewProps> = ({
  leads,
  properties,
  selectedCity,
  onOpenWhatsApp,
  onOpenUSSD,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'hot' | 'warm' | 'cold'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLeads = leads.filter((lead) => {
    const matchesCity = selectedCity === 'All' || lead.targetCity === selectedCity;
    const matchesStatus = filterStatus === 'all' || lead.status === filterStatus;
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery) ||
      lead.targetCity.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: 'hot' | 'warm' | 'cold') => {
    switch (status) {
      case 'hot':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
            <Flame className="w-3 h-3 text-rose-400" /> Chaud (Prioritaire)
          </span>
        );
      case 'warm':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
            🔥 Tiède
          </span>
        );
      case 'cold':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-500/20 text-slate-300 border border-slate-500/30 flex items-center gap-1">
            ❄️ Froid
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            Pipeline des Prospects & Scoring IA WhatsApp
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Qualification automatique des demandes de meublés, détection de la diaspora et calcul du budget.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par nom, téléphone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 w-52 sm:w-64"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 p-1 rounded-xl text-xs">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                filterStatus === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tous ({leads.length})
            </button>
            <button
              onClick={() => setFilterStatus('hot')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                filterStatus === 'hot' ? 'bg-rose-500/20 text-rose-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Chauds
            </button>
            <button
              onClick={() => setFilterStatus('warm')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                filterStatus === 'warm' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tièdes
            </button>
          </div>
        </div>
      </div>

      {/* Leads Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredLeads.map((lead) => {
          const recProperty = properties.find(p => p.id === lead.recommendedPropertyId);

          return (
            <div
              key={lead.id}
              className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Top Row: Lead identity, Score, Diaspora */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-base text-white">{lead.name}</h3>
                      {lead.isDiaspora && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                          <Globe className="w-2.5 h-2.5" /> Diaspora ({lead.diasporaCountry || 'International'})
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-500" />
                      {formatPhoneNumber(lead.phone)}
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-xl">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Score IA</span>
                      <span className="font-mono font-extrabold text-sm text-purple-400">
                        {lead.intentScore}/100
                      </span>
                    </div>
                    <div className="mt-1.5">{getStatusBadge(lead.status)}</div>
                  </div>
                </div>

                {/* Key specs */}
                <div className="grid grid-cols-3 gap-2 bg-slate-900/80 p-3 rounded-xl border border-slate-800 mt-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Destination</span>
                    <strong className="text-white font-medium">📍 {lead.targetCity}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Séjour</span>
                    <strong className="text-white font-medium">{lead.nights} nuits ({lead.dates})</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Budget Estimé</span>
                    <strong className="text-amber-300 font-mono font-bold">{formatFCFA(lead.budget)}</strong>
                  </div>
                </div>

                {/* Requirements Pills */}
                <div className="mt-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Exigences clés détectées par l'IA :
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {lead.keyRequirements.map((req, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md text-[11px] bg-slate-800 text-slate-200 border border-slate-700">
                        ✓ {req}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Last Message Quote */}
                <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 italic">
                  "{lead.lastMessage}"
                  <div className="text-[10px] text-slate-400 not-italic text-right mt-1 font-mono">
                    Reçu {lead.lastMessageTime}
                  </div>
                </div>

                {/* Recommended Property */}
                {recProperty && (
                  <div className="mt-3 p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src={recProperty.imageUrl} alt={recProperty.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <div className="text-[11px] text-emerald-400 font-bold uppercase">Logement Conseillé</div>
                        <div className="text-xs font-semibold text-white">{recProperty.name}</div>
                      </div>
                    </div>
                    <div className="text-xs font-mono font-bold text-amber-300">
                      {formatFCFA(recProperty.pricePerNight)}/nuit
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
                <button
                  onClick={() => onOpenWhatsApp(lead)}
                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-md"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Répondre sur WhatsApp IA</span>
                </button>

                <button
                  onClick={() => onOpenUSSD(recProperty)}
                  className="py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Envoyer USSD</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

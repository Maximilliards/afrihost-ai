import React, { useEffect, useState } from 'react';
import { 
  Building2, 
  Sparkles, 
  ShieldCheck, 
  Smartphone, 
  Receipt, 
  MapPin, 
  Zap, 
  DollarSign, 
  Bot,
  Activity,
  Layers,
  Fuel,
  Users,
  Settings,
  CreditCard
} from 'lucide-react';
import { City, SaasPlanType } from '../types';
import { formatFCFA } from '../utils/formatters';

interface NavbarProps {
  currentTab: 'dashboard' | 'properties' | 'chat' | 'leads' | 'logistics';
  setCurrentTab: (tab: 'dashboard' | 'properties' | 'chat' | 'leads' | 'logistics') => void;
  selectedCity: City;
  setSelectedCity: (city: City) => void;
  totalTTAAccumulated: number;
  openUSSDModal: () => void;
  openSettingsModal: () => void;
  saasPlan: SaasPlanType;
  unreadLeadsCount: number;
  criticalTasksCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  selectedCity,
  setSelectedCity,
  totalTTAAccumulated,
  openUSSDModal,
  openSettingsModal,
  saasPlan,
  unreadLeadsCount,
  criticalTasksCount
}) => {
  const [backendHealth, setBackendHealth] = useState<{
    status: string;
    hasGeminiApiKey: boolean;
    geminiModel: string;
  } | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch('/api/health');
        if (res.ok) {
          const data = await res.json();
          setBackendHealth(data);
        } else {
          setBackendHealth({ status: 'offline', hasGeminiApiKey: false, geminiModel: 'offline' });
        }
      } catch {
        setBackendHealth({ status: 'heuristic_mode', hasGeminiApiKey: false, geminiModel: 'local_heuristic' });
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const cities: City[] = ['All', 'Douala', 'Yaoundé', 'Kribi', 'Limbé'];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Platform identity */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-amber-500 text-white shadow-lg shadow-emerald-950/50">
              <Building2 className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 text-xs" title="Cameroun">🇨🇲</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
                  AfriHost<span className="text-white">AI</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Cameroon OS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <span>Gestion Meublés & Hôtels IA</span>
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'dashboard'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Tableau de Bord</span>
            </button>

            <button
              onClick={() => setCurrentTab('properties')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'properties'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Propriétés & Autonomie</span>
            </button>

            <button
              onClick={() => setCurrentTab('chat')}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'chat'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp Concierge IA</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </button>

            <button
              onClick={() => setCurrentTab('leads')}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'leads'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Leads & Prospection</span>
              {unreadLeadsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {unreadLeadsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setCurrentTab('logistics')}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'logistics'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Fuel className="w-3.5 h-3.5" />
              <span>Logistique Groupes</span>
              {criticalTasksCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  {criticalTasksCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Action Widgets: City filter, TTA Counter, Settings, Quick USSD */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* City Selector */}
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <select
                aria-label="Filtrer par ville"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value as City)}
                className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none cursor-pointer"
              >
                {cities.map((city) => (
                  <option key={city} value={city} className="bg-slate-900 text-slate-200">
                    {city === 'All' ? '🇨🇲 Tout le Cameroun' : `📍 ${city}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Live TTA Tax Counter (Taxe sur les Transferts Électroniques 0.2%) */}
            <div 
              className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-amber-500/10 to-emerald-500/10 border border-amber-500/20 px-3 py-1 rounded-lg"
              title="Taxe sur les Transferts Électroniques (0.2%) reversée à la DGI Cameroun"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <div className="text-left">
                <div className="text-[9px] uppercase font-bold text-amber-400/80 tracking-wider">
                  TTA DGI (0.2%)
                </div>
                <div className="text-xs font-mono font-bold text-amber-300">
                  {formatFCFA(totalTTAAccumulated)}
                </div>
              </div>
            </div>

            {/* Settings & SaaS Subscription Button */}
            <button
              onClick={openSettingsModal}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 px-2.5 py-1.5 rounded-lg text-xs text-slate-200 hover:text-white transition-colors"
              title="Paramètres de l'établissement et Abonnement SaaS"
            >
              <Settings className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden xl:inline font-semibold">Paramètres</span>
              <span className="px-1 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 uppercase">
                {saasPlan}
              </span>
            </button>

            {/* USSD Simulator Quick Button */}
            <button
              onClick={openUSSDModal}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs shadow-md shadow-amber-950/40 transition-transform active:scale-95"
            >
              <Smartphone className="w-3.5 h-3.5 text-slate-950" />
              <span className="hidden sm:inline">Paiement MoMo / OM</span>
              <span className="sm:hidden">USSD</span>
            </button>

            {/* Status Pill */}
            <div className="hidden 2xl:flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400">
              <span className={`w-2 h-2 rounded-full ${backendHealth?.hasGeminiApiKey ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
              <span>Gemini 3.7 Live</span>
            </div>

          </div>

        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-2 border-t border-slate-800/60 no-scrollbar">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap font-medium ${
              currentTab === 'dashboard' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setCurrentTab('properties')}
            className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap font-medium ${
              currentTab === 'properties' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400'
            }`}
          >
            Propriétés & Hôtels
          </button>
          <button
            onClick={() => setCurrentTab('chat')}
            className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap font-medium ${
              currentTab === 'chat' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400'
            }`}
          >
            WhatsApp IA
          </button>
          <button
            onClick={() => setCurrentTab('leads')}
            className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap font-medium ${
              currentTab === 'leads' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400'
            }`}
          >
            Leads & Prospection ({unreadLeadsCount})
          </button>
          <button
            onClick={() => setCurrentTab('logistics')}
            className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap font-medium ${
              currentTab === 'logistics' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400'
            }`}
          >
            Logistique ({criticalTasksCount})
          </button>
        </div>

      </div>
    </header>
  );
};

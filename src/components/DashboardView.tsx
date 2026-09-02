import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  ShieldCheck, 
  Smartphone, 
  Building, 
  Fuel, 
  Droplets, 
  Zap, 
  ArrowUpRight, 
  Receipt, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Flame,
  Bot,
  ExternalLink
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  Legend 
} from 'recharts';
import { Property, Transaction, Lead, City } from '../types';
import { formatFCFA, formatDate, formatPhoneNumber } from '../utils/formatters';

interface DashboardViewProps {
  properties: Property[];
  transactions: Transaction[];
  leads: Lead[];
  selectedCity: City;
  onOpenReceipt: (tx: Transaction) => void;
  onOpenUSSD: (property?: Property) => void;
  onSelectPropertyForChat: (prop: Property) => void;
  onNavigateToTab: (tab: 'properties' | 'chat' | 'leads' | 'logistics') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  properties,
  transactions,
  leads,
  selectedCity,
  onOpenReceipt,
  onOpenUSSD,
  onSelectPropertyForChat,
  onNavigateToTab,
}) => {
  // Filter by selected city
  const filteredProperties = selectedCity === 'All' 
    ? properties 
    : properties.filter(p => p.city === selectedCity);

  const filteredTransactions = selectedCity === 'All'
    ? transactions
    : transactions.filter(t => {
        const prop = properties.find(p => p.id === t.propertyId);
        return prop?.city === selectedCity;
      });

  // Calculate high-level financial metrics
  const totalGrossRevenue = filteredTransactions.reduce((acc, t) => acc + t.amount, 0);
  const totalTTA = filteredTransactions.reduce((acc, t) => acc + t.ttaTax, 0);
  const totalOperatorFees = filteredTransactions.reduce((acc, t) => acc + t.operatorFee, 0);
  const totalNetRevenue = filteredTransactions.reduce((acc, t) => acc + t.netAmount, 0);

  // Average occupancy
  const avgOccupancy = filteredProperties.length > 0 
    ? Math.round(filteredProperties.reduce((acc, p) => acc + p.occupancyRate, 0) / filteredProperties.length)
    : 0;

  // Breakdown by payment provider
  const momoTotal = filteredTransactions
    .filter(t => t.provider === 'MTN_MOMO')
    .reduce((acc, t) => acc + t.amount, 0);

  const orangeTotal = filteredTransactions
    .filter(t => t.provider === 'ORANGE_MONEY')
    .reduce((acc, t) => acc + t.amount, 0);

  const cashTotal = filteredTransactions
    .filter(t => t.provider === 'CASH')
    .reduce((acc, t) => acc + t.amount, 0);

  const paymentData = [
    { name: 'MTN Mobile Money', value: momoTotal, color: '#FFCC00', percentage: Math.round((momoTotal / (totalGrossRevenue || 1)) * 100) },
    { name: 'Orange Money', value: orangeTotal, color: '#FF7900', percentage: Math.round((orangeTotal / (totalGrossRevenue || 1)) * 100) },
    { name: 'Espèces / Cash', value: cashTotal, color: '#10B981', percentage: Math.round((cashTotal / (totalGrossRevenue || 1)) * 100) },
  ];

  // Revenue monthly trend simulation
  const trendData = [
    { month: 'Mai', momo: 820000, orange: 640000, cash: 150000, total: 1610000 },
    { month: 'Juin', momo: 950000, orange: 720000, cash: 180000, total: 1850000 },
    { month: 'Juil (Vacances)', momo: 1400000, orange: 980000, cash: 220000, total: 2600000 },
    { month: 'Août (Diaspora)', momo: 1650000, orange: 1150000, cash: 260000, total: 3060000 },
    { month: 'Septembre (Actuel)', momo: 1290000, orange: 880000, cash: 200000, total: 2370000 },
  ];

  // Energy & fuel alerts
  const lowFuelProperties = properties.filter(p => p.fuelLevelPercentage < 50);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Welcome & City Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🇨🇲</span>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Tableau de Bord AfriHostAI {selectedCity !== 'All' ? `— ${selectedCity}` : '— Cameroun'}
            </h1>
          </div>
          <p className="text-sm text-slate-400">
            Supervision des meublés de luxe, conformité fiscale DGI (TTA 0.2%), flux Mobile Money & conciergerie IA.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigateToTab('chat')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold text-xs transition-colors"
          >
            <Bot className="w-4 h-4" />
            <span>Tester l'IA WhatsApp</span>
          </button>

          <button
            onClick={() => onOpenUSSD()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-950/50 transition-all active:scale-95"
          >
            <Smartphone className="w-4 h-4" />
            <span>Simulateur USSD MoMo/OM</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Revenue */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden border-emerald-500/20">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Chiffre d'Affaires Brut</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-white font-mono tracking-tight">
              {formatFCFA(totalGrossRevenue)}
            </div>
            <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
              <span>Net Hôte : <strong className="text-emerald-400 font-mono">{formatFCFA(totalNetRevenue)}</strong></span>
              <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" /> +18.4%
              </span>
            </div>
          </div>
        </div>

        {/* Cameroon TTA Tax (0.2%) */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden border-amber-500/20">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">Taxe TTA DGI (0.2%)</span>
            </div>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-amber-300 font-mono tracking-tight">
              {formatFCFA(totalTTA)}
            </div>
            <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
              <span className="text-[11px]">Art. 225 CGI Cameroun</span>
              <span className="text-amber-400/90 font-medium">100% Conforme</span>
            </div>
          </div>
        </div>

        {/* Global Occupancy Rate */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden border-blue-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Taux d'Occupation</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Building className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-white font-mono tracking-tight">
              {avgOccupancy}%
            </div>
            <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
              <span>{filteredProperties.filter(p => p.status === 'occupied').length} / {filteredProperties.length} meublés occupés</span>
              <span className="text-blue-400 font-semibold">+6.2% vs M-1</span>
            </div>
          </div>
        </div>

        {/* AI WhatsApp Conversion */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden border-purple-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Conversion IA WhatsApp</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Bot className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-white font-mono tracking-tight">
              34.8%
            </div>
            <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
              <span>{leads.length} leads qualifiés</span>
              <span className="text-purple-400 font-semibold">Gemini 3.7</span>
            </div>
          </div>
        </div>

      </div>

      {/* Energy, Generator & Water Autonomy Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Zap className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">Autonomie Énergétique & Eau 24/7</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                Inverseurs automatiques actifs
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Tous les groupes électrogènes (30 à 80 kVA) et forages sous surveillance automatique.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          {lowFuelProperties.length > 0 ? (
            <div 
              onClick={() => onNavigateToTab('logistics')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs cursor-pointer hover:bg-rose-500/20 transition-colors"
            >
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span><strong>{lowFuelProperties.length} alerte(s) carburant :</strong> {lowFuelProperties[0]?.name} ({lowFuelProperties[0]?.fuelLevelPercentage}%)</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>Réserves de gasoil optimales (&gt; 60%)</span>
            </div>
          )}

          <button
            onClick={() => onNavigateToTab('logistics')}
            className="text-xs text-slate-400 hover:text-white underline whitespace-nowrap"
          >
            Gérer la logistique &rarr;
          </button>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Payment Streams Breakdown (MTN MoMo, Orange Money, Cash) */}
        <div className="glass-panel p-5 rounded-2xl border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-amber-400" />
                  Flux de Paiements Cameroun
                </h3>
                <p className="text-xs text-slate-400">Répartition MoMo (*126#) vs OM (*150#) vs Espèces</p>
              </div>
            </div>

            <div className="h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {paymentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(val: number) => [formatFCFA(val), 'Volume']}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            {paymentData.map((p) => (
              <div key={p.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }}></span>
                  <span className="text-slate-300">{p.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 font-mono">{p.percentage}%</span>
                  <strong className="text-white font-mono">{formatFCFA(p.value)}</strong>
                </div>
              </div>
            ))}
            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/60">
              <span>Frais opérateurs (1%) :</span>
              <span className="font-mono font-semibold text-rose-400">{formatFCFA(totalOperatorFees)}</span>
            </div>
          </div>
        </div>

        {/* Monthly Revenue & Growth Trend */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Évolution des Revenus & Saisonnalité Diaspora (FCFA)
              </h3>
              <p className="text-xs text-slate-400">Pic en Juillet-Août et Décembre (retours vacances diaspora)</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium">
              Croissance +24% YoY
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorMomo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffcc00" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ffcc00" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={11} 
                  tickFormatter={(val) => `${val / 1000}k`}
                />
                <Tooltip 
                  formatter={(val: number) => [formatFCFA(val)]}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="total" name="Total Chiffre d'Affaires" stroke="#10b981" fillOpacity={1} fill="url(#colorTotal)" strokeWidth={2} />
                <Area type="monotone" dataKey="momo" name="MTN MoMo" stroke="#ffcc00" fillOpacity={1} fill="url(#colorMomo)" strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Properties Overview & Live Autonomy Status Grid */}
      <div className="glass-panel p-5 rounded-2xl border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-400" />
              Parc Immobilier Meublé & Disponibilité
            </h3>
            <p className="text-xs text-slate-400">Statuts d'occupation, prix par nuitée et réserves d'autonomie</p>
          </div>
          <button
            onClick={() => onNavigateToTab('properties')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>Voir toutes les propriétés</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProperties.slice(0, 3).map((prop) => (
            <div 
              key={prop.id}
              className="glass-card p-4 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-36 rounded-lg overflow-hidden mb-3">
                  <img 
                    src={prop.imageUrl} 
                    alt={prop.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 flex gap-1.5">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-950/80 backdrop-blur-md text-white border border-slate-700">
                      📍 {prop.city}
                    </span>
                  </div>
                  <div className="absolute top-2 right-2">
                    {prop.propertyKind === 'hotel_residence' ? (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md bg-emerald-500/90 text-slate-950">
                        {prop.availableRooms}/{prop.totalRooms} Dispo
                      </span>
                    ) : (
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${
                        prop.status === 'available'
                          ? 'bg-emerald-500/90 text-white'
                          : 'bg-amber-500/90 text-slate-950'
                      }`}>
                        {prop.status === 'available' ? 'Disponible' : 'Occupé'}
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-slate-950/90 px-2 py-1 rounded-md text-xs font-mono font-extrabold text-amber-300 border border-slate-800">
                    {prop.propertyKind === 'hotel_residence' && <span className="text-[10px] font-sans font-normal text-slate-400 mr-1">Dès</span>}
                    {formatFCFA(prop.pricePerNight)} <span className="text-[10px] text-slate-400 font-sans font-normal">/nuit</span>
                  </div>
                </div>

                <h4 className="font-bold text-sm text-white">{prop.name}</h4>
                <p className="text-xs text-slate-400 mb-3">{prop.neighborhood}</p>

                {/* Amenity tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {prop.amenities.generator && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-1">
                      <Zap className="w-2.5 h-2.5" /> Groupe {prop.amenities.generatorKva}kVA
                    </span>
                  )}
                  {prop.amenities.waterReserve && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-300 border border-blue-500/20 flex items-center gap-1">
                      <Droplets className="w-2.5 h-2.5" /> Cuve {prop.amenities.waterCapacityLiters}L
                    </span>
                  )}
                  {prop.amenities.starlinkWifi && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      🛰️ Starlink
                    </span>
                  )}
                </div>

                {/* Fuel and water gauges */}
                <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-900/80 p-2 rounded-lg border border-slate-800 mb-3">
                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span className="flex items-center gap-1"><Fuel className="w-3 h-3 text-amber-400" /> Gasoil</span>
                      <span className="font-mono font-bold text-white">{prop.fuelLevelPercentage}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${prop.fuelLevelPercentage < 50 ? 'bg-rose-500' : 'bg-amber-400'}`}
                        style={{ width: `${prop.fuelLevelPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span className="flex items-center gap-1"><Droplets className="w-3 h-3 text-blue-400" /> Eau</span>
                      <span className="font-mono font-bold text-white">{prop.waterLevelPercentage}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-400 rounded-full"
                        style={{ width: `${prop.waterLevelPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => onSelectPropertyForChat(prop)}
                  className="flex-1 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 flex items-center justify-center gap-1 transition-colors"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Chat IA</span>
                </button>
                <button
                  onClick={() => onOpenUSSD(prop)}
                  className="flex-1 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1 transition-colors shadow"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Payer USSD</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions & Official Fiscal Receipts Table */}
      <div className="glass-panel p-5 rounded-2xl border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Receipt className="w-4 h-4 text-amber-400" />
              Transactions Récentes & Quittances Fiscales DGI
            </h3>
            <p className="text-xs text-slate-400">
              Chaque paiement intègre automatiquement la Taxe sur les Transferts Électroniques (0.2%)
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {filteredTransactions.length} règlements enregistrés
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="pb-3 pr-4">Réf / Date</th>
                <th className="pb-3 px-4">Client & Contact</th>
                <th className="pb-3 px-4">Propriété</th>
                <th className="pb-3 px-4">Opérateur</th>
                <th className="pb-3 px-4 text-right">Montant Brut</th>
                <th className="pb-3 px-4 text-right">TTA (0.2%)</th>
                <th className="pb-3 px-4 text-right">Net Hôte</th>
                <th className="pb-3 pl-4 text-center">Quittance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 pr-4">
                    <div className="font-mono font-bold text-slate-200">{tx.reference}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" /> {formatDate(tx.date)}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-semibold text-white">{tx.guestName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{formatPhoneNumber(tx.guestPhone)}</div>
                  </td>

                  <td className="py-3 px-4 text-slate-300">
                    <div className="font-medium text-slate-200">{tx.propertyName}</div>
                    <div className="text-[10px] text-slate-400">{tx.nights} nuit(s)</div>
                  </td>

                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      tx.provider === 'MTN_MOMO'
                        ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                        : tx.provider === 'ORANGE_MONEY'
                        ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {tx.provider === 'MTN_MOMO' && '🟡 MTN MoMo'}
                      {tx.provider === 'ORANGE_MONEY' && '🟠 Orange Money'}
                      {tx.provider === 'CASH' && '💵 Espèces'}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right font-mono font-bold text-white">
                    {formatFCFA(tx.amount)}
                  </td>

                  <td className="py-3 px-4 text-right font-mono text-amber-300 font-medium">
                    {formatFCFA(tx.ttaTax)}
                  </td>

                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">
                    {formatFCFA(tx.netAmount)}
                  </td>

                  <td className="py-3 pl-4 text-center">
                    <button
                      onClick={() => onOpenReceipt(tx)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-[11px] font-medium transition-colors"
                      title="Afficher la quittance conforme DGI"
                    >
                      <Receipt className="w-3.5 h-3.5 text-amber-400" />
                      <span>Reçu</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

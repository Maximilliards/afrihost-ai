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
  ArrowRight,
  Upload,
  Download,
  FileSpreadsheet,
  Send,
  CheckSquare,
  Square,
  Plus,
  RefreshCw,
  CheckCircle2,
  Tag,
  Radio
} from 'lucide-react';
import { InboundLead, OutboundContact, City, Property, WhatsAppCampaign } from '../types';
import { formatFCFA, formatPhoneNumber } from '../utils/formatters';

interface LeadsPipelineViewProps {
  inboundLeads: InboundLead[];
  outboundContacts: OutboundContact[];
  properties: Property[];
  selectedCity: City;
  onOpenWhatsApp: (lead: InboundLead) => void;
  onOpenUSSD: (property?: Property) => void;
  onImportContacts: (contacts: OutboundContact[]) => void;
}

export const LeadsPipelineView: React.FC<LeadsPipelineViewProps> = ({
  inboundLeads,
  outboundContacts,
  properties,
  selectedCity,
  onOpenWhatsApp,
  onOpenUSSD,
  onImportContacts,
}) => {
  const [activeTab, setActiveTab] = useState<'inbound' | 'outbound'>('inbound');

  // Inbound Filters
  const [filterStatus, setFilterStatus] = useState<'all' | 'hot' | 'warm' | 'cold'>('all');
  const [searchInbound, setSearchInbound] = useState('');

  // Outbound States
  const [outboundSegmentFilter, setOutboundSegmentFilter] = useState<string>('all');
  const [searchOutbound, setSearchOutbound] = useState('');
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>(['out-01', 'out-02', 'out-05']);
  const [showImportModal, setShowImportModal] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualSegment, setManualSegment] = useState<OutboundContact['segment']>('Diaspora France/Europe');
  const [manualCity, setManualCity] = useState<'Douala' | 'Yaoundé' | 'Kribi' | 'Limbé'>('Douala');
  const [manualBudget, setManualBudget] = useState(500000);

  // Campaign Dispatcher State
  const [selectedTemplateKey, setSelectedTemplateKey] = useState<'diaspora_promo' | 'business_douala' | 'kribi_weekend' | 'custom'>('diaspora_promo');
  const [customMessage, setCustomMessage] = useState('Bonjour {{nom}}, nous préparons vos séjours à {{ville}} avec groupe électrogène garanti et Starlink !');
  const [isSendingCampaign, setIsSendingCampaign] = useState(false);
  const [campaignSuccess, setCampaignSuccess] = useState(false);

  const campaignTemplates = {
    diaspora_promo: {
      title: '🇨🇲 Retours Diaspora & Vacances (-15%)',
      text: 'Bonjour {{nom}} ! 🇨🇲 Vous préparez votre prochain retour au Cameroun ? AfriHostAI vous réserve une remise exclusive de -15% sur nos villas et suites à {{ville}} avec Groupe électrogène automatique 24/7, Starlink et Navette Aéroport VIP offerte. Répondez à ce message pour bloquer vos dates !',
    },
    business_douala: {
      title: '💼 Offre Cadres & Séjour Affaires Douala (Facture DGI)',
      text: 'Bonjour {{nom}}, pour vos prochaines missions d\'affaires à Douala, profitez de nos suites au Grand Wouri : Groupe 120kVA (0 coupure Eneo), Starlink 250Mbps, petit-déjeuner et facture conforme DGI avec TTA 0.2% incluse. Souhaitez-vous recevoir notre grille tarifaire entreprise ?',
    },
    kribi_weekend: {
      title: '🌊 Escapade Détente Kribi Bord de Mer',
      text: 'Bonjour {{nom}} ! Envie d\'un weekend les pieds dans l\'eau à Kribi Ngoye Plage ? Barbecue de crevettes géantes face à l\'océan, climatisation continue et groupe automatique silencieux. Réservez dès 95 000 FCFA/nuit par MTN MoMo ou Orange Money !',
    },
    custom: {
      title: '✍️ Message Personnalisé Sur-Mesure',
      text: customMessage,
    }
  };

  // Filter Inbound Leads
  const filteredInbound = inboundLeads.filter((lead) => {
    const matchesCity = selectedCity === 'All' || lead.targetCity === selectedCity;
    const matchesStatus = filterStatus === 'all' || lead.status === filterStatus;
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchInbound.toLowerCase()) ||
      lead.phone.includes(searchInbound) ||
      lead.targetCity.toLowerCase().includes(searchInbound.toLowerCase());
    return matchesCity && matchesStatus && matchesSearch;
  });

  // Filter Outbound Contacts
  const filteredOutbound = outboundContacts.filter((contact) => {
    const matchesCity = selectedCity === 'All' || contact.city === selectedCity;
    const matchesSegment = outboundSegmentFilter === 'all' || contact.segment === outboundSegmentFilter;
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchOutbound.toLowerCase()) ||
      contact.phone.includes(searchOutbound) ||
      contact.city.toLowerCase().includes(searchOutbound.toLowerCase());
    return matchesCity && matchesSegment && matchesSearch;
  });

  // Selection handlers
  const handleToggleSelectContact = (id: string) => {
    setSelectedContactIds(prev => 
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  const handleSelectAllVisible = () => {
    const visibleIds = filteredOutbound.map(c => c.id);
    setSelectedContactIds(Array.from(new Set([...selectedContactIds, ...visibleIds])));
  };

  const handleDeselectAll = () => {
    setSelectedContactIds([]);
  };

  // Launch Campaign
  const handleLaunchCampaign = () => {
    if (selectedContactIds.length === 0) return;
    setIsSendingCampaign(true);
    setTimeout(() => {
      setIsSendingCampaign(false);
      setCampaignSuccess(true);
      setTimeout(() => setCampaignSuccess(false), 5000);
    }, 2500);
  };

  // Add manual contact
  const handleAddManualContact = (e: React.FormEvent) => {
    e.preventDefault();
    const newContact: OutboundContact = {
      id: `out-${Date.now().toString().slice(-4)}`,
      name: manualName,
      phone: manualPhone,
      segment: manualSegment,
      city: manualCity,
      estimatedBudgetFCFA: Number(manualBudget),
      status: 'to_contact',
      tags: ['Import Manuel', manualCity]
    };
    onImportContacts([newContact]);
    setShowImportModal(false);
    setManualName('');
    setManualPhone('');
  };

  // Sample CSV template download simulation
  const handleDownloadSampleCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,Nom,Telephone,Segment,Ville,BudgetEstimeFCFA\nSamuel Etoo,+33612345678,Diaspora France/Europe,Douala,850000\nMarcelle Nguemo,+13015550199,Diaspora USA/Canada,Yaounde,650000\nSerge Manga,+237699112233,Affaires & Entreprises,Douala,500000";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "modele_contacts_afrihost.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Mock file upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate parsing CSV contacts
    const importedSample: OutboundContact[] = [
      {
        id: `out-imp-1-${Date.now()}`,
        name: 'Dr. Joseph Ndongo (Diaspora Lyon)',
        phone: '+33 6 44 55 66 77',
        segment: 'Diaspora France/Europe',
        city: 'Douala',
        estimatedBudgetFCFA: 700000,
        status: 'to_contact',
        tags: ['Import CSV', 'Médecin Diaspora']
      },
      {
        id: `out-imp-2-${Date.now()}`,
        name: 'Société Eneo Cameroun (Missions Cadres)',
        phone: '+237 677 00 99 88',
        segment: 'Affaires & Entreprises',
        city: 'Yaoundé',
        estimatedBudgetFCFA: 850000,
        status: 'to_contact',
        tags: ['Import CSV', 'Entreprise']
      }
    ];

    onImportContacts(importedSample);
    setShowImportModal(false);
    alert(`2 nouveaux contacts importés avec succès depuis "${file.name}" !`);
  };

  const getStatusBadge = (status: 'hot' | 'warm' | 'cold') => {
    switch (status) {
      case 'hot':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
            <Flame className="w-3 h-3 text-rose-400" /> Chaud
          </span>
        );
      case 'warm':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            🔥 Tiède
          </span>
        );
      case 'cold':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-500/20 text-slate-300 border border-slate-500/30">
            ❄️ Froid
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl font-black text-white">
              CRM Leads & Prospection WhatsApp
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Gérez les demandes entrantes (Inbound) et lancez des campagnes ciblées de relance WhatsApp (Outbound).
          </p>
        </div>

        {/* Primary Sub-Tabs Switcher */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('inbound')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'inbound'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>Demandes Entrantes (Inbound)</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
              {inboundLeads.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('outbound')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'outbound'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Send className="w-4 h-4 text-purple-400" />
            <span>Prospection & Base Clients (Outbound)</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300">
              {outboundContacts.length}
            </span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: INBOUND LEADS (Demandes Entrantes) */}
      {activeTab === 'inbound' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  filterStatus === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Tous ({inboundLeads.length})
              </button>
              <button
                onClick={() => setFilterStatus('hot')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  filterStatus === 'hot' ? 'bg-rose-500/20 text-rose-300' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Chauds ({inboundLeads.filter(l => l.status === 'hot').length})
              </button>
              <button
                onClick={() => setFilterStatus('warm')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  filterStatus === 'warm' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Tièdes
              </button>
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher prospect, téléphone..."
                value={searchInbound}
                onChange={(e) => setSearchInbound(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>

          {/* Inbound Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredInbound.map((lead) => {
              const recProperty = properties.find(p => p.id === lead.recommendedPropertyId);

              return (
                <div
                  key={lead.id}
                  className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-base text-white">{lead.name}</h3>
                          {lead.isDiaspora && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                              <Globe className="w-2.5 h-2.5" /> Diaspora ({lead.diasporaCountry || 'Europe'})
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

                    <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 italic">
                      "{lead.lastMessage}"
                      <div className="text-[10px] text-slate-400 not-italic text-right mt-1 font-mono">
                        Reçu {lead.lastMessageTime}
                      </div>
                    </div>

                    {recProperty && (
                      <div className="mt-3 p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img src={recProperty.imageUrl} alt={recProperty.name} className="w-10 h-10 rounded-lg object-cover" />
                          <div>
                            <div className="text-[11px] text-emerald-400 font-bold uppercase">Logement / Hôtel Conseillé</div>
                            <div className="text-xs font-semibold text-white">{recProperty.name}</div>
                          </div>
                        </div>
                        <div className="text-xs font-mono font-bold text-amber-300">
                          {formatFCFA(recProperty.pricePerNight)}/nuit
                        </div>
                      </div>
                    )}
                  </div>

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
      )}

      {/* SUB-TAB 2: OUTBOUND PROSPECTION & CSV IMPORT */}
      {activeTab === 'outbound' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Top Actions: Import CSV, Download Template */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-purple-900/30">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-purple-400" />
                Base Clients & Fichiers CSV / Excel
              </h3>
              <p className="text-xs text-slate-400">
                Importez vos listes de contacts diaspora ou entreprises pour lancer des relances WhatsApp automatisées.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadSampleCSV}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Modèle CSV</span>
              </button>

              <button
                onClick={() => setShowImportModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-purple-950/50"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Importer Contacts (CSV/Excel)</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column (2 spans): Contacts Table & Segmentation */}
            <div className="lg:col-span-2 space-y-4">
              
              {/* Segment Filters & Mass Selection */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-slate-400 text-[11px] font-semibold mr-1">Segment :</span>
                  {['all', 'Diaspora France/Europe', 'Affaires & Entreprises', 'Tourisme & Vacances', 'Clients Fidèles'].map((seg) => (
                    <button
                      key={seg}
                      onClick={() => setOutboundSegmentFilter(seg)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                        outboundSegmentFilter === seg
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                          : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {seg === 'all' ? 'Tous les segments' : seg}
                    </button>
                  ))}
                </div>

                {/* Mass select toggles */}
                <div className="flex items-center gap-2 text-xs">
                  <button
                    onClick={handleSelectAllVisible}
                    className="text-emerald-400 hover:underline font-semibold"
                  >
                    Tout sélectionner
                  </button>
                  <span className="text-slate-600">•</span>
                  <button
                    onClick={handleDeselectAll}
                    className="text-slate-400 hover:text-slate-200"
                  >
                    Désélectionner
                  </button>
                </div>
              </div>

              {/* Contacts Table */}
              <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
                <div className="p-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">Contacts Disponibles ({filteredOutbound.length})</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {selectedContactIds.length} ciblés pour l'envoi
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold bg-slate-950/40">
                        <th className="p-3 w-10 text-center">Cocher</th>
                        <th className="p-3">Nom & Entreprise</th>
                        <th className="p-3">Téléphone</th>
                        <th className="p-3">Segment</th>
                        <th className="p-3">Ville</th>
                        <th className="p-3 text-right">Budget Est.</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-sans">
                      {filteredOutbound.map((contact) => {
                        const isSelected = selectedContactIds.includes(contact.id);

                        return (
                          <tr
                            key={contact.id}
                            onClick={() => handleToggleSelectContact(contact.id)}
                            className={`cursor-pointer transition-colors ${
                              isSelected ? 'bg-purple-950/20 hover:bg-purple-950/30' : 'hover:bg-slate-800/30'
                            }`}
                          >
                            <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleSelectContact(contact.id)}
                                className="w-4 h-4 text-purple-600 accent-purple-500 rounded cursor-pointer"
                              />
                            </td>

                            <td className="p-3">
                              <div className="font-bold text-white">{contact.name}</div>
                              {contact.notes && <div className="text-[10px] text-slate-400">{contact.notes}</div>}
                            </td>

                            <td className="p-3 font-mono text-slate-300">
                              {formatPhoneNumber(contact.phone)}
                            </td>

                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                                {contact.segment}
                              </span>
                            </td>

                            <td className="p-3 font-medium text-slate-200">
                              📍 {contact.city}
                            </td>

                            <td className="p-3 text-right font-mono font-bold text-amber-300">
                              {formatFCFA(contact.estimatedBudgetFCFA)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Right Column: Campaign Dispatcher & WhatsApp Preview */}
            <div className="space-y-4">
              
              <div className="glass-panel p-5 rounded-2xl border border-purple-900/40 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Send className="w-4 h-4 text-purple-400" />
                    Campagne de Relance WhatsApp
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    Instantané
                  </span>
                </div>

                {/* Template Selector */}
                <div>
                  <label className="block text-slate-400 text-xs font-semibold mb-1.5">
                    Modèle de Message Contexte Cameroun :
                  </label>
                  <select
                    value={selectedTemplateKey}
                    onChange={(e) => setSelectedTemplateKey(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value="diaspora_promo">🇨🇲 Promo Retours Diaspora (-15%)</option>
                    <option value="business_douala">💼 Offre Cadres Douala & Facture DGI</option>
                    <option value="kribi_weekend">🌊 Weekend Détente Kribi Bord de Mer</option>
                    <option value="custom">✍️ Rédiger un Message Sur-Mesure</option>
                  </select>
                </div>

                {selectedTemplateKey === 'custom' && (
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">
                      Personnalisez le message (variables : <code>{`{{nom}}`}</code>, <code>{`{{ville}}`}</code>) :
                    </label>
                    <textarea
                      rows={3}
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                )}

                {/* Realistic WhatsApp Message Preview */}
                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Aperçu WhatsApp pour le 1er contact sélectionné :
                  </div>
                  <div className="bg-[#075E54]/20 border border-[#075E54]/40 p-3.5 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-xs text-emerald-300 font-bold border-b border-emerald-500/20 pb-1.5">
                      <span>Destinataire :</span>
                      <span>
                        {filteredOutbound.find(c => selectedContactIds.includes(c.id))?.name || 'Client Sélectionné'} ({filteredOutbound.find(c => selectedContactIds.includes(c.id))?.phone || '+237...'})
                      </span>
                    </div>
                    <div className="bg-[#005c4b] text-white p-3 rounded-2xl rounded-tl-none text-xs leading-relaxed shadow">
                      {campaignTemplates[selectedTemplateKey].text
                        .replace('{{nom}}', filteredOutbound.find(c => selectedContactIds.includes(c.id))?.name || 'Cher Client')
                        .replace('{{ville}}', filteredOutbound.find(c => selectedContactIds.includes(c.id))?.city || 'Douala')}
                    </div>
                  </div>
                </div>

                {/* Trigger Button */}
                <div className="pt-2">
                  <button
                    onClick={handleLaunchCampaign}
                    disabled={selectedContactIds.length === 0 || isSendingCampaign}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-950/50 transition-all active:scale-95"
                  >
                    {isSendingCampaign ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Envoi en cours via WhatsApp API...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Diffuser la Campagne ({selectedContactIds.length} destinataires)</span>
                      </>
                    )}
                  </button>

                  {campaignSuccess && (
                    <div className="mt-2 p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 animate-fade-in">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Campagne envoyée avec succès à {selectedContactIds.length} contacts !</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Statistics Card */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Performances Moyennes Outbound
                </h4>
                <div className="grid grid-cols-2 gap-2 pt-1 text-slate-300">
                  <div className="p-2 bg-slate-900 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Taux d'ouverture</span>
                    <strong className="text-emerald-400 text-sm font-mono">94.2%</strong>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Conversion Séjour</span>
                    <strong className="text-purple-400 text-sm font-mono">28.6%</strong>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* Import Contacts Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative bg-slate-900 border border-purple-500/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-fade-in text-slate-100">
            
            <button
              onClick={() => setShowImportModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Importer des Contacts</h3>
                <p className="text-xs text-slate-400">Via fichier CSV / Excel ou saisie manuelle</p>
              </div>
            </div>

            {/* CSV Dropzone */}
            <div className="border-2 border-dashed border-purple-500/40 rounded-2xl p-6 text-center space-y-2 bg-slate-950/60 hover:bg-slate-950 transition-colors">
              <FileSpreadsheet className="w-8 h-8 mx-auto text-purple-400" />
              <div className="text-xs font-bold text-white">Glissez-déposez votre fichier .CSV ou .XLSX</div>
              <p className="text-[11px] text-slate-400">Colonnes reconnues : Nom, Téléphone (+237 / Int), Segment, Ville</p>
              <label className="inline-block mt-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold cursor-pointer transition-colors shadow">
                <span>Parcourir mes fichiers</span>
                <input type="file" accept=".csv, .xlsx, .txt" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink mx-4 text-slate-500 text-[11px] uppercase font-bold">OU Saisie Manuelle</span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            {/* Manual Form */}
            <form onSubmit={handleAddManualContact} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Nom & Prénom / Entreprise</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Patrice Fotso"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Téléphone (+237 ou Int)</label>
                  <input
                    type="text"
                    required
                    placeholder="+237 6XX XX XX XX"
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Ville Préférée</label>
                  <select
                    value={manualCity}
                    onChange={(e) => setManualCity(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value="Douala">Douala</option>
                    <option value="Yaoundé">Yaoundé</option>
                    <option value="Kribi">Kribi</option>
                    <option value="Limbé">Limbé</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Segment / Catégorie</label>
                <select
                  value={manualSegment}
                  onChange={(e) => setManualSegment(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option value="Diaspora France/Europe">Diaspora France/Europe</option>
                  <option value="Diaspora USA/Canada">Diaspora USA/Canada</option>
                  <option value="Affaires & Entreprises">Affaires & Entreprises</option>
                  <option value="Tourisme & Vacances">Tourisme & Vacances</option>
                  <option value="Clients Fidèles">Clients Fidèles</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md"
                >
                  Ajouter le Contact
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

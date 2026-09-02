import React, { useState, useMemo } from 'react';
import { 
  MOCK_PROPERTIES, 
  MOCK_TRANSACTIONS, 
  MOCK_LEADS, 
  MOCK_LOGISTICS_TASKS,
  MOCK_OUTBOUND_CONTACTS,
  DEFAULT_SAAS_SETTINGS
} from './data/mockData';
import { 
  Property, 
  Transaction, 
  InboundLead, 
  OutboundContact, 
  LogisticsTask, 
  City, 
  LeadQualification,
  SaasSettings,
  SaasPlanType,
  RoomCategory
} from './types';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { PropertiesView } from './components/PropertiesView';
import { WhatsAppSimulator } from './components/WhatsAppSimulator';
import { LeadsPipelineView } from './components/LeadsPipelineView';
import { LogisticsView } from './components/LogisticsView';
import { USSDPushModal } from './components/USSDPushModal';
import { ReceiptModal } from './components/ReceiptModal';
import { SettingsModal } from './components/SettingsModal';
import { formatFCFA } from './utils/formatters';

export function App() {
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'properties' | 'chat' | 'leads' | 'logistics'>('dashboard');
  const [selectedCity, setSelectedCity] = useState<City>('All');
  
  // App Global Data State
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [inboundLeads, setInboundLeads] = useState<InboundLead[]>(MOCK_LEADS);
  const [outboundContacts, setOutboundContacts] = useState<OutboundContact[]>(MOCK_OUTBOUND_CONTACTS);
  const [logisticsTasks, setLogisticsTasks] = useState<LogisticsTask[]>(MOCK_LOGISTICS_TASKS);
  const [saasSettings, setSaasSettings] = useState<SaasSettings>(DEFAULT_SAAS_SETTINGS);

  // Modal states
  const [isUSSDOpen, setIsUSSDOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedPropertyForUSSD, setSelectedPropertyForUSSD] = useState<Property | null>(null);
  const [selectedRoomCategoryForUSSD, setSelectedRoomCategoryForUSSD] = useState<RoomCategory | null>(null);
  const [selectedReceiptTx, setSelectedReceiptTx] = useState<Transaction | null>(null);
  const [selectedChatProperty, setSelectedChatProperty] = useState<Property | null>(null);

  // Total TTA Accumulated across all transactions
  const totalTTAAccumulated = useMemo(() => {
    return transactions.reduce((acc, t) => acc + t.ttaTax, 0);
  }, [transactions]);

  // Handle USSD Trigger from any view
  const handleOpenUSSD = (prop?: Property, roomCategory?: RoomCategory) => {
    setSelectedPropertyForUSSD(prop || null);
    setSelectedRoomCategoryForUSSD(roomCategory || null);
    setIsUSSDOpen(true);
  };

  // Handle Receipt opening
  const handleOpenReceipt = (tx: Transaction) => {
    setSelectedReceiptTx(tx);
  };

  // Handle selecting a property to chat about in WhatsApp Concierge
  const handleSelectPropertyForChat = (prop: Property) => {
    setSelectedChatProperty(prop);
    setCurrentTab('chat');
  };

  // Handle selecting a lead to chat with
  const handleSelectLeadForChat = (lead: InboundLead) => {
    const matchedProp = properties.find(p => p.id === lead.recommendedPropertyId);
    setSelectedChatProperty(matchedProp || null);
    setCurrentTab('chat');
  };

  // Handle new transaction from USSD simulator
  const handleTransactionSuccess = (newTx: Transaction) => {
    setTransactions(prev => [newTx, ...prev]);
  };

  // Handle adding new property or hotel
  const handleAddProperty = (newProp: Property) => {
    setProperties(prev => [newProp, ...prev]);
  };

  // Handle new logistics task
  const handleAddTask = (newTask: Omit<LogisticsTask, 'id'>) => {
    const task: LogisticsTask = {
      ...newTask,
      id: `task-${Date.now().toString().slice(-4)}`
    };
    setLogisticsTasks(prev => [task, ...prev]);
  };

  // Handle update task status
  const handleUpdateTaskStatus = (taskId: string, status: 'pending' | 'in_progress' | 'completed') => {
    setLogisticsTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
  };

  // Handle lead qualification from AI
  const handleLeadQualified = (qualification: LeadQualification) => {
    const newLead: InboundLead = {
      id: `lead-${Date.now().toString().slice(-4)}`,
      name: 'Prospect WhatsApp IA',
      phone: '+237 699 12 34 56',
      isDiaspora: qualification.isDiaspora,
      diasporaCountry: qualification.isDiaspora ? 'France / Europe' : undefined,
      targetCity: (qualification.targetCity as any) || 'Douala',
      budget: qualification.budgetEstimatedFCFA || 400000,
      nights: qualification.durationNights || 3,
      dates: 'Septembre 2026',
      intentScore: qualification.intentScore,
      status: qualification.status,
      keyRequirements: qualification.detectedNeeds || ['Groupe électrogène', 'Starlink'],
      recommendedPropertyId: qualification.suggestedPropertyId || properties[0].id,
      lastMessage: qualification.summary,
      lastMessageTime: 'À l\'instant',
    };
    setInboundLeads(prev => [newLead, ...prev]);
  };

  // Handle importing outbound contacts from CSV
  const handleImportContacts = (newContacts: OutboundContact[]) => {
    setOutboundContacts(prev => [...newContacts, ...prev]);
  };

  // Handle paying subscription by USSD
  const handlePaySubscriptionUSSD = (plan: SaasPlanType, amount: number) => {
    setIsSettingsOpen(false);
    handleOpenUSSD();
    setSaasSettings(prev => ({
      ...prev,
      plan: plan,
      renewalDate: '2026-10-02'
    }));
  };

  const criticalTasksCount = logisticsTasks.filter(t => t.status !== 'completed' && (t.urgency === 'critical' || t.urgency === 'high')).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        totalTTAAccumulated={totalTTAAccumulated}
        openUSSDModal={() => handleOpenUSSD()}
        openSettingsModal={() => setIsSettingsOpen(true)}
        saasPlan={saasSettings.plan}
        unreadLeadsCount={inboundLeads.filter(l => l.status === 'hot').length}
        criticalTasksCount={criticalTasksCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentTab === 'dashboard' && (
          <DashboardView
            properties={properties}
            transactions={transactions}
            leads={inboundLeads}
            selectedCity={selectedCity}
            onOpenReceipt={handleOpenReceipt}
            onOpenUSSD={handleOpenUSSD}
            onSelectPropertyForChat={handleSelectPropertyForChat}
            onNavigateToTab={setCurrentTab}
          />
        )}

        {currentTab === 'properties' && (
          <PropertiesView
            properties={properties}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            onOpenUSSD={handleOpenUSSD}
            onSelectForChat={handleSelectPropertyForChat}
            onAddProperty={handleAddProperty}
          />
        )}

        {currentTab === 'chat' && (
          <WhatsAppSimulator
            selectedCity={selectedCity}
            initialProperty={selectedChatProperty}
            onOpenUSSD={handleOpenUSSD}
            onLeadQualified={handleLeadQualified}
          />
        )}

        {currentTab === 'leads' && (
          <LeadsPipelineView
            inboundLeads={inboundLeads}
            outboundContacts={outboundContacts}
            properties={properties}
            selectedCity={selectedCity}
            onOpenWhatsApp={handleSelectLeadForChat}
            onOpenUSSD={handleOpenUSSD}
            onImportContacts={handleImportContacts}
          />
        )}

        {currentTab === 'logistics' && (
          <LogisticsView
            properties={properties}
            tasks={logisticsTasks}
            selectedCity={selectedCity}
            onAddTask={handleAddTask}
            onUpdateTaskStatus={handleUpdateTaskStatus}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span>🇨🇲</span>
            <span className="font-bold text-slate-400">AfriHostAI Cameroun</span>
            <span>— Plateforme de gestion de meublés, résidences & hôtels conforme DGI</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Taxe TTA 0.2% Active</span>
            <span>•</span>
            <span>MTN MoMo (*126#)</span>
            <span>•</span>
            <span>Orange Money (*150#)</span>
            <span>•</span>
            <span>Gemini 3.7 Flash</span>
          </div>
        </div>
      </footer>

      {/* USSD Push Payment Simulator Modal */}
      <USSDPushModal
        isOpen={isUSSDOpen}
        onClose={() => setIsUSSDOpen(false)}
        selectedProperty={selectedPropertyForUSSD}
        selectedRoomCategory={selectedRoomCategoryForUSSD}
        properties={properties}
        onTransactionSuccess={handleTransactionSuccess}
        onOpenReceipt={handleOpenReceipt}
      />

      {/* Official Cameroonian DGI Receipt Modal */}
      <ReceiptModal
        transaction={selectedReceiptTx}
        onClose={() => setSelectedReceiptTx(null)}
      />

      {/* Settings & SaaS Subscription Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={saasSettings}
        onUpdateSettings={setSaasSettings}
        onPaySubscriptionUSSD={handlePaySubscriptionUSSD}
      />

    </div>
  );
}
export default App;

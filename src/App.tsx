import React, { useState, useMemo } from 'react';
import { 
  MOCK_PROPERTIES, 
  MOCK_TRANSACTIONS, 
  MOCK_LEADS, 
  MOCK_LOGISTICS_TASKS 
} from './data/mockData';
import { Property, Transaction, Lead, LogisticsTask, City, LeadQualification } from './types';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { PropertiesView } from './components/PropertiesView';
import { WhatsAppSimulator } from './components/WhatsAppSimulator';
import { LeadsPipelineView } from './components/LeadsPipelineView';
import { LogisticsView } from './components/LogisticsView';
import { USSDPushModal } from './components/USSDPushModal';
import { ReceiptModal } from './components/ReceiptModal';
import { formatFCFA } from './utils/formatters';

export function App() {
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'properties' | 'chat' | 'leads' | 'logistics'>('dashboard');
  const [selectedCity, setSelectedCity] = useState<City>('All');
  
  // App Global Data State
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [logisticsTasks, setLogisticsTasks] = useState<LogisticsTask[]>(MOCK_LOGISTICS_TASKS);

  // Modal states
  const [isUSSDOpen, setIsUSSDOpen] = useState(false);
  const [selectedPropertyForUSSD, setSelectedPropertyForUSSD] = useState<Property | null>(null);
  const [selectedReceiptTx, setSelectedReceiptTx] = useState<Transaction | null>(null);
  const [selectedChatProperty, setSelectedChatProperty] = useState<Property | null>(null);

  // Total TTA Accumulated across all transactions
  const totalTTAAccumulated = useMemo(() => {
    return transactions.reduce((acc, t) => acc + t.ttaTax, 0);
  }, [transactions]);

  // Handle USSD Trigger from any view
  const handleOpenUSSD = (prop?: Property) => {
    setSelectedPropertyForUSSD(prop || null);
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
  const handleSelectLeadForChat = (lead: Lead) => {
    const matchedProp = properties.find(p => p.id === lead.recommendedPropertyId);
    setSelectedChatProperty(matchedProp || null);
    setCurrentTab('chat');
  };

  // Handle new transaction from USSD simulator
  const handleTransactionSuccess = (newTx: Transaction) => {
    setTransactions(prev => [newTx, ...prev]);
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
    const newLead: Lead = {
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
    setLeads(prev => [newLead, ...prev]);
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
        unreadLeadsCount={leads.filter(l => l.status === 'hot').length}
        criticalTasksCount={criticalTasksCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentTab === 'dashboard' && (
          <DashboardView
            properties={properties}
            transactions={transactions}
            leads={leads}
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
            leads={leads}
            properties={properties}
            selectedCity={selectedCity}
            onOpenWhatsApp={handleSelectLeadForChat}
            onOpenUSSD={handleOpenUSSD}
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
            <span>— Plateforme de gestion de meublés premium & conformité DGI</span>
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
        properties={properties}
        onTransactionSuccess={handleTransactionSuccess}
        onOpenReceipt={handleOpenReceipt}
      />

      {/* Official Cameroonian DGI Receipt Modal */}
      <ReceiptModal
        transaction={selectedReceiptTx}
        onClose={() => setSelectedReceiptTx(null)}
      />

    </div>
  );
}
export default App;

import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  CreditCard, 
  Smartphone, 
  QrCode, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Bot, 
  Building2, 
  Save, 
  RefreshCw,
  Phone,
  Layers,
  Zap,
  Globe,
  DollarSign
} from 'lucide-react';
import { SaasSettings, SaasPlanType } from '../types';
import { formatFCFA } from '../utils/formatters';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SaasSettings;
  onUpdateSettings: (newSettings: SaasSettings) => void;
  onPaySubscriptionUSSD: (plan: SaasPlanType, amount: number) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onPaySubscriptionUSSD,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'subscription' | 'whatsapp' | 'payment_tax'>('subscription');
  const [formData, setFormData] = useState<SaasSettings>(settings);
  const [isScanningQR, setIsScanningQR] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const plans: {
    id: SaasPlanType;
    name: string;
    badge?: string;
    priceMonth: number;
    description: string;
    features: string[];
  }[] = [
    {
      id: 'starter',
      name: 'Pack Starter Meublés',
      priceMonth: 39000,
      description: 'Idéal pour 1 à 3 meublés indépendants (villas & studios).',
      features: [
        'Jusqu\'à 3 meublés indépendants',
        'Concierge IA WhatsApp standard (500 msg/mois)',
        'Calcul automatique TTA 0.2% DGI',
        'Paiements MTN MoMo & Orange Money',
        'Support standard par WhatsApp'
      ]
    },
    {
      id: 'pro',
      name: 'Pack Pro Gestionnaire',
      badge: 'LE PLUS PRISÉ',
      priceMonth: 69000,
      description: 'Pour gestionnaires jusqu\'à 10 logements ou 1 complexe hôtelier.',
      features: [
        'Jusqu\'à 10 meublés OU 1 Hôtel / Résidence',
        'Gestion inventaire multi-chambres & catégories',
        'IA Gemini 3.7 Flash illimitée',
        'Module Prospection Outbound (Import CSV & Relances)',
        '2 numéros WhatsApp Business connectés',
        'Quittances DGI téléchargeables & certifiées',
        'Support VIP prioritaire 7j/7'
      ]
    },
    {
      id: 'premium',
      name: 'Pack Premium Hôtelier',
      badge: 'MULTI-ÉTABLISSEMENTS',
      priceMonth: 189000,
      description: 'Pour grands hôtels, résidences multi-sites et promoteurs diaspora.',
      features: [
        'Logements & Hôtels illimités',
        'Multi-utilisateurs & dispatch régisseurs/terrain',
        'Passerelle API Mobile Money & TTA dédiée',
        'Personnalisation complète du bot IA',
        'Rapports d\'audit conformité fiscale DGI',
        'Account Manager dédié à Douala & Yaoundé'
      ]
    }
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSimulateQRScan = () => {
    setIsScanningQR(true);
    setTimeout(() => {
      setIsScanningQR(false);
      setFormData(prev => ({
        ...prev,
        whatsappStatus: 'connected',
        whatsappPhoneNumber: '+237 699 00 00 00'
      }));
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in text-slate-100 my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              Paramètres de l'Établissement & Abonnement SaaS
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                AfriHostAI OS
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Gérez votre offre logicielle, l'instance WhatsApp Business et vos identifiants Mobile Money / DGI.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 gap-2">
          <button
            onClick={() => setActiveTab('subscription')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'subscription'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Offres & Abonnement SaaS</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-mono uppercase">
              {formData.plan}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'whatsapp'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Connexion WhatsApp Business</span>
            <span className={`w-2 h-2 rounded-full ${formData.whatsappStatus === 'connected' ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
          </button>

          <button
            onClick={() => setActiveTab('payment_tax')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'payment_tax'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Encaissement Mobile Money & DGI</span>
          </button>
        </div>

        {/* TAB 1: SaaS Subscription Plans */}
        {activeTab === 'subscription' && (
          <div className="space-y-6 animate-fade-in text-xs">
            
            {/* Active Plan Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/40 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Abonnement en cours</span>
                <h3 className="text-base font-extrabold text-white mt-0.5">
                  {plans.find(p => p.id === formData.plan)?.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Prochain renouvellement le <strong className="text-white">{formData.renewalDate}</strong> (Facturation mensuelle)
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-lg text-amber-300">
                  {formatFCFA(plans.find(p => p.id === formData.plan)?.priceMonth || 69000)} <span className="text-xs text-slate-400 font-normal">/mois</span>
                </span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  ACTIF
                </span>
              </div>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plans.map((p) => {
                const isCurrent = formData.plan === p.id;
                return (
                  <div
                    key={p.id}
                    className={`rounded-2xl p-5 border flex flex-col justify-between transition-all relative ${
                      isCurrent
                        ? 'bg-slate-950 border-emerald-500 shadow-xl shadow-emerald-950/30'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {p.badge && (
                      <span className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow">
                        {p.badge}
                      </span>
                    )}

                    <div className="space-y-3">
                      <div>
                        <h4 className="font-extrabold text-sm text-white">{p.name}</h4>
                        <p className="text-[11px] text-slate-400 mt-1">{p.description}</p>
                      </div>

                      <div className="py-2 border-y border-slate-800">
                        <div className="text-xl font-mono font-black text-amber-300">
                          {formatFCFA(p.priceMonth)}
                          <span className="text-xs text-slate-400 font-sans font-normal ml-1">/mois</span>
                        </div>
                        <div className="text-[10px] text-slate-400">TTA 0.2% et TVA incluses</div>
                      </div>

                      <ul className="space-y-1.5 text-[11px] text-slate-300">
                        {p.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-emerald-400 font-bold">✓</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-800/80">
                      {isCurrent ? (
                        <button
                          disabled
                          className="w-full py-2 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/40 cursor-default"
                        >
                          Offre Actuelle
                        </button>
                      ) : (
                        <button
                          onClick={() => onPaySubscriptionUSSD(p.id, p.priceMonth)}
                          className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
                        >
                          <Smartphone className="w-3.5 h-3.5 text-slate-950" />
                          <span>Choisir & Payer par MoMo / OM</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: WhatsApp Business Connection & AI Auto-Reply */}
        {activeTab === 'whatsapp' && (
          <div className="space-y-6 animate-fade-in text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* WhatsApp Instance Status */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    Instance WhatsApp Multi-Device
                  </h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    formData.whatsappStatus === 'connected'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}>
                    {formData.whatsappStatus === 'connected' ? 'Connecté' : 'Déconnecté'}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-900">
                    <span className="text-slate-400">Numéro connecté :</span>
                    <strong className="text-white font-mono">{formData.whatsappPhoneNumber}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-900">
                    <span className="text-slate-400">Nom de l'instance :</span>
                    <span className="text-slate-300 font-mono">{formData.whatsappInstanceName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-900">
                    <span className="text-slate-400">Moteur IA :</span>
                    <span className="text-emerald-400 font-semibold">Gemini 3.7 Flash Concierge</span>
                  </div>
                </div>

                {/* AI Configuration toggles */}
                <div className="pt-2 space-y-3">
                  <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div>
                      <div className="font-semibold text-white">Réponses automatiques IA</div>
                      <div className="text-[11px] text-slate-400">L'IA AfriBot répond 24h/24 aux clients</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.aiAutoReply}
                      onChange={(e) => setFormData({ ...formData, aiAutoReply: e.target.checked })}
                      className="w-4 h-4 text-emerald-500 accent-emerald-500 cursor-pointer"
                    />
                  </label>

                  <div>
                    <label className="block text-slate-400 mb-1">Délai avant réponse de l'IA</label>
                    <select
                      value={formData.aiResponseDelaySeconds}
                      onChange={(e) => setFormData({ ...formData, aiResponseDelaySeconds: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value={1}>1 seconde (Instantané)</option>
                      <option value={3}>3 secondes (Humain & Naturel - Recommandé)</option>
                      <option value={5}>5 secondes (Séquentiel)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* QR Code Scanner Simulation */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center space-y-3">
                <h4 className="font-bold text-white text-sm">Appairage WhatsApp Web / Business</h4>
                <p className="text-[11px] text-slate-400 max-w-xs">
                  Ouvrez WhatsApp sur votre téléphone &gt; Appareils connectés &gt; Scanner le code QR.
                </p>

                <div className="p-4 bg-white rounded-2xl shadow-inner border border-slate-300 relative">
                  {isScanningQR ? (
                    <div className="w-36 h-36 flex flex-col items-center justify-center bg-slate-900 rounded-xl text-emerald-400 space-y-2">
                      <RefreshCw className="w-8 h-8 animate-spin" />
                      <span className="text-[11px] font-mono">Synchronisation...</span>
                    </div>
                  ) : (
                    <div className="w-36 h-36 flex items-center justify-center">
                      <QrCode className="w-32 h-32 text-slate-950" />
                    </div>
                  )}
                </div>

                <button
                  onClick={handleSimulateQRScan}
                  disabled={isScanningQR}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Re-générer & Scanner le QR Code</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* TAB 3: Mobile Money & DGI Tax Configuration */}
        {activeTab === 'payment_tax' && (
          <form onSubmit={handleSave} className="space-y-5 animate-fade-in text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* MTN MoMo Merchant */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🟡</span>
                  <h4 className="font-bold text-white text-sm">MTN Mobile Money (*126#)</h4>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Code Marchand / Merchant ID</label>
                  <input
                    type="text"
                    value={formData.momoMerchantId}
                    onChange={(e) => setFormData({ ...formData, momoMerchantId: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="text-[10px] text-slate-500">Frais opérateur : 1.0% prélevé à la transaction</div>
              </div>

              {/* Orange Money Merchant */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🟠</span>
                  <h4 className="font-bold text-white text-sm">Orange Money (*150#)</h4>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Code Marchand / Merchant Code</label>
                  <input
                    type="text"
                    value={formData.orangeMoneyMerchantId}
                    onChange={(e) => setFormData({ ...formData, orangeMoneyMerchantId: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div className="text-[10px] text-slate-500">Frais opérateur : 1.0% prélevé à la transaction</div>
              </div>

              {/* Payout Destination */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 sm:col-span-2">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  Compte de Reversement Automatique des Loyers Nets
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Numéro Mobile Money du Propriétaire (+237)</label>
                    <input
                      type="text"
                      value={formData.hostPayoutPhone}
                      onChange={(e) => setFormData({ ...formData, hostPayoutPhone: e.target.value })}
                      placeholder="+237 6XX XX XX XX"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Nom du Titulaire du Compte</label>
                    <input
                      type="text"
                      value={formData.hostPayoutName}
                      onChange={(e) => setFormData({ ...formData, hostPayoutName: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* DGI Tax Settings */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-amber-300 text-sm flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    Paramètres Fiscaux DGI Cameroun (TTA 0.2%)
                  </h4>
                  <span className="text-[10px] text-slate-400">Art. 225 CGI Cameroun</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Numéro d'Identifiant Unique (NIU)</label>
                    <input
                      type="text"
                      value={formData.niuTaxNumber}
                      onChange={(e) => setFormData({ ...formData, niuTaxNumber: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Centre des Impôts de Rattachement</label>
                    <input
                      type="text"
                      value={formData.dgiTaxCenter}
                      onChange={(e) => setFormData({ ...formData, dgiTaxCenter: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Save Button */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              {saveSuccess ? (
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs animate-fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Paramètres enregistrés avec succès !</span>
                </div>
              ) : (
                <div className="text-[11px] text-slate-400">
                  Toutes les modifications sont appliquées immédiatement.
                </div>
              )}

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Enregistrer les Paramètres</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

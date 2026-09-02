import React, { useState } from 'react';
import { 
  Smartphone, 
  X, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  RefreshCw, 
  AlertCircle, 
  Receipt,
  PhoneCall,
  Lock
} from 'lucide-react';
import { Property, PaymentProvider, Transaction } from '../types';
import { formatFCFA, calculateFinancialBreakdown, formatPhoneNumber } from '../utils/formatters';

interface USSDPushModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProperty?: Property | null;
  properties: Property[];
  onTransactionSuccess: (tx: Transaction) => void;
  onOpenReceipt: (tx: Transaction) => void;
}

export const USSDPushModal: React.FC<USSDPushModalProps> = ({
  isOpen,
  onClose,
  selectedProperty,
  properties,
  onTransactionSuccess,
  onOpenReceipt,
}) => {
  if (!isOpen) return null;

  const [provider, setProvider] = useState<PaymentProvider>('MTN_MOMO');
  const [propertyId, setPropertyId] = useState<string>(selectedProperty?.id || properties[0]?.id || '');
  const [guestName, setGuestName] = useState('Samuel Eto\'o Jr');
  const [guestPhone, setGuestPhone] = useState('+237 677 88 99 00');
  const [nights, setNights] = useState(3);
  
  const currentProp = properties.find(p => p.id === propertyId) || properties[0];
  const grossAmount = (currentProp?.pricePerNight || 85000) * nights;
  const breakdown = calculateFinancialBreakdown(grossAmount, provider);

  // USSD Push Flow States: 'input' -> 'pushing' -> 'ussd_dialog' -> 'pin_entry' -> 'success'
  const [step, setStep] = useState<'input' | 'pushing' | 'ussd_dialog' | 'pin_entry' | 'success'>('input');
  const [pin, setPin] = useState('');
  const [completedTx, setCompletedTx] = useState<Transaction | null>(null);

  const handleStartPush = () => {
    setStep('pushing');
    setTimeout(() => {
      setStep('ussd_dialog');
    }, 1500);
  };

  const handleConfirmUSSD = () => {
    setStep('pin_entry');
  };

  const handleConfirmPIN = () => {
    setStep('pushing');
    setTimeout(() => {
      const newTx: Transaction = {
        id: `tx-237-${Date.now().toString().slice(-6)}`,
        propertyId: currentProp.id,
        propertyName: currentProp.name,
        guestName,
        guestPhone,
        provider,
        amount: breakdown.grossAmount,
        ttaTax: breakdown.ttaTax,
        operatorFee: breakdown.operatorFee,
        netAmount: breakdown.netAmount,
        status: 'completed',
        date: new Date().toISOString(),
        nights,
        reference: provider === 'MTN_MOMO' 
          ? `MOMO-CI-${Math.floor(100000000 + Math.random() * 900000000)}`
          : `OM-TX-${Math.floor(100000000 + Math.random() * 900000000)}`,
      };

      setCompletedTx(newTx);
      onTransactionSuccess(newTx);
      setStep('success');
    }, 2000);
  };

  const handleCloseModal = () => {
    setStep('input');
    setPin('');
    setCompletedTx(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in text-slate-100">
        
        {/* Modal Close Button */}
        <button
          onClick={handleCloseModal}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              Simulateur de Paiement USSD Push Cameroun
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                +237 MoMo / OM
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Déclenchement instantané de l'invite USSD sur le téléphone du client avec calcul de la taxe TTA (0.2%).
            </p>
          </div>
        </div>

        {/* Step 1: Order Configuration */}
        {step === 'input' && (
          <div className="space-y-5 text-xs">
            
            {/* Operator Switcher */}
            <div>
              <label className="block text-slate-400 font-semibold mb-2">Choisir l'opérateur Mobile Money</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setProvider('MTN_MOMO')}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                    provider === 'MTN_MOMO'
                      ? 'bg-yellow-500/10 border-yellow-500 text-yellow-300 shadow-md shadow-yellow-500/10'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🟡</span>
                    <div className="text-left">
                      <div className="font-extrabold text-sm">MTN Mobile Money</div>
                      <div className="text-[10px] text-slate-400 font-mono">Code USSD : *126#</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold">1% Frais</span>
                </button>

                <button
                  type="button"
                  onClick={() => setProvider('ORANGE_MONEY')}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                    provider === 'ORANGE_MONEY'
                      ? 'bg-orange-500/10 border-orange-500 text-orange-300 shadow-md shadow-orange-500/10'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🟠</span>
                    <div className="text-left">
                      <div className="font-extrabold text-sm">Orange Money</div>
                      <div className="text-[10px] text-slate-400 font-mono">Code USSD : *150#</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold">1% Frais</span>
                </button>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Nom & Prénom du Client</label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Numéro Mobile Money (+237)</label>
                <input
                  type="text"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="+237 6XX XX XX XX"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Résidence Meublée</label>
                <select
                  value={propertyId}
                  onChange={(e) => setPropertyId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 text-xs cursor-pointer"
                >
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.city}) — {formatFCFA(p.pricePerNight)}/nuit
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Nombre de Nuitées</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={nights}
                  onChange={(e) => setNights(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500 text-xs"
                />
              </div>
            </div>

            {/* Financial Breakdown Table */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider flex items-center justify-between">
                <span>Décomposition Financière & Fiscale</span>
                <span className="text-amber-400 flex items-center gap-1 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5" /> Conforme DGI Cameroun
                </span>
              </div>

              <div className="space-y-1.5 pt-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Hébergement ({nights} nuits x {formatFCFA(currentProp.pricePerNight)}) :</span>
                  <span className="font-mono font-bold text-white">{formatFCFA(breakdown.grossAmount)}</span>
                </div>

                <div className="flex justify-between text-amber-400/90 font-medium">
                  <span>Taxe sur les Transferts Électroniques (TTA 0.2%) :</span>
                  <span className="font-mono font-bold text-amber-300">- {formatFCFA(breakdown.ttaTax)}</span>
                </div>

                <div className="flex justify-between text-rose-400/90 font-medium">
                  <span>Frais opérateur {provider === 'MTN_MOMO' ? 'MTN MoMo (1%)' : 'Orange Money (1%)'} :</span>
                  <span className="font-mono font-bold text-rose-400">- {formatFCFA(breakdown.operatorFee)}</span>
                </div>

                <div className="flex justify-between pt-2 border-t border-slate-800 font-bold text-sm">
                  <span className="text-slate-200">Total Net Versé à l'Hôte :</span>
                  <span className="text-emerald-400 font-mono text-base">{formatFCFA(breakdown.netAmount)}</span>
                </div>
              </div>
            </div>

            {/* Action Trigger */}
            <button
              onClick={handleStartPush}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-950/50 transition-all active:scale-98"
            >
              <Smartphone className="w-5 h-5" />
              <span>Envoyer l'Invite USSD Push ({formatFCFA(breakdown.grossAmount)})</span>
            </button>
          </div>
        )}

        {/* Step 2: Pushing State Animation */}
        {step === 'pushing' && (
          <div className="py-12 text-center space-y-4">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-amber-500/20 animate-ping"></div>
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border-2 border-amber-500 flex items-center justify-center text-amber-400">
                <RefreshCw className="w-8 h-8 animate-spin" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Connexion Passerelle {provider === 'MTN_MOMO' ? 'MTN MoMo' : 'Orange Money'}...</h3>
              <p className="text-xs text-slate-400 mt-1">
                Envoi du Push USSD vers <strong className="text-white font-mono">{formatPhoneNumber(guestPhone)}</strong>
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Interactive Phone Screen Mockup for USSD Prompt */}
        {step === 'ussd_dialog' && (
          <div className="py-4 flex flex-col items-center">
            {/* Phone Screen Mockup */}
            <div className="w-80 bg-slate-950 rounded-3xl border-4 border-slate-700 p-5 space-y-4 shadow-2xl relative overflow-hidden">
              <div className="w-20 h-4 bg-slate-800 rounded-full mx-auto mb-2"></div>
              
              {/* USSD Modal Dialog on Phone */}
              <div className="bg-slate-900 rounded-2xl p-4 border border-amber-500/40 space-y-3 text-center">
                <div className="text-xs font-mono font-bold text-amber-400">
                  {provider === 'MTN_MOMO' ? 'MTN Mobile Money (*126#)' : 'Orange Money (*150#)'}
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  Autorisez-vous le débit de <strong className="text-white font-mono">{formatFCFA(breakdown.grossAmount)}</strong> par <strong className="text-emerald-400">AfriHostAI SARL</strong> pour {currentProp.name} ({nights} nuits) ?
                </p>
                <div className="text-[10px] text-slate-400">
                  TTA DGI (0.2%) : {formatFCFA(breakdown.ttaTax)}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => setStep('input')}
                    className="py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                  >
                    2. Annuler
                  </button>
                  <button
                    onClick={handleConfirmUSSD}
                    className="py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black"
                  >
                    1. Confirmer
                  </button>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 text-center mt-3">
              Appuyez sur <strong>"1. Confirmer"</strong> sur le téléphone virtuel ci-dessus.
            </p>
          </div>
        )}

        {/* Step 4: PIN Entry */}
        {step === 'pin_entry' && (
          <div className="py-4 flex flex-col items-center">
            <div className="w-80 bg-slate-950 rounded-3xl border-4 border-slate-700 p-5 space-y-4 shadow-2xl relative">
              <div className="w-20 h-4 bg-slate-800 rounded-full mx-auto mb-2"></div>

              <div className="bg-slate-900 rounded-2xl p-4 border border-emerald-500/40 space-y-3 text-center">
                <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-400 w-fit mx-auto">
                  <Lock className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-white">
                  Entrez votre code PIN secret {provider === 'MTN_MOMO' ? 'MoMo' : 'Orange Money'}
                </div>

                <input
                  type="password"
                  maxLength={5}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="••••"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 text-center text-lg font-mono text-white tracking-widest focus:outline-none focus:border-emerald-500"
                />

                <button
                  onClick={handleConfirmPIN}
                  className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md"
                >
                  Valider le Paiement
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Success Screen */}
        {step === 'success' && completedTx && (
          <div className="text-center space-y-5 py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-black text-white">Paiement Réussi & Enregistré !</h3>
              <p className="text-xs text-slate-400 mt-1">
                La quittance fiscale a été générée et le compte hôte crédité.
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs space-y-2 text-left max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-400">Référence :</span>
                <strong className="text-white font-mono">{completedTx.reference}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Montant Débité :</span>
                <strong className="text-amber-300 font-mono font-bold">{formatFCFA(completedTx.amount)}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Taxe TTA DGI (0.2%) :</span>
                <strong className="text-amber-400 font-mono">{formatFCFA(completedTx.ttaTax)}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Net Hôte :</span>
                <strong className="text-emerald-400 font-mono font-bold">{formatFCFA(completedTx.netAmount)}</strong>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenReceipt(completedTx);
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black flex items-center justify-center gap-2 shadow-lg"
              >
                <Receipt className="w-4 h-4" />
                <span>Voir la Quittance Fiscale DGI</span>
              </button>

              <button
                onClick={handleCloseModal}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Fermer
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

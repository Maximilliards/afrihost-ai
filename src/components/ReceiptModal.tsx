import React, { useRef } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  ShieldCheck, 
  QrCode, 
  Building2, 
  CheckCircle,
  Copy,
  Receipt
} from 'lucide-react';
import { Transaction } from '../types';
import { formatFCFA, formatDate, formatPhoneNumber } from '../utils/formatters';

interface ReceiptModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  transaction,
  onClose,
}) => {
  if (!transaction) return null;

  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyRef = () => {
    navigator.clipboard.writeText(transaction.reference);
    alert(`Référence ${transaction.reference} copiée dans le presse-papier !`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in text-slate-100">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Action Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 print:hidden">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-amber-400" />
            <span className="font-extrabold text-sm text-white">Quittance Fiscale & Facture Conforme DGI</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Télécharger PDF</span>
            </button>
          </div>
        </div>

        {/* Printable Official Receipt Sheet */}
        <div 
          ref={receiptRef}
          className="bg-white text-slate-900 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl border border-slate-200 relative overflow-hidden"
        >
          
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 rotate-[-25deg]">
            <span className="text-8xl font-black text-slate-900 uppercase">ACQUITTÉ DGI</span>
          </div>

          {/* Official Cameroon Header */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-4 text-[11px] leading-tight">
            <div>
              <div className="font-extrabold uppercase tracking-wider text-slate-800">RÉPUBLIQUE DU CAMEROUN</div>
              <div className="text-slate-500 text-[10px]">Paix – Travail – Patrie</div>
              <div className="text-slate-600 font-bold mt-1">DIRECTION GÉNÉRALE DES IMPÔTS (DGI)</div>
              <div className="text-[10px] text-slate-500">Code Général des Impôts – Art. 225 (TTA)</div>
            </div>

            <div className="text-right">
              <div className="font-extrabold uppercase tracking-wider text-slate-800">REPUBLIC OF CAMEROON</div>
              <div className="text-slate-500 text-[10px]">Peace – Work – Fatherland</div>
              <div className="text-slate-600 font-bold mt-1">DIRECTORATE GENERAL OF TAXATION</div>
              <div className="text-[10px] text-slate-500">Electronic Transfer Tax (0.2%)</div>
            </div>
          </div>

          {/* Company & Receipt Details */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                  AH
                </div>
                <strong className="text-sm font-black text-slate-900">AFRIHOST AI SARL</strong>
              </div>
              <div className="text-slate-600 space-y-0.5 text-[11px]">
                <div>N° Identifiant Unique (NIU) : <strong className="text-slate-900">M052319028120K</strong></div>
                <div>RCCM : <strong className="text-slate-900">RC/DLA/2024/B/1842</strong></div>
                <div>Siège Social : Bonanjo, Douala, Cameroun</div>
                <div>Service Client : +237 699 00 00 00 / contact@afrihost.ai</div>
              </div>
            </div>

            <div className="text-right space-y-1 text-xs">
              <div className="font-mono text-sm font-black text-slate-900">
                QUITTANCE N° {transaction.reference}
              </div>
              <div className="text-slate-600 text-[11px]">
                Date d'émission : <strong className="text-slate-800">{formatDate(transaction.date)}</strong>
              </div>
              <div className="text-slate-600 text-[11px]">
                Mode de règlement : <strong className="text-emerald-700">
                  {transaction.provider === 'MTN_MOMO' ? 'MTN Mobile Money (*126#)' : transaction.provider === 'ORANGE_MONEY' ? 'Orange Money (*150#)' : 'Espèces'}
                </strong>
              </div>
              <div className="inline-block bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded border border-emerald-300">
                ✓ TRANSACTION CONFIRMÉE & RÉGLÉE
              </div>
            </div>
          </div>

          {/* Client Info Banner */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
            <span className="font-bold uppercase tracking-wider text-[10px] text-slate-500 block mb-1">
              Informations du Client / Réservataire :
            </span>
            <div className="flex justify-between items-center">
              <div>
                <strong className="text-sm text-slate-900">{transaction.guestName}</strong>
                <div className="text-slate-600 font-mono text-[11px]">{formatPhoneNumber(transaction.guestPhone)}</div>
              </div>
              <div className="text-right">
                <span className="text-slate-600 text-[11px]">Hébergement attribué :</span>
                <div className="font-bold text-slate-900">{transaction.propertyName}</div>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="p-2.5">Désignation</th>
                <th className="p-2.5 text-center">Nuits</th>
                <th className="p-2.5 text-right">Prix Unitaire</th>
                <th className="p-2.5 text-right">Total HT (FCFA)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              <tr>
                <td className="p-2.5">
                  <div className="font-bold text-slate-900">{transaction.propertyName}</div>
                  <div className="text-[10px] text-slate-500">
                    Prestation meublée avec autonomie groupe électrogène, forage & Starlink
                  </div>
                </td>
                <td className="p-2.5 text-center font-medium">{transaction.nights}</td>
                <td className="p-2.5 text-right font-mono">{formatFCFA(transaction.amount / (transaction.nights || 1))}</td>
                <td className="p-2.5 text-right font-mono font-bold">{formatFCFA(transaction.amount)}</td>
              </tr>
            </tbody>
          </table>

          {/* Financial and Tax Totals Breakdown */}
          <div className="flex justify-end">
            <div className="w-72 space-y-1.5 text-xs text-slate-700">
              <div className="flex justify-between py-1">
                <span>Total Brut Hébergement :</span>
                <strong className="font-mono text-slate-900">{formatFCFA(transaction.amount)}</strong>
              </div>

              <div className="flex justify-between py-1 border-t border-slate-200 text-amber-800">
                <span className="flex items-center gap-1">
                  <span>Taxe Transferts Électroniques (TTA 0.2%) :</span>
                </span>
                <strong className="font-mono">{formatFCFA(transaction.ttaTax)}</strong>
              </div>

              <div className="flex justify-between py-1 text-slate-600 text-[11px]">
                <span>Frais passerelle opérateur (1%) :</span>
                <strong className="font-mono">{formatFCFA(transaction.operatorFee)}</strong>
              </div>

              <div className="flex justify-between py-2 border-t-2 border-slate-900 text-sm font-black text-slate-900 bg-slate-100 px-2 rounded-lg">
                <span>TOTAL RÉGLÉ (TTC) :</span>
                <span className="font-mono text-emerald-800 text-base">{formatFCFA(transaction.amount)}</span>
              </div>
            </div>
          </div>

          {/* Fiscal Stamp & Verification QR */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-slate-100 border border-slate-300">
                <QrCode className="w-10 h-10 text-slate-800" />
              </div>
              <div className="space-y-0.5">
                <div className="font-bold text-slate-800 uppercase">Certificat Numérique DGI Cameroun</div>
                <div>Hash Fiscal : SHA256:{transaction.reference}</div>
                <div>Authenticité vérifiable sur le portail télé-déclaration DGI</div>
              </div>
            </div>

            {/* Official Green Stamp Box */}
            <div className="border-2 border-dashed border-emerald-600 text-emerald-800 p-2 rounded-xl text-center space-y-0.5">
              <div className="font-black text-xs uppercase tracking-wider">AFRIHOST AI SARL</div>
              <div className="text-[9px] font-bold">DIRECTION FINANCIÈRE</div>
              <div className="text-[8px]">ACQUITTÉ LE {new Date(transaction.date).toLocaleDateString('fr-FR')}</div>
            </div>
          </div>

        </div>

        {/* Copy Reference bar */}
        <div className="flex items-center justify-between text-xs bg-slate-950 p-3 rounded-xl border border-slate-800 print:hidden">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="font-mono text-white">{transaction.reference}</span>
          </div>
          <button
            onClick={handleCopyRef}
            className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copier Réf</span>
          </button>
        </div>

      </div>
    </div>
  );
};

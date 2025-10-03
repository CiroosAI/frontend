// components/InvestmentModal.js
import { useState } from 'react';
import { createInvestment } from '../utils/api';
import { useRouter } from 'next/router';
import { BANKS, PAYMENT_METHODS } from '../constants/products';
import { Icon } from '@iconify/react';

export default function InvestmentModal({ open, onClose, product, user, onSuccess }) {
  const router = useRouter();
  const [amount, setAmount] = useState(product?.minimum || '');
  const [paymentMethod, setPaymentMethod] = useState('QRIS');
  const [bank, setBank] = useState(BANKS[0].code);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!open || !product) return null;

  const min = product.minimum;
  const max = product.maximum;
  const percentage = product.percentage;
  const duration = product.duration;

  const totalReturn = amount && !isNaN(amount)
    ? (parseInt(amount) + (amount * percentage * 2 / 100))
    : 0;

  const formatCurrency = (amt) => new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: 'IDR', 
    maximumFractionDigits: 0 
  }).format(amt);

  const handleConfirm = async () => {
    setError('');
    if (!amount || isNaN(amount) || amount < min || amount > max) {
      setError(`Nominal investasi harus antara ${formatCurrency(min)} dan ${formatCurrency(max)}`);
      return;
    }
    if (paymentMethod === 'BANK' && !bank) {
      setError('Pilih bank transfer.');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        product_id: product.id,
        amount: parseInt(amount),
        payment_method: paymentMethod,
        payment_channel: paymentMethod === 'BANK' ? bank : undefined,
      };
      const data = await createInvestment(payload);
      setLoading(false);
      if (data && data.data && data.data.order_id) {
        router.push(`/payment?order_id=${encodeURIComponent(data.data.order_id)}`);
      } else {
        setError('Gagal mendapatkan order ID pembayaran');
      }
    } catch (err) {
      setError(err.message || 'Gagal melakukan investasi');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative max-w-md w-full animate-slideUp">
        {/* Outer Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#F45D16] via-[#FF6B35] to-[#0058BC] rounded-3xl blur-xl opacity-40"></div>
        
        {/* Main Card */}
        <div className="relative bg-gradient-to-br from-[#1A1A1A] via-[#0F0F0F] to-[#1A1A1A] rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <Icon icon="mdi:close" className="w-5 h-5 text-white" />
          </button>

          {/* Header with Gradient */}
          <div className="relative p-6 pb-8 bg-gradient-to-br from-[#F45D16]/10 to-[#0058BC]/10 border-b border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F45D16] to-[#FF6B35] flex items-center justify-center shadow-lg">
                <Icon icon="mdi:trending-up" className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{product.name}</h2>
                <p className="text-xs text-white/60">Konfirmasi Investasi</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mt-4 text-xs">
              <div className="flex items-center gap-1.5 text-white/70">
                <Icon icon="mdi:arrow-down-circle" className="w-4 h-4 text-[#F45D16]" />
                <span>Min: {formatCurrency(min)}</span>
              </div>
              <div className="w-px h-4 bg-white/20"></div>
              <div className="flex items-center gap-1.5 text-white/70">
                <Icon icon="mdi:arrow-up-circle" className="w-4 h-4 text-[#0058BC]" />
                <span>Max: {formatCurrency(max)}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            {/* Investment Amount Input */}
            <div>
              <label htmlFor="amount" className="block text-white text-sm font-semibold mb-3 flex items-center gap-2">
                <Icon icon="mdi:cash-multiple" className="w-4 h-4 text-[#F45D16]" />
                Nominal Investasi
              </label>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#F45D16]/20 to-[#0058BC]/20 rounded-2xl blur-sm opacity-50"></div>
                <div className="relative flex items-center bg-white/5 rounded-2xl border border-white/10 overflow-hidden transition-all duration-300 focus-within:border-[#F45D16] focus-within:shadow-[0_0_20px_rgba(244,93,22,0.2)]">
                  <div className="flex items-center justify-center w-16 bg-gradient-to-br from-[#F45D16]/20 to-[#FF6B35]/20 h-full border-r border-white/10">
                    <span className="text-white/90 text-sm font-bold">IDR</span>
                  </div>
                  <input
                    type="number"
                    id="amount"
                    min={min}
                    max={max}
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="flex-1 bg-transparent outline-none py-4 px-4 text-white placeholder-white/40 text-base font-semibold"
                    placeholder="Masukkan nominal"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Investment Summary - New Card Style */}
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#F45D16]/30 to-[#0058BC]/30 rounded-2xl blur opacity-50"></div>
              <div className="relative bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl p-5 border border-white/10">
                <div className="flex items-center gap-2 mb-4">
                  <Icon icon="mdi:chart-line-variant" className="w-5 h-5 text-[#F45D16]" />
                  <h3 className="text-white font-bold text-base">Ringkasan Investasi</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-white/70 text-sm flex items-center gap-2">
                      <Icon icon="mdi:cash" className="w-4 h-4 text-white/50" />
                      Nominal
                    </span>
                    <span className="text-white font-bold text-base">{formatCurrency(amount || 0)}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gradient-to-br from-[#F45D16]/10 to-[#FF6B35]/10 rounded-xl border border-[#F45D16]/20">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Icon icon="mdi:calendar-today" className="w-3.5 h-3.5 text-[#F45D16]" />
                        <p className="text-[10px] text-white/70 font-medium uppercase tracking-wide">Harian</p>
                      </div>
                      <p className="text-lg font-bold text-[#F45D16]">{Math.ceil((percentage * 2) / duration)}%</p>
                    </div>
                    
                    <div className="p-3 bg-gradient-to-br from-[#0058BC]/10 to-[#F45D16]/10 rounded-xl border border-[#0058BC]/20">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Icon icon="mdi:chart-arc" className="w-3.5 h-3.5 text-[#0058BC]" />
                        <p className="text-[10px] text-white/70 font-medium uppercase tracking-wide">Total</p>
                      </div>
                      <p className="text-lg font-bold text-[#0058BC]">{percentage * 2}%</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-bold flex items-center gap-2">
                        <Icon icon="mdi:trophy" className="w-5 h-5 text-[#F45D16]" />
                        Total Kembali
                      </span>
                      <span className="text-white font-bold text-xl bg-gradient-to-r from-[#F45D16] to-[#FF6B35] bg-clip-text text-transparent">
                        {formatCurrency(totalReturn)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="relative animate-shake">
                <div className="absolute -inset-0.5 bg-red-500/50 rounded-2xl blur"></div>
                <div className="relative bg-red-500/10 border border-red-400/30 rounded-2xl p-4 flex items-start gap-3">
                  <Icon icon="mdi:alert-circle" className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="text-red-300 text-sm leading-relaxed">{error}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                disabled={loading}
                className="flex-1 bg-white/5 hover:bg-white/10 disabled:bg-white/5 text-white font-bold py-4 px-6 rounded-2xl text-sm transition-all duration-300 border border-white/10 disabled:cursor-not-allowed disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
              >
                Batal
              </button>
              
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="flex-1 relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#F45D16] to-[#FF6B35] rounded-2xl transition-all duration-300 group-hover:shadow-lg group-hover:shadow-[#F45D16]/50"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#d74e0f] to-[#F45D16] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative text-white font-bold py-4 px-6 rounded-2xl text-sm transition-all duration-300 flex items-center justify-center gap-2 group-disabled:opacity-60 group-disabled:cursor-not-allowed">
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <>
                      <Icon icon="mdi:check-circle" className="w-5 h-5" />
                      Konfirmasi
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            transform: translateY(30px) scale(0.95); 
            opacity: 0; 
          }
          to { 
            transform: translateY(0) scale(1); 
            opacity: 1; 
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        
        .animate-fadeIn { 
          animation: fadeIn 0.3s ease-out; 
        }
        
        .animate-slideUp { 
          animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); 
        }
        
        .animate-shake { 
          animation: shake 0.5s ease-in-out; 
        }

        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}
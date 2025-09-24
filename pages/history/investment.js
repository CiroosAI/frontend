// pages/history/investment.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Home, Users, Gift, CreditCard, User, BarChart3, ArrowLeft } from 'lucide-react';
import { Icon } from '@iconify/react';
import { getInvestmentHistory, getPaymentByOrderId } from '../../utils/api';
import BottomNavbar from '../../components/BottomNavbar';

const navItems = [
  { label: 'Home', icon: Home, href: '/dashboard', key: 'dashboard' },
  { label: 'Komisi', icon: Users, href: '/referral', key: 'komisi' },
  { label: 'Spin', icon: Gift, href: '/spin-wheel', key: 'spin' },
  { label: 'Testimoni', icon: CreditCard, href: '/testimoni', key: 'testimoni' },
  { label: 'Profil', icon: User, href: '/profile', key: 'profile' },
];

export default function RiwayatDeposit() {
  const router = useRouter();
  const [investments, setInvestments] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState({}); // { order_id: { status, expired_at, payment_method, product } }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // Fixed limit to 10
  const [applicationData, setApplicationData] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = sessionStorage.getItem('token');
    const accessExpire = sessionStorage.getItem('access_expire');
    if (!token || !accessExpire) {
      router.push('/login');
      return;
    }
    fetchInvestmentHistory();
  }, [router]);

  useEffect(() => {
    // Fetch data when page changes
    fetchInvestmentHistory();
    // Scroll to top of list
    try { 
      window.scrollTo({ top: 0, behavior: 'smooth' }); 
    } catch (e) {
      console.log('Scroll failed:', e);
    }
    const storedApplication = localStorage.getItem('application');
  if (storedApplication) {
    try {
      const parsed = JSON.parse(storedApplication);
      setApplicationData({
        name: parsed.name || 'Vla Devs',
        healthy: parsed.healthy || false,
        // tambahkan properti lain jika diperlukan
      });
    } catch (e) {
      setApplicationData({ name: 'Vla Devs', healthy: false });
    }
  } else {
    setApplicationData({ name: 'Vla Devs', healthy: false });
  }
  }, [page]);

  const fetchInvestmentHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      // Build query parameters
      const queryParams = {
        limit: 10, // Fixed limit to 10
        page
      };

      console.log('Fetching investment history with params:', queryParams); // Debug log
      
      const res = await getInvestmentHistory(queryParams);
      if (res.success && res.data) {
        const invs = res.data.investments || res.data || [];
        const fetchedInvestments = Array.isArray(invs) ? invs : [];
        setInvestments(fetchedInvestments);
        
        // Ambil status pembayaran untuk setiap investasi
        const statusObj = {};
        await Promise.all(
          fetchedInvestments.map(async (inv) => {
            try {
              const payRes = await getPaymentByOrderId(inv.order_id);
              if (payRes.success && payRes.data) {
                statusObj[inv.order_id] = {
                  status: payRes.data.status,
                  expired_at: payRes.data.expired_at,
                  payment_method: payRes.data.payment_method,
                  product: payRes.data.product
                };
              } else {
                statusObj[inv.order_id] = { 
                  status: inv.status || 'Unknown', 
                  expired_at: null,
                  payment_method: null,
                  product: null
                };
              }
            } catch {
              statusObj[inv.order_id] = { 
                status: inv.status || 'Unknown', 
                expired_at: null,
                payment_method: null,
                product: null
              };
            }
          })
        );
        setPaymentStatus(statusObj);
      } else {
        setInvestments([]);
        setPaymentStatus({});
        setError(res.message || 'Gagal memuat riwayat investasi');
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
      console.error('Error fetching investment history:', err);
      setInvestments([]);
      setPaymentStatus({});
    }
    setLoading(false);
  };

  const handlePageChange = (newPage) => {
    console.log('handlePageChange called with:', newPage, 'current page:', page);
    if (newPage >= 1 && newPage !== page) {
      console.log('Setting page to:', newPage);
      setPage(newPage);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID').format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusConfig = (status, expired_at) => {
    // Cek expired untuk status Pending
    if (status === 'Pending' && expired_at) {
      const expiredDate = new Date(expired_at);
      const now = new Date();
      const diff = (expiredDate.getTime() - now.getTime()) / 1000;
      if (diff < 0) {
        return {
          color: 'text-gray-400', 
          bgColor: 'bg-gradient-to-r from-gray-500/20 to-slate-500/20', 
          borderColor: 'border-gray-400/30',
          text: 'Kadaluarsa', 
          icon: 'mdi:timer-off'
        };
      }
    }

    const statusConfig = {
      'Success': { 
        color: 'text-green-400', 
        bgColor: 'bg-gradient-to-r from-green-500/20 to-emerald-500/20', 
        borderColor: 'border-green-400/30',
        text: 'Berhasil', 
        icon: 'mdi:check-circle' 
      },
      'Completed': { 
        color: 'text-green-400', 
        bgColor: 'bg-gradient-to-r from-green-500/20 to-emerald-500/20', 
        borderColor: 'border-green-400/30',
        text: 'Berhasil', 
        icon: 'mdi:check-circle' 
      },
      'Running': { 
        color: 'text-green-400', 
        bgColor: 'bg-gradient-to-r from-green-500/20 to-emerald-500/20', 
        borderColor: 'border-green-400/30',
        text: 'Berhasil', 
        icon: 'mdi:play-circle' 
      },
      'Pending': { 
        color: 'text-yellow-400', 
        bgColor: 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20', 
        borderColor: 'border-yellow-400/30',
        text: 'Menunggu', 
        icon: 'mdi:clock-outline' 
      },
      'Failed': { 
        color: 'text-red-400', 
        bgColor: 'bg-gradient-to-r from-red-500/20 to-rose-500/20', 
        borderColor: 'border-red-400/30',
        text: 'Gagal', 
        icon: 'mdi:close-circle' 
      },
      'Expired': { 
        color: 'text-gray-400', 
        bgColor: 'bg-gradient-to-r from-gray-500/20 to-slate-500/20', 
        borderColor: 'border-gray-400/30',
        text: 'Kadaluarsa', 
        icon: 'mdi:timer-off' 
      }
    };

    return statusConfig[status] || statusConfig['Pending'];
  };

  const getStatusBadge = (status, expired_at) => {
    const config = getStatusConfig(status, expired_at);
    
    return (
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bgColor} border ${config.borderColor}`}>
        <Icon icon={config.icon} className={`w-4 h-4 ${config.color}`} />
        <span className={`text-xs font-semibold ${config.color}`}>
          {config.text}
        </span>
      </div>
    );
  };

  const getPaymentMethodIcon = (method) => {
    if (method === 'QRIS') {
      return 'mdi:qrcode';
    } else if (method === 'BANK') {
      return 'mdi:bank';
    }
    return 'mdi:credit-card';
  };

  const shouldShowPayButton = (status, expired_at) => {
    if (status === 'Pending' && expired_at) {
      const expiredDate = new Date(expired_at);
      const now = new Date();
      const diff = (expiredDate.getTime() - now.getTime()) / 1000;
      return diff > 0; // Masih belum expired
    }
    return false;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-400 border-t-transparent"></div>
            <Icon icon="mdi:chart-timeline-variant" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-purple-400 w-6 h-6" />
          </div>
          <span className="text-purple-200 mt-4 text-sm">Memuat riwayat investasi...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 pb-24">
      <Head>
  <title>{applicationData?.name || 'Vla Devs'} | Riwayat Investasi</title>
  <meta name="description" content={`${applicationData?.name || 'Vla Devs'} Description`} />
  <link rel="icon" href="/logo.png" />
</Head>

      {/* Top Navigation */}
      <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center">
          <button 
            onClick={() => router.back()}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 active:scale-95"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center gap-3 mx-auto">
            <div className={`p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl`}>
              <Icon icon="mdi:chart-timeline-variant" className="text-xl text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Riwayat Investasi</h1>
            </div>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-800/60 to-pink-600/60 backdrop-blur-xl rounded-3xl p-6 mb-6 border border-purple-400/30 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-pink-400/20 rounded-full blur-xl"></div>
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-lg"></div>
          
          <div className="flex flex-col items-center text-center relative z-10">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-xl border border-purple-400/30 mb-4">
              <Icon icon="mdi:shopping-outline" className="text-white w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Riwayat Pembelian Investasi</h2>
            <p className="text-purple-200 text-sm">Lihat semua riwayat pembelian dan status pembayaran</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-purple-800/40 to-indigo-600/30 backdrop-blur-xl rounded-2xl p-4 border border-purple-400/20 shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <Icon icon="mdi:counter" className="text-cyan-400 w-5 h-5" />
              <span className="text-purple-200 text-xs">Total Transaksi</span>
            </div>
            <p className="text-white font-bold text-lg">
              {investments.length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-800/40 to-pink-600/30 backdrop-blur-xl rounded-2xl p-4 border border-purple-400/20 shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <Icon icon="mdi:cash-multiple" className="text-green-400 w-5 h-5" />
              <span className="text-purple-200 text-xs">Total Investasi</span>
            </div>
            <p className="text-green-400 font-bold text-lg">
              IDR {formatCurrency(
                investments.reduce((sum, inv) => {
                  const status = paymentStatus[inv.order_id]?.status || inv.status;
                  return status === 'Success' || status === 'Completed' || status === 'Running' 
                    ? sum + (inv.amount || 0)
                    : sum;
                }, 0)
              )}
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-gradient-to-br from-red-800/40 to-red-600/30 backdrop-blur-xl rounded-3xl p-6 border border-red-400/20 shadow-2xl mb-6">
            <div className="flex items-center gap-4 mb-4">
              <Icon icon="mdi:alert-circle" className="text-red-400 w-8 h-8 flex-shrink-0" />
              <div>
                <h4 className="text-white font-semibold text-sm mb-1">Terjadi Kesalahan</h4>
                <p className="text-red-200 text-xs">{error}</p>
              </div>
            </div>
            <button 
              onClick={fetchInvestmentHistory}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-purple-500/25 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <Icon icon="mdi:refresh" className="w-4 h-4" />
              Coba Lagi
            </button>
          </div>
        )}

        {/* Investments List */}
        {investments.length === 0 && !error ? (
          <div className="bg-gradient-to-br from-purple-800/40 to-pink-600/30 backdrop-blur-xl rounded-3xl p-8 text-center border border-purple-400/20">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center mx-auto mb-4">
              <Icon icon="mdi:shopping-outline" className="text-white w-8 h-8" />
            </div>
            <h4 className="text-white font-semibold text-sm mb-1">Belum Ada Riwayat</h4>
            <p className="text-purple-200 text-xs">Anda belum melakukan pembelian investasi</p>
          </div>
        ) : (
          <div className="space-y-4">
            {investments.map((investment) => {
              const paymentInfo = paymentStatus[investment.order_id] || {};
              const status = paymentInfo.status || investment.status;
              const statusConfig = getStatusConfig(status, paymentInfo.expired_at);
              const showPayButton = shouldShowPayButton(status, paymentInfo.expired_at);
              
              return (
                <div key={investment.id || investment.order_id} className="bg-gradient-to-br from-purple-800/50 to-pink-600/40 backdrop-blur-xl rounded-3xl p-6 border border-purple-400/30 shadow-2xl hover:shadow-3xl transition-all duration-300 relative overflow-hidden group">
                  {/* Background decoration */}
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-pink-400/10 to-purple-400/10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-500"></div>
                  
                  {/* Header with Order ID and Status */}
                  <div className="flex justify-between items-center mb-4 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Icon icon="mdi:receipt-text" className="text-white w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-white font-semibold text-sm">#{investment.order_id}</span>
                        <p className="text-purple-300 text-xs">Order ID</p>
                      </div>
                    </div>
                    {getStatusBadge(status, paymentInfo.expired_at)}
                  </div>

                  {/* Product Details */}
                  <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-xl p-4 mb-4 border border-indigo-400/20 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                        <Icon icon="mdi:star" className="text-white w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-indigo-200 font-semibold text-sm">
                          {paymentInfo.product || 'Produk Investasi'}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-indigo-300 mt-1">
                          <Icon icon="mdi:cash" className="w-3 h-3" />
                          <span>IDR {formatCurrency(investment.amount || 0)}</span>
                        </div>
                      </div>
                      {paymentInfo.payment_method && (
                        <div className="flex items-center gap-2 px-2 py-1 bg-blue-500/20 rounded-lg border border-blue-400/20">
                          <Icon icon={getPaymentMethodIcon(paymentInfo.payment_method)} className="text-blue-300 w-3 h-3" />
                          <span className="text-blue-200 text-xs font-medium">{paymentInfo.payment_method}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Amount and Date */}
                  <div className="grid grid-cols-2 gap-4 mb-4 relative z-10">
                    <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon icon="mdi:wallet-outline" className="text-cyan-400 w-4 h-4" />
                        <span className="text-cyan-200 text-xs">Jumlah Investasi</span>
                      </div>
                      <span className="text-cyan-400 font-semibold text-sm">IDR {formatCurrency(investment.amount || 0)}</span>
                    </div>
                    
                    <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon icon="mdi:calendar-outline" className="text-purple-400 w-4 h-4" />
                        <span className="text-purple-200 text-xs">Tanggal Order</span>
                      </div>
                      <span className="text-purple-400 font-semibold text-sm">
                        {investment.created_at ? 
                          formatDate(investment.created_at) : 
                          new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
                        }
                      </span>
                    </div>
                  </div>

                  {/* Payment Button for Pending Status */}
                  {showPayButton && (
                    <div className="relative z-10">
                      <button
                        onClick={() => router.push(`/payment?order_id=${investment.order_id}`)}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-green-500/25 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                      >
                        <Icon icon="mdi:credit-card-fast" className="w-5 h-5" />
                        <span>Bayar Sekarang</span>
                      </button>
                      {paymentInfo.expired_at && (
                        <div className="flex items-center justify-center gap-2 mt-2 text-xs text-yellow-300">
                          <Icon icon="mdi:timer-outline" className="w-3 h-3" />
                          <span>
                            Batas waktu: {formatDate(paymentInfo.expired_at)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Controls - Fixed position above copyright */}
        <div className="flex items-center justify-center gap-4 mt-6 mb-4">
          <div className="bg-gradient-to-br from-purple-800/40 to-pink-600/30 backdrop-blur-xl rounded-2xl p-4 border border-purple-400/20 shadow-xl">
            <div className="flex items-center gap-3">
              {/* Previous Button - disabled if page = 1 */}
              <button
                onClick={() => {
                  console.log('Previous clicked, current page:', page);
                  if (page > 1) {
                    handlePageChange(page - 1);
                  }
                }}
                disabled={page === 1}
                className={`${page === 1 ? 'bg-white/5 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 hover:scale-105 active:scale-95'} p-3 rounded-xl transition-all duration-300 shadow-lg flex items-center justify-center`}
              >
                <Icon icon="mdi:chevron-left" className="w-5 h-5" />
              </button>

              {/* Current Page Info */}
              <div className="bg-white/10 rounded-xl px-4 py-2 border border-white/20 min-w-[60px] text-center">
                <span className="text-white text-sm font-semibold">
                  {page}
                </span>
                <p className="text-purple-200 text-xs mt-1">
                  {investments.length} item
                </p>
              </div>

              {/* Next Button - enabled only if current data length = 10 (means there might be more data) */}
              <button
                onClick={() => {
                  console.log('Next clicked, current page:', page, 'data length:', investments.length);
                  if (investments.length === 10) {
                    handlePageChange(page + 1);
                  }
                }}
                disabled={investments.length < 10}
                className={`${investments.length < 10 ? 'bg-white/5 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 hover:scale-105 active:scale-95'} p-3 rounded-xl transition-all duration-300 shadow-lg flex items-center justify-center`}
              >
                <Icon icon="mdi:chevron-right" className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-white/60 text-xs flex items-center justify-center gap-2 mt-8 mb-8">
          <Icon icon="solar:copyright-bold" className="w-3 h-3" />
<span>2025 {applicationData?.name || 'Vla Devs'}. All Rights Reserved.</span>        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/30 backdrop-blur-xl border-t border-purple-400/20 z-50">
        <div className="max-w-4xl mx-auto grid grid-cols-5 gap-1 p-2">
          <BottomNavbar />
        </div>
      </div>
    </div>
  );
}
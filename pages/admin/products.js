// pages/admin/products.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Icon } from '@iconify/react';
import AdminLayout from '../../components/admin/Layout';
import useAdminAuth from '../../lib/auth/useAdminAuth';
import { adminRequest } from '../../utils/admin/api';

export default function ProductManagement() {
  const { loading: authLoading } = useAdminAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    minimum: '',
    maximum: '',
    percentage: '',
    duration: '',
    status: 'Active'
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0
  });

  useEffect(() => {
    if (authLoading) return;
    loadProducts();
  }, [authLoading]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await adminRequest('/products', { method: 'GET' });
      if (res && Array.isArray(res.data)) {
        const mappedProducts = res.data.map(product => ({
          id: product.id,
          name: product.name,
          minInvestment: product.minimum ?? product.minInvestment ?? 0,
          maxInvestment: product.maximum ?? product.maxInvestment ?? 0,
          returnPercentage: product.percentage ?? product.returnPercentage ?? 0,
          duration: product.duration ?? 0,
          status: product.status ?? 'Inactive'
        }));
        
        setProducts(mappedProducts);
        
        // Calculate stats
        const statsData = mappedProducts.reduce((acc, product) => {
          acc.total++;
          if (product.status === 'Active') acc.active++;
          else acc.inactive++;
          return acc;
        }, { total: 0, active: 0, inactive: 0 });
        setStats(statsData);
      } else {
        setProducts([]);
        setStats({ total: 0, active: 0, inactive: 0 });
      }
    } catch (err) {
      console.error('Failed to load products:', err);
      setProducts([]);
      setStats({ total: 0, active: 0, inactive: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setEditForm({
      name: product.name,
      minimum: product.minInvestment.toString(),
      maximum: product.maxInvestment.toString(),
      percentage: product.returnPercentage.toString(),
      duration: product.duration.toString(),
      status: product.status
    });
    setError('');
    setShowEditModal(true);
  };

  const handleSave = async () => {
    if (!selectedProduct) return;
    
    setSaving(true);
    setError('');
    
    try {
      const body = {
        name: editForm.name,
        minimum: Number(editForm.minimum),
        maximum: Number(editForm.maximum),
        percentage: Number(editForm.percentage),
        duration: Number(editForm.duration),
        status: editForm.status
      };

      const res = await adminRequest(`/products/${selectedProduct.id}`, { 
        method: 'PUT', 
        body: JSON.stringify(body) 
      });
      
      if (res && res.success) {
        loadProducts(); // Reload data
        setShowEditModal(false);
      } else {
        setError(res?.message || 'Gagal memperbarui produk');
      }
    } catch (err) {
      console.error('Update failed:', err);
      setError(err?.message || 'Gagal memperbarui produk');
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status) => {
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
        status === 'Active' 
          ? 'bg-green-500/20 text-green-400 border-green-500/30' 
          : 'bg-red-500/20 text-red-400 border-red-500/30'
      }`}>
        {status === 'Active' ? 'Aktif' : 'Tidak Aktif'}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const calculateROI = (amount, percentage) => {
    return (amount * percentage) / 100;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-400/30 border-t-purple-400 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-pink-400 rounded-full animate-spin animation-delay-150"></div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-white font-medium text-lg">Memuat Data Produk...</p>
            <p className="text-gray-400 text-sm mt-1">Harap tunggu sebentar</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout title="Kelola Produk">
      <Head>
        <title>Vla Devs | Kelola Produk</title>
        <link rel="icon" type="image/x-icon" href="/vla-logo.png" />
      </Head>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Produk" value={stats.total} icon="mdi:package-variant" color="blue" />
        <StatCard title="Produk Aktif" value={stats.active} icon="mdi:package-variant-closed" color="green" />
        <StatCard title="Produk Tidak Aktif" value={stats.inactive} icon="mdi:package-variant-remove" color="red" />
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-xl rounded-3xl p-6 border border-blue-500/20 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center">
            <Icon icon="mdi:information" className="text-white text-xl" />
          </div>
          <div>
            <h2 className="text-white font-semibold text-lg mb-1">Informasi Produk Investasi</h2>
            <p className="text-gray-300 text-sm">
              Platform memiliki 3 produk investasi tetap yang dapat dikelola statusnya. 
              Klik tombol edit untuk mengubah parameter produk.
            </p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {products.map((product, index) => (
          <div key={product.id} className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300 hover:scale-105">
            <div className={`h-2 ${
              index === 0 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
              index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-600' :
              'bg-gradient-to-r from-yellow-600 to-yellow-400'
            }`}></div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    index === 0 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                    index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-600' :
                    'bg-gradient-to-r from-yellow-600 to-yellow-400'
                  }`}>
                    <Icon icon="mdi:star" className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">{product.name}</h3>
                  </div>
                </div>
                {getStatusBadge(product.status)}
              </div>

              <div className="space-y-4 mb-6">
                <div className="bg-white/5 rounded-2xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400 text-sm">Minimal Investasi</span>
                    <Icon icon="mdi:arrow-down" className="text-blue-400 w-4 h-4" />
                  </div>
                  <div className="text-white font-bold text-lg">
                    {formatCurrency(product.minInvestment)}
                  </div>
                </div>

                <div className="bg-white/5 rounded-2xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400 text-sm">Maksimal Investasi</span>
                    <Icon icon="mdi:arrow-up" className="text-green-400 w-4 h-4" />
                  </div>
                  <div className="text-white font-bold text-lg">
                    {formatCurrency(product.maxInvestment)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-2xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400 text-sm">Return</span>
                      <Icon icon="mdi:percent" className="text-purple-400 w-4 h-4" />
                    </div>
                    <div className="text-purple-400 font-bold text-lg">
                      {product.returnPercentage}%
                    </div>
                    <div className="text-gray-500 text-xs">{Math.ceil((product.returnPercentage * 2) / product.duration)}% per hari</div>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400 text-sm">Durasi</span>
                      <Icon icon="mdi:calendar" className="text-orange-400 w-4 h-4" />
                    </div>
                    <div className="text-orange-400 font-bold text-lg">
                      {product.duration}
                    </div>
                    <div className="text-gray-500 text-xs">hari</div>
                  </div>
                </div>
              </div>

              {/* ROI Examples */}
              <div className="bg-gradient-to-r from-green-600/10 to-emerald-600/10 rounded-2xl p-4 mb-6 border border-green-500/20">
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-2">Contoh ROI (Investasi Minimal)</p>
                  <div className="text-green-400 font-bold text-xl">
                    +{formatCurrency(calculateROI(product.minInvestment, product.returnPercentage, product.duration))}
                  </div>
                  <p className="text-gray-500 text-xs mt-1">
                    Total: {formatCurrency(product.minInvestment + calculateROI(product.minInvestment, product.returnPercentage, product.duration))}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleEdit(product)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <Icon icon="mdi:pencil" className="w-5 h-5" />
                Edit Produk
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900/95 backdrop-blur-xl rounded-3xl w-full max-w-2xl border border-white/20 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                    <Icon icon="mdi:pencil" className="text-white w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">Edit Produk</h3>
                    <p className="text-gray-400 text-sm">{selectedProduct.name} (ID: {selectedProduct.id})</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <Icon icon="mdi:close" className="text-gray-400 hover:text-white w-5 h-5" />
                </button>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-2xl text-sm mb-6">
                  <div className="flex items-center gap-2">
                    <Icon icon="mdi:alert-circle" className="w-4 h-4" />
                    {error}
                  </div>
                </div>
              )}

              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-gray-400 text-sm mb-2">Nama Produk</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      className="w-full bg-white/10 border border-white/20 text-white rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Minimal Investasi (Rp)</label>
                    <input
                      type="number"
                      value={editForm.minimum}
                      onChange={(e) => setEditForm({...editForm, minimum: e.target.value})}
                      className="w-full bg-white/10 border border-white/20 text-white rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      min="0"
                      step="1000"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Maksimal Investasi (Rp)</label>
                    <input
                      type="number"
                      value={editForm.maximum}
                      onChange={(e) => setEditForm({...editForm, maximum: e.target.value})}
                      className="w-full bg-white/10 border border-white/20 text-white rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      min="0"
                      step="1000"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Persentase Return (%)</label>
                    <input
                      type="number"
                      value={editForm.percentage}
                      onChange={(e) => setEditForm({...editForm, percentage: e.target.value})}
                      className="w-full bg-white/10 border border-white/20 text-white rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      min="0"
                      step="0.1"
                      required
                    />
                    <p className="text-gray-500 text-xs mt-1">Return per hari</p>
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Durasi (Hari)</label>
                    <input
                      type="number"
                      value={editForm.duration}
                      onChange={(e) => setEditForm({...editForm, duration: e.target.value})}
                      className="w-full bg-white/10 border border-white/20 text-white rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      min="1"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-400 text-sm mb-2">Status Produk</label>
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                      className="w-full bg-white/10 border border-white/20 text-white rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all dark-select"
                    >
                      <option value="Active">Aktif</option>
                      <option value="Inactive">Tidak Aktif</option>
                    </select>
                  </div>
                </div>

                {/* ROI Preview */}
                <div className="bg-white/5 rounded-2xl p-6">
                  <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Icon icon="mdi:calculator" className="text-green-400 w-5 h-5" />
                    Preview ROI
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4">
                      <p className="text-gray-400 text-sm mb-2">ROI Minimal</p>
                      <div className="text-green-400 font-bold text-lg">
                        +{formatCurrency(calculateROI(Number(editForm.minimum), Number(editForm.percentage), Number(editForm.duration)))}
                      </div>
                      <p className="text-gray-500 text-xs">
                        Total: {formatCurrency(Number(editForm.minimum) + calculateROI(Number(editForm.minimum), Number(editForm.percentage), Number(editForm.duration)))}
                      </p>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-4">
                      <p className="text-gray-400 text-sm mb-2">ROI Maksimal</p>
                      <div className="text-purple-400 font-bold text-lg">
                        +{formatCurrency(calculateROI(Number(editForm.maximum), Number(editForm.percentage), Number(editForm.duration)))}
                      </div>
                      <p className="text-gray-500 text-xs">
                        Total: {formatCurrency(Number(editForm.maximum) + calculateROI(Number(editForm.maximum), Number(editForm.percentage), Number(editForm.duration)))}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-3 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 disabled:scale-100"
                  >
                    {saving ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <Icon icon="mdi:content-save" className="w-5 h-5" />
                    )}
                    {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-2xl flex items-center justify-center gap-2 transition-all"
                  >
                    <Icon icon="mdi:close" className="w-5 h-5" />
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

// Stats Card Component
function StatCard({ title, value, icon, color }) {
  const colorClasses = {
    blue: { bg: 'from-blue-600 to-cyan-600', text: 'text-blue-400' },
    green: { bg: 'from-green-600 to-emerald-600', text: 'text-green-400' },
    red: { bg: 'from-red-600 to-pink-600', text: 'text-red-400' }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 hover:bg-white/10 hover:scale-105 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-r ${colorClasses[color].bg} rounded-xl flex items-center justify-center`}>
          <Icon icon={icon} className="w-6 h-6 text-white" />
        </div>
      </div>
      <div>
        <h3 className="text-gray-400 text-sm font-medium mb-2">{title}</h3>
        <div className="text-2xl font-bold text-white">{value.toLocaleString('id-ID')}</div>
      </div>
    </div>
  );
}
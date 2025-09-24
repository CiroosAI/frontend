// pages/about.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Icon } from '@iconify/react';
import { ArrowLeft } from 'lucide-react';
import BottomNavbar from '../components/BottomNavbar';
import Image from 'next/image';

export default function About() {
  const router = useRouter();
  const [applicationData, setApplicationData] = useState(null);

  useEffect(() => {
    const storedApplication = localStorage.getItem('application');
    if (storedApplication) {
      try {
        const parsed = JSON.parse(storedApplication);
        setApplicationData({
          name: parsed.name || 'Vla Devs',
          healthy: parsed.healthy || false,
        });
      } catch (e) {
        setApplicationData({ name: 'Vla Devs', healthy: false });
      }
    } else {
      setApplicationData({ name: 'Vla Devs', healthy: false });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 pb-32">
      <Head>
        <title>{applicationData?.name || 'Vla Devs'} | Tentang Kami</title>
        <meta name="description" content={`Tentang ${applicationData?.name || 'Vla Devs'}`} />
        <link rel="icon" href="/logo.png" />
      </Head>

      {/* Top Navigation - Following portfolio style */}
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
              <Icon icon="mdi:information" className="text-xl text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Tentang Kami</h1>
            </div>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-800/60 to-pink-600/60 backdrop-blur-xl rounded-3xl p-6 mb-6 border border-purple-400/30 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-yellow-400/20 to-pink-400/20 rounded-full blur-xl"></div>
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-lg"></div>
          
          <div className="flex justify-between items-center mb-4 relative z-10">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-xl border border-purple-400/30">
<Image 
  src="/logo.png" 
  alt="About Our Company" 
  width={800}    // Set appropriate width
  height={400}   // Set appropriate height
  className="w-full h-auto"
  priority       // Optional: if it's above the fold
/>              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Stoneform</h2>
                <p className="text-purple-200 text-sm">Platform Investasi Properti Premium</p>
              </div>
            </div>
          </div>
        </div>

        {/* About Content */}
        <div className="bg-gradient-to-br from-purple-800/50 to-pink-600/40 backdrop-blur-xl rounded-3xl p-5 mb-6 border border-purple-400/30 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-pink-400/10 to-purple-400/10 rounded-full blur-lg"></div>
          
          <h2 className="text-xl font-bold text-white mb-4 text-center">Tentang Kami</h2>
          
          <div className="space-y-4 text-purple-200 text-sm">
            <div className="bg-purple-900/30 p-4 rounded-2xl border border-purple-400/20">
              <h3 className="text-cyan-400 font-semibold mb-3 flex items-center gap-2">
                <Icon icon="mdi:earth" className="w-5 h-5" />
                Latar Belakang Berdirinya Platform STONEFORM
              </h3>
              <p>
                STONEFORM adalah platform investasi yang berpusat di London, United Kingdom, didirikan oleh Ukrit Thaweerat dengan visi menciptakan akses investasi properti premium bagi semua kalangan.
              </p>
              <p className="mt-2">
                Platform ini lahir untuk menghapus hambatan tradisional dalam kepemilikan properti, sehingga investor global dapat berpartisipasi dengan modal yang lebih terjangkau namun tetap mendapatkan potensi keuntungan yang signifikan.
              </p>
            </div>
            
            <div className="bg-purple-900/30 p-4 rounded-2xl border border-purple-400/20">
              <h3 className="text-cyan-400 font-semibold mb-3 flex items-center gap-2">
                <Icon icon="mdi:target" className="w-5 h-5" />
                Tujuan Pendirian
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Icon icon="mdi:numeric-1-circle" className="text-green-400 w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span><span className="font-semibold">Memperluas Akses Investasi</span> - Memberikan kesempatan bagi investor di Indonesia untuk memiliki bagian dari properti strategis.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon icon="mdi:numeric-2-circle" className="text-green-400 w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span><span className="font-semibold">Meningkatkan Likuiditas</span> - Proses investasi yang cepat dan fleksibel, memungkinkan keluar-masuk investasi dengan mudah.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon icon="mdi:numeric-3-circle" className="text-green-400 w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span><span className="font-semibold">Transparansi & Efisiensi</span> - Laporan kinerja berkala untuk memantau perkembangan aset secara jelas.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon icon="mdi:numeric-4-circle" className="text-green-400 w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span><span className="font-semibold">Keamanan & Kepatuhan</span> - Mematuhi regulasi investasi internasional dan menerapkan sistem keamanan yang ketat.</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-purple-900/30 p-4 rounded-2xl border border-purple-400/20">
              <h3 className="text-cyan-400 font-semibold mb-3 flex items-center gap-2">
                <Icon icon="mdi:diamond-stone" className="w-5 h-5" />
                Nilai Utama STONEFORM
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Icon icon="mdi:earth" className="text-blue-400 w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span><span className="font-semibold">Akses Global</span> - Terbuka untuk investor dari berbagai negara.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon icon="mdi:office-building" className="text-blue-400 w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span><span className="font-semibold">Kualitas Aset Premium</span> - Fokus pada properti bernilai tinggi dengan prospek pertumbuhan.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon icon="mdi:chart-bar" className="text-blue-400 w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span><span className="font-semibold">Manajemen Profesional</span> - Dikelola oleh tim berpengalaman di bidang investasi digital dan keuangan.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon icon="mdi:handshake" className="text-blue-400 w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span><span className="font-semibold">Inklusif</span> - Membuka peluang investasi bagi siapa saja, tanpa batasan latar belakang.</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-purple-900/30 p-4 rounded-2xl border border-purple-400/20">
              <h3 className="text-cyan-400 font-semibold mb-3 flex items-center gap-2">
                <Icon icon="mdi:lightbulb-on" className="w-5 h-5" />
                Kesimpulan
              </h3>
              <p>
                STONEFORM hadir untuk menjadi penghubung antara pasar properti kelas atas dan investor global. Dengan pengelolaan yang profesional, transparansi penuh, serta komitmen pada keamanan, STONEFORM menciptakan peluang investasi yang aman, menguntungkan, dan dapat diakses oleh semua orang.
              </p>
            </div>
          </div>
        </div>

        {/* Legal Certificates Section */}
        <div className="bg-gradient-to-br from-purple-800/50 to-pink-600/40 backdrop-blur-xl rounded-3xl p-5 mb-6 border border-purple-400/30 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-lg"></div>
          
          <h2 className="text-xl font-bold text-white mb-4 text-center">Sertifikat Legal</h2>
          
          <div className="space-y-6">
            {/* Ministry of Law Certificate */}
            <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 p-4 rounded-2xl border border-blue-400/20">
              <div className="flex items-center gap-2 mb-3">
                <Icon icon="mdi:government" className="w-5 h-5 text-blue-400" />
                <h3 className="text-cyan-400 font-semibold">SURAT KETERANGAN PENDIRIAN PERUSAHAAN</h3>
              </div>
              
              <div className="relative w-full h-64 rounded-xl overflow-hidden mb-3 border border-blue-400/30">
                <Image
                  src="/company-certificate.jpg"
                  alt="Company Certificate"
                  fill
                  className="object-contain"
                />
              </div>
              
              <div className="text-center">
                <p className="text-white font-bold text-sm">PT STONEFORM INDONESIA</p>
                <p className="text-blue-300 text-xs">Berkedudukan di JAKARTA PUSAT</p>
                <p className="text-blue-300 text-xs mt-2">NOMOR: AHU-000985.AH.01.31.Tahun 2025</p>
                <p className="text-blue-300 text-xs">Tanggal Diterbitkan: 05 September 2025</p>
              </div>
            </div>
            
            {/* Tax Office Certificate */}
            <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 p-4 rounded-2xl border border-green-400/20">
              <div className="flex items-center gap-2 mb-3">
                <Icon icon="mdi:calculator" className="w-5 h-5 text-green-400" />
                <h3 className="text-cyan-400 font-semibold">NOMOR POKOK WAJIB PAJAK</h3>
              </div>
              
              <div className="relative w-full h-64 rounded-xl overflow-hidden mb-3 border border-green-400/30">
                <Image
                  src="/taxpayer-identification-number.jpg"
                  alt="Taxpayer Identification Number"
                  fill
                  className="object-contain"
                />
              </div>
              
              <div className="text-center">
                <p className="text-white font-bold text-lg">0270 0886 1311 1000</p>
                <p className="text-green-300 font-bold">STONEFORM INDONESIA</p>
                <p className="text-green-300 text-xs mt-2">Tanggal Terdaftar: 09/09/2025</p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-purple-300 text-xs flex items-center justify-center gap-2 mb-4">
          <Icon icon="mdi:copyright" className="w-3 h-3" />
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
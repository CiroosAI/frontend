import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { isMobileApp } from '../utils/mobileAppDetection';

/**
 * AppInstallButton Component
 * Handles app installation logic for both PWA and mobile app redirect
 */
export default function AppInstallButton({ applicationData, className = "" }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInMobileApp, setIsInMobileApp] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    setIsInMobileApp(isMobileApp());
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Skip PWA detection if already in mobile app
    if (isInMobileApp) {
      setIsInstalled(true);
      setIsInstallable(false);
      return;
    }

    // Check jika sudah terinstall
    const checkInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches || 
          window.navigator.standalone === true) {
        setIsInstalled(true);
        setIsInstallable(false);
        return true;
      }
      return false;
    };

    if (checkInstalled()) return;

    // Listen untuk install prompt
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      console.log('PWA install prompt available');
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Listen untuk app installed
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      console.log('PWA was installed');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, [isInMobileApp]);

  const handleInstallApp = async () => {
    if (isInstalled || isInMobileApp) {
      alert('Aplikasi sudah terinstall! ✅');
      return;
    }

    // Jika ada link_app, redirect ke Play Store
    if (applicationData?.link_app) {
      window.open(applicationData.link_app, '_blank');
      return;
    }

    // Fallback ke PWA install
    if (!deferredPrompt) {
      showManualInstallGuide();
      return;
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted PWA install');
        setDeferredPrompt(null);
        setIsInstallable(false);
        setIsInstalled(true);
      } else {
        console.log('User dismissed PWA install');
      }
    } catch (error) {
      console.error('Error installing PWA:', error);
    }
  };

  const showManualInstallGuide = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isIOS) {
      alert(
        '📱 Cara Install di iPhone/iPad:\n\n' +
        '1. Tap tombol Share (kotak dengan panah)\n' +
        '2. Scroll dan pilih "Add to Home Screen"\n' +
        '3. Tap "Add"\n' +
        '4. Icon akan muncul di home screen!'
      );
    } else {
      alert(
        '📱 Cara Install Manual:\n\n' +
        'Android Chrome:\n' +
        '1. Tap menu ⋯ (3 titik)\n' +
        '2. Pilih "Install app" atau "Tambahkan ke layar utama"\n' +
        '3. Tap "Install"\n\n' +
        'Desktop:\n' +
        '1. Klik icon ⊕ di address bar\n' +
        '2. Atau menu → Install Ciroos AI'
      );
    }
  };

  // Don't render if in mobile app
  if (isInMobileApp) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#F45D16] to-[#0058BC] rounded-2xl blur opacity-20"></div>
      <div className="relative bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] rounded-2xl p-5 border border-white/10 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isInstalled ? 'bg-[#F45D16]/10' : 
            isInstallable ? 'bg-green-500/10' : 
            'bg-green-500/10'
          }`}>
            <Icon 
              icon={
                isInstalled ? "mdi:check-circle" : 
                isInstallable ? "mdi:cellphone-arrow-down" : 
                "mdi:android"
              } 
              className={`w-6 h-6 ${
                isInstalled ? 'text-[#F45D16]' : 'text-green-400'
              }`} 
            />
          </div>
          <h3 className="text-white font-bold text-base">
            {isInstalled
              ? `${applicationData?.name || 'Ciroos'} Terinstall`
              : isInstallable
                ? `${applicationData?.name || 'Ciroos'} APK`
                : `${applicationData?.name || 'Ciroos'} APK`
            }
          </h3>
        </div>
        
        <p className="text-white/60 text-xs mb-4">
          {isInstalled 
            ? 'Aplikasi sudah terinstall di perangkat Anda ✅'
            : isInstallable 
              ? 'Install aplikasi untuk akses lebih cepat & mudah'
              : 'Install untuk akses lebih cepat & mudah'
          }
        </p>
        
        <button
          onClick={handleInstallApp}
          disabled={isInstalled && !applicationData?.link_app}
          className={`inline-flex items-center gap-2 ${
            isInstalled
              ? 'bg-[#F45D16]/20 text-[#F45D16] cursor-default border border-[#F45D16]/30'
              : isInstallable || applicationData?.link_app
                ? 'bg-gradient-to-r from-[#F45D16] to-[#FF6B35] hover:from-[#d74e0f] hover:to-[#F45D16] hover:scale-[1.02] active:scale-[0.98]'
                : 'bg-white/5 cursor-not-allowed border border-white/10'
          } text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg`}
        >
          <Icon 
            icon={
              isInstalled ? "mdi:check-circle" : 
              isInstallable ? "mdi:download-circle" : 
              "mdi:download"
            } 
            className="w-5 h-5" 
          />
          {isInstalled ? 'TERINSTALL' : 
           isInstallable ? 'INSTALL NOW' : 
           'INSTALL NOW'}
        </button>

        {isInstalled && (
          <p className="text-[#F45D16] text-[10px] mt-3 flex items-center justify-center gap-1">
            <Icon icon="mdi:information" className="w-3 h-3" />
            Cek home screen Anda
          </p>
        )}
      </div>
    </div>
  );
}

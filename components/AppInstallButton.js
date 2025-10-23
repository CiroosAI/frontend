import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { isMobileApp, isIOS, isAndroid, isDesktop, isAppInstalled } from '../utils/mobileAppDetection';
import CustomAlert from './CustomAlert';

/**
 * AppInstallButton Component
 * Smart app installation button that detects if app is installed
 * Only shows for browser users, hidden for mobile app users
 */
export default function AppInstallButton({ applicationData, className = "" }) {
  const [isInMobileApp, setIsInMobileApp] = useState(false);
  const [deviceType, setDeviceType] = useState({ isIOS: false, isAndroid: false, isDesktop: false });
  const [isAppInstalledState, setIsAppInstalledState] = useState(false);
  const [isCheckingInstallation, setIsCheckingInstallation] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({});

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    setIsInMobileApp(isMobileApp());
    setDeviceType({
      isIOS: isIOS(),
      isAndroid: isAndroid(),
      isDesktop: isDesktop()
    });

    // Check if app is installed
    const checkAppInstallation = async () => {
      try {
        const installed = await isAppInstalled();
        setIsAppInstalledState(installed);
      } catch (error) {
        console.log('Error checking app installation:', error);
        setIsAppInstalledState(false);
      } finally {
        setIsCheckingInstallation(false);
      }
    };

    checkAppInstallation();
  }, []);

  const handleAppAction = () => {
    // Jika sudah terinstall, buka aplikasi
    if (isAppInstalledState) {
      openApp();
      return;
    }

    // Jika belum terinstall, install aplikasi
    handleInstallApp();
  };

  const openApp = () => {
    if (deviceType.isAndroid) {
      // Android: Gunakan intent untuk membuka aplikasi
      const intent = `intent://${window.location.host}${window.location.pathname}#Intent;scheme=https;package=ca.ciroos;end`;
      window.location.href = intent;
    } else if (deviceType.isIOS) {
      // iOS: Gunakan custom URL scheme atau fallback ke PWA
      const customScheme = `ciroos://${window.location.pathname}`;
      
      // Try custom scheme first
      const testLink = document.createElement('a');
      testLink.href = customScheme;
      testLink.style.display = 'none';
      document.body.appendChild(testLink);
      testLink.click();
      document.body.removeChild(testLink);
      
      // Fallback setelah timeout
      setTimeout(() => {
        // Jika tidak bisa buka custom scheme, buka PWA
        if (window.matchMedia('(display-mode: standalone)').matches) {
          // Already in PWA, do nothing
        } else {
          showIOSInstallGuide();
        }
      }, 1000);
    }
  };

  const handleInstallApp = () => {
    // Jika Android dan ada link_app, redirect ke Play Store
    if (deviceType.isAndroid && applicationData?.link_app) {
      window.open(applicationData.link_app, '_blank');
      return;
    }

    // Jika iOS, tampilkan panduan PWA
    if (deviceType.isIOS) {
      showIOSInstallGuide();
      return;
    }

    // Jika desktop, tampilkan alert khusus
    if (deviceType.isDesktop) {
      showDesktopAlert();
      return;
    }

    // Jika tidak ada link_app, tampilkan pesan
    showNoLinkAlert();
  };

  const showIOSInstallGuide = () => {
    setAlertConfig({
      title: 'Install Aplikasi di iPhone/iPad',
      message: 'Untuk menginstall aplikasi di iPhone/iPad:\n\n1. Tap tombol Share (kotak dengan panah) di bawah\n2. Scroll dan pilih "Add to Home Screen"\n3. Tap "Add"\n4. Icon aplikasi akan muncul di home screen Anda!',
      type: 'info',
      confirmText: 'Mengerti'
    });
    setShowAlert(true);
  };

  const showDesktopAlert = () => {
    setAlertConfig({
      title: 'Install Hanya untuk Mobile',
      message: 'Aplikasi hanya tersedia untuk perangkat mobile (Android & iOS).\n\nUntuk Android: Download dari Play Store\nUntuk iOS: Gunakan "Add to Home Screen" di Safari',
      type: 'warning',
      confirmText: 'Mengerti'
    });
    setShowAlert(true);
  };

  const showNoLinkAlert = () => {
    setAlertConfig({
      title: 'Link Download Belum Tersedia',
      message: 'Link download aplikasi belum tersedia. Silakan hubungi admin untuk informasi lebih lanjut.',
      type: 'error',
      confirmText: 'OK'
    });
    setShowAlert(true);
  };

  // Jangan tampilkan jika di aplikasi mobile
  if (isInMobileApp) {
    return null;
  }

  // Tentukan icon dan text berdasarkan status
  const getButtonConfig = () => {
    if (isCheckingInstallation) {
      return {
        icon: 'mdi:loading',
        text: 'MENGECEK...',
        subtitle: 'Checking installation',
        isLoading: true
      };
    }

    if (isAppInstalledState) {
      return {
        icon: 'mdi:open-in-app',
        text: 'LANJUTKAN DI APLIKASI',
        subtitle: 'Buka aplikasi Ciroos',
        isLoading: false
      };
    }

    if (deviceType.isIOS) {
      return {
        icon: 'mdi:apple',
        text: 'INSTALL PWA',
        subtitle: 'Add to Home Screen',
        isLoading: false
      };
    } else if (deviceType.isAndroid) {
      return {
        icon: 'mdi:android',
        text: 'DOWNLOAD APK',
        subtitle: 'Play Store',
        isLoading: false
      };
    } else {
      return {
        icon: 'mdi:cellphone',
        text: 'INSTALL APP',
        subtitle: 'Mobile Only',
        isLoading: false
      };
    }
  };

  const buttonConfig = getButtonConfig();

  return (
    <>
      <div className={`relative ${className}`}>
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#F45D16] to-[#0058BC] rounded-2xl blur opacity-20"></div>
        <div className="relative bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] rounded-2xl p-5 border border-white/10 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isAppInstalledState ? 'bg-green-500/10' : 'bg-green-500/10'
            }`}>
              <Icon 
                icon={buttonConfig.icon} 
                className={`w-6 h-6 ${
                  isAppInstalledState ? 'text-green-400' : 'text-green-400'
                } ${buttonConfig.isLoading ? 'animate-spin' : ''}`} 
              />
            </div>
            <h3 className="text-white font-bold text-base">
              {applicationData?.name || 'Ciroos'} {isAppInstalledState ? 'App' : deviceType.isIOS ? 'PWA' : 'APK'}
            </h3>
          </div>
          
          <p className="text-white/60 text-xs mb-4">
            {isAppInstalledState 
              ? 'Aplikasi sudah terinstall, lanjutkan menggunakan aplikasi'
              : deviceType.isIOS 
                ? 'Install aplikasi untuk akses lebih cepat & mudah'
                : deviceType.isAndroid
                  ? 'Download aplikasi untuk akses lebih cepat & mudah'
                  : 'Aplikasi tersedia untuk perangkat mobile'
            }
          </p>
          
          <button
            onClick={handleAppAction}
            disabled={isCheckingInstallation}
            className={`inline-flex items-center gap-2 ${
              isAppInstalledState
                ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                : 'bg-gradient-to-r from-[#F45D16] to-[#FF6B35] hover:from-[#d74e0f] hover:to-[#F45D16]'
            } hover:scale-[1.02] active:scale-[0.98] text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg ${
              isCheckingInstallation ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Icon icon={buttonConfig.icon} className={`w-5 h-5 ${buttonConfig.isLoading ? 'animate-spin' : ''}`} />
            {buttonConfig.text}
          </button>

          <p className="text-white/40 text-[10px] mt-3 flex items-center justify-center gap-1">
            <Icon icon="mdi:information" className="w-3 h-3" />
            {buttonConfig.subtitle}
          </p>
        </div>
      </div>

      {/* Custom Alert */}
      <CustomAlert
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        {...alertConfig}
      />
    </>
  );
}
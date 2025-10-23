/**
 * Utility functions for detecting mobile app environment
 */

/**
 * Detect if the current environment is a mobile app (TWA/WebView)
 * @returns {boolean} True if running in mobile app
 */
export const isMobileApp = () => {
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent.toLowerCase();
  
  // Check for TWA (Trusted Web Activity) indicators
  const isTWA = userAgent.includes('wv') || // WebView
               userAgent.includes('version/') && userAgent.includes('chrome/') && !userAgent.includes('edg/') || // Chrome WebView
               window.navigator.standalone === true || // iOS standalone
               window.matchMedia('(display-mode: standalone)').matches; // PWA standalone
  
  // Check for specific app indicators
  const isInApp = userAgent.includes('ciroos') || // Custom app user agent
                 userAgent.includes('mobile app') ||
                 document.referrer.includes('android-app://') ||
                 document.referrer.includes('ios-app://');
  
  return isTWA || isInApp;
};

/**
 * Get mobile app detection info
 * @returns {object} Detection information
 */
export const getMobileAppInfo = () => {
  if (typeof window === 'undefined') {
    return {
      isMobileApp: false,
      userAgent: '',
      referrer: '',
      displayMode: 'browser'
    };
  }
  
  const userAgent = navigator.userAgent;
  const referrer = document.referrer;
  const displayMode = window.matchMedia('(display-mode: standalone)').matches ? 'standalone' : 'browser';
  
  return {
    isMobileApp: isMobileApp(),
    userAgent,
    referrer,
    displayMode,
    isStandalone: window.navigator.standalone === true
  };
};

/**
 * Check if PWA is installable
 * @returns {boolean} True if PWA can be installed
 */
export const isPWAInstallable = () => {
  if (typeof window === 'undefined') return false;
  
  // Skip if already in mobile app
  if (isMobileApp()) return false;
  
  // Check if already installed
  if (window.matchMedia('(display-mode: standalone)').matches || 
      window.navigator.standalone === true) {
    return false;
  }
  
  return true;
};

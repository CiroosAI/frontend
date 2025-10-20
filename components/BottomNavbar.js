// components/BottomNavbar.js
import { Home, Users, CreditCard, User } from 'lucide-react';
import { useRouter } from 'next/router';
import { Icon } from '@iconify/react';

const navItems = [
  { label: 'Home', icon: Home, href: '/dashboard', key: 'dashboard' },
  { label: 'Komisi', icon: Users, href: '/referral', key: 'referral' },
  { label: 'Testimoni', icon: CreditCard, href: '/forum', key: 'forum' },
  { label: 'Profil', icon: User, href: '/profile', key: 'profile' },
];

export default function BottomNavbar() {
  const router = useRouter();

  const renderNavItem = (item) => {
    const IconComponent = item.icon;
    const isActive = router.pathname === item.href ||
                    (item.key === 'dashboard' && router.pathname === '/') ||
                    (item.href !== '/dashboard' && router.pathname.startsWith(item.href));
    
    return (
      <button
        key={item.key}
        onClick={() => router.push(item.href)}
        className={`relative flex flex-col items-center justify-center py-3 px-2 rounded-xl transition-all duration-300 group flex-1 ${
          isActive
            ? 'text-white'
            : 'text-white/50 hover:text-white/80 active:scale-95'
        }`}
      >
        {isActive && (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-[#F45D16] to-[#FF6B35] rounded-xl opacity-20 blur"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#F45D16]/30 to-[#FF6B35]/30 rounded-xl"></div>
          </>
        )}
        <div className={`relative z-10 transition-all duration-300 ${isActive ? 'scale-110 mb-1' : 'group-hover:scale-105 mb-1'}`}>
          <IconComponent 
            className={`w-5 h-5 transition-all duration-300 ${isActive ? 'drop-shadow-[0_0_10px_rgba(244,93,22,0.7)]' : ''}`} 
            strokeWidth={isActive ? 2.5 : 2} 
          />
        </div>
        <span className={`relative z-10 text-[10px] font-medium transition-all duration-300 ${isActive ? 'font-bold' : 'font-normal'}`}>
          {item.label}
        </span>
        {isActive && (
          <div className="absolute -bottom-1 w-1.5 h-1.5 bg-[#F45D16] rounded-full shadow-[0_0_10px_rgba(244,93,22,0.9)]"></div>
        )}
      </button>
    );
  };

  return (
    <div className="w-full py-2 px-2">
      <div className="relative">
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#F45D16]/20 via-[#0058BC]/20 to-[#F45D16]/20 rounded-2xl blur-xl"></div>
        
        {/* Main Navigation Bar */}
        <div className="relative bg-gradient-to-br from-[#1A1A1A] via-[#0F0F0F] to-[#1A1A1A] backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl flex justify-around items-center p-1.5">
          
          {/* Left Navigation Items */}
          <div className="flex justify-around w-full">
            {navItems.slice(0, 2).map(renderNavItem)}
          </div>

          {/* Center Spin Wheel Button */}
          <div className="relative -mt-8 z-10 px-2">
            <button
              onClick={() => router.push('/spin-wheel')}
              className="relative w-16 h-16 bg-gradient-to-br from-[#F45D16] to-[#FF6B35] rounded-full flex items-center justify-center border-4 border-[#0A0A0A] shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 group"
            >
              {/* Rotating Border Glow */}
              <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-pulse"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-[#F45D16] to-[#FF6B35] rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
              
              {/* Icon */}
              <Icon 
                icon="mdi:dharmachakra" 
                className="relative w-8 h-8 text-white animate-spin" 
                style={{ animationDuration: '5s' }} 
              />
              
              {/* Pulse Ring */}
              <div className="absolute inset-0 rounded-full border-2 border-[#F45D16]/50 animate-ping"></div>
            </button>
          </div>

          {/* Right Navigation Items */}
          <div className="flex justify-around w-full">
            {navItems.slice(2).map(renderNavItem)}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        @keyframes ping {
          75%, 100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
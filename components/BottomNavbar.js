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
            : 'text-[#EDE5D9]/60 hover:text-[#EDE5D9] active:scale-95'
        }`}
      >
        {isActive && (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-[#F45D11] to-[#FF6B35] rounded-xl opacity-20 blur-sm"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#F45D12]/30 to-[#FF6B35]/30 rounded-xl"></div>
          </>
        )}
        <div className={`relative z-10 transition-all duration-300 ${isActive ? 'scale-110 mb-1' : 'group-hover:scale-105 mb-1'}`}>
          <IconComponent className={`w-5 h-5 transition-all duration-300 ${isActive ? 'drop-shadow-[0_0_8px_rgba(244,93,22,0.6)]' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
        </div>
        <span className={`relative z-10 text-[10px] font-medium transition-all duration-300 ${isActive ? 'font-bold' : 'font-normal'}`}>
          {item.label}
        </span>
        {isActive && (
          <div className="absolute -bottom-1 w-1 h-1 bg-[#F45D16] rounded-full shadow-[0_0_8px_rgba(244,93,22,0.8)]"></div>
        )}
      </button>
    );
  };

  return (
    <div className="w-full py-2">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#F45D16]/20 via-[#0058BC]/20 to-[#F45D16]/20 rounded-2xl blur-xl"></div>
        
        <div className="relative bg-[#0A0A0A]/80 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl flex justify-around items-center p-1">
          <div className="flex justify-around w-full">
            {navItems.slice(0, 2).map(renderNavItem)}
          </div>

          <div className="relative -mt-8 z-10">
            <button
              onClick={() => router.push('/spin-wheel')}
              className="relative w-16 h-16 bg-gradient-to-br from-[#F45D16] to-[#FF6B35] rounded-full flex items-center justify-center border-4 border-[#1a1a1a] shadow-lg hover:scale-105 transition-transform duration-300"
            >
              <Icon icon="mdi:dharmachakra" className="w-8 h-8 text-white animate-spin" style={{ animationDuration: '5s' }} />
              <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-pulse"></div>
            </button>
          </div>

          <div className="flex justify-around w-full">
            {navItems.slice(2).map(renderNavItem)}
          </div>
        </div>
      </div>
    </div>
  );
}

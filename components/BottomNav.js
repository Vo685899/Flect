import Link from 'next/link';
import { useRouter } from 'next/router';

const tabs = [
  { href:'/home',     label:'Home',
    icon: <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" strokeWidth="1.8"/> },
  { href:'/timeline', label:'Timeline',
    icon: <><rect x="3" y="4" width="4" height="4" rx="1" strokeWidth="1.8"/><rect x="10" y="4" width="4" height="4" rx="1" strokeWidth="1.8"/><rect x="17" y="4" width="4" height="4" rx="1" strokeWidth="1.8"/><rect x="3" y="11" width="4" height="4" rx="1" strokeWidth="1.8"/><rect x="10" y="11" width="4" height="4" rx="1" strokeWidth="1.8"/><rect x="17" y="11" width="4" height="4" rx="1" strokeWidth="1.8"/><rect x="3" y="18" width="4" height="4" rx="1" strokeWidth="1.8"/><rect x="10" y="18" width="4" height="4" rx="1" strokeWidth="1.8"/></> },
  { href:'/tracker',  label:'Tracker',
    icon: <><polyline points="3 12 7 8 11 14 15 6 19 10 21 8" strokeWidth="1.8"/></> },
  { href:'/profile',  label:'Profile',
    icon: <><circle cx="12" cy="7" r="4" strokeWidth="1.8"/><path d="M4 21v-1a8 8 0 0116 0v1" strokeWidth="1.8"/></> },
];

export default function BottomNav() {
  const { pathname } = useRouter();
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50"
      style={{ background:'rgba(245,240,232,0.96)', borderTop:'2px solid #E8E0D0', backdropFilter:'blur(16px)', paddingBottom:'max(12px,env(safe-area-inset-bottom))' }}>
      <div className="flex items-center pt-3 pb-1">
        {tabs.map(({ href, label, icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} className="flex-1 flex flex-col items-center gap-1">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${active ? 'bg-coral' : ''}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke={active ? '#F5F0E8' : '#A8A29E'} strokeLinecap="round" strokeLinejoin="round">
                  {icon}
                </svg>
              </div>
              <span className={`text-[10px] font-semibold transition-colors ${active ? 'text-coral' : 'text-ink-4'}`}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

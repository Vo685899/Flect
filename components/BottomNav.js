import Link from 'next/link';
import { useRouter } from 'next/router';

const tabs = [
  { href:'/home',     label:'Home',
    icon: <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" strokeWidth="1.8"/> },
  { href:'/timeline', label:'Timeline',
    icon: <><rect x="3" y="4" width="4" height="4" rx="1" strokeWidth="1.8"/><rect x="10" y="4" width="4" height="4" rx="1" strokeWidth="1.8"/><rect x="17" y="4" width="4" height="4" rx="1" strokeWidth="1.8"/><rect x="3" y="11" width="4" height="4" rx="1" strokeWidth="1.8"/><rect x="10" y="11" width="4" height="4" rx="1" strokeWidth="1.8"/><rect x="17" y="11" width="4" height="4" rx="1" strokeWidth="1.8"/><rect x="3" y="18" width="4" height="4" rx="1" strokeWidth="1.8"/><rect x="10" y="18" width="4" height="4" rx="1" strokeWidth="1.8"/></> },
  { href:'/tracker',  label:'Tracker',
    icon: <polyline points="3 12 7 8 11 14 15 6 19 10 21 8" strokeWidth="1.8"/> },
  { href:'/profile',  label:'Profile',
    icon: <><circle cx="12" cy="7" r="4" strokeWidth="1.8"/><path d="M4 21v-1a8 8 0 0116 0v1" strokeWidth="1.8"/></> },
];

export default function BottomNav() {
  const { pathname } = useRouter();
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-center"
      style={{ maxWidth: '100vw' }}
    >
      <div
        className="w-full"
        style={{
          maxWidth: 430,
          background: 'rgba(245,240,232,0.97)',
          borderTop: '2px solid #E8E0D0',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
        }}
      >
        <div className="flex items-center pt-3 pb-1">
          {tabs.map(({ href, label, icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className="flex-1 flex flex-col items-center gap-1 py-1"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                  style={{ background: active ? '#C4794A' : 'transparent' }}
                >
                  <svg
                    width="20" height="20" viewBox="0 0 24 24"
                    fill="none"
                    stroke={active ? '#F5F0E8' : '#A8A29E'}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {icon}
                  </svg>
                </div>
                <span
                  className="text-[10px] font-semibold transition-colors"
                  style={{ color: active ? '#C4794A' : '#A8A29E' }}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

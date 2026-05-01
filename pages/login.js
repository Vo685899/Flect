import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
import { Button, Input } from '../components/UI';

const DEMO_EMAIL = 'flectdemo@gmail.com';
const DEMO_PASSWORD = 'FlectDemo';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [error, setError] = useState('');

  const handle = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError('Incorrect email or password.'); setLoading(false); }
    else router.replace('/home');
  };

  const handleDemo = async () => {
    setDemoLoading(true); setError('');
    const { error } = await supabase.auth.signInWithPassword({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
    });
    if (error) {
      setError('Demo account unavailable. Please try again.');
      setDemoLoading(false);
    } else {
      router.replace('/home');
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col px-6 pt-20 pb-10 page-enter">
      <div className="mb-10">
        <p className="font-display-i text-coral text-sm mb-3">your daily reflection</p>
        <h1 className="font-display text-5xl text-ink leading-tight mb-2">Welcome<br/>back.</h1>
        <p className="text-ink-3 text-sm">Sign in to continue your practice.</p>
      </div>

      {/* Demo button */}
      <button
        onClick={handleDemo}
        disabled={demoLoading}
        className="w-full py-4 rounded-2xl mb-6 flex items-center justify-center gap-3 font-semibold text-[15px] transition-all active:scale-[0.98] border-2"
        style={{ background: 'linear-gradient(135deg, #EDE7D9, #E8E0D0)', borderColor: '#C4794A', color: '#C4794A' }}
      >
        {demoLoading ? (
          <span className="w-4 h-4 border-2 border-coral border-t-transparent rounded-full animate-spin"/>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            Try a Live Demo
          </>
        )}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-paper"/>
        <span className="text-ink-4 text-xs font-semibold uppercase tracking-wider">or sign in</span>
        <div className="flex-1 h-px bg-paper"/>
      </div>

      <form onSubmit={handle} className="flex flex-col">
        <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required/>
        <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Your password" autoComplete="current-password" required/>
        {error && <p className="text-red-500 text-sm mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}
        <Button type="submit" loading={loading}>Sign In</Button>
        <p className="text-center text-ink-3 text-sm mt-5">
          New here? <Link href="/signup" className="text-coral font-semibold">Create an account</Link>
        </p>
      </form>
    </div>
  );
}

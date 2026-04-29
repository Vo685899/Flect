import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
import { Button, Input } from '../components/UI';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handle = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError('Incorrect email or password.'); setLoading(false); }
    else router.replace('/home');
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col px-6 pt-20 pb-10 page-enter">
      <div className="mb-12">
        <p className="font-display-i text-coral text-sm mb-3">your daily reflection</p>
        <h1 className="font-display text-5xl text-ink leading-tight mb-2">Welcome<br/>back.</h1>
        <p className="text-ink-3 text-sm">Sign in to continue your practice.</p>
      </div>
      <form onSubmit={handle} className="flex-1 flex flex-col">
        <Input label="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required/>
        <Input label="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Your password" autoComplete="current-password" required/>
        {error && <p className="text-red-500 text-sm mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}
        <Button type="submit" loading={loading}>Sign In</Button>
        <p className="text-center text-ink-3 text-sm mt-5">
          New here? <Link href="/signup" className="text-coral font-semibold">Create an account</Link>
        </p>
      </form>
    </div>
  );
}

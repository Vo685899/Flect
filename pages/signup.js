import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
import { Button, Input } from '../components/UI';

export default function SignUp() {
  const router = useRouter();
  const [form, setForm] = useState({ displayName:'', email:'', password:'', confirm:'' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));

  const validate = () => {
    const e = {};
    if (!form.displayName.trim()) e.displayName = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    if (!form.password || form.password.length < 6) e.password = 'Minimum 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e); return !Object.keys(e).length;
  };

  const handle = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true); setErrors({});
    try {
      const { data, error } = await supabase.auth.signUp({
        email: form.email.trim().toLowerCase(),
        password: form.password,
        options: { data: { display_name: form.displayName.trim() } },
      });
      if (error) { setErrors({ submit: error.message }); setLoading(false); return; }
      await new Promise(r => setTimeout(r, 1000));
      if (data?.user?.id) {
        await supabase.from('profiles').upsert({ id: data.user.id, display_name: form.displayName.trim() }, { onConflict:'id' });
      }
      router.replace('/home');
    } catch { setErrors({ submit:'Something went wrong. Please try again.' }); setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col px-6 pt-16 pb-10 page-enter">
      <Link href="/login" className="text-ink-3 text-lg mb-8 block w-8">←</Link>
      <div className="mb-8">
        <p className="font-display-i text-coral text-sm mb-3">get started</p>
        <h1 className="font-display text-5xl text-ink leading-tight mb-2">Create your<br/>account.</h1>
      </div>
      <form onSubmit={handle}>
        <Input label="Your Name" value={form.displayName} onChange={set('displayName')} placeholder="Alex Rivera" error={errors.displayName} autoComplete="name"/>
        <Input label="Email" type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" error={errors.email} autoComplete="email"/>
        <Input label="Password" type="password" value={form.password} onChange={set('password')} placeholder="At least 6 characters" error={errors.password} autoComplete="new-password"/>
        <Input label="Confirm Password" type="password" value={form.confirm} onChange={set('confirm')} placeholder="Repeat password" error={errors.confirm} autoComplete="new-password"/>
        {errors.submit && <p className="text-red-500 text-sm mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{errors.submit}</p>}
        <Button type="submit" loading={loading}>Create Account</Button>
        <p className="text-center text-ink-3 text-sm mt-5">
          Already have an account? <Link href="/login" className="text-coral font-semibold">Sign in</Link>
        </p>
      </form>
    </div>
  );
}

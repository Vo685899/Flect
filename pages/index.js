import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../lib/AuthContext';
export default function Index() {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => { if (!loading) router.replace(user ? '/home' : '/login'); }, [user, loading]);
  return (
    <div className="flex items-center justify-center min-h-screen bg-cream">
      <p className="font-display text-5xl text-ink">Flect</p>
    </div>
  );
}

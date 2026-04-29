import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';
import BottomNav from '../components/BottomNav';
import { Card, Button, Input, Textarea, Divider } from '../components/UI';

export default function Profile() {
  const { user, profile, refreshProfile } = useAuth();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ display_name: '', bio: '' });
  const [saving, setSaving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const startEdit = () => { setForm({ display_name: profile?.display_name || '', bio: profile?.bio || '' }); setEditing(true); };

  const handleSave = async () => {
    setSaving(true);
    await supabase.from('profiles').update({ display_name: form.display_name.trim(), bio: form.bio.trim() }).eq('id', user.id);
    await refreshProfile();
    setEditing(false); setSaving(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };

  const handleDelete = async () => {
    setDeleteError(''); setDeleting(true);
    const { error } = await supabase.auth.signInWithPassword({ email: user.email, password: deletePassword });
    if (error) { setDeleteError('Incorrect password.'); setDeleting(false); return; }
    await supabase.from('responses').delete().eq('user_id', user.id);
    await supabase.from('tracker_entries').delete().eq('user_id', user.id);
    await supabase.from('profiles').delete().eq('id', user.id);
    await supabase.auth.signOut();
    router.replace('/login');
  };

  const initial = profile?.display_name?.[0]?.toUpperCase() || 'F';

  return (
    <div className="min-h-screen bg-cream pb-28 page-enter">
      <div className="px-5 pt-14 pb-4 flex justify-between items-end">
        <div>
          <p className="font-display-i text-coral text-sm mb-1">your space</p>
          <h1 className="font-display text-4xl text-ink">Profile</h1>
        </div>
        {!editing && (
          <button onClick={startEdit} className="bg-white border-2 border-paper rounded-xl px-3 py-1.5 text-ink-3 text-xs font-semibold">Edit</button>
        )}
      </div>

      <div className="px-5">
        <div className="mb-5">
          <div className="w-20 h-20 rounded-2xl bg-coral flex items-center justify-center font-display text-3xl font-bold text-cream mb-4">{initial}</div>
          {editing ? (
            <div>
              <Input label="Display Name" value={form.display_name} onChange={e => setForm(f => ({ ...f, display_name: e.target.value }))}/>
              <Textarea label="Bio" value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="A sentence about you..." rows={2}/>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setEditing(false)} className="flex-1">Cancel</Button>
                <Button onClick={handleSave} loading={saving} className="flex-1">Save</Button>
              </div>
            </div>
          ) : (
            <div>
              <p className="font-display text-2xl text-ink">{profile?.display_name || 'Flect User'}</p>
              {profile?.bio && <p className="text-ink-3 text-sm mt-1.5 leading-relaxed">{profile.bio}</p>}
              <p className="text-ink-4 text-xs mt-1">{user?.email}</p>
            </div>
          )}
        </div>

        {!editing && (
          <div className="grid grid-cols-2 gap-2 mb-5">
            <div className="bg-white rounded-2xl p-4 border-2 border-paper text-center">
              <div className="font-display text-3xl" style={{ color: '#D4A847' }}>{profile?.streak || 0}</div>
              <div className="text-[10px] text-ink-4 uppercase tracking-wider font-semibold mt-1">Day Streak</div>
            </div>
            <div className="bg-white rounded-2xl p-4 border-2 border-paper text-center">
              <div className="font-display text-3xl" style={{ color: '#7A9E7E' }}>{profile?.total_responses || 0}</div>
              <div className="text-[10px] text-ink-4 uppercase tracking-wider font-semibold mt-1">Reflections</div>
            </div>
          </div>
        )}

        <Divider/>
        <p className="text-[11px] font-semibold text-ink-4 uppercase tracking-widest mb-2">Account</p>
        <Card>
          <button onClick={handleLogout} className="flex items-center gap-3 w-full py-1.5">
            <span className="text-sm font-semibold" style={{ color: '#C4794A' }}>Sign Out</span>
          </button>
          <Divider/>
          <button onClick={() => setShowDelete(true)} className="flex items-center justify-between w-full py-1.5">
            <span className="text-sm font-semibold text-red-500">Delete Account</span>
            <span className="text-red-400 text-sm">›</span>
          </button>
        </Card>
        <p className="text-ink-4 text-[11px] text-center mt-5">Flect — v1.0.0</p>
      </div>

      {showDelete && (
        <div className="fixed inset-0 z-50 flex flex-col overflow-y-auto max-w-[430px] mx-auto px-5 pt-12 pb-10" style={{ background: 'rgba(245,240,232,0.98)' }}>
          <div className="w-10 h-1 bg-ink-4 rounded-full mx-auto mb-8"/>
          <h2 className="font-display text-3xl text-red-600 mb-3">Delete account?</h2>
          <p className="text-ink-3 text-sm leading-relaxed mb-4">This permanently deletes your account, all {profile?.total_responses || 0} reflections, and all tracker data. This cannot be undone.</p>
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 mb-5">
            <p className="text-red-600 text-sm leading-relaxed">You will lose your {profile?.streak || 0}-day streak and everything permanently.</p>
          </div>
          <Input label="Confirm with your password" type="password" value={deletePassword} onChange={e => setDeletePassword(e.target.value)} placeholder="Your password" error={deleteError}/>
          <Button variant="danger" onClick={handleDelete} loading={deleting} className="mb-2">Permanently Delete Account</Button>
          <Button variant="secondary" onClick={() => { setShowDelete(false); setDeletePassword(''); setDeleteError(''); }}>Keep my account</Button>
        </div>
      )}
      <BottomNav/>
    </div>
  );
}

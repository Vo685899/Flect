import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';
import BottomNav from '../components/BottomNav';
import { Card, Button, Textarea, MoodPicker, Tag, MOOD_LABELS, MOOD_COLORS, CATEGORY_META } from '../components/UI';
import { format } from 'date-fns';

export default function Home() {
  const { user, profile, loading, refreshProfile } = useAuth();
  const router = useRouter();
  const cameraRef = useRef();  // opens camera directly
  const libraryRef = useRef(); // opens photo library
  const [prompt, setPrompt] = useState(null);
  const [todayResponse, setTodayResponse] = useState(null);
  const [mood, setMood] = useState(null);
  const [caption, setCaption] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => { if (!loading && !user) router.replace('/login'); }, [user, loading]);
  useEffect(() => { if (user) load(); }, [user]);

  const load = async () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const { data: p } = await supabase.from('prompts').select('*').eq('prompt_date', today).single();
    setPrompt(p);
    if (p) {
      const { data: r } = await supabase.from('responses').select('*').eq('user_id', user.id).eq('prompt_id', p.id).single();
      if (r) {
        setTodayResponse(r);
        setCaption(r.caption || '');
        if (r.media_url) setMediaPreview(r.media_url);
      }
    }
    // Load mood from tracker (single source of truth)
    const { data: tracker } = await supabase
      .from('tracker_entries')
      .select('mood')
      .eq('user_id', user.id)
      .eq('entry_date', today)
      .single();
    if (tracker?.mood) setMood(tracker.mood - 1);
    setPageLoading(false);
  };

  // Save mood to tracker entry so it syncs with Tracker page
  const saveMoodToTracker = async (moodIndex) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const { data: existing } = await supabase
      .from('tracker_entries')
      .select('id')
      .eq('user_id', user.id)
      .eq('entry_date', today)
      .single();

    if (existing) {
      await supabase.from('tracker_entries')
        .update({ mood: moodIndex + 1 })
        .eq('id', existing.id);
    } else {
      await supabase.from('tracker_entries')
        .insert({ user_id: user.id, entry_date: today, mood: moodIndex + 1 });
    }
  };

  const handleMoodSelect = (moodIndex) => {
    setMood(moodIndex);
    saveMoodToTracker(moodIndex);
  };

  const handleFile = (e) => {
    const f = e.target.files[0]; if (!f) return;
    setMediaFile(f); setMediaPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async () => {
    if (mood === null || !prompt) return;
    setSubmitting(true);
    let mediaUrl = todayResponse?.media_url || null;
    let mediaType = todayResponse?.media_type || null;
    if (mediaFile) {
      const ext = mediaFile.name.split('.').pop();
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from('responses').upload(path, mediaFile);
      if (!upErr) {
        const { data: { publicUrl } } = supabase.storage.from('responses').getPublicUrl(path);
        mediaUrl = publicUrl; mediaType = mediaFile.type.startsWith('video') ? 'video' : 'photo';
      }
    }
    if (todayResponse) {
      await supabase.from('responses').update({ media_url: mediaUrl, media_type: mediaType, caption: caption.trim() || null, mood_tag: mood + 1 }).eq('id', todayResponse.id);
      setTodayResponse(r => ({ ...r, media_url: mediaUrl, media_type: mediaType, caption: caption.trim() || null, mood_tag: mood + 1 }));
    } else {
      const { data: r } = await supabase.from('responses').insert({ user_id: user.id, prompt_id: prompt.id, media_url: mediaUrl, media_type: mediaType, caption: caption.trim() || null, mood_tag: mood + 1 }).select().single();
      const today = format(new Date(), 'yyyy-MM-dd');
      const yesterday = format(new Date(Date.now() - 86400000), 'yyyy-MM-dd');
      const newStreak = profile?.last_response_date === yesterday ? (profile?.streak || 0) + 1 : 1;
      await supabase.from('profiles').update({ total_responses: (profile?.total_responses || 0) + 1, streak: newStreak, last_response_date: today }).eq('id', user.id);
      await refreshProfile();
      setTodayResponse(r);
    }
    setMediaFile(null); setSubmitting(false);
  };

  const cat = prompt ? (CATEGORY_META[prompt.category] || CATEGORY_META.mindfulness) : null;

  if (pageLoading) return (
    <div className="flex items-center justify-center min-h-screen bg-cream">
      <div className="w-8 h-8 border-2 border-coral border-t-transparent rounded-full animate-spin"/>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream page-enter">
      <div className="px-5 pt-14 pb-5">
        <p className="font-display-i text-coral text-sm mb-1">{format(new Date(), 'EEEE, MMMM d')}</p>
        <div className="flex justify-between items-end">
          <h1 className="font-display text-4xl text-ink leading-tight">
            Hello,<br/>{profile?.display_name?.split(' ')[0] || 'there'}.
          </h1>
          <div className="flex flex-col items-end gap-2">
            {/* Streak */}
            <div className="bg-amber/20 border-2 border-amber/40 rounded-2xl px-4 py-2 text-center">
              <div className="font-display text-2xl text-amber-700">{profile?.streak || 0}</div>
              <div className="text-[10px] font-semibold text-amber-700 uppercase tracking-wide">day streak</div>
            </div>

          </div>
        </div>
      </div>

      <div className="px-5">
        {prompt ? (
          <div className="rounded-3xl p-5 mb-4 relative overflow-hidden border-2"
            style={{ background: cat?.color+'12', borderColor: cat?.color+'40' }}>
            <div className="flex justify-between items-center mb-3">
              <Tag color={cat?.color}>{cat?.label}</Tag>
              <span className="text-ink-4 text-xs font-medium">Today's prompt</span>
            </div>
            <p className="font-display text-[22px] text-ink leading-snug">"{prompt.text}"</p>
          </div>
        ) : (
          <Card className="mb-4 text-center py-8">
            <p className="font-display text-lg text-ink-3 mb-1">No prompt today</p>
            <p className="text-ink-4 text-xs">Check back soon</p>
          </Card>
        )}

        {prompt && (
          <>
            {todayResponse && (
              <div className="bg-sage/10 border-2 rounded-2xl px-4 py-3 mb-4 flex items-center gap-3" style={{ borderColor: '#7A9E7E60' }}>
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: MOOD_COLORS[todayResponse.mood_tag - 1] }}/>
                <div>
                  <p className="text-ink text-sm font-semibold">Reflected today</p>
                  <p className="text-ink-4 text-xs">You can update your photo or mood below</p>
                </div>
              </div>
            )}

            {mediaPreview && (
              <div className="mb-4 rounded-2xl overflow-hidden border-2 border-paper relative">
                {(mediaFile?.type.startsWith('video') || todayResponse?.media_type === 'video')
                  ? <video src={mediaPreview} className="w-full h-52 object-cover" controls/>
                  : <img src={mediaPreview} className="w-full h-52 object-cover" alt=""/>}
                <button onClick={() => { setMediaFile(null); setMediaPreview(null); }}
                  className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center text-ink-3 text-sm shadow">✕</button>
              </div>
            )}

            {/* Two hidden file inputs — one for camera, one for library */}
            <input
              ref={cameraRef}
              type="file"
              accept="image/*,video/*"
              capture="environment"
              className="hidden"
              onChange={handleFile}
            />
            <input
              ref={libraryRef}
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={handleFile}
            />

            <div className="grid grid-cols-2 gap-2 mb-4">
              {/* Camera button — uses capture="environment" for direct camera on mobile */}
              <button
                onClick={() => cameraRef.current?.click()}
                className="bg-coral text-cream rounded-2xl py-4 flex flex-col items-center gap-1.5 font-semibold text-sm shadow-sm active:scale-95 transition-transform">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
                Take Photo
              </button>

              {/* Library button — no capture attribute, opens photo library on mobile */}
              <button
                onClick={() => libraryRef.current?.click()}
                className="bg-parchment border-2 border-paper text-ink-2 rounded-2xl py-4 flex flex-col items-center gap-1.5 font-semibold text-sm active:scale-95 transition-transform">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
                From Library
              </button>
            </div>

            <Card>
              <p className="text-[11px] font-semibold text-ink-3 uppercase tracking-widest mb-3">How are you feeling?</p>
              <MoodPicker value={mood} onChange={handleMoodSelect}/>
            </Card>

            <Textarea placeholder="Write a note about this moment... (optional)" value={caption} onChange={e => setCaption(e.target.value)} rows={2}/>

            <Button onClick={handleSubmit} loading={submitting} disabled={mood === null}>
              {todayResponse ? 'Update Reflection' : 'Save Reflection'}
            </Button>
          </>
        )}

        <div className="grid grid-cols-3 gap-2 mt-4">
          {[
            { val: profile?.streak || 0, lbl: 'Day Streak', color: '#D4A847' },
            { val: profile?.total_responses || 0, lbl: 'Reflections', color: '#7A9E7E' },
            { val: todayResponse ? 'Done' : 'Pending', lbl: 'Today', color: todayResponse ? '#7A9E7E' : '#A8A29E' },
          ].map(({ val, lbl, color }) => (
            <div key={lbl} className="bg-white rounded-2xl p-3 border-2 border-paper text-center">
              <div className="font-display text-xl" style={{ color }}>{val}</div>
              <div className="text-[9px] text-ink-4 uppercase tracking-wider mt-0.5 font-semibold">{lbl}</div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav/>
    </div>
  );
}

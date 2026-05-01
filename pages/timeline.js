import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';
import BottomNav from '../components/BottomNav';
import { MOOD_LABELS, MOOD_COLORS, MOOD_BG, CATEGORY_META, ENERGY_COLOR, SLEEP_COLOR, WATER_COLOR, Button } from '../components/UI';
import {
  format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval,
  isToday, getDay, subMonths, addMonths, isPast, isSameDay
} from 'date-fns';

export default function Timeline() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const fileRef = useRef();
  const [responses, setResponses] = useState([]);
  const [prompts, setPrompts] = useState([]);
  const [trackerEntries, setTrackerEntries] = useState({});
  const [selected, setSelected] = useState(null);
  const [calMonth, setCalMonth] = useState(new Date());
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { if (!loading && !user) router.replace('/login'); }, [user, loading]);
  useEffect(() => { if (user) fetchData(); }, [user]);

  const fetchData = async () => {
    const [{ data: r }, { data: p }, { data: t }] = await Promise.all([
      supabase.from('responses').select('*, prompts(text, category, prompt_date)').eq('user_id', user.id).order('submitted_at', { ascending: false }),
      supabase.from('prompts').select('*').order('prompt_date', { ascending: false }),
      supabase.from('tracker_entries').select('*').eq('user_id', user.id),
    ]);
    setResponses(r || []);
    setPrompts(p || []);
    // Map tracker entries by date
    const tMap = (t || []).reduce((acc, e) => { acc[e.entry_date] = e; return acc; }, {});
    setTrackerEntries(tMap);
    setFetching(false);
  };

  const toggleFavorite = async (id, cur) => {
    await supabase.from('responses').update({ is_favorite: !cur }).eq('id', id);
    setResponses(r => r.map(x => x.id === id ? { ...x, is_favorite: !cur } : x));
    if (selected?.response?.id === id) setSelected(s => ({ ...s, response: { ...s.response, is_favorite: !cur } }));
  };

  const deleteMedia = async (response) => {
    if (!response?.media_url) return;
    // Remove media from DB record
    await supabase.from('responses').update({ media_url: null, media_type: null }).eq('id', response.id);
    // Try to delete from storage
    try {
      const path = response.media_url.split('/responses/')[1];
      if (path) await supabase.storage.from('responses').remove([path]);
    } catch {}
    const updated = { ...response, media_url: null, media_type: null };
    setResponses(r => r.map(x => x.id === response.id ? updated : x));
    setSelected(s => ({ ...s, response: updated }));
  };

  const deleteResponse = async (response) => {
    if (!window.confirm('Delete this reflection? This cannot be undone.')) return;
    if (response.media_url) {
      try {
        const path = response.media_url.split('/responses/')[1];
        if (path) await supabase.storage.from('responses').remove([path]);
      } catch {}
    }
    await supabase.from('responses').delete().eq('id', response.id);
    setResponses(r => r.filter(x => x.id !== response.id));
    setSelected(null);
  };

  const handleUploadForDay = async (e) => {
    const file = e.target.files[0];
    if (!file || !selected) return;
    setUploading(true);

    const ext = file.name.split('.').pop();
    const path = `${user.id}/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from('responses').upload(path, file);
    if (upErr) { setUploading(false); return; }

    const { data: { publicUrl } } = supabase.storage.from('responses').getPublicUrl(path);
    const mediaType = file.type.startsWith('video') ? 'video' : 'photo';

    if (selected.response) {
      // Update existing response
      await supabase.from('responses').update({ media_url: publicUrl, media_type: mediaType }).eq('id', selected.response.id);
      const updatedResponse = { ...selected.response, media_url: publicUrl, media_type: mediaType };
      setResponses(r => r.map(x => x.id === selected.response.id ? updatedResponse : x));
      setSelected(s => ({ ...s, response: updatedResponse }));
    } else if (selected.prompt) {
      // Create new response for past day
      const { data: newR } = await supabase.from('responses').insert({
        user_id: user.id,
        prompt_id: selected.prompt.id,
        media_url: publicUrl,
        media_type: mediaType,
        mood_tag: null,
        submitted_at: new Date(selected.date + 'T12:00:00').toISOString(),
      }).select('*, prompts(text, category, prompt_date)').single();
      if (newR) {
        setResponses(r => [newR, ...r]);
        setSelected(s => ({ ...s, response: newR }));
        // Update total count
        await supabase.from('profiles').update({ total_responses: responses.length + 1 }).eq('id', user.id);
      }
    }
    setUploading(false);
    // Reset file input
    if (fileRef.current) fileRef.current.value = '';
  };

  const responseByDate = responses.reduce((acc, r) => {
    const d = format(parseISO(r.submitted_at), 'yyyy-MM-dd');
    if (!acc[d]) acc[d] = r;
    return acc;
  }, {});

  const promptByDate = prompts.reduce((acc, p) => { acc[p.prompt_date] = p; return acc; }, {});

  const firstDay = startOfMonth(calMonth);
  const days = eachDayOfInterval({ start: firstDay, end: endOfMonth(calMonth) });
  const startOffset = getDay(firstDay);

  const formatSleep = (hours) => {
    if (!hours) return '—';
    const h = Math.floor(hours);
    const m = Math.round((hours % 1) * 60);
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  return (
    <div className="min-h-screen bg-cream pb-28 page-enter">
      <div className="px-5 pt-14 pb-4">
        <p className="font-display-i text-coral text-sm mb-1">your history</p>
        <h1 className="font-display text-4xl text-ink">Timeline</h1>
        <p className="text-ink-3 text-xs mt-1">{responses.length} reflection{responses.length !== 1 ? 's' : ''} recorded</p>
      </div>

      <div className="px-4">
        {/* Month nav */}
        <div className="flex justify-between items-center mb-4 px-1">
          <button onClick={() => setCalMonth(m => subMonths(m, 1))}
            className="w-9 h-9 rounded-xl bg-white border-2 border-paper flex items-center justify-center text-ink-3 font-bold text-lg active:scale-95 transition-transform">‹</button>
          <p className="font-display text-xl text-ink">{format(calMonth, 'MMMM yyyy')}</p>
          <button onClick={() => setCalMonth(m => addMonths(m, 1))}
            className="w-9 h-9 rounded-xl bg-white border-2 border-paper flex items-center justify-center text-ink-3 font-bold text-lg active:scale-95 transition-transform">›</button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-1.5">
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
            <div key={d} className="text-center text-[10px] font-semibold text-ink-4 py-1">{d}</div>
          ))}
        </div>

        {fetching ? (
          <div className="flex justify-center py-16">
            <div className="w-7 h-7 border-2 border-coral border-t-transparent rounded-full animate-spin"/>
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: startOffset }).map((_, i) => <div key={`e${i}`} className="aspect-square"/>)}

            {days.map(day => {
              const key = format(day, 'yyyy-MM-dd');
              const response = responseByDate[key];
              const prompt = promptByDate[key];
              const today = isToday(day);
              const isPastDay = isPast(day) && !today;
              const isClickable = !!(response || prompt);

              return (
                <button
                  key={key}
                  onClick={() => isClickable && setSelected({ response, prompt, date: key })}
                  disabled={!isClickable}
                  className="aspect-square rounded-xl overflow-hidden relative transition-all active:scale-95"
                  style={{
                    
                    background: response?.media_url ? 'transparent' : 'white',
                    border: `2px solid ${response && response.mood_tag ? MOOD_COLORS[response.mood_tag-1] : today ? '#C4794A60' : '#E8E0D0'}`,
                    opacity: !isClickable && !today ? 0.5 : 1,
                  }}
                >
                  {/* Photo/video fills the square */}
                  {response?.media_url && (
                    response.media_type === 'video'
                      ? <video src={response.media_url} className="absolute inset-0 w-full h-full" style={{objectFit:'cover',objectPosition:'center'}}/>
                      : <img src={response.media_url} className="absolute inset-0 w-full h-full" style={{objectFit:'cover',objectPosition:'center',display:'block'}} alt=""/>
                  )}

                  {/* Date number — no dots */}
                  <div className={`absolute bottom-0 left-0 right-0 text-center leading-tight py-0.5 text-[9px] font-bold
                    ${response?.media_url ? 'text-white bg-gradient-to-t from-black/40 to-transparent' : ''}
                  `}
                    style={{ color: response?.media_url ? undefined : today ? '#C4794A' : '#A8A29E' }}>
                    {format(day, 'd')}
                  </div>

                  {/* Today indicator */}
                  {today && !response?.media_url && (
                    <div className="absolute inset-0 rounded-[10px] border-2 border-coral/40 pointer-events-none"/>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Recent reflections list */}
        {responses.length > 0 && (
          <div className="mt-5">
            <p className="font-display text-xl text-ink mb-3">Recent</p>
            <div className="flex flex-col gap-2">
              {responses.slice(0, 8).map(r => {
                const moodIdx = (r.mood_tag || 3) - 1;
                const dateKey = format(parseISO(r.submitted_at), 'yyyy-MM-dd');
                return (
                  <button key={r.id}
                    onClick={() => setSelected({ response: r, prompt: promptByDate[dateKey], date: dateKey })}
                    className="bg-white border-2 border-paper rounded-2xl p-3 flex gap-3 items-center text-left active:scale-[0.98] transition-transform w-full">
                    {r.media_url ? (
                      r.media_type === 'video'
                        ? <video src={r.media_url} className="w-14 h-14 rounded-xl object-cover flex-shrink-0"/>
                        : <img src={r.media_url} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" alt=""/>
                    ) : (
                      <div className="w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center border-2 border-paper bg-parchment">
                        <div className="w-4 h-4 rounded-full" style={{ background: MOOD_COLORS[moodIdx] }}/>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-semibold text-ink-4 uppercase tracking-wide mb-0.5">
                        {format(parseISO(r.submitted_at), 'EEEE, MMM d')}
                      </p>
                      {r.prompts?.text && (
                        <p className="text-ink text-sm font-medium leading-tight line-clamp-1 font-display">"{r.prompts.text}"</p>
                      )}
                      {r.caption && <p className="text-ink-3 text-xs mt-0.5 line-clamp-1">{r.caption}</p>}
                      {r.mood_tag && (
                        <div className="flex items-center gap-1 mt-1">
                          <div className="w-2 h-2 rounded-full" style={{ background: MOOD_COLORS[(r.mood_tag||3)-1] }}/>
                          <span className="text-[10px] text-ink-4">{MOOD_LABELS[(r.mood_tag||3)-1]}</span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleUploadForDay}/>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex flex-col max-w-[430px] mx-auto overflow-y-auto"
          style={{ background: 'rgba(245,240,232,0.98)' }}>
          <div className="w-10 h-1 bg-ink-4 rounded-full mx-auto mt-3 mb-3"/>

          {/* Media */}
          {selected.response?.media_url ? (
            selected.response.media_type === 'video'
              ? <video src={selected.response.media_url} className="w-full h-64 object-cover" controls/>
              : <img src={selected.response.media_url} className="w-full h-64 object-cover" alt=""/>
          ) : (
            <div className="w-full h-36 flex items-center justify-center border-b-2 border-paper"
              style={{ background: selected.response ? MOOD_BG[(selected.response.mood_tag||3)-1] : '#F5F0E8' }}>
              {selected.response ? (
                <div className="w-12 h-12 rounded-full" style={{ background: MOOD_COLORS[(selected.response.mood_tag||3)-1] }}/>
              ) : (
                <p className="text-ink-4 text-sm font-display italic">No photo for this day</p>
              )}
            </div>
          )}

          <div className="flex-1 p-5">
            <p className="font-display text-xl text-ink mb-1">{format(parseISO(selected.date), 'EEEE, MMMM d, yyyy')}</p>

            {selected.response && selected.response.mood_tag && (
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full" style={{ background: MOOD_COLORS[selected.response.mood_tag-1] }}/>
                <span className="text-sm text-ink-3">{MOOD_LABELS[selected.response.mood_tag-1]}</span>
                <button onClick={() => toggleFavorite(selected.response.id, selected.response.is_favorite)}
                  className="ml-auto text-xl active:scale-90 transition-transform">
                  {selected.response.is_favorite ? '★' : '☆'}
                </button>
              </div>
            )}

            {/* Prompt */}
            {selected.prompt && (
              <div className="bg-parchment rounded-2xl p-4 mb-3 border-2 border-paper">
                <p className="text-[10px] font-semibold text-ink-4 uppercase tracking-widest mb-1">Prompt</p>
                <p className="text-ink-2 text-sm leading-relaxed font-display">"{selected.prompt.text}"</p>
              </div>
            )}

            {selected.response?.caption && (
              <p className="text-ink text-[15px] leading-relaxed mb-3">"{selected.response.caption}"</p>
            )}

            {/* Tracker data for this day */}
            {trackerEntries[selected.date] && (
              <div className="bg-white border-2 border-paper rounded-2xl p-4 mb-3">
                <p className="text-[10px] font-semibold text-ink-3 uppercase tracking-widest mb-3">That Day's Tracker</p>
                <div className="grid grid-cols-2 gap-2">
                  {trackerEntries[selected.date].mood && (
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: MOOD_COLORS[trackerEntries[selected.date].mood - 1] }}/>
                      <div>
                        <p className="text-[9px] text-ink-4 uppercase tracking-wide">Mood</p>
                        <p className="text-xs font-semibold text-ink">{MOOD_LABELS[trackerEntries[selected.date].mood - 1]}</p>
                      </div>
                    </div>
                  )}
                  {trackerEntries[selected.date].energy > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: ENERGY_COLOR }}/>
                      <div>
                        <p className="text-[9px] text-ink-4 uppercase tracking-wide">Energy</p>
                        <p className="text-xs font-semibold text-ink">{trackerEntries[selected.date].energy} / 5</p>
                      </div>
                    </div>
                  )}
                  {trackerEntries[selected.date].sleep_hours > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: SLEEP_COLOR }}/>
                      <div>
                        <p className="text-[9px] text-ink-4 uppercase tracking-wide">Sleep</p>
                        <p className="text-xs font-semibold text-ink">{formatSleep(trackerEntries[selected.date].sleep_hours)}</p>
                      </div>
                    </div>
                  )}
                  {trackerEntries[selected.date].water_glasses > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: WATER_COLOR }}/>
                      <div>
                        <p className="text-[9px] text-ink-4 uppercase tracking-wide">Water</p>
                        <p className="text-xs font-semibold text-ink">{trackerEntries[selected.date].water_glasses} glasses</p>
                      </div>
                    </div>
                  )}
                </div>
                {trackerEntries[selected.date].note && (
                  <p className="text-ink-3 text-xs mt-3 pt-3 border-t border-paper leading-relaxed">
                    "{trackerEntries[selected.date].note}"
                  </p>
                )}
              </div>
            )}

            {/* Upload / replace photo for past days */}
            {(selected.prompt && isPast(parseISO(selected.date))) && (
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="w-full py-3 rounded-2xl border-2 border-dashed border-coral/40 text-coral text-sm font-semibold mb-3 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                style={{ background: '#FDF5F0' }}
              >
                {uploading ? (
                  <span className="w-4 h-4 border-2 border-coral border-t-transparent rounded-full animate-spin"/>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    {selected.response?.media_url ? 'Replace Photo / Video' : 'Add Photo / Video for this day'}
                  </>
                )}
              </button>
            )}

            {!selected.response && !selected.prompt && (
              <div className="bg-parchment border-2 border-paper rounded-2xl p-4 mb-3">
                <p className="text-ink-3 text-sm">No prompt or reflection for this day.</p>
              </div>
            )}

            {/* Delete buttons */}
            {selected.response && (
              <div className="flex gap-2 mb-2">
                {selected.response.media_url && (
                  <button
                    onClick={() => { if (window.confirm('Remove just the photo/video? The reflection and mood will stay.')) deleteMedia(selected.response); }}
                    className="flex-1 py-2.5 rounded-2xl border-2 border-red-200 text-red-400 text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                    style={{ background: 'rgba(239,68,68,0.04)' }}>
                    Remove Photo Only
                  </button>
                )}
                <button
                  onClick={() => deleteResponse(selected.response)}
                  className="flex-1 py-2.5 rounded-2xl border-2 border-red-200 text-red-500 text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                  style={{ background: 'rgba(239,68,68,0.06)' }}>
                  Delete Reflection
                </button>
              </div>
            )}

            <button onClick={() => setSelected(null)}
              className="w-full py-3 rounded-2xl bg-white border-2 border-paper text-ink-3 font-semibold text-sm">
              Close
            </button>
          </div>
        </div>
      )}

      <BottomNav/>
    </div>
  );

}

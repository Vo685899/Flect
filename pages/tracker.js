import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';
import BottomNav from '../components/BottomNav';
import { Card, Button, Textarea, MoodPicker, MOOD_LABELS, MOOD_COLORS, ENERGY_COLOR, SLEEP_COLOR, WATER_COLOR } from '../components/UI';
import { format, parseISO } from 'date-fns';

function EnergyPicker({ value, onChange }) {
  const labels = ['Very Low', 'Low', 'Moderate', 'High', 'Very High'];
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-ink">Energy</span>
        <span className="text-sm font-bold" style={{ color: ENERGY_COLOR }}>
          {value > 0 ? labels[value - 1] : '—'}
        </span>
      </div>
      <div className="flex gap-2">
        {[1,2,3,4,5].map(l => (
          <button key={l} onClick={() => onChange(l)}
            className="flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl border-2 transition-all active:scale-95"
            style={{ background: value >= l ? ENERGY_COLOR+'15' : 'white', borderColor: value >= l ? ENERGY_COLOR : '#E8E0D0' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill={value >= l ? ENERGY_COLOR : '#E8E0D0'}>
              <path d="M13 2L4.5 13.5H11L10 22L20.5 10H14L13 2Z"/>
            </svg>
            <span className="text-[8px] font-bold" style={{ color: value >= l ? ENERGY_COLOR : '#A8A29E' }}>{l}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function SleepPicker({ hours, minutes, onChangeHours, onChangeMinutes }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-semibold text-ink">Sleep</span>
        <span className="text-sm font-bold" style={{ color: SLEEP_COLOR }}>{hours}h {minutes > 0 ? `${minutes}m` : '00m'}</span>
      </div>
      <div className="flex gap-3">
        <div className="flex-1">
          <p className="text-[10px] font-semibold text-ink-4 uppercase tracking-wider mb-1.5">Hours</p>
          <div className="relative">
            <select value={hours} onChange={e => onChangeHours(Number(e.target.value))}
              className="w-full appearance-none bg-white border-2 rounded-xl px-4 py-3 text-ink font-semibold text-sm cursor-pointer"
              style={{ borderColor: SLEEP_COLOR+'60' }}>
              {[3,4,5,6,7,8,9,10,11,12].map(h => <option key={h} value={h}>{h} hours</option>)}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={SLEEP_COLOR} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-semibold text-ink-4 uppercase tracking-wider mb-1.5">Minutes</p>
          <div className="relative">
            <select value={minutes} onChange={e => onChangeMinutes(Number(e.target.value))}
              className="w-full appearance-none bg-white border-2 rounded-xl px-4 py-3 text-ink font-semibold text-sm cursor-pointer"
              style={{ borderColor: SLEEP_COLOR+'60' }}>
              {[0,15,30,45].map(m => <option key={m} value={m}>{m === 0 ? '00 min' : `${m} min`}</option>)}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={SLEEP_COLOR} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WaterPicker({ value, onChange, metric, onMetricChange }) {
  const dotValues = metric === 'oz' ? [8,16,24,32,40,48,56,64] : [1,2,3,4,5,6,7,8];
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-ink">Water</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold" style={{ color: WATER_COLOR }}>{value} {metric}</span>
          <div className="relative">
            <select value={metric} onChange={e => { onMetricChange(e.target.value); onChange(0); }}
              className="appearance-none text-[11px] font-bold rounded-lg px-2.5 py-1 cursor-pointer pr-5"
              style={{ background: WATER_COLOR+'15', color: WATER_COLOR, border: `1px solid ${WATER_COLOR}40` }}>
              <option value="glasses">glasses</option>
              <option value="oz">oz</option>
            </select>
            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={WATER_COLOR} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-1.5">
        {dotValues.map(dv => {
          const filled = value >= dv;
          return (
            <button key={dv} onClick={() => onChange(dv)}
              className="flex-1 flex flex-col items-center gap-1 py-2 rounded-xl border-2 transition-all active:scale-95"
              style={{ background: filled ? WATER_COLOR+'12' : 'white', borderColor: filled ? WATER_COLOR : '#E8E0D0' }}>
              <svg width="14" height="16" viewBox="0 0 14 18" fill={filled ? WATER_COLOR : '#E8E0D0'}>
                <path d="M7 0C7 0 1 7 1 11.5a6 6 0 0012 0C13 7 7 0 7 0z"/>
              </svg>
              <span className="text-[8px] font-bold" style={{ color: filled ? WATER_COLOR : '#A8A29E' }}>{dv}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Tracker() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [todayEntry, setTodayEntry] = useState(null);
  const [history, setHistory] = useState([]);
  const [mood, setMood] = useState(null);
  const [energy, setEnergy] = useState(0);
  const [sleepHours, setSleepHours] = useState(7);
  const [sleepMinutes, setSleepMinutes] = useState(0);
  const [water, setWater] = useState(0);
  const [waterMetric, setWaterMetric] = useState('glasses');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { if (!loading && !user) router.replace('/login'); }, [user, loading]);
  useEffect(() => { if (user) { fetchToday(); fetchHistory(); } }, [user]);

  const fetchToday = async () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const { data } = await supabase.from('tracker_entries').select('*').eq('user_id', user.id).eq('entry_date', today).single();
    if (data) {
      setTodayEntry(data); setMood(data.mood - 1); setEnergy(data.energy || 0);
      const total = data.sleep_hours || 0;
      setSleepHours(Math.floor(total)); setSleepMinutes(Math.round((total % 1) * 60));
      setWater(data.water_glasses || 0); setNote(data.note || ''); setSaved(true);
    }
  };

  const fetchHistory = async () => {
    // Get strictly the last 7 calendar days
    const today = format(new Date(), 'yyyy-MM-dd');
    const sevenDaysAgo = format(new Date(Date.now() - 6 * 86400000), 'yyyy-MM-dd');
    const { data } = await supabase
      .from('tracker_entries')
      .select('*')
      .eq('user_id', user.id)
      .gte('entry_date', sevenDaysAgo)
      .lte('entry_date', today)
      .order('entry_date', { ascending: true });
    setHistory(data || []);
  };

  const handleSave = async () => {
    if (mood === null) return;
    setSaving(true);
    const today = format(new Date(), 'yyyy-MM-dd');
    const entry = { user_id: user.id, entry_date: today, mood: mood + 1, energy, sleep_hours: sleepHours + sleepMinutes / 60, water_glasses: water, note: note.trim() || null };
    if (todayEntry) { await supabase.from('tracker_entries').update(entry).eq('id', todayEntry.id); }
    else { const { data } = await supabase.from('tracker_entries').insert(entry).select().single(); setTodayEntry(data); }

    // Sync mood back to today's response if one exists
    const { data: todayPrompt } = await supabase.from('prompts').select('id').eq('prompt_date', today).single();
    if (todayPrompt) {
      await supabase.from('responses')
        .update({ mood_tag: mood + 1 })
        .eq('user_id', user.id)
        .eq('prompt_id', todayPrompt.id);
    }

    await fetchHistory(); setSaved(true); setSaving(false);
  };

  const avg = key => history.length ? (history.reduce((s, e) => s + (e[key] || 0), 0) / history.length).toFixed(1) : '—';

  // Build 7-day chart — one slot per day, empty if no entry
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const date = format(new Date(Date.now() - (6 - i) * 86400000), 'yyyy-MM-dd');
    const entry = history.find(e => e.entry_date === date);
    return {
      date,
      mood: entry?.mood || 0,
      label: format(new Date(Date.now() - (6 - i) * 86400000), 'EEE').slice(0, 2),
      hasEntry: !!entry,
    };
  });

  return (
    <div className="min-h-screen bg-cream pb-28 page-enter">
      <div className="px-5 pt-14 pb-4">
        <p className="font-display-i text-coral text-sm mb-1">{format(new Date(), 'EEEE, MMMM d')}</p>
        <h1 className="font-display text-4xl text-ink">Tracker</h1>
      </div>
      <div className="px-5">
        <p className="text-[11px] font-semibold text-ink-3 uppercase tracking-widest mb-3">Today's Check-in</p>
        <Card>
          <p className="text-[11px] font-semibold text-ink-3 uppercase tracking-widest mb-3">Mood</p>
          <MoodPicker value={mood} onChange={setMood}/>
        </Card>
        <Card>
          <EnergyPicker value={energy} onChange={setEnergy}/>
          <div className="h-px bg-paper my-4"/>
          <SleepPicker hours={sleepHours} minutes={sleepMinutes} onChangeHours={setSleepHours} onChangeMinutes={setSleepMinutes}/>
          <div className="h-px bg-paper my-4"/>
          <WaterPicker value={water} onChange={setWater} metric={waterMetric} onMetricChange={setWaterMetric}/>
        </Card>
        <Textarea placeholder="Any notes about today..." value={note} onChange={e => setNote(e.target.value)} rows={2}/>
        <Button onClick={handleSave} loading={saving} disabled={mood === null}>
          {saved ? 'Update Check-in' : 'Save Check-in'}
        </Button>

        {history.length > 0 && (
          <>
            <p className="text-[11px] font-semibold text-ink-3 uppercase tracking-widest mt-5 mb-3">7-Day Averages</p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { val: avg('mood'), lbl: 'Avg Mood', color: '#C4794A' },
                { val: avg('energy'), lbl: 'Avg Energy', color: ENERGY_COLOR },
                { val: `${avg('sleep_hours')}h`, lbl: 'Avg Sleep', color: SLEEP_COLOR },
              ].map(({ val, lbl, color }) => (
                <div key={lbl} className="bg-white rounded-2xl p-3 border-2 border-paper text-center">
                  <div className="font-display text-xl" style={{ color }}>{val}</div>
                  <div className="text-[9px] text-ink-4 uppercase tracking-wider mt-0.5 font-semibold">{lbl}</div>
                </div>
              ))}
            </div>

            <Card>
              <p className="text-[11px] font-semibold text-ink-3 uppercase tracking-widest mb-3">Mood this week</p>
              <div className="flex items-end gap-1.5 h-16">
                {chartData.map((entry, i) => {
                  const h = entry.hasEntry ? Math.max(8, (entry.mood / 5) * 56) : 0;
                  const color = entry.hasEntry ? MOOD_COLORS[(entry.mood || 3) - 1] : '#E8E0D0';
                  const isToday = i === 6;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      {entry.hasEntry ? (
                        <div className="w-full rounded-t-lg" style={{ height: `${h}px`, background: color, opacity: 0.85 }}/>
                      ) : (
                        <div className="w-full rounded-t-lg" style={{ height: '4px', background: '#E8E0D0' }}/>
                      )}
                      <span className="text-[9px] font-semibold" style={{ color: isToday ? '#C4794A' : '#A8A29E' }}>
                        {entry.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>
          </>
        )}
      </div>
      <BottomNav/>
    </div>
  );
}

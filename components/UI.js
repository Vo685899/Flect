// Flect UI — Warm retro design system

export const MOOD_LABELS  = ['Low', 'Okay', 'Good', 'Great', 'Wonderful'];
export const MOOD_COLORS  = ['#E07070','#D4A847','#7A9E7E','#6B9EC4','#8B6F8E']; // Wonderful = purple
export const MOOD_BG      = ['#FDF0F0','#FEFBF0','#F0F7F0','#F0F5FD','#F5F0FD'];

export const ENERGY_COLOR = '#C4794A'; // orange (was purple)
export const SLEEP_COLOR  = '#7A9E7E'; // green (swapped from blue)
export const WATER_COLOR  = '#6B9EC4'; // blue (swapped from green)

export const CATEGORY_META = {
  mindfulness: { label: 'Mindfulness', color: '#7A9E7E' },
  joy:         { label: 'Joy',         color: '#D4A847' },
  authenticity:{ label: 'Authentic',   color: '#8B6F8E' },
  creative:    { label: 'Creative',    color: '#C4794A' },
  lifestyle:   { label: 'Lifestyle',   color: '#6B9EC4' },
  mood:        { label: 'Mood',        color: '#E07070' },
  gratitude:   { label: 'Gratitude',   color: '#7A9E7E' },
};

export function Button({ children, onClick, variant='primary', disabled, loading, className='', type='button' }) {
  const base = 'w-full py-3.5 px-5 rounded-2xl font-semibold text-[15px] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]';
  const variants = {
    primary:   'bg-coral text-cream hover:bg-coral-dark shadow-sm',
    secondary: 'bg-parchment text-ink border border-paper hover:bg-paper',
    ghost:     'bg-transparent text-ink-3 border border-ink-4/40 hover:border-coral/40 hover:text-coral',
    danger:    'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100',
    sage:      'bg-sage text-cream hover:bg-sage-dark shadow-sm',
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled||loading} className={`${base} ${variants[variant]} ${className}`}>
      {loading ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"/> : children}
    </button>
  );
}

export function Input({ label, error, hint, className='', ...props }) {
  return (
    <div className="mb-4">
      {label && <label className="block text-[11px] font-semibold text-ink-3 uppercase tracking-[1.5px] mb-1.5">{label}</label>}
      <input className={`w-full bg-white border-2 border-paper rounded-xl px-4 py-3 text-ink text-[14px] placeholder:text-ink-4 transition-all ${error ? 'border-red-300' : ''} ${className}`} {...props}/>
      {hint  && <p className="text-[11px] text-ink-4 mt-1">{hint}</p>}
      {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export function Textarea({ label, error, className='', ...props }) {
  return (
    <div className="mb-4">
      {label && <label className="block text-[11px] font-semibold text-ink-3 uppercase tracking-[1.5px] mb-1.5">{label}</label>}
      <textarea className={`w-full bg-white border-2 border-paper rounded-xl px-4 py-3 text-ink text-[14px] placeholder:text-ink-4 transition-all resize-none ${error?'border-red-300':''} ${className}`} rows={3} {...props}/>
      {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export function Card({ children, className='', style }) {
  return (
    <div style={style} className={`bg-white rounded-2xl p-4 border-2 border-paper shadow-sm mb-3 ${className}`}>
      {children}
    </div>
  );
}

export function Tag({ children, color }) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border"
      style={{ background: color+'18', color, borderColor: color+'44' }}>
      {children}
    </span>
  );
}

export function Divider({ className='' }) {
  return <div className={`h-px bg-paper my-3 ${className}`}/>;
}

export function MoodPicker({ value, onChange }) {
  return (
    <div className="flex gap-2">
      {MOOD_LABELS.map((lbl, i) => (
        <button key={i} onClick={() => onChange(i)}
          className="flex-1 flex flex-col items-center gap-1 py-3 rounded-xl border-2 transition-all"
          style={{
            background: value===i ? MOOD_BG[i] : 'white',
            borderColor: value===i ? MOOD_COLORS[i] : '#E8E0D0',
          }}>
          <div className="w-4 h-4 rounded-full" style={{ background: MOOD_COLORS[i] }}/>
          <span className="text-[9px] font-semibold" style={{ color: value===i ? MOOD_COLORS[i] : '#A8A29E' }}>{lbl}</span>
        </button>
      ))}
    </div>
  );
}

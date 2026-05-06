'use client'

import { type Lang } from './types'

export default function LangToggle({ lang, setLang, dark }: { lang: Lang; setLang: (l: Lang) => void; dark?: boolean }) {
  const base = dark
    ? { border: 'rgba(240,237,232,0.2)', activeBg: 'rgba(240,237,232,0.15)', activeColor: '#F0EDE8', inactiveColor: 'rgba(240,237,232,0.4)' }
    : { border: 'var(--border)', activeBg: 'var(--accent)', activeColor: '#fff', inactiveColor: 'var(--muted)' }

  return (
    <div style={{ display: 'flex', borderRadius: '6px', overflow: 'hidden', border: `1px solid ${base.border}` }}>
      {(['fr', 'en'] as Lang[]).map((l) => (
        <button key={l} onClick={() => setLang(l)} style={{
          padding: '4px 10px', fontSize: '12px', fontWeight: lang === l ? 600 : 400,
          background: lang === l ? base.activeBg : 'transparent',
          color: lang === l ? base.activeColor : base.inactiveColor,
          border: 'none', cursor: 'pointer', transition: 'all 0.15s ease',
          textTransform: 'uppercase', letterSpacing: '0.05em',
        }}>
          {l}
        </button>
      ))}
    </div>
  )
}

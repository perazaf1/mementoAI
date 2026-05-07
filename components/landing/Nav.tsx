'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { type Lang, type CopyType } from './types'
import LangToggle from './LangToggle'

export default function Nav({ t, lang, setLang }: { t: CopyType; lang: Lang; setLang: (l: Lang) => void }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      height: '60px', display: 'flex', alignItems: 'center', padding: '0 clamp(16px, 4vw, 40px)', gap: '12px',
      background: scrolled ? 'rgba(12,20,32,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
      transition: 'all 0.3s ease',
    }}>
      <span
        className="lp-nav-logo"
        style={{ fontFamily: 'var(--heading-font)', fontSize: '22px', fontWeight: 600, letterSpacing: '-0.02em', color: '#F0EDE8', cursor: 'default' }}
      >
        Memento
      </span>

      <div style={{ flex: 1 }} />

      <Link href="/app" className="hide-mobile lp-hover-light" style={{
        fontSize: '13px', color: 'rgba(240,237,232,0.65)', textDecoration: 'none', padding: '6px 12px',
      }}>
        {t.login}
      </Link>

      <Link href="/app" className="lp-hover-opacity" style={{
        fontSize: '13px', fontWeight: 500, background: '#F0EDE8', color: '#0C1420',
        padding: '7px 14px', borderRadius: '6px', textDecoration: 'none',
        whiteSpace: 'nowrap', flexShrink: 0,
      }}>
        <span className="hide-mobile">{t.startFree}</span>
        <span className="show-mobile">{t.startFreeMobile}</span>
      </Link>

      <LangToggle lang={lang} setLang={setLang} dark />
    </nav>
  )
}

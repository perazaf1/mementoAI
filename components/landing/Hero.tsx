'use client'

import Link from 'next/link'
import { type Lang, type CopyType, MOCK_CONTENT } from './types'

export default function Hero({ t, lang }: { t: CopyType; lang: Lang }) {
  const mock = MOCK_CONTENT[lang]
  const sections = [
    { label: t.mockSec1, color: '#16A34A', bg: '#F0FDF4', border: '#16A34A', text: mock.sec1 },
    { label: t.mockSec2, color: '#DC2626', bg: '#FEF2F2', border: '#DC2626', items: mock.sec2items },
    { label: t.mockSec3, color: '#C2410C', bg: '#FFF7ED', border: '#C2410C', text: mock.sec3 },
    { label: t.mockSec4, color: '#1D4ED8', bg: '#EFF6FF', border: '#1D4ED8', text: mock.sec4 },
  ]

  return (
    <section style={{
      minHeight: '100vh', background: '#0C1420',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '100px 24px 80px', position: 'relative', overflow: 'hidden',
    }}>
      {/* Grid */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.03,
        backgroundImage: 'linear-gradient(rgba(240,237,232,1) 1px, transparent 1px), linear-gradient(90deg, rgba(240,237,232,1) 1px, transparent 1px)',
        backgroundSize: '60px 60px', pointerEvents: 'none',
      }} />
      {/* Glow */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '600px', height: '400px',
        background: 'radial-gradient(ellipse, rgba(26,56,128,0.35) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="lp-hero-text" style={{ position: 'relative', textAlign: 'center', maxWidth: '760px' }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          border: '1px solid rgba(240,237,232,0.15)', borderRadius: '100px', padding: '5px 14px', marginBottom: '36px',
        }}>
          <div style={{ position: 'relative', width: '6px', height: '6px', flexShrink: 0 }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#4ade80', animation: 'lp-pulse-ring 2.2s ease-out infinite' }} />
            <div style={{ position: 'relative', width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', animation: 'lp-pulse-dot 2.2s ease-in-out infinite' }} />
          </div>
          <span style={{ fontSize: '12px', color: 'rgba(240,237,232,0.55)', letterSpacing: '0.04em' }}>{t.badge}</span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: 'Cormorant, serif', fontSize: 'clamp(52px, 8vw, 88px)',
          fontWeight: 500, lineHeight: 1.05, letterSpacing: '-0.03em', color: '#F0EDE8', marginBottom: '28px',
        }}>
          {t.h1a}
          <br />
          <em style={{ fontStyle: 'italic', color: 'rgba(240,237,232,0.5)' }}>{t.h1b}</em>
        </h1>

        {/* Sub */}
        <p style={{
          fontSize: 'clamp(15px, 2vw, 18px)', color: 'rgba(240,237,232,0.55)',
          lineHeight: 1.7, maxWidth: '520px', margin: '0 auto 44px', fontFamily: 'DM Sans, sans-serif',
        }}>
          {t.sub}
        </p>

        {/* CTAs */}
        <div className="lp-hero-ctas" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/app" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: '#F0EDE8', color: '#0C1420', padding: '12px 28px', borderRadius: '8px',
            fontSize: '15px', fontWeight: 600, textDecoration: 'none', transition: 'all 0.15s ease', letterSpacing: '0.01em',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)' }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
          >
            {t.ctaStart}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
          <a href="#comment" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            border: '1px solid rgba(240,237,232,0.2)', color: 'rgba(240,237,232,0.7)',
            padding: '12px 24px', borderRadius: '8px', fontSize: '15px', fontWeight: 400,
            textDecoration: 'none', transition: 'all 0.15s ease',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(240,237,232,0.4)'; e.currentTarget.style.color = '#F0EDE8' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(240,237,232,0.2)'; e.currentTarget.style.color = 'rgba(240,237,232,0.7)' }}
          >
            {t.ctaHow}
          </a>
        </div>
      </div>

      {/* Mock UI */}
      <div className="lp-mock" style={{
        marginTop: '72px', position: 'relative', width: '100%', maxWidth: '540px',
        transform: 'perspective(1000px) rotateX(4deg)',
        filter: 'drop-shadow(0 40px 80px rgba(0,0,0,0.5))',
        padding: '0 8px',
      }}>
        <div style={{
          background: '#1C2A3C', borderRadius: '12px 12px 0 0', padding: '10px 16px',
          display: 'flex', alignItems: 'center', gap: '6px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          {['#FF5F57', '#FFBD2E', '#28CA41'].map((c) => (
            <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />
          ))}
          <div style={{
            marginLeft: '8px', flex: 1, height: '22px', borderRadius: '5px',
            background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', padding: '0 10px',
          }}>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>memento.app</span>
          </div>
        </div>
        <div style={{
          background: 'var(--bg)', borderRadius: '0 0 12px 12px',
          padding: '24px 24px 20px', border: '1px solid rgba(255,255,255,0.06)', borderTop: 'none',
        }}>
          <p style={{ fontFamily: 'Cormorant, serif', fontSize: '24px', fontWeight: 500, color: 'var(--text)', letterSpacing: '-0.02em' }}>
            {t.mockTitle}
          </p>
          <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px', marginBottom: '16px' }}>
            {t.mockSub}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {sections.map((s) => (
              <div key={s.label} style={{
                borderRadius: '7px', border: '1px solid var(--border)',
                borderLeft: `3px solid ${s.border}`, background: s.bg, padding: '10px 14px',
              }}>
                <p style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: s.color, marginBottom: '5px' }}>
                  {s.label}
                </p>
                {s.text && <p style={{ fontSize: '11px', color: '#111110', lineHeight: 1.55 }}>{s.text}</p>}
                {s.items && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    {s.items.map((item) => (
                      <div key={item} style={{ display: 'flex', gap: '7px', alignItems: 'flex-start' }}>
                        <div style={{ width: '3px', height: '3px', borderRadius: '50%', background: s.color, marginTop: '5px', flexShrink: 0 }} />
                        <span style={{ fontSize: '11px', color: '#111110', lineHeight: 1.55 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '100px',
        background: 'linear-gradient(to bottom, transparent, var(--bg))', pointerEvents: 'none',
      }} />
    </section>
  )
}

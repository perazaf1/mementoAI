'use client'

import { type CopyType } from './types'
import Reveal from './Reveal'

export default function HowItWorks({ t }: { t: CopyType }) {
  const steps = [
    {
      n: '01', title: t.s1title, desc: t.s1desc,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      ),
    },
    {
      n: '02', title: t.s2title, desc: t.s2desc,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/>
        </svg>
      ),
    },
    {
      n: '03', title: t.s3title, desc: t.s3desc,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 11 12 14 22 4"/>
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
        </svg>
      ),
    },
  ]

  return (
    <section id="comment" className="lp-section" style={{ background: 'var(--bg)', padding: '120px 24px' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: '72px' }}>
            <p style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '14px' }}>
              {t.methodLabel}
            </p>
            <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--text)', lineHeight: 1.15 }}>
              {t.methodH}
              <br />
              <span style={{ color: 'var(--muted)' }}>{t.methodHSub}</span>
            </h2>
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '28px' }}>
          {steps.map((step, i) => (
            <Reveal key={step.n} delay={i * 110}>
              <div style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: '12px', padding: '32px', transition: 'box-shadow 0.2s ease, border-color 0.2s ease, transform 0.2s ease',
              }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.boxShadow = '0 8px 32px rgba(0,0,0,0.07)'
                  el.style.borderColor = 'rgba(26,56,128,0.25)'
                  el.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.boxShadow = 'none'
                  el.style.borderColor = 'var(--border)'
                  el.style.transform = 'translateY(0)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <span style={{ fontFamily: 'var(--heading-font)', fontSize: '52px', fontWeight: 300, letterSpacing: '-0.03em', color: 'var(--border)', lineHeight: 1 }}>
                    {step.n}
                  </span>
                  <div style={{ color: 'var(--accent)', marginTop: '4px' }}>{step.icon}</div>
                </div>
                <h3 style={{ fontFamily: 'var(--heading-font)', fontSize: '22px', fontWeight: 500, color: 'var(--text)', marginBottom: '10px', letterSpacing: '-0.01em' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.7 }}>{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

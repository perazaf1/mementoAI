'use client'

import { type CopyType } from './types'
import Reveal from './Reveal'

export default function Features({ t }: { t: CopyType }) {
  const features = [
    { tag: t.f1tag, title: t.f1title, desc: t.f1desc },
    { tag: t.f2tag, title: t.f2title, desc: t.f2desc },
    { tag: t.f3tag, title: t.f3title, desc: t.f3desc },
  ]

  return (
    <section className="lp-section" style={{ background: 'var(--surface)', padding: '120px 24px', borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: '72px' }}>
            <p style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '14px' }}>
              {t.featLabel}
            </p>
            <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--text)', lineHeight: 1.15 }}>
              {t.featH}
              <br />
              <span style={{ color: 'var(--muted)' }}>{t.featHSub}</span>
            </h2>
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 100}>
              <div className="lp-card-feature" style={{ padding: '32px', borderRadius: '12px' }}>
                <div style={{
                  display: 'inline-block', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em',
                  textTransform: 'uppercase', color: 'var(--accent)', background: 'var(--accent-light)',
                  padding: '3px 10px', borderRadius: '100px', marginBottom: '20px',
                }}>
                  {f.tag}
                </div>
                <h3 style={{ fontFamily: 'var(--heading-font)', fontSize: '24px', fontWeight: 500, color: 'var(--text)', marginBottom: '12px', letterSpacing: '-0.01em' }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

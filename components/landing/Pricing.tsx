'use client'

import Link from 'next/link'
import { type CopyType } from './types'
import Reveal from './Reveal'

export default function Pricing({ t, onProCheckout, onIsepCheckout, checkoutLoading }: {
  t: CopyType
  onProCheckout: () => void
  onIsepCheckout: () => void
  checkoutLoading: 'pro' | 'isep' | null
}) {
  return (
    <section className="lp-section" style={{ background: 'var(--bg)', padding: '120px 24px', borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: '840px', margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <p style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '14px' }}>
              {t.pricingLabel}
            </p>
            <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--text)', lineHeight: 1.15 }}>
              {t.pricingH}
              <br />
              <span style={{ color: 'var(--muted)' }}>{t.pricingHSub}</span>
            </h2>
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'start' }}>
          {/* Free */}
          <Reveal delay={0}>
            <div className="lp-card-free" style={{
              background: 'var(--surface)', borderRadius: '16px', padding: '36px',
            }}>
              <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--muted)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {t.freePlan}
              </p>
              <div style={{ marginBottom: '28px' }}>
                <span style={{ fontFamily: 'var(--heading-font)', fontSize: '52px', fontWeight: 500, color: 'var(--text)', letterSpacing: '-0.03em' }}>0€</span>
                <span style={{ fontSize: '14px', color: 'var(--muted)', marginLeft: '4px' }}>{t.perMonth}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                {t.freeItems.map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                    <span style={{ fontSize: '14px', color: 'var(--text)' }}>{item}</span>
                  </div>
                ))}
              </div>
              <Link href="/app" className="lp-cta-free-link" style={{
                display: 'block', textAlign: 'center', padding: '11px',
                border: '1px solid var(--border)', borderRadius: '8px',
                fontSize: '14px', fontWeight: 500, color: 'var(--text)', textDecoration: 'none',
              }}>
                {t.freeCta}
              </Link>
            </div>
          </Reveal>

          {/* Pro */}
          <Reveal delay={120}>
            <div className="lp-card-pro" style={{
              background: '#0C1420', borderRadius: '16px', padding: '36px',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px',
                background: 'radial-gradient(ellipse, rgba(26,56,128,0.4) 0%, transparent 70%)', pointerEvents: 'none',
              }} />
              <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <p style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(240,237,232,0.55)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {t.proPlan}
                  </p>
                  <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#0C1420', background: '#F0EDE8', padding: '2px 10px', borderRadius: '100px' }}>
                    {t.popular}
                  </span>
                </div>
                <div style={{ marginBottom: '28px' }}>
                  <span style={{ fontFamily: 'var(--heading-font)', fontSize: '52px', fontWeight: 500, color: '#F0EDE8', letterSpacing: '-0.03em' }}>8€</span>
                  <span style={{ fontSize: '14px', color: 'rgba(240,237,232,0.4)', marginLeft: '4px' }}>{t.perMonth}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                  {t.proItems.map((item) => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'rgba(26,56,128,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#93B4F0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </div>
                      <span style={{ fontSize: '14px', color: '#F0EDE8' }}>{item}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={onProCheckout}
                  disabled={checkoutLoading === 'pro'}
                  className="lp-hover-opacity"
                  style={{
                    display: 'block', width: '100%', textAlign: 'center', padding: '11px',
                    background: '#F0EDE8', borderRadius: '8px', border: 'none',
                    fontSize: '14px', fontWeight: 600, color: '#0C1420',
                    cursor: checkoutLoading === 'pro' ? 'not-allowed' : 'pointer',
                    opacity: checkoutLoading === 'pro' ? 0.7 : 1,
                  }}
                >
                  {checkoutLoading === 'pro' ? '...' : t.proCta}
                </button>
              </div>
            </div>
          </Reveal>
        </div>

        {/* ISEP student note */}
        <Reveal delay={200}>
          <div style={{
            marginTop: '32px',
            padding: '16px 24px',
            borderRadius: '10px',
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap',
          }}>
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: 'var(--accent)', flexShrink: 0,
            }} />
            <p style={{ fontSize: '14px', color: 'var(--muted)', flex: 1, lineHeight: 1.6 }}>
              {t.isepNote}
            </p>
            <button
              onClick={onIsepCheckout}
              disabled={checkoutLoading === 'isep'}
              className="lp-hover-opacity"
              style={{
                fontSize: '13px', fontWeight: 500, color: 'var(--accent)',
                background: 'none', border: 'none', cursor: checkoutLoading === 'isep' ? 'not-allowed' : 'pointer',
                whiteSpace: 'nowrap', flexShrink: 0, padding: 0,
                opacity: checkoutLoading === 'isep' ? 0.6 : 1,
              }}
            >
              {checkoutLoading === 'isep' ? '...' : t.isepCta}
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

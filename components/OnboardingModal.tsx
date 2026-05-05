'use client'

import { useState, useEffect } from 'react'

const STORAGE_KEY = 'memento_onboarded'

const COPY = {
  fr: {
    title: 'Bienvenue sur Memento',
    subtitle: 'Voici comment ça marche en 3 étapes.',
    steps: [
      {
        title: 'Colle ton cours',
        desc: 'Paste le texte de ton cours ou importe un PDF. Tu peux aussi écrire du code pour le mode Code.',
      },
      {
        title: 'Récite à voix haute',
        desc: 'Clique sur "Commencer" et parle. La reconnaissance vocale transcrit ta récitation en temps réel.',
      },
      {
        title: 'Lis ton feedback',
        desc: 'Memento compare ta récitation à ton cours et génère un rapport structuré en 4 axes.',
      },
    ],
    note: 'Utilise Chrome ou Edge pour la reconnaissance vocale.',
    cta: "C'est parti",
  },
  en: {
    title: 'Welcome to Memento',
    subtitle: "Here's how it works in 3 steps.",
    steps: [
      {
        title: 'Paste your course',
        desc: 'Paste your course text or import a PDF. You can also paste code for Code mode.',
      },
      {
        title: 'Recite out loud',
        desc: 'Click "Start" and speak. Speech recognition transcribes your recitation in real time.',
      },
      {
        title: 'Read your feedback',
        desc: 'Memento compares your recitation to your course and generates a structured 4-axis report.',
      },
    ],
    note: 'Use Chrome or Edge for speech recognition.',
    cta: "Let's go",
  },
}

function StepIcon({ index }: { index: number }) {
  const style = { flexShrink: 0 as const }
  if (index === 0) return (
    <svg style={style} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  )
  if (index === 1) return (
    <svg style={style} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
      <line x1="12" y1="19" x2="12" y2="23"/>
      <line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
  )
  return (
    <svg style={style} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  )
}

export default function OnboardingModal({ lang }: { lang: 'fr' | 'en' }) {
  const [visible, setVisible] = useState(false)
  const [resolvedLang, setResolvedLang] = useState<'fr' | 'en'>(lang)

  useEffect(() => {
    const saved = localStorage.getItem('uiLang')
    if (saved === 'en' || saved === 'fr') setResolvedLang(saved)
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true)
    }
  }, [])

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  const t = COPY[resolvedLang]

  if (!visible) return null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={dismiss}
        style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(3px)',
          animation: 'onboardFadeIn 0.2s ease',
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 101,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
        pointerEvents: 'none',
      }}>
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '18px',
          padding: '32px 28px',
          width: '100%',
          maxWidth: '440px',
          pointerEvents: 'all',
          animation: 'onboardSlideUp 0.25s ease',
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px',
              background: 'var(--accent-light)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h2 style={{
              fontFamily: 'Cormorant, serif', fontSize: '24px', fontWeight: 600,
              color: 'var(--text)', margin: '0 0 6px', letterSpacing: '-0.01em',
            }}>
              {t.title}
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--muted)', margin: 0 }}>
              {t.subtitle}
            </p>
          </div>

          {/* Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
            {t.steps.map((step, i) => (
              <div key={i} style={{
                display: 'flex', gap: '14px', alignItems: 'flex-start',
                padding: '14px', borderRadius: '10px',
                background: 'var(--bg)', border: '1px solid var(--border)',
              }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  background: 'var(--accent-light)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <StepIcon index={i} />
                </div>
                <div style={{ paddingTop: '2px' }}>
                  <p style={{ margin: '0 0 3px', fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
                    {step.title}
                  </p>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)', lineHeight: 1.5 }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Note */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: '8px',
            marginBottom: '20px', padding: '10px 12px',
            borderRadius: '8px', background: 'var(--bg)', border: '1px solid var(--border)',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '1px' }}>
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p style={{ margin: 0, fontSize: '11px', color: 'var(--muted)', lineHeight: 1.5 }}>
              {t.note}
            </p>
          </div>

          {/* CTA */}
          <button
            onClick={dismiss}
            style={{
              width: '100%', padding: '12px', borderRadius: '8px',
              background: 'var(--accent)', color: '#fff', border: 'none',
              fontSize: '14px', fontWeight: 600, cursor: 'pointer',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--accent-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--accent)')}
          >
            {t.cta}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes onboardFadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes onboardSlideUp { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
    </>
  )
}

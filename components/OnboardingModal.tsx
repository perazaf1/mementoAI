'use client'

import { useState, useEffect } from 'react'

const STORAGE_KEY = 'memento_onboarded'

const COPY = {
  fr: {
    title: 'Bienvenue sur Memento',
    subtitle: 'Voici comment ça marche en 3 étapes.',
    steps: [
      {
        icon: '📄',
        title: 'Colle ton cours',
        desc: 'Paste le texte de ton cours ou importe un PDF. Tu peux aussi écrire du code pour le mode Code.',
      },
      {
        icon: '🎙️',
        title: 'Récite à voix haute',
        desc: 'Clique sur "Commencer" et parle. La reconnaissance vocale transcrit ta récitation en temps réel.',
      },
      {
        icon: '📊',
        title: 'Lis ton feedback',
        desc: 'Memento compare ta récitation à ton cours et génère un rapport structuré en 4 axes.',
      },
    ],
    note: 'Utilise Chrome ou Edge pour la reconnaissance vocale.',
    cta: "C'est parti !",
  },
  en: {
    title: 'Welcome to Memento',
    subtitle: 'Here\'s how it works in 3 steps.',
    steps: [
      {
        icon: '📄',
        title: 'Paste your course',
        desc: 'Paste your course text or import a PDF. You can also paste code for Code mode.',
      },
      {
        icon: '🎙️',
        title: 'Recite out loud',
        desc: 'Click "Start" and speak. Speech recognition transcribes your recitation in real time.',
      },
      {
        icon: '📊',
        title: 'Read your feedback',
        desc: 'Memento compares your recitation to your course and generates a structured 4-axis report.',
      },
    ],
    note: 'Use Chrome or Edge for speech recognition.',
    cta: "Let's go!",
  },
}

export default function OnboardingModal({ lang }: { lang: 'fr' | 'en' }) {
  const [visible, setVisible] = useState(false)
  const t = COPY[lang]

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true)
    }
  }, [])

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={dismiss}
        style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(3px)',
          animation: 'fadeIn 0.2s ease',
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
          animation: 'slideUp 0.25s ease',
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
                <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
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
                  fontSize: '18px', flexShrink: 0,
                }}>
                  {step.icon}
                </div>
                <div>
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
          <p style={{
            fontSize: '11px', color: 'var(--muted)', textAlign: 'center',
            marginBottom: '20px', lineHeight: 1.5,
          }}>
            ⚠️ {t.note}
          </p>

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
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
    </>
  )
}

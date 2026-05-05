'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

/* ─── Types ──────────────────────────────────────────────────────────── */
type Lang = 'fr' | 'en'

/* ─── Translations ───────────────────────────────────────────────────── */
const COPY = {
  fr: {
    // Nav
    login: 'Se connecter',
    startFree: 'Commencer gratuitement',

    // Hero
    badge: 'Disponible gratuitement',
    h1a: 'Récite ton cours.',
    h1b: 'Retiens-le vraiment.',
    sub: 'Parle à voix haute. Memento analyse ta récitation et te donne un feedback structuré sur ce que tu maîtrises, ce qui manque, et comment progresser.',
    ctaStart: 'Commencer gratuitement',
    ctaHow: 'Comment ça marche',

    // Mock UI labels
    mockTitle: 'Résultats',
    mockSub: 'Analyse de ta récitation en Programmation Orientée Objet.',
    mockSec1: 'Bien couvert',
    mockSec2: 'Points manquants',
    mockSec3: 'Imprécisions',
    mockSec4: 'Conseil',

    // How it works
    methodLabel: 'Méthode',
    methodH: 'Simple par design.',
    methodHSub: 'Efficace par nature.',
    s1title: 'Colle ton cours',
    s1desc: 'Colle ton contenu ou importe un PDF. Limité à 15 000 caractères (environ 10 pages). Au-delà, le feedback perd en précision.',
    s2title: 'Récite à voix haute',
    s2desc: 'Clique sur "Commencer" et parle. La reconnaissance vocale transcrit ta récitation en temps réel. Durée recommandée : moins de 10 minutes.',
    s3title: 'Reçois ton feedback',
    s3desc: "L'IA compare ta récitation au cours de référence et te génère un rapport précis en 4 axes.",

    // Features
    featLabel: 'Fonctionnalités',
    featH: 'Conçu pour les étudiants',
    featHSub: 'qui veulent progresser.',
    f1tag: 'Tous niveaux',
    f1title: 'Mode Cours',
    f1desc: "Colle n'importe quel contenu textuel ou importe un PDF. Memento s'adapte à toutes les matières. Limité à 15 000 caractères par session.",
    f2tag: 'Algorithmie',
    f2title: 'Mode Code',
    f2desc: 'Explique un algorithme à voix haute. Memento évalue ta compréhension de la logique, de la complexité et des cas limites. Limité à 50 lignes de code.',
    f3tag: 'International',
    f3title: '11 langues de feedback',
    f3desc: 'Récite en français, en anglais, en espagnol... Memento détecte la langue et répond dans celle que tu choisis.',

    // Pricing
    pricingLabel: 'Tarifs',
    pricingH: 'Commence gratuitement.',
    pricingHSub: 'Passe au Pro quand tu es prêt.',
    freePlan: 'Gratuit',
    proPlan: 'Pro',
    popular: 'Populaire',
    perMonth: '/mois',
    freeItems: ['3 sessions par jour', 'Mode Cours', '15 000 caractères par session', 'Français et anglais', 'Feedback structuré en 4 axes'],
    proItems: ['Sessions illimitées', 'Mode Cours et Mode Code', '25 000 caractères par session', '11 langues de feedback', 'Historique complet', 'Support prioritaire'],
    freeCta: 'Commencer gratuitement',
    proCta: 'Commencer avec Pro',
    isepNote: 'Étudiant à l\'ISEP ? Accède au plan Pro à 5€/mois en t\'inscrivant avec ton adresse @eleve.isep.fr.',
    isepCta: 'En savoir plus',

    // Footer
    footerOpen: "Ouvrir l'application",
  },
  en: {
    // Nav
    login: 'Log in',
    startFree: 'Start for free',

    // Hero
    badge: 'Free to use',
    h1a: 'Recite your course.',
    h1b: 'Actually remember it.',
    sub: 'Speak out loud. Memento analyses your recitation and gives you structured feedback on what you know, what is missing, and how to improve.',
    ctaStart: 'Start for free',
    ctaHow: 'How it works',

    // Mock UI labels
    mockTitle: 'Results',
    mockSub: 'Analysis of your recitation in Object-Oriented Programming.',
    mockSec1: 'Well covered',
    mockSec2: 'Missing points',
    mockSec3: 'Imprecisions',
    mockSec4: 'Advice',

    // How it works
    methodLabel: 'Method',
    methodH: 'Simple by design.',
    methodHSub: 'Effective by nature.',
    s1title: 'Paste your course',
    s1desc: 'Paste your content or import a PDF. Limit: 15,000 characters (about 10 pages). Beyond that, feedback quality decreases.',
    s2title: 'Recite out loud',
    s2desc: 'Click "Start" and speak. Speech recognition transcribes your recitation in real time. Recommended duration: under 10 minutes.',
    s3title: 'Get your feedback',
    s3desc: 'The AI compares your recitation to the reference material and generates a precise report across 4 dimensions.',

    // Features
    featLabel: 'Features',
    featH: 'Built for students',
    featHSub: 'who want to improve.',
    f1tag: 'All levels',
    f1title: 'Course mode',
    f1desc: 'Paste any text or import a PDF. Memento works with any subject. Limit: 15,000 characters per session.',
    f2tag: 'Algorithms',
    f2title: 'Code mode',
    f2desc: 'Explain an algorithm out loud. Memento evaluates your understanding of the logic, complexity, and edge cases. Limit: 50 lines of code.',
    f3tag: 'International',
    f3title: '11 feedback languages',
    f3desc: 'Recite in French, English, Spanish... Memento detects the language and responds in whichever you choose.',

    // Pricing
    pricingLabel: 'Pricing',
    pricingH: 'Start for free.',
    pricingHSub: 'Upgrade when you are ready.',
    freePlan: 'Free',
    proPlan: 'Pro',
    popular: 'Popular',
    perMonth: '/month',
    freeItems: ['3 sessions per day', 'Course mode', '15,000 characters per session', 'French and English', 'Structured feedback in 4 axes'],
    proItems: ['Unlimited sessions', 'Course and Code mode', '25,000 characters per session', '11 feedback languages', 'Full session history', 'Priority support'],
    freeCta: 'Start for free',
    proCta: 'Start with Pro',
    isepNote: 'Studying at ISEP? Get Pro access at 5€/month by signing up with your @eleve.isep.fr address.',
    isepCta: 'Learn more',

    // Footer
    footerOpen: 'Open the app',
  },
}

/* ─── Feedback mock data (static, shown in hero) ────────────────────── */
const MOCK_CONTENT = {
  fr: {
    sec1: 'La notion de polymorphisme et les constructeurs ont été clairement expliqués.',
    sec2items: ["L'encapsulation et les modificateurs d'accès", 'Les interfaces et classes abstraites'],
    sec3: "La définition de l'héritage manque de précision sur la notion de surcharge.",
    sec4: 'Concentre-toi sur les interfaces lors de ta prochaine révision.',
  },
  en: {
    sec1: 'The concept of polymorphism and constructors were clearly explained.',
    sec2items: ['Encapsulation and access modifiers', 'Interfaces and abstract classes'],
    sec3: 'The definition of inheritance lacks precision regarding method overloading.',
    sec4: 'Focus on interfaces in your next revision session.',
  },
}

/* ─── Scroll reveal ──────────────────────────────────────────────────── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.12 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return { ref, visible }
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useReveal()
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(22px)',
      transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
    }}>
      {children}
    </div>
  )
}

/* ─── Lang switcher (shared UI) ──────────────────────────────────────── */
function LangToggle({ lang, setLang, dark }: { lang: Lang; setLang: (l: Lang) => void; dark?: boolean }) {
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

/* ─── Nav ────────────────────────────────────────────────────────────── */
function Nav({ t, lang, setLang }: { t: typeof COPY.fr; lang: Lang; setLang: (l: Lang) => void }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
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
        style={{ fontFamily: 'Cormorant, serif', fontSize: '22px', fontWeight: 600, letterSpacing: '-0.02em', color: '#F0EDE8', cursor: 'default', transition: 'text-shadow 0.2s ease' }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.textShadow = '0 0 24px rgba(240,237,232,0.35)')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.textShadow = 'none')}
      >
        Memento
      </span>

      <div style={{ flex: 1 }} />

      <LangToggle lang={lang} setLang={setLang} dark />

      <Link href="/app" className="hide-mobile" style={{
        fontSize: '13px', color: 'rgba(240,237,232,0.65)', textDecoration: 'none', padding: '6px 12px', transition: 'color 0.15s ease',
      }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#F0EDE8')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(240,237,232,0.65)')}
      >
        {t.login}
      </Link>
      <Link href="/app" style={{
        fontSize: '13px', fontWeight: 500, background: '#F0EDE8', color: '#0C1420',
        padding: '7px 18px', borderRadius: '6px', textDecoration: 'none', transition: 'opacity 0.15s ease',
        whiteSpace: 'nowrap',
      }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
      >
        {t.startFree}
      </Link>
    </nav>
  )
}

/* ─── Hero ───────────────────────────────────────────────────────────── */
function Hero({ t, lang }: { t: typeof COPY.fr; lang: Lang }) {
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

/* ─── How it works ───────────────────────────────────────────────────── */
function HowItWorks({ t }: { t: typeof COPY.fr }) {
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
            <h2 style={{ fontFamily: 'Cormorant, serif', fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--text)', lineHeight: 1.15 }}>
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
                  <span style={{ fontFamily: 'Cormorant, serif', fontSize: '52px', fontWeight: 300, letterSpacing: '-0.03em', color: 'var(--border)', lineHeight: 1 }}>
                    {step.n}
                  </span>
                  <div style={{ color: 'var(--accent)', marginTop: '4px' }}>{step.icon}</div>
                </div>
                <h3 style={{ fontFamily: 'Cormorant, serif', fontSize: '22px', fontWeight: 500, color: 'var(--text)', marginBottom: '10px', letterSpacing: '-0.01em' }}>
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

/* ─── Features ───────────────────────────────────────────────────────── */
function Features({ t }: { t: typeof COPY.fr }) {
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
            <h2 style={{ fontFamily: 'Cormorant, serif', fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--text)', lineHeight: 1.15 }}>
              {t.featH}
              <br />
              <span style={{ color: 'var(--muted)' }}>{t.featHSub}</span>
            </h2>
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 100}>
              <div
                style={{ padding: '32px', borderRadius: '12px', border: '1px solid transparent', transition: 'border-color 0.2s ease, background 0.2s ease, transform 0.2s ease' }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = 'rgba(26,56,128,0.18)'
                  el.style.background = 'var(--bg)'
                  el.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = 'transparent'
                  el.style.background = 'transparent'
                  el.style.transform = 'translateY(0)'
                }}
              >
                <div style={{
                  display: 'inline-block', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em',
                  textTransform: 'uppercase', color: 'var(--accent)', background: 'var(--accent-light)',
                  padding: '3px 10px', borderRadius: '100px', marginBottom: '20px',
                }}>
                  {f.tag}
                </div>
                <h3 style={{ fontFamily: 'Cormorant, serif', fontSize: '24px', fontWeight: 500, color: 'var(--text)', marginBottom: '12px', letterSpacing: '-0.01em' }}>
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

/* ─── Pricing ────────────────────────────────────────────────────────── */
function Pricing({ t }: { t: typeof COPY.fr }) {
  return (
    <section className="lp-section" style={{ background: 'var(--bg)', padding: '120px 24px', borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: '840px', margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <p style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '14px' }}>
              {t.pricingLabel}
            </p>
            <h2 style={{ fontFamily: 'Cormorant, serif', fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--text)', lineHeight: 1.15 }}>
              {t.pricingH}
              <br />
              <span style={{ color: 'var(--muted)' }}>{t.pricingHSub}</span>
            </h2>
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'start' }}>
          {/* Free */}
          <Reveal delay={0}>
            <div
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '36px', transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease' }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.transform = 'translateY(-3px)'
                el.style.boxShadow = '0 12px 36px rgba(0,0,0,0.07)'
                el.style.borderColor = 'rgba(26,56,128,0.2)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.transform = 'translateY(0)'
                el.style.boxShadow = 'none'
                el.style.borderColor = 'var(--border)'
              }}
            >
              <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--muted)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {t.freePlan}
              </p>
              <div style={{ marginBottom: '28px' }}>
                <span style={{ fontFamily: 'Cormorant, serif', fontSize: '52px', fontWeight: 500, color: 'var(--text)', letterSpacing: '-0.03em' }}>0€</span>
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
              <Link href="/app" style={{
                display: 'block', textAlign: 'center', padding: '11px',
                border: '1px solid var(--border)', borderRadius: '8px',
                fontSize: '14px', fontWeight: 500, color: 'var(--text)', textDecoration: 'none', transition: 'all 0.15s ease',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text)' }}
              >
                {t.freeCta}
              </Link>
            </div>
          </Reveal>

          {/* Pro */}
          <Reveal delay={120}>
            <div
              style={{ background: '#0C1420', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '36px', position: 'relative', overflow: 'hidden', transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease' }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.transform = 'translateY(-3px)'
                el.style.boxShadow = '0 16px 48px rgba(26,56,128,0.25)'
                el.style.borderColor = 'rgba(255,255,255,0.15)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.transform = 'translateY(0)'
                el.style.boxShadow = 'none'
                el.style.borderColor = 'rgba(255,255,255,0.08)'
              }}
            >
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
                  <span style={{ fontFamily: 'Cormorant, serif', fontSize: '52px', fontWeight: 500, color: '#F0EDE8', letterSpacing: '-0.03em' }}>8€</span>
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
                <Link href="/app" style={{
                  display: 'block', textAlign: 'center', padding: '11px',
                  background: '#F0EDE8', borderRadius: '8px',
                  fontSize: '14px', fontWeight: 600, color: '#0C1420', textDecoration: 'none', transition: 'opacity 0.15s ease',
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  {t.proCta}
                </Link>
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
            <Link href="/app" style={{
              fontSize: '13px', fontWeight: 500, color: 'var(--accent)',
              textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0,
              transition: 'opacity 0.15s ease',
            }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              {t.isepCta}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ─── Footer ─────────────────────────────────────────────────────────── */
const ICON_STYLE = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  width: '34px', height: '34px', borderRadius: '8px',
  border: '1px solid rgba(240,237,232,0.12)',
  color: 'rgba(240,237,232,0.45)',
  textDecoration: 'none',
  transition: 'all 0.15s ease',
} as const

function Footer({ t }: { t: typeof COPY.fr }) {
  return (
    <footer style={{
      background: '#0C1420', borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '32px clamp(16px, 4vw, 40px)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px',
    }}>
      {/* Left — logo */}
      <span style={{ fontFamily: 'Cormorant, serif', fontSize: '20px', fontWeight: 600, color: '#F0EDE8', letterSpacing: '-0.02em' }}>
        Memento
      </span>

      {/* Center — copyright */}
      <p className="lp-footer-center" style={{ fontSize: '13px', color: 'rgba(240,237,232,0.25)' }}>
        2026 - Made with love by perazaf1 the best 
      </p>

      {/* Right — social + app link */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* LinkedIn */}
        <a
          href="https://www.linkedin.com/in/perazaf1/"
          target="_blank"
          rel="noopener noreferrer"
          style={ICON_STYLE}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement
            el.style.borderColor = 'rgba(240,237,232,0.35)'
            el.style.color = '#F0EDE8'
            el.style.background = 'rgba(240,237,232,0.06)'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement
            el.style.borderColor = 'rgba(240,237,232,0.12)'
            el.style.color = 'rgba(240,237,232,0.45)'
            el.style.background = 'transparent'
          }}
          aria-label="LinkedIn"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
            <rect x="2" y="9" width="4" height="12"/>
            <circle cx="4" cy="4" r="2"/>
          </svg>
        </a>

        {/* GitHub */}
        <a
          href="https://github.com/perazaf1"
          target="_blank"
          rel="noopener noreferrer"
          style={ICON_STYLE}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement
            el.style.borderColor = 'rgba(240,237,232,0.35)'
            el.style.color = '#F0EDE8'
            el.style.background = 'rgba(240,237,232,0.06)'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement
            el.style.borderColor = 'rgba(240,237,232,0.12)'
            el.style.color = 'rgba(240,237,232,0.45)'
            el.style.background = 'transparent'
          }}
          aria-label="GitHub"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
          </svg>
        </a>

        {/* Divider */}
        <div style={{ width: '1px', height: '20px', background: 'rgba(240,237,232,0.1)', margin: '0 2px' }} />

        {/* App link */}
        <Link href="/app" style={{ fontSize: '13px', color: 'rgba(240,237,232,0.45)', textDecoration: 'none', transition: 'color 0.15s ease' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#F0EDE8')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(240,237,232,0.45)')}
        >
          {t.footerOpen}
        </Link>
      </div>
    </footer>
  )
}

/* ─── Page ───────────────────────────────────────────────────────────── */
export default function LandingPage() {
  const [lang, setLang] = useState<Lang>('fr')
  const t = COPY[lang]

  return (
    <>
      <style>{`
        @keyframes lp-pulse-ring {
          0%   { transform: scale(1);   opacity: 0.6; }
          70%  { transform: scale(2.4); opacity: 0;   }
          100% { transform: scale(2.4); opacity: 0;   }
        }
        @keyframes lp-pulse-dot {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.55; }
        }
        @media (max-width: 640px) {
          .lp-mock { transform: none !important; margin-top: 48px !important; }
          .lp-hero-text { text-align: left !important; }
          .lp-hero-ctas { justify-content: flex-start !important; }
          .lp-section { padding: 72px 16px !important; }
          .lp-footer-center { display: none !important; }
        }
      `}</style>
      <Nav t={t} lang={lang} setLang={setLang} />
      <Hero t={t} lang={lang} />
      <HowItWorks t={t} />
      <Features t={t} />
      <Pricing t={t} />
      <Footer t={t} />
    </>
  )
}

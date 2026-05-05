'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AppProvider, useApp, type AppMode } from '@/context/AppContext'
import InputScreen from '@/components/InputScreen'
import RecordingScreen from '@/components/RecordingScreen'
import FeedbackScreen from '@/components/FeedbackScreen'
import OnboardingModal from '@/components/OnboardingModal'
import { createClient } from '@/utils/supabase/client'
import { useIsMobile } from '@/hooks/useIsMobile'
import { type UILang } from '@/lib/i18n'

type Step = 'input' | 'recording' | 'feedback'

interface UserProfile {
  email: string
  plan: string
  sessions_today: number
}

const PLAN_LIMITS: Record<string, number> = { free: 3, pro: 20, isep: 10 }
const PLAN_LABELS: Record<string, string> = { free: 'Free', pro: 'Pro', isep: 'ISEP' }

function AppShell() {
  const { uiLang, setUiLang, mode, setMode, feedbackLang, t } = useApp()
  const router = useRouter()
  const supabase = createClient()
  const isMobile = useIsMobile()

  const [step, setStep] = useState<Step>('input')
  const [courseText, setCourseText] = useState('')
  const [transcript, setTranscript] = useState('')
  const [feedback, setFeedback] = useState('')
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false)
  const [feedbackError, setFeedbackError] = useState('')
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [sessionsUsed, setSessionsUsed] = useState(0)

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('users')
        .select('plan, sessions_today')
        .eq('id', user.id)
        .single()

      if (data) {
        setProfile({ email: user.email ?? '', plan: data.plan, sessions_today: data.sessions_today })
        setSessionsUsed(data.sessions_today)
      }
    }
    loadProfile()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const [upgradeError, setUpgradeError] = useState('')
  const [upgradeLoading, setUpgradeLoading] = useState(false)

  const handleUpgrade = async () => {
    setUpgradeError('')
    setUpgradeLoading(true)
    try {
      const isIsep = profile?.email?.endsWith('@eleve.isep.fr')
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: isIsep ? 'isep' : 'pro' }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setUpgradeError(data.error ?? 'Erreur lors de la création du checkout.')
      }
    } catch {
      setUpgradeError('Erreur réseau. Réessaie.')
    } finally {
      setUpgradeLoading(false)
    }
  }

  // Show upgrade success banner once after redirect
  const [showUpgradedBanner, setShowUpgradedBanner] = useState(false)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('upgraded') === '1') {
        setShowUpgradedBanner(true)
        window.history.replaceState({}, '', '/app')
        setTimeout(() => setShowUpgradedBanner(false), 5000)
      }
    }
  }, [])

  const handleModeChange = (m: AppMode) => {
    setMode(m)
    setCourseText('')
    setTranscript('')
    setFeedback('')
    setFeedbackError('')
    setStep('input')
  }

  const handleBeginSession = () => {
    setTranscript('')
    setFeedback('')
    setFeedbackError('')
    setStep('recording')
  }

  const handleStopRecording = async (finalTranscript: string) => {
    setTranscript(finalTranscript)
    setStep('feedback')
    setIsLoadingFeedback(true)
    setFeedbackError('')
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseText, transcript: finalTranscript, feedbackLang, mode }),
      })

      if (res.status === 429) {
        const data = await res.json()
        const limit = PLAN_LIMITS[data.plan] ?? 3
        setFeedbackError(`Tu as atteint ta limite de ${limit} sessions aujourd'hui. Reviens demain !`)
        return
      }

      if (!res.ok) throw new Error()
      const data = await res.json()
      setFeedback(data.feedback)
      if (data.sessionsUsed !== undefined) {
        setSessionsUsed(data.sessionsUsed)
      }
    } catch {
      setFeedbackError(t('errApi'))
    } finally {
      setIsLoadingFeedback(false)
    }
  }

  const handleTryAgain = () => {
    setTranscript('')
    setFeedback('')
    setFeedbackError('')
    setStep('recording')
  }

  const handleNewCourse = () => {
    setCourseText('')
    setTranscript('')
    setFeedback('')
    setFeedbackError('')
    setStep('input')
  }

  const stepIndex = ['input', 'recording', 'feedback'].indexOf(step)
  const stepLabels = mode === 'course'
    ? [t('modeCoursLabel'), 'Récitation', t('resultsTitle')]
    : [t('modeCodeLabel'), 'Explication', t('resultsTitle')]

  const plan = profile?.plan ?? 'free'
  const limit = PLAN_LIMITS[plan] ?? 3

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        borderBottom: '1px solid var(--border)',
        background: 'var(--surface)',
        padding: `0 ${isMobile ? '14px' : '28px'}`,
        height: '54px',
        display: 'flex',
        alignItems: 'center',
        gap: isMobile ? '8px' : '12px',
        flexShrink: 0,
      }}>
        {/* Logo */}
        <Link href="/" style={{
          fontFamily: 'Cormorant, serif', fontSize: '21px', fontWeight: 600,
          letterSpacing: '-0.02em', color: 'var(--text)', textDecoration: 'none', flexShrink: 0,
        }}>
          Memento
        </Link>

        {/* Mode switcher */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '2px',
          background: 'var(--bg)', borderRadius: '7px', padding: '3px',
          border: '1px solid var(--border)', flexShrink: 0,
        }}>
          {(['course', 'code'] as AppMode[]).map((m) => (
            <button key={m} onClick={() => handleModeChange(m)} style={{
              padding: '3px 10px', borderRadius: '5px', fontSize: '12px',
              fontWeight: mode === m ? 500 : 400,
              background: mode === m ? 'var(--surface)' : 'transparent',
              color: mode === m ? 'var(--text)' : 'var(--muted)',
              border: mode === m ? '1px solid var(--border)' : '1px solid transparent',
              cursor: 'pointer', transition: 'all 0.15s ease', whiteSpace: 'nowrap',
            }}>
              {m === 'course' ? t('modeCoursLabel') : t('modeCodeLabel')}
            </button>
          ))}
        </div>

        <div style={{ flex: 1 }} />

        {/* Breadcrumb — desktop only */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            {stepLabels.map((label, i) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: i <= stepIndex ? 'var(--accent)' : 'var(--border)',
                    transition: 'background 0.3s ease', flexShrink: 0,
                  }} />
                  <span style={{
                    fontSize: '12px',
                    color: i === stepIndex ? 'var(--text)' : 'var(--muted)',
                    fontWeight: i === stepIndex ? 500 : 400,
                  }}>{label}</span>
                </div>
                {i < 2 && <div style={{ width: '14px', height: '1px', background: i < stepIndex ? 'var(--accent)' : 'var(--border)' }} />}
              </div>
            ))}
          </div>
        )}

        {/* Separator — desktop only */}
        {!isMobile && <div style={{ width: '1px', height: '18px', background: 'var(--border)', flexShrink: 0 }} />}

        {/* Session counter */}
        {profile && (
          <div style={{
            fontSize: '12px',
            color: sessionsUsed >= limit ? 'var(--red)' : 'var(--muted)',
            flexShrink: 0, whiteSpace: 'nowrap',
          }}>
            <span style={{ fontWeight: 600, color: sessionsUsed >= limit ? 'var(--red)' : 'var(--text)' }}>
              {sessionsUsed}/{limit}
            </span>
            {!isMobile && <span style={{ marginLeft: '3px' }}>sessions</span>}
          </div>
        )}

        {/* Plan badge */}
        {profile && plan !== 'free' && (
          <div style={{
            fontSize: '10px', fontWeight: 700, letterSpacing: '0.07em',
            color: '#fff',
            background: 'var(--accent)',
            borderRadius: '4px', padding: '2px 7px',
            textTransform: 'uppercase', flexShrink: 0,
          }}>
            {PLAN_LABELS[plan] ?? plan}
          </div>
        )}

        {/* History — desktop only */}
        {!isMobile && (
          <Link href="/app/history" style={{
            fontSize: '12px', color: 'var(--muted)', textDecoration: 'none',
            flexShrink: 0, whiteSpace: 'nowrap',
          }}>
            Historique
          </Link>
        )}

        {/* Upgrade button — Free users only */}
        {profile && plan === 'free' && (
          <button onClick={handleUpgrade} disabled={upgradeLoading} style={{
            padding: '4px 12px', fontSize: '12px', fontWeight: 600,
            color: upgradeLoading ? 'var(--muted)' : 'var(--accent)',
            background: 'var(--accent-light)',
            border: '1px solid var(--accent)', borderRadius: '6px',
            cursor: upgradeLoading ? 'wait' : 'pointer',
            flexShrink: 0, whiteSpace: 'nowrap', transition: 'all 0.15s ease',
            opacity: upgradeLoading ? 0.7 : 1,
          }}
            onMouseEnter={(e) => { if (!upgradeLoading) { const el = e.currentTarget as HTMLElement; el.style.background = 'var(--accent)'; el.style.color = '#fff' } }}
            onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = 'var(--accent-light)'; el.style.color = 'var(--accent)' }}
          >
            {upgradeLoading ? '...' : isMobile ? 'Pro' : '⬆ Passer Pro'}
          </button>
        )}

        {/* Lang switcher */}
        <div style={{ display: 'flex', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border)', flexShrink: 0 }}>
          {(['fr', 'en'] as UILang[]).map((lang) => (
            <button key={lang} onClick={() => setUiLang(lang)} style={{
              padding: '3px 8px', fontSize: '11px',
              fontWeight: uiLang === lang ? 600 : 400,
              background: uiLang === lang ? 'var(--accent)' : 'transparent',
              color: uiLang === lang ? '#fff' : 'var(--muted)',
              border: 'none', cursor: 'pointer',
              textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>
              {lang}
            </button>
          ))}
        </div>

        {/* Sign out */}
        <button onClick={handleSignOut} title="Déconnexion" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: '30px', height: '30px',
          fontSize: '16px', color: 'var(--muted)',
          background: 'transparent', border: '1px solid var(--border)',
          borderRadius: '6px', cursor: 'pointer', flexShrink: 0,
          lineHeight: 1,
        }}>
          ↪
        </button>
      </header>

      {/* Upgrade error banner */}
      {upgradeError && (
        <div style={{
          background: 'var(--red-bg)', borderBottom: '1px solid var(--red-border)',
          padding: '10px 28px', display: 'flex', alignItems: 'center', gap: '10px',
          fontSize: '13px', color: 'var(--red)', flexShrink: 0,
        }}>
          <span>{upgradeError}</span>
          <button onClick={() => setUpgradeError('')} style={{
            marginLeft: 'auto', background: 'none', border: 'none',
            cursor: 'pointer', color: 'var(--red)', fontSize: '16px',
          }}>×</button>
        </div>
      )}

      {/* Upgrade success banner */}
      {showUpgradedBanner && (
        <div style={{
          background: 'var(--accent)', padding: '12px 20px',
          display: 'flex', alignItems: 'center', gap: '12px',
          flexShrink: 0, flexWrap: 'wrap',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#fff' }}>
              {profile?.plan === 'isep' ? 'Plan ISEP activé !' : 'Plan Pro activé !'}
            </p>
            <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.75)' }}>
              {profile?.plan === 'isep'
                ? '10 sessions par jour et 25 000 caractères sont maintenant disponibles.'
                : '20 sessions par jour, mode code et 11 langues sont maintenant disponibles.'}
            </p>
          </div>
          <button onClick={() => setShowUpgradedBanner(false)} style={{
            background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '6px',
            cursor: 'pointer', color: '#fff', fontSize: '13px', fontWeight: 500,
            padding: '4px 10px', flexShrink: 0,
          }}>
            OK
          </button>
        </div>
      )}

      {/* Mobile progress bar */}
      {isMobile && (
        <div style={{
          height: '3px', background: 'var(--border)',
          display: 'flex', flexShrink: 0,
        }}>
          <div style={{
            height: '100%',
            width: `${((stepIndex + 1) / 3) * 100}%`,
            background: 'var(--accent)',
            transition: 'width 0.4s ease',
          }} />
        </div>
      )}

      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: isMobile ? '28px 16px 60px' : '52px 24px 80px' }}>
        <div style={{ width: '100%', maxWidth: '660px' }}>
          {step === 'input' && (
            <InputScreen courseText={courseText} onCourseChange={setCourseText} onBegin={handleBeginSession} userPlan={profile?.plan} />
          )}
          {step === 'recording' && (
            <RecordingScreen onStop={handleStopRecording} onCancel={() => setStep('input')} />
          )}
          {step === 'feedback' && (
            <FeedbackScreen
              transcript={transcript} feedback={feedback}
              isLoading={isLoadingFeedback} error={feedbackError}
              onRetryFeedback={() => handleStopRecording(transcript)}
              onTryAgain={handleTryAgain} onNewCourse={handleNewCourse}
            />
          )}
        </div>
      </main>

      <OnboardingModal lang={uiLang} />
    </div>
  )
}

export default function AppPage() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  )
}

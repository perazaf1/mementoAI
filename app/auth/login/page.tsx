'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'

type AuthMode = 'login' | 'signup'
type Lang = 'fr' | 'en'

const COPY = {
  fr: {
    login: 'Connexion',
    signup: 'Créer un compte',
    forgotPassword: 'Mot de passe oublié ?',
    google: 'Continuer avec Google',
    googleLoading: 'Redirection...',
    or: 'ou',
    email: 'Email',
    password: 'Mot de passe',
    passwordPlaceholder: '••••••••',
    submit_login: 'Se connecter',
    submit_signup: 'Créer mon compte',
    loading_login: 'Connexion...',
    loading_signup: 'Création...',
    isep_note: 'Les étudiants ISEP (@eleve.isep.fr) bénéficient automatiquement du plan ISEP.',
    success: 'Vérifie ta boîte mail pour confirmer ton compte.',
  },
  en: {
    login: 'Sign in',
    signup: 'Create account',
    forgotPassword: 'Forgot password?',
    google: 'Continue with Google',
    googleLoading: 'Redirecting...',
    or: 'or',
    email: 'Email',
    password: 'Password',
    passwordPlaceholder: '••••••••',
    submit_login: 'Sign in',
    submit_signup: 'Create my account',
    loading_login: 'Signing in...',
    loading_signup: 'Creating...',
    isep_note: 'ISEP students (@eleve.isep.fr) automatically get the ISEP plan.',
    success: 'Check your inbox to confirm your account.',
  },
}

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [lang, setLang] = useState<Lang>('fr')
  const [authMode, setAuthMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  const c = COPY[lang]

  useEffect(() => {
    const saved = localStorage.getItem('uiLang') as Lang | null
    if (saved === 'en' || saved === 'fr') setLang(saved)
  }, [])

  const switchLang = (l: Lang) => {
    setLang(l)
    localStorage.setItem('uiLang', l)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')
    setLoading(true)

    try {
      if (authMode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setSuccessMsg(c.success)
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/app')
        router.refresh()
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback` },
    })
    if (error) {
      setError(error.message)
      setGoogleLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    background: 'var(--bg)',
    color: 'var(--text)',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      {/* Lang toggle */}
      <div style={{ position: 'fixed', top: '16px', right: '16px' }}>
        <div style={{
          display: 'flex', borderRadius: '6px', overflow: 'hidden',
          border: '1px solid var(--border)',
        }}>
          {(['fr', 'en'] as Lang[]).map((l) => (
            <button key={l} onClick={() => switchLang(l)} style={{
              padding: '4px 10px', fontSize: '12px',
              fontWeight: lang === l ? 600 : 400,
              background: lang === l ? 'var(--accent)' : 'transparent',
              color: lang === l ? '#fff' : 'var(--muted)',
              border: 'none', cursor: 'pointer',
              textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <Link href="/" style={{
        fontFamily: 'Cormorant, serif',
        fontSize: '26px',
        fontWeight: 600,
        letterSpacing: '-0.02em',
        color: 'var(--text)',
        textDecoration: 'none',
        marginBottom: '32px',
        display: 'block',
      }}>
        Memento
      </Link>

      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '14px',
        padding: '32px',
        width: '100%',
        maxWidth: '380px',
      }}>
        {/* Tab switcher */}
        <div style={{
          display: 'flex',
          background: 'var(--bg)',
          borderRadius: '8px',
          padding: '3px',
          border: '1px solid var(--border)',
          marginBottom: '24px',
        }}>
          {(['login', 'signup'] as AuthMode[]).map((m) => (
            <button
              key={m}
              onClick={() => { setAuthMode(m); setError(''); setSuccessMsg('') }}
              style={{
                flex: 1,
                padding: '6px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: authMode === m ? 500 : 400,
                background: authMode === m ? 'var(--surface)' : 'transparent',
                color: authMode === m ? 'var(--text)' : 'var(--muted)',
                border: authMode === m ? '1px solid var(--border)' : '1px solid transparent',
                cursor: 'pointer',
              }}
            >
              {m === 'login' ? c.login : c.signup}
            </button>
          ))}
        </div>

        {/* Google OAuth */}
        <button
          onClick={handleGoogle}
          disabled={googleLoading}
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            background: 'var(--bg)',
            color: 'var(--text)',
            fontSize: '14px',
            fontWeight: 500,
            cursor: googleLoading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            opacity: googleLoading ? 0.6 : 1,
            marginBottom: '16px',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {googleLoading ? c.googleLoading : c.google}
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '16px',
        }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{c.or}</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>

        {/* Email/password form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 500, display: 'block', marginBottom: '5px' }}>
              {c.email}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 500, display: 'block', marginBottom: '5px' }}>
              {c.password}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={c.passwordPlaceholder}
              required
              minLength={6}
              style={inputStyle}
            />
          </div>

          {error && (
            <p style={{ fontSize: '13px', color: 'var(--red)', margin: 0 }}>{error}</p>
          )}
          {successMsg && (
            <p style={{ fontSize: '13px', color: 'var(--green)', margin: 0 }}>{successMsg}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              border: 'none',
              background: loading ? 'var(--accent-light)' : 'var(--accent)',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '4px',
            }}
          >
            {loading
              ? (authMode === 'login' ? c.loading_login : c.loading_signup)
              : (authMode === 'login' ? c.submit_login : c.submit_signup)
            }
          </button>

          {authMode === 'login' && (
            <Link href="/auth/reset-password" style={{
              display: 'block', textAlign: 'center', marginTop: '12px',
              fontSize: '12px', color: 'var(--muted)', textDecoration: 'none',
            }}>
              {c.forgotPassword}
            </Link>
          )}
        </form>

        {authMode === 'signup' && (
          <p style={{ fontSize: '11px', color: 'var(--muted)', textAlign: 'center', marginTop: '16px', lineHeight: 1.5 }}>
            {c.isep_note}
          </p>
        )}
      </div>
    </div>
  )
}

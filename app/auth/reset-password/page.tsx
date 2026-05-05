'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'

type Lang = 'fr' | 'en'

const COPY = {
  fr: {
    title: 'Mot de passe oublié',
    sub: 'Saisis ton adresse email. Tu recevras un lien pour réinitialiser ton mot de passe.',
    email: 'Email',
    submit: 'Envoyer le lien',
    loading: 'Envoi...',
    success: 'Lien envoyé ! Vérifie ta boîte mail (et tes spams).',
    back: '← Retour à la connexion',
  },
  en: {
    title: 'Forgot password',
    sub: 'Enter your email address. You will receive a link to reset your password.',
    email: 'Email',
    submit: 'Send reset link',
    loading: 'Sending...',
    success: 'Link sent! Check your inbox (and spam folder).',
    back: '← Back to sign in',
  },
}

export default function ResetPasswordPage() {
  const supabase = createClient()
  const [lang, setLang] = useState<Lang>('fr')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('uiLang') as Lang | null
    if (saved === 'fr' || saved === 'en') setLang(saved)
  }, [])

  const c = COPY[lang]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const redirectTo = `${location.origin}/auth/update-password`
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
    if (error) setError(error.message)
    else setSuccess(true)
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}>
      {/* Lang toggle */}
      <div style={{ position: 'fixed', top: '16px', right: '16px' }}>
        <div style={{ display: 'flex', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border)' }}>
          {(['fr', 'en'] as Lang[]).map((l) => (
            <button key={l} onClick={() => { setLang(l); localStorage.setItem('uiLang', l) }} style={{
              padding: '4px 10px', fontSize: '12px',
              fontWeight: lang === l ? 600 : 400,
              background: lang === l ? 'var(--accent)' : 'transparent',
              color: lang === l ? '#fff' : 'var(--muted)',
              border: 'none', cursor: 'pointer',
              textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>{l}</button>
          ))}
        </div>
      </div>

      <Link href="/" style={{
        fontFamily: 'Cormorant, serif', fontSize: '26px', fontWeight: 600,
        letterSpacing: '-0.02em', color: 'var(--text)', textDecoration: 'none',
        marginBottom: '32px', display: 'block',
      }}>
        Memento
      </Link>

      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: '14px', padding: '32px', width: '100%', maxWidth: '380px',
      }}>
        <h1 style={{
          fontFamily: 'Cormorant, serif', fontSize: '24px', fontWeight: 500,
          color: 'var(--text)', marginBottom: '8px', letterSpacing: '-0.01em',
        }}>
          {c.title}
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '24px', lineHeight: 1.6 }}>
          {c.sub}
        </p>

        {success ? (
          <div style={{
            padding: '14px', borderRadius: '8px',
            background: 'var(--green-bg)', border: '1px solid var(--green-border)',
            fontSize: '13px', color: 'var(--green)', lineHeight: 1.6,
          }}>
            {c.success}
          </div>
        ) : (
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
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: '8px',
                  border: '1px solid var(--border)', background: 'var(--bg)',
                  color: 'var(--text)', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>

            {error && <p style={{ fontSize: '13px', color: 'var(--red)', margin: 0 }}>{error}</p>}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: '8px', border: 'none',
                background: loading ? 'var(--accent-light)' : 'var(--accent)',
                color: '#fff', fontSize: '14px', fontWeight: 500,
                cursor: loading ? 'not-allowed' : 'pointer', marginTop: '4px',
              }}
            >
              {loading ? c.loading : c.submit}
            </button>
          </form>
        )}

        <Link href="/auth/login" style={{
          display: 'block', marginTop: '20px', fontSize: '13px',
          color: 'var(--muted)', textDecoration: 'none', textAlign: 'center',
        }}>
          {c.back}
        </Link>
      </div>
    </div>
  )
}

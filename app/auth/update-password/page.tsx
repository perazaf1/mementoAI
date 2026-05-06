'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'

type Lang = 'fr' | 'en'

const COPY = {
  fr: {
    title: 'Nouveau mot de passe',
    sub: 'Choisis un nouveau mot de passe pour ton compte.',
    password: 'Nouveau mot de passe',
    confirm: 'Confirmer le mot de passe',
    submit: 'Mettre à jour',
    loading: 'Mise à jour...',
    mismatch: 'Les mots de passe ne correspondent pas.',
    success: 'Mot de passe mis à jour ! Redirection...',
    short: 'Le mot de passe doit contenir au moins 6 caractères.',
  },
  en: {
    title: 'New password',
    sub: 'Choose a new password for your account.',
    password: 'New password',
    confirm: 'Confirm password',
    submit: 'Update password',
    loading: 'Updating...',
    mismatch: 'Passwords do not match.',
    success: 'Password updated! Redirecting...',
    short: 'Password must be at least 6 characters.',
  },
}

export default function UpdatePasswordPage() {
  const supabase = createClient()
  const router = useRouter()
  const [lang, setLang] = useState<Lang>('fr')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
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

    if (password.length < 6) { setError(c.short); return }
    if (password !== confirm) { setError(c.mismatch); return }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    setSuccess(true)
    setTimeout(() => router.push('/app'), 1800)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: '8px',
    border: '1px solid var(--border)', background: 'var(--bg)',
    color: 'var(--text)', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
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
        fontFamily: 'var(--heading-font)', fontSize: '26px', fontWeight: 600,
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
          fontFamily: 'var(--heading-font)', fontSize: '24px', fontWeight: 500,
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
                {c.password}
              </label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" required style={inputStyle} />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 500, display: 'block', marginBottom: '5px' }}>
                {c.confirm}
              </label>
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••" required style={inputStyle} />
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
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'

interface Recitation {
  id: string
  mode: 'course' | 'code'
  course_text: string | null
  transcript: string
  feedback: string
  created_at: string
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function truncate(str: string, n: number) {
  return str.length > n ? str.slice(0, n) + '…' : str
}

export default function HistoryPage() {
  const supabase = createClient()
  const [recitations, setRecitations] = useState<Recitation[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('recitations')
        .select('id, mode, course_text, transcript, feedback, created_at')
        .order('created_at', { ascending: false })
        .limit(50)

      setRecitations(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        borderBottom: '1px solid var(--border)',
        background: 'var(--surface)',
        padding: '0 clamp(14px, 4vw, 28px)',
        height: '54px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}>
        <Link href="/" style={{
          fontFamily: 'Cormorant, serif',
          fontSize: '21px',
          fontWeight: 600,
          letterSpacing: '-0.02em',
          color: 'var(--text)',
          textDecoration: 'none',
        }}>
          Memento
        </Link>
        <div style={{ flex: 1 }} />
        <Link href="/app" style={{
          fontSize: '13px',
          color: 'var(--accent)',
          textDecoration: 'none',
          padding: '5px 12px',
          borderRadius: '7px',
          background: 'var(--accent-light)',
          fontWeight: 500,
        }}>
          ← Retour à l'app
        </Link>
      </header>

      <main style={{ flex: 1, maxWidth: '720px', margin: '0 auto', width: '100%', padding: 'clamp(28px, 5vw, 48px) clamp(14px, 4vw, 24px) 80px' }}>
        <h1 style={{
          fontFamily: 'Cormorant, serif',
          fontSize: '28px',
          fontWeight: 600,
          color: 'var(--text)',
          marginBottom: '8px',
        }}>
          Historique
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '32px' }}>
          Tes 50 dernières récitations.
        </p>

        {loading && (
          <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Chargement…</p>
        )}

        {!loading && recitations.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 24px',
            background: 'var(--surface)',
            borderRadius: '12px',
            border: '1px solid var(--border)',
          }}>
            <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '16px' }}>
              Aucune récitation pour l'instant.
            </p>
            <Link href="/app" style={{
              color: 'var(--accent)',
              fontSize: '14px',
              textDecoration: 'none',
              fontWeight: 500,
            }}>
              Commencer une session →
            </Link>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {recitations.map((r) => (
            <div
              key={r.id}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                overflow: 'hidden',
              }}
            >
              {/* Header row */}
              <button
                onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: r.mode === 'code' ? 'var(--blue)' : 'var(--accent)',
                  background: r.mode === 'code' ? 'var(--blue-bg)' : 'var(--accent-light)',
                  border: `1px solid ${r.mode === 'code' ? 'var(--blue-border)' : 'transparent'}`,
                  borderRadius: '4px',
                  padding: '2px 7px',
                  flexShrink: 0,
                }}>
                  {r.mode === 'code' ? 'Code' : 'Cours'}
                </span>

                <span style={{ fontSize: '13px', color: 'var(--text)', flex: 1, fontWeight: 500 }}>
                  {r.course_text ? truncate(r.course_text, 60) : truncate(r.transcript, 60)}
                </span>

                <span style={{ fontSize: '12px', color: 'var(--muted)', flexShrink: 0 }}>
                  {formatDate(r.created_at)}
                </span>

                <span style={{ fontSize: '12px', color: 'var(--muted)', flexShrink: 0 }}>
                  {expanded === r.id ? '▲' : '▼'}
                </span>
              </button>

              {/* Expanded content */}
              {expanded === r.id && (
                <div style={{
                  borderTop: '1px solid var(--border)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}>
                  <div>
                    <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                      Transcription
                    </p>
                    <p style={{ fontSize: '13px', color: 'var(--text)', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>
                      {r.transcript}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                      Feedback
                    </p>
                    <pre style={{
                      fontSize: '13px',
                      color: 'var(--text)',
                      lineHeight: 1.6,
                      margin: 0,
                      whiteSpace: 'pre-wrap',
                      fontFamily: 'inherit',
                    }}>
                      {r.feedback}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

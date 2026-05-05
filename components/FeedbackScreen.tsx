'use client'

import { useState } from 'react'
import ErrorBanner from './ErrorBanner'
import { useApp } from '@/context/AppContext'

interface FeedbackScreenProps {
  transcript: string
  feedback: string
  isLoading: boolean
  error: string
  onRetryFeedback: () => void
  onTryAgain: () => void
  onNewCourse: () => void
}

interface Section {
  key: string
  labelKey: 'secWellCovered' | 'secMissing' | 'secImprecisions' | 'secAdvice'
  matchKeys: string[]
  color: string
  borderColor: string
  bg: string
  content: string
}

const SECTION_DEFS: Omit<Section, 'content'>[] = [
  {
    key: 'well',
    labelKey: 'secWellCovered',
    matchKeys: ['bien couvert', 'well covered', 'well explained', 'bien expliqué'],
    color: 'var(--green)',
    borderColor: 'var(--green)',
    bg: 'var(--green-bg)',
  },
  {
    key: 'missing',
    labelKey: 'secMissing',
    matchKeys: ['points manquants', 'missing points', 'manquants', 'missing or incorrect'],
    color: 'var(--red)',
    borderColor: 'var(--red)',
    bg: 'var(--red-bg)',
  },
  {
    key: 'imprecisions',
    labelKey: 'secImprecisions',
    matchKeys: ['imprécisions', 'imprecisions'],
    color: 'var(--orange)',
    borderColor: 'var(--orange)',
    bg: 'var(--orange-bg)',
  },
  {
    key: 'advice',
    labelKey: 'secAdvice',
    matchKeys: ['conseil', 'advice'],
    color: 'var(--blue)',
    borderColor: 'var(--blue)',
    bg: 'var(--blue-bg)',
  },
]

function parseFeedback(raw: string): Section[] {
  const sections: Section[] = []
  let current: Section | null = null

  for (const line of raw.split('\n')) {
    // Match markdown headings: ## Some Title
    const headingMatch = line.match(/^#+\s*(.+)/)
    if (headingMatch) {
      const headingText = headingMatch[1].trim().toLowerCase()
      const def = SECTION_DEFS.find((d) =>
        d.matchKeys.some((k) => headingText.includes(k))
      )
      if (def) {
        if (current) sections.push(current)
        current = { ...def, content: '' }
        continue
      }
    }
    if (current) {
      current.content += line + '\n'
    }
  }
  if (current) sections.push(current)

  // Fallback: unknown format
  if (sections.length === 0) {
    return [{
      key: 'raw',
      labelKey: 'secAdvice',
      matchKeys: [],
      color: 'var(--text)',
      borderColor: 'var(--border)',
      bg: 'var(--surface)',
      content: raw,
    }]
  }

  return sections
}

function renderContent(raw: string) {
  const lines = raw.trim().split('\n').filter((l) => l.trim() !== '')
  if (lines.length === 0) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {lines.map((line, i) => {
        const isBullet = /^[-*]\s/.test(line.trim())
        const text = isBullet ? line.replace(/^[-*]\s+/, '') : line

        // Render **bold**
        const parts = text.split(/\*\*(.*?)\*\*/g)
        const rendered = parts.map((part, j) =>
          j % 2 === 1
            ? <strong key={j} style={{ fontWeight: 600 }}>{part}</strong>
            : part
        )

        if (isBullet) {
          return (
            <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{
                marginTop: '8px',
                width: '4px', height: '4px', borderRadius: '50%',
                background: 'currentColor', flexShrink: 0, opacity: 0.45,
              }} />
              <span style={{ fontSize: '14px', lineHeight: 1.7 }}>{rendered}</span>
            </div>
          )
        }
        return (
          <p key={i} style={{ fontSize: '14px', lineHeight: 1.7 }}>{rendered}</p>
        )
      })}
    </div>
  )
}

export default function FeedbackScreen({
  transcript,
  feedback,
  isLoading,
  error,
  onRetryFeedback,
  onTryAgain,
  onNewCourse,
}: FeedbackScreenProps) {
  const { t, mode } = useApp()
  const [showTranscript, setShowTranscript] = useState(false)
  const sections = feedback ? parseFeedback(feedback) : []
  const isCode = mode === 'code'

  return (
    <div className="animate-fade-up">
      {/* Page title */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontFamily: 'Cormorant, serif', fontSize: '36px', fontWeight: 500,
          lineHeight: 1.15, letterSpacing: '-0.02em', color: 'var(--text)', marginBottom: '8px',
        }}>
          {t('resultsTitle')}
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '14px' }}>
          {isCode ? t('resultsCodeSubtitle') : t('resultsCourseSubtitle')}
        </p>
      </div>

      {/* Loading */}
      {isLoading && (
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '64px 24px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px',
        }}>
          <div style={{
            width: '30px', height: '30px', borderRadius: '50%',
            border: '2px solid var(--border)', borderTopColor: 'var(--accent)',
            animation: 'spin 0.8s linear infinite',
          }} />
          <p style={{ fontSize: '14px', color: 'var(--muted)' }}>{t('analyzing')}</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Error */}
      {!isLoading && error && (
        <ErrorBanner message={error} onRetry={onRetryFeedback} />
      )}

      {/* 4 Sections */}
      {!isLoading && !error && sections.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {sections.map((section) => (
            <div
              key={section.key}
              style={{
                borderRadius: '10px',
                border: '1px solid var(--border)',
                borderLeft: `3px solid ${section.borderColor}`,
                background: section.bg,
                overflow: 'hidden',
              }}
            >
              {/* Section header */}
              <div style={{
                padding: '14px 20px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: section.color,
                }}>
                  {t(section.labelKey)}
                </span>
              </div>

              {/* Section body */}
              <div style={{
                padding: '10px 20px 18px',
                color: 'var(--text)',
              }}>
                {renderContent(section.content)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Transcript collapsible */}
      {!isLoading && transcript && (
        <div style={{ marginTop: '28px' }}>
          <button
            onClick={() => setShowTranscript((v) => !v)}
            style={{
              fontSize: '13px', color: 'var(--muted)', background: 'none', border: 'none',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', padding: 0,
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--muted)')}
          >
            <svg
              width="11" height="11" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2"
              style={{ transform: showTranscript ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s ease' }}
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
            {t('transcriptToggle')}
          </button>
          {showTranscript && (
            <div style={{
              marginTop: '10px', padding: '16px 20px', borderRadius: '8px',
              border: '1px solid var(--border)', background: 'var(--surface)',
              fontSize: '14px', lineHeight: 1.7, color: 'var(--muted)', fontStyle: 'italic',
            }}>
              {transcript}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      {!isLoading && (
        <div style={{
          marginTop: '36px', paddingTop: '24px',
          borderTop: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px',
        }}>
          <button
            onClick={onNewCourse}
            style={{
              padding: '8px 16px', borderRadius: '6px', fontSize: '13px',
              color: 'var(--muted)', background: 'none', border: '1px solid var(--border)',
              cursor: 'pointer', transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--muted)')}
          >
            {isCode ? t('newCode') : t('newCourse')}
          </button>
          <div style={{ flex: 1 }} />
          <button
            onClick={onTryAgain}
            style={{
              padding: '8px 20px', borderRadius: '6px', fontSize: '13px', fontWeight: 500,
              background: 'var(--accent)', color: '#fff', border: 'none',
              cursor: 'pointer', transition: 'background 0.15s ease',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'var(--accent-hover)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'var(--accent)')}
          >
            {isCode ? t('tryAgainCode') : t('tryAgainCourse')}
          </button>
        </div>
      )}
    </div>
  )
}

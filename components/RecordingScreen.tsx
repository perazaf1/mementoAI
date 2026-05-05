'use client'

import { useEffect, useState } from 'react'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'
import ErrorBanner from './ErrorBanner'
import { useApp } from '@/context/AppContext'

interface RecordingScreenProps {
  onStop: (transcript: string) => void
  onCancel: () => void
}

function PulseIndicator({ isActive }: { isActive: boolean }) {
  return (
    <div style={{ position: 'relative', width: '52px', height: '52px', margin: '0 auto' }}>
      {isActive && (
        <>
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            background: 'var(--accent)', opacity: 0,
            animation: 'pulse-ring 2s ease-out infinite',
          }} />
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            background: 'var(--accent)', opacity: 0,
            animation: 'pulse-ring 2s ease-out infinite 0.7s',
          }} />
        </>
      )}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: isActive ? 'var(--accent)' : 'var(--border)',
        transition: 'background 0.3s ease',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
          <line x1="12" y1="19" x2="12" y2="22"/>
        </svg>
      </div>
    </div>
  )
}

export default function RecordingScreen({ onStop, onCancel }: RecordingScreenProps) {
  const { t, mode } = useApp()
  const { isSupported, isListening, transcript, interimTranscript, start, stop, getFullTranscript } =
    useSpeechRecognition()
  const [emptyError, setEmptyError] = useState(false)

  useEffect(() => {
    if (isSupported) start()
  }, [isSupported, start])

  const handleStop = () => {
    stop()
    const full = getFullTranscript()
    if (!full) {
      setEmptyError(true)
      return
    }
    onStop(full)
  }

  if (!isSupported) {
    return (
      <div className="animate-fade-up">
        <h1 style={{
          fontFamily: 'Cormorant, serif', fontSize: '34px', fontWeight: 500,
          letterSpacing: '-0.02em', color: 'var(--text)', marginBottom: '10px',
        }}>
          {t('browserUnsupportedTitle')}
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '24px' }}>
          {t('browserUnsupportedSub')}
        </p>
        <button onClick={onCancel} style={{
          fontSize: '14px', color: 'var(--accent)', background: 'none',
          border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline',
        }}>
          {t('goBack')}
        </button>
      </div>
    )
  }

  const isCode = mode === 'code'

  return (
    <div className="animate-fade-up">
      {/* Title */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{
          fontFamily: 'Cormorant, serif', fontSize: '36px', fontWeight: 500,
          lineHeight: 1.15, letterSpacing: '-0.02em', color: 'var(--text)', marginBottom: '8px',
        }}>
          {isListening
            ? (isCode ? t('listeningCodeTitle') : t('listeningCourseTitle'))
            : t('readyTitle')}
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '14px' }}>
          {isListening
            ? (isCode ? t('listeningCodeSubtitle') : t('listeningCourseSubtitle'))
            : t('readySubtitle')}
        </p>
      </div>

      {/* Recording card */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        overflow: 'hidden',
      }}>
        {/* Pulse + status */}
        <div style={{
          padding: '32px 24px 24px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
          borderBottom: '1px solid var(--border)',
        }}>
          <PulseIndicator isActive={isListening} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <div style={{
              width: '7px', height: '7px', borderRadius: '50%',
              background: isListening ? 'var(--green)' : 'var(--border)',
              transition: 'background 0.3s ease',
            }} />
            <span style={{
              fontSize: '12px', fontWeight: 500, letterSpacing: '0.03em',
              color: isListening ? 'var(--green)' : 'var(--muted)',
              transition: 'color 0.3s ease',
              textTransform: 'uppercase',
            }}>
              {isListening ? t('recordingStatus') : t('waitingStatus')}
            </span>
          </div>
        </div>

        {/* Live transcript */}
        <div style={{
          padding: '20px 24px',
          minHeight: '130px',
          fontSize: '14px',
          lineHeight: 1.75,
          color: 'var(--text)',
        }}>
          {!transcript && !interimTranscript ? (
            <span style={{ color: 'var(--muted)', fontStyle: 'italic' }}>
              {t('waitingVoice')}
            </span>
          ) : (
            <>
              <span>{transcript}</span>
              <span style={{ color: 'var(--muted)' }}>{interimTranscript}</span>
            </>
          )}
        </div>

        {/* Toolbar */}
        <div style={{
          borderTop: '1px solid var(--border)',
          padding: '11px 16px',
          display: 'flex', alignItems: 'center', gap: '10px',
          background: 'var(--bg)',
        }}>
          <button
            onClick={onCancel}
            style={{
              padding: '6px 14px', borderRadius: '6px', fontSize: '13px',
              color: 'var(--muted)', background: 'none', border: '1px solid var(--border)',
              cursor: 'pointer', transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--muted)')}
          >
            {t('cancel')}
          </button>
          <div style={{ flex: 1 }} />
          <button
            onClick={handleStop}
            style={{
              padding: '6px 18px', borderRadius: '6px', fontSize: '13px', fontWeight: 500,
              background: 'var(--accent)', color: '#fff', border: 'none',
              cursor: 'pointer', transition: 'background 0.15s ease',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'var(--accent-hover)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'var(--accent)')}
          >
            {t('stopAndFeedback')}
          </button>
        </div>
      </div>

      {emptyError && (
        <div style={{ marginTop: '16px' }}>
          <ErrorBanner
            message={t('errEmpty')}
            onRetry={() => { setEmptyError(false); start() }}
          />
        </div>
      )}
    </div>
  )
}

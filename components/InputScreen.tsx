'use client'

import { useRef, useState } from 'react'
import ErrorBanner from './ErrorBanner'
import { useApp } from '@/context/AppContext'
import { FEEDBACK_LANGUAGES } from '@/lib/i18n'

interface InputScreenProps {
  courseText: string
  onCourseChange: (text: string) => void
  onBegin: () => void
  userPlan?: string
}

const MAX_CODE_LINES = 50

export default function InputScreen({ courseText, onCourseChange, onBegin, userPlan }: InputScreenProps) {
  const isPro = userPlan === 'pro' || userPlan === 'isep'
  const MAX_COURSE_CHARS = isPro ? 25000 : 15000
  const WARN_COURSE_CHARS = isPro ? 21000 : 12000
  const { t, mode, feedbackLang, setFeedbackLang, uiLang } = useApp()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractError, setExtractError] = useState('')

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type !== 'application/pdf') {
      setExtractError(t('errPdfType'))
      return
    }
    setIsExtracting(true)
    setExtractError('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/extract-pdf', { method: 'POST', body: formData })
      if (!res.ok) throw new Error()
      const data = await res.json()
      onCourseChange(data.text)
    } catch {
      setExtractError(t('errPdfExtract'))
    } finally {
      setIsExtracting(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const lineCount = courseText.split('\n').length
  const isCodeMode = mode === 'code'
  const isOverCodeLimit = isCodeMode && lineCount > MAX_CODE_LINES
  const isOverCourseLimit = !isCodeMode && courseText.length > MAX_COURSE_CHARS
  const isNearCourseLimit = !isCodeMode && courseText.length > WARN_COURSE_CHARS && courseText.length <= MAX_COURSE_CHARS
  const canBegin = courseText.trim().length > 0 && !isOverCourseLimit

  return (
    <div className="animate-fade-up">
      {/* Title */}
      <div style={{ marginBottom: '28px' }}>
        <h1
          style={{
            fontFamily: 'var(--heading-font)',
            fontSize: '36px',
            fontWeight: 500,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            color: 'var(--text)',
            marginBottom: '8px',
          }}
        >
          {isCodeMode ? t('codeTitle') : t('courseTitle')}
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '14px' }}>
          {isCodeMode ? t('codeSubtitle') : t('courseSubtitle')}
        </p>
      </div>

      {/* Code note banner */}
      {isCodeMode && (
        <div
          style={{
            borderLeft: '3px solid var(--blue)',
            background: 'var(--blue-bg)',
            padding: '10px 14px',
            borderRadius: '0 6px 6px 0',
            marginBottom: '16px',
            fontSize: '13px',
            color: 'var(--blue)',
          }}
        >
          {t('codeNote')}
        </div>
      )}

      {/* Main card */}
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        <textarea
          value={courseText}
          onChange={(e) => onCourseChange(e.target.value)}
          placeholder={isCodeMode ? t('codePlaceholder') : t('coursePlaceholder')}
          rows={isCodeMode ? 14 : 13}
          style={{
            width: '100%',
            padding: '20px 24px',
            fontSize: isCodeMode ? '13px' : '14px',
            lineHeight: isCodeMode ? 1.6 : 1.75,
            color: 'var(--text)',
            background: 'transparent',
            border: 'none',
            resize: 'none',
            outline: 'none',
            fontFamily: isCodeMode ? "'DM Mono', 'Fira Code', 'Courier New', monospace" : 'var(--body-font)',
            display: 'block',
          }}
          spellCheck={!isCodeMode}
        />

        {/* Code over limit */}
        {isOverCodeLimit && (
          <div style={{ margin: '0 20px 12px', padding: '8px 12px', borderRadius: '6px', background: 'var(--orange-bg)', borderLeft: '3px solid var(--orange)', fontSize: '12px', color: 'var(--orange)' }}>
            {t('codeLimitWarning')}
          </div>
        )}

        {/* Course near limit */}
        {isNearCourseLimit && (
          <div style={{ margin: '0 20px 12px', padding: '8px 12px', borderRadius: '6px', background: 'var(--orange-bg)', borderLeft: '3px solid var(--orange)', fontSize: '12px', color: 'var(--orange)' }}>
            {t('courseLimitWarn')}
          </div>
        )}

        {/* Course over limit */}
        {isOverCourseLimit && (
          <div style={{ margin: '0 20px 12px', padding: '8px 12px', borderRadius: '6px', background: 'var(--red-bg)', borderLeft: '3px solid var(--red)', fontSize: '12px', color: 'var(--red)' }}>
            {t('courseLimitError')}
          </div>
        )}

        {/* Bottom toolbar */}
        <div
          style={{
            borderTop: '1px solid var(--border)',
            padding: '11px 16px',
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px',
            background: 'var(--bg)',
          }}
        >
          {/* PDF upload — only in course mode */}
          {!isCodeMode && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                id="pdf-upload"
              />
              <label
                htmlFor="pdf-upload"
                style={{
                  fontSize: '13px',
                  color: 'var(--muted)',
                  cursor: isExtracting ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 11px',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  transition: 'all 0.15s ease',
                  userSelect: 'none',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = 'var(--accent)'
                  el.style.color = 'var(--accent)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = 'var(--border)'
                  el.style.color = 'var(--muted)'
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                {isExtracting ? t('extracting') : t('importPdf')}
              </label>
            </>
          )}

          <div style={{ flex: 1 }} />

          {/* Char / line counter */}
          <span style={{
            fontSize: '12px', flexShrink: 0,
            color: isOverCourseLimit ? 'var(--red)' : isNearCourseLimit ? 'var(--orange)' : 'var(--muted)',
            transition: 'color 0.2s ease',
          }}>
            {isCodeMode
              ? `${lineCount} / 50 ${t('lines')}`
              : courseText.length > 0
                ? `${courseText.length.toLocaleString('fr-FR')} / ${MAX_COURSE_CHARS.toLocaleString('fr-FR')} ${t('chars')}`
                : null}
          </span>

          {/* Begin button */}
          <button
            onClick={onBegin}
            disabled={!canBegin}
            style={{
              padding: '8px 20px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 500,
              background: canBegin ? 'var(--accent)' : 'var(--border)',
              color: canBegin ? '#fff' : 'var(--muted)',
              border: 'none',
              cursor: canBegin ? 'pointer' : 'not-allowed',
              transition: 'background 0.15s ease',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              if (canBegin) (e.currentTarget as HTMLElement).style.background = 'var(--accent-hover)'
            }}
            onMouseLeave={(e) => {
              if (canBegin) (e.currentTarget as HTMLElement).style.background = 'var(--accent)'
            }}
          >
            {t('begin')}
          </button>
        </div>
      </div>

      {extractError && (
        <div style={{ marginTop: '14px' }}>
          <ErrorBanner message={extractError} />
        </div>
      )}

      {/* Feedback language selector — only in course mode */}
      {!isCodeMode && (
        <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <label
            htmlFor="feedback-lang"
            style={{ fontSize: '13px', color: 'var(--muted)', flexShrink: 0 }}
          >
            {t('feedbackLangLabel')}
          </label>
          <select
            id="feedback-lang"
            value={feedbackLang}
            onChange={(e) => setFeedbackLang(e.target.value)}
            style={{
              fontSize: '13px',
              color: 'var(--text)',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              padding: '5px 10px',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            {FEEDBACK_LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {uiLang === 'fr' ? lang.fr : lang.en}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}

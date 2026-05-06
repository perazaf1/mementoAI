'use client'

import Link from 'next/link'
import { type CopyType } from './types'

const ICON_STYLE = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  width: '34px', height: '34px', borderRadius: '8px',
  border: '1px solid rgba(240,237,232,0.12)',
  color: 'rgba(240,237,232,0.45)',
  textDecoration: 'none',
  transition: 'all 0.15s ease',
} as const

export default function Footer({ t }: { t: CopyType }) {
  return (
    <footer style={{
      background: '#0C1420', borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '32px clamp(16px, 4vw, 40px)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px',
    }}>
      {/* Left — logo */}
      <span style={{ fontFamily: 'var(--heading-font)', fontSize: '20px', fontWeight: 600, color: '#F0EDE8', letterSpacing: '-0.02em' }}>
        Memento
      </span>

      {/* Center — copyright */}
      <p className="lp-footer-center" style={{ fontSize: '13px', color: 'rgba(240,237,232,0.25)' }}>
        2026 Memento. All rights reserved.
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

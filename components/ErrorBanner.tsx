interface ErrorBannerProps {
  message: string
  onRetry?: () => void
}

export default function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <div
      style={{
        borderLeft: '3px solid var(--red)',
        background: 'var(--red-bg)',
        padding: '12px 16px',
        borderRadius: '0 6px 6px 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '12px',
      }}
    >
      <p style={{ color: 'var(--red)', fontSize: '14px', lineHeight: 1.5 }}>{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            fontSize: '13px',
            color: 'var(--red)',
            textDecoration: 'underline',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          Try again
        </button>
      )}
    </div>
  )
}

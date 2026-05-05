import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Memento — Récite. Retiens.',
  description: 'Récite ton cours à voix haute. Memento analyse ta récitation et te donne un feedback structuré pour mémoriser vraiment.',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: { url: '/apple-touch-icon.png' },
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}

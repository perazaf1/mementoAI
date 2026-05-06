import type { Metadata } from 'next'
import { Cormorant, DM_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

const cormorant = Cormorant({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-cormorant',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-dm-sans',
})

export const metadata: Metadata = {
  title: 'Memento — Récite. Retiens.',
  description: 'Récite ton cours à voix haute. Memento analyse ta récitation et te donne un feedback structuré sur ce que tu sais, ce qui manque, et comment progresser.',
  metadataBase: new URL('https://memento-ai-delta.vercel.app'),
  openGraph: {
    title: 'Memento — Récite. Retiens.',
    description: 'Récite ton cours à voix haute. Memento analyse ta récitation et te donne un feedback structuré pour mémoriser vraiment.',
    url: 'https://memento-ai-delta.vercel.app',
    siteName: 'Memento',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Memento — Récite. Retiens.',
    description: 'Récite ton cours à voix haute. Memento analyse ta récitation et te donne un feedback structuré pour mémoriser vraiment.',
  },
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
    <html lang="fr" className={`${cormorant.variable} ${dmSans.variable}`}>
      <head>
        <link rel="preconnect" href="https://va.vercel-scripts.com" />
      </head>
      <body>
        <main>
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  )
}

'use client'

import { useState } from 'react'
import { Nav, Hero, HowItWorks, Features, Pricing, Footer, COPY, type Lang } from '@/components/landing'

function useCheckout() {
  const [loading, setLoading] = useState<'pro' | 'isep' | null>(null)

  const startCheckout = async (plan: 'pro' | 'isep') => {
    setLoading(plan)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      if (res.status === 401) {
        window.location.href = '/auth/login'
        return
      }
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } finally {
      setLoading(null)
    }
  }

  return { startCheckout, loading }
}

export default function LandingPage() {
  const [lang, setLang] = useState<Lang>('fr')
  const t = COPY[lang]
  const { startCheckout, loading: checkoutLoading } = useCheckout()

  return (
    <>
      <style>{`
        @keyframes lp-pulse-ring {
          0%   { transform: scale(1);   opacity: 0.6; }
          70%  { transform: scale(2.4); opacity: 0;   }
          100% { transform: scale(2.4); opacity: 0;   }
        }
        @keyframes lp-pulse-dot {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.55; }
        }
        @media (max-width: 640px) {
          .lp-mock { transform: none !important; margin-top: 48px !important; }
          .lp-hero-text { text-align: left !important; }
          .lp-hero-ctas { justify-content: flex-start !important; }
          .lp-section { padding: 72px 16px !important; }
          .lp-footer-center { display: none !important; }
        }
      `}</style>
      <Nav t={t} lang={lang} setLang={setLang} />
      <Hero t={t} lang={lang} />
      <HowItWorks t={t} />
      <Features t={t} />
      <Pricing
        t={t}
        onProCheckout={() => startCheckout('pro')}
        onIsepCheckout={() => startCheckout('isep')}
        checkoutLoading={checkoutLoading}
      />
      <Footer t={t} />
    </>
  )
}

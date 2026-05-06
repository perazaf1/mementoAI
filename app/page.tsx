'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Nav, Hero, COPY, type Lang } from '@/components/landing'

const HowItWorks = dynamic(() => import('@/components/landing/HowItWorks'), { ssr: true })
const Features = dynamic(() => import('@/components/landing/Features'), { ssr: true })
const Pricing = dynamic(() => import('@/components/landing/Pricing'), { ssr: true })
const Footer = dynamic(() => import('@/components/landing/Footer'), { ssr: true })

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

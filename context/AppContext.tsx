'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { type UILang, getT, type TranslationKey } from '@/lib/i18n'

export type AppMode = 'course' | 'code'

interface AppContextValue {
  uiLang: UILang
  setUiLang: (lang: UILang) => void
  feedbackLang: string
  setFeedbackLang: (lang: string) => void
  mode: AppMode
  setMode: (mode: AppMode) => void
  t: (key: TranslationKey) => string
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [uiLang, setUiLang] = useState<UILang>('fr')
  const [feedbackLang, setFeedbackLang] = useState('auto')
  const [mode, setMode] = useState<AppMode>('course')

  const t = getT(uiLang)

  return (
    <AppContext.Provider value={{ uiLang, setUiLang, feedbackLang, setFeedbackLang, mode, setMode, t }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}

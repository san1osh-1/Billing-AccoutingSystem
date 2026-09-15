import { createContext, useContext, useMemo, useState } from 'react'
import { translations } from './translations'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en')

  const value = useMemo(() => {
    const t = (key, fallback) =>
      translations[lang]?.[key] ?? translations.en[key] ?? fallback ?? key
    return { lang, setLang, t }
  }, [lang])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTranslation() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useTranslation must be used within a LanguageProvider')
  return ctx
}

// eslint-disable-next-line react-refresh/only-export-components
export const LANGUAGES = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'ne', label: 'नेपाली', short: 'ने' },
]
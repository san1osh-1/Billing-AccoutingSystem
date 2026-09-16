import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { translations } from './translations'
import { formatCurrency as fmtCurrency, formatDate as fmtDate, toNe } from '../utils/format'
import { formatBsDate } from '../utils/bs'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en')
  const [dateSys, setDateSys] = useState(() => localStorage.getItem('dateSys') || 'ad')

  useEffect(() => {
    localStorage.setItem('dateSys', dateSys)
  }, [dateSys])

  const value = useMemo(() => {
    const t = (key, fallback) =>
      translations[lang]?.[key] ?? translations.en[key] ?? fallback ?? key
    const num = (v) => (lang === 'ne' ? toNe(v) : String(v))
    const formatCurrency = (v) =>
      lang === 'ne' ? toNe(fmtCurrency(v, 'रु. ')) : fmtCurrency(v)
    const formatDate = (d) => {
      if (!d) return ''
      const base = dateSys === 'bs' ? formatBsDate(d, lang) : fmtDate(d)
      return lang === 'ne' ? toNe(base) : base
    }
    return { lang, setLang, dateSys, setDateSys, t, num, formatCurrency, formatDate }
  }, [lang, dateSys])

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
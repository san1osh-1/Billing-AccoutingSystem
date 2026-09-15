import { Globe } from 'lucide-react'
import { useTranslation, LANGUAGES } from '../../i18n/LanguageContext'

export default function LanguageSwitcher() {
  const { lang, setLang } = useTranslation()

  const next = LANGUAGES.find((l) => l.code !== lang)

  return (
    <div className="flex items-center rounded-lg border border-slate-200 bg-white p-0.5" role="group" aria-label="Language">
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          title={l.label}
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold transition ${
            lang === l.code
              ? 'bg-brand-50 text-brand-700'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {lang === l.code && <Globe className="w-3.5 h-3.5" />}
          {l.short}
        </button>
      ))}
      <span className="sr-only">{next?.label}</span>
    </div>
  )
}
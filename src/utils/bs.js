import { ADToBS } from 'bikram-sambat-js'

const MONTHS_EN = [
  'Baishakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin',
  'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra',
]

const MONTHS_NE = [
  'बैशाख', 'जेठ', 'असार', 'साउन', 'भदौ', 'असोज',
  'कात्तिक', 'मंसिर', 'पुस', 'माघ', 'फागुन', 'चैत',
]

export const adToBsParts = (dateStr) => {
  if (!dateStr) return null
  try {
    const [year, month, day] = ADToBS(new Date(dateStr)).split('-').map(Number)
    if (!year || !month || !day) return null
    return { year, month, day }
  } catch {
    return null
  }
}

export const formatBsDate = (dateStr, lang = 'en') => {
  const parts = adToBsParts(dateStr)
  if (!parts) return ''
  const dd = String(parts.day).padStart(2, '0')
  const monthName = lang === 'ne' ? MONTHS_NE[parts.month - 1] : MONTHS_EN[parts.month - 1]
  return `${dd} ${monthName} ${parts.year}`
}
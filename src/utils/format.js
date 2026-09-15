// Formats numbers in Nepali/Indian style: 1,23,456.00
export const formatIN = (num) => {
  if (num === null || num === undefined) return ''
  const n = Number(num)
  if (Number.isNaN(n)) return ''
  const [intPart, decPart] = n.toFixed(2).split('.')
  let lastThree = intPart.slice(-3)
  const other = intPart.slice(0, -3)
  const formatted = other
    ? other.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree
    : lastThree
  return decPart === '00' ? formatted : `${formatted}.${decPart}`
}

export const formatCurrency = (num, prefix = 'Rs. ') =>
  num === 0 || num ? `${prefix}${formatIN(num)}` : ''

export const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
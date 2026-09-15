// Shared calculation logic — used by POS and Purchase entry
export const VAT_RATE = 13 // Nepal standard VAT %

export const calcLineTotal = (price, qty, discount = 0, vatApplicable = true) => {
  const base = price * qty - discount
  const vat = vatApplicable ? base * (VAT_RATE / 100) : 0
  return { base, vat, total: base + vat }
}

export const calcCartTotals = (items, extraDiscount = 0) => {
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const itemDiscount = items.reduce((s, i) => s + (i.discount || 0), 0)
  const totalDiscount = itemDiscount + extraDiscount
  const taxable = items
    .filter((i) => i.vatApplicable)
    .reduce((s, i) => s + (i.price * i.quantity - (i.discount || 0)), 0)
  const nonTaxable = items
    .filter((i) => !i.vatApplicable)
    .reduce((s, i) => s + (i.price * i.quantity - (i.discount || 0)), 0)
  const vat = taxable * (VAT_RATE / 100)
  const grandTotal = subtotal - totalDiscount + vat
  return {
    subtotal,
    itemDiscount,
    extraDiscount,
    totalDiscount,
    taxable,
    nonTaxable,
    vat,
    grandTotal,
  }
}

export const paymentMethods = [
  { key: 'cash',   label: 'Cash',    icon: '💵' },
  { key: 'bank',   label: 'Bank',    icon: '🏦' },
  { key: 'qr',     label: 'QR',      icon: '📱' },
  { key: 'esewa',  label: 'eSewa',   icon: '🟣' },
  { key: 'khalti', label: 'Khalti',  icon: '🟪' },
  { key: 'credit', label: 'Credit',  icon: '📝' },
]
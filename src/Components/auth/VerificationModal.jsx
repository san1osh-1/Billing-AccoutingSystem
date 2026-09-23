import { useState, useRef, useEffect } from 'react'
import { Mail, CheckCircle2, AlertCircle, RefreshCw, X, ShieldCheck } from 'lucide-react'
import Button from '../ui/Button'

export default function VerificationModal({
  open,
  onClose,
  email,
  onVerify,
  onResend,
  title = 'Verify Your Email Address',
  subtitle = 'We sent a 6-digit verification code to',
  mockCode = null,
}) {
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const [canResend, setCanResend] = useState(false)

  const inputRefs = useRef([])

  // Reset timer on open
  useEffect(() => {
    if (open) {
      setDigits(['', '', '', '', '', ''])
      setError('')
      setTimeLeft(60)
      setCanResend(false)
      setTimeout(() => inputRefs.current[0]?.focus(), 100)
    }
  }, [open])

  // Countdown timer
  useEffect(() => {
    if (!open || timeLeft <= 0) {
      setCanResend(true)
      return
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [open, timeLeft])

  if (!open) return null

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return
    const char = value.slice(-1)
    const newDigits = [...digits]
    newDigits[index] = char
    setDigits(newDigits)
    setError('')

    // Auto-advance to next input
    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').trim()
    if (/^\d{6}$/.test(pasted)) {
      const arr = pasted.split('')
      setDigits(arr)
      inputRefs.current[5]?.focus()
      setError('')
    }
  }

  const handleSubmit = async (e) => {
    e?.preventDefault()
    const code = digits.join('')
    if (code.length < 6) {
      setError('Please enter the full 6-digit code')
      return
    }

    setLoading(true)
    setError('')
    try {
      await onVerify(code)
    } catch (err) {
      setError(err.message || 'Verification failed. Please check the code.')
    } finally {
      setLoading(false)
    }
  }

  const handleResendClick = async () => {
    if (!canResend || resending) return
    setResending(true)
    setError('')
    try {
      await onResend()
      setTimeLeft(60)
      setCanResend(false)
      setDigits(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } catch (err) {
      setError(err.message || 'Failed to resend code')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 md:p-8 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-50 border border-brand-100 text-brand-600 mb-4 shadow-xs">
            <Mail className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
            {subtitle} <span className="font-semibold text-slate-800">{email}</span>
          </p>
        </div>

        {/* Mock code hint if in dev/mock mode */}
        {mockCode && (
          <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between">
            <span className="font-medium">Dev Test Code: <strong>{mockCode}</strong></span>
            <button
              type="button"
              onClick={() => {
                setDigits(mockCode.split(''))
                inputRefs.current[5]?.focus()
              }}
              className="text-brand-600 hover:underline font-bold"
            >
              Auto-fill
            </button>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 6 Digit Inputs */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between gap-2 sm:gap-3" onPaste={handlePaste}>
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className={`w-12 h-13 sm:w-13 sm:h-14 text-center text-2xl font-bold rounded-xl border bg-slate-50/50 text-slate-900 transition-all outline-none ${
                  digit
                    ? 'border-brand-500 bg-white ring-2 ring-brand-500/10 shadow-xs'
                    : 'border-slate-200 focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20'
                }`}
              />
            ))}
          </div>

          <Button
            type="submit"
            className="w-full h-11 text-base font-semibold shadow-md shadow-brand-500/20"
            disabled={loading || digits.join('').length < 6}
          >
            {loading ? 'Verifying Code...' : 'Verify & Continue'}
          </Button>
        </form>

        {/* Resend timer */}
        <div className="mt-5 text-center text-xs text-slate-500">
          {canResend ? (
            <button
              type="button"
              onClick={handleResendClick}
              disabled={resending}
              className="inline-flex items-center gap-1.5 font-semibold text-brand-600 hover:text-brand-700 hover:underline"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
              {resending ? 'Sending new code...' : 'Resend verification code'}
            </button>
          ) : (
            <span>
              Resend code in <strong className="text-slate-700 font-mono">{timeLeft}s</strong>
            </span>
          )}
        </div>

        {/* Security badge */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Secured with Gmail SMTP & Nodemailer verification</span>
        </div>
      </div>
    </div>
  )
}

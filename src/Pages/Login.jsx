import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import AuthShowcasePanel from '../Components/auth/AuthShowcasePanel'
import VerificationModal from '../Components/auth/VerificationModal'
import { sendVerificationCode, verifyCode, resetPassword } from '../services/authService'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, AlertCircle, KeyRound, CheckCircle2, Lock, ShieldAlert } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const from = location.state?.from?.pathname || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successBanner, setSuccessBanner] = useState('')

  // ── Forgot Password 3-Step State: 'NONE' | 'EMAIL' | 'OTP' | 'NEW_PASSWORD' ──
  const [forgotStep, setForgotStep] = useState('NONE')
  const [forgotEmail, setForgotEmail] = useState('')
  const [verifiedCode, setVerifiedCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [forgotMockCode, setForgotMockCode] = useState(null)
  const [forgotError, setForgotError] = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      setError('Please enter both email address and password')
      return
    }

    setLoading(true)
    try {
      await login(email.trim(), password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Step 1: Send Verification Code to Gmail ──
  const handleSendResetCode = async (e) => {
    e.preventDefault()
    setForgotError('')

    if (!forgotEmail.trim() || !forgotEmail.includes('@')) {
      setForgotError('Please enter a valid email address')
      return
    }

    setForgotLoading(true)
    try {
      const res = await sendVerificationCode(forgotEmail.trim(), 'reset_password')
      if (res.mockCode) setForgotMockCode(res.mockCode)
      setForgotStep('OTP')
    } catch (err) {
      setForgotError(err.message || 'Failed to send verification code')
    } finally {
      setForgotLoading(false)
    }
  }

  // ── Step 2: Verify 6-digit Code ──
  const handleVerifyResetOtp = async (code) => {
    await verifyCode(forgotEmail.trim(), code, 'reset_password')
    setVerifiedCode(code)
    setForgotStep('NEW_PASSWORD')
  }

  // ── Step 3: Update Password with verified code ──
  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    setForgotError('')

    if (!newPassword || newPassword.length < 6) {
      setForgotError('New password must be at least 6 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      setForgotError('Passwords do not match')
      return
    }

    setForgotLoading(true)
    try {
      await resetPassword(forgotEmail.trim(), newPassword, verifiedCode)
      setEmail(forgotEmail.trim())
      setPassword(newPassword)
      setForgotStep('NONE')
      setSuccessBanner('Password reset successfully! You can now sign in with your new password.')
      setTimeout(() => setSuccessBanner(''), 6000)
    } catch (err) {
      setForgotError(err.message || 'Failed to reset password. Please try again.')
    } finally {
      setForgotLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100/80 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-sans antialiased">
      {/* Main Split Card Container */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-200/90 grid grid-cols-1 lg:grid-cols-12 transition-all">
        {/* Left Visual Column */}
        <div className="lg:col-span-5 flex flex-col h-full">
          <AuthShowcasePanel />
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-7 p-8 sm:p-10 lg:p-12 flex flex-col justify-center bg-gradient-to-t from-brand-100/60 via-brand-50/40 to-white">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Welcome back
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-500 leading-relaxed">
              Sign in to your HisaabKit account to manage your billing, invoices, and accounting.
            </p>
          </div>

          {successBanner && (
            <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successBanner}</span>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4">
            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@business.com"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm bg-white text-slate-900 transition outline-none placeholder:text-slate-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/15"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 pl-3.5 pr-10 rounded-xl border border-slate-200 text-sm bg-white text-slate-900 transition outline-none placeholder:text-slate-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500/20"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => {
                  setForgotEmail(email)
                  setForgotError('')
                  setNewPassword('')
                  setConfirmPassword('')
                  setForgotStep('EMAIL')
                }}
                className="font-semibold text-brand-600 hover:text-brand-700 hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-semibold text-sm transition-all shadow-md shadow-brand-500/20 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? 'Signing in...' : 'Sign in to Dashboard'}
              </button>
            </div>

            {/* Divider */}
            <div className="relative py-2 flex items-center gap-3">
              <div className="flex-1 border-t border-slate-200" />
              <span className="text-[11px] font-semibold text-slate-400 uppercase">
                OR
              </span>
              <div className="flex-1 border-t border-slate-200" />
            </div>

            {/* Create Account Link */}
            <div className="text-center text-xs text-slate-500">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="font-semibold text-brand-600 hover:text-brand-700 hover:underline">
                Create an account
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* ── STEP 1 MODAL: ASK FOR REGISTERED GMAIL ADDRESS ONLY ── */}
      {forgotStep === 'EMAIL' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 sm:p-8">
            <div className="text-center mb-5">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-50 text-brand-600 mb-3 border border-brand-100">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Reset Your Password</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Enter your registered Gmail address below to receive a 6-digit verification code.
              </p>
            </div>

            {/* Policy & Rate Limit Notice */}
            <div className="mb-4 p-3 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-900">Security Restrictions</p>
                <p className="mt-0.5 text-[11px] text-amber-700 leading-snug">
                  Password reset is restricted to <strong>maximum 3 times per day</strong>. Unregistered email addresses cannot request reset codes.
                </p>
              </div>
            </div>

            {forgotError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{forgotError}</span>
              </div>
            )}

            <form onSubmit={handleSendResetCode} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Registered Email Address
                </label>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="you@business.com"
                  className="w-full h-10 px-3.5 rounded-lg border border-slate-200 text-sm bg-white text-slate-900 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/15"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setForgotStep('NONE')}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="px-5 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm cursor-pointer disabled:opacity-60"
                >
                  {forgotLoading ? 'Sending Code...' : 'Send Verification Code'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── STEP 2 MODAL: 6-DIGIT VERIFICATION CODE (MODAL) ── */}
      <VerificationModal
        open={forgotStep === 'OTP'}
        onClose={() => setForgotStep('NONE')}
        email={forgotEmail}
        onVerify={handleVerifyResetOtp}
        onResend={() => sendVerificationCode(forgotEmail.trim(), 'reset_password')}
        mockCode={forgotMockCode}
        title="Verify Code for Password Reset"
        subtitle="We sent a 6-digit verification code to"
      />

      {/* ── STEP 3 MODAL: SET NEW PASSWORD (ONLY AFTER CODE IS VERIFIED) ── */}
      {forgotStep === 'NEW_PASSWORD' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 sm:p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 mb-3 border border-emerald-100">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Set New Password</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Code verified for <span className="font-semibold text-slate-800">{forgotEmail}</span>. Enter your new password below.
              </p>
            </div>

            {forgotError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{forgotError}</span>
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full h-10 px-3.5 rounded-lg border border-slate-200 text-sm bg-white text-slate-900 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/15"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-10 px-3.5 rounded-lg border border-slate-200 text-sm bg-white text-slate-900 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/15"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setForgotStep('NONE')}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm cursor-pointer disabled:opacity-60"
                >
                  {forgotLoading ? 'Updating Password...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

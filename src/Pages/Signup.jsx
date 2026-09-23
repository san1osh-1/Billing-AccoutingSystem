import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthShowcasePanel from '../Components/auth/AuthShowcasePanel'
import VerificationModal from '../Components/auth/VerificationModal'
import { sendVerificationCode } from '../services/authService'
import { useAuth } from '../context/AuthContext'
import Button from '../Components/ui/Button'
import { AlertCircle } from 'lucide-react'

export default function Signup() {
  const navigate = useNavigate()
  const { signup } = useAuth()

  const [formData, setFormData] = useState({
    businessName: '',
    taxType: 'PAN', // 'PAN' | 'VAT'
    panNumber: '',
    phone: '',
    address: '',
    ownerName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [otpModalOpen, setOtpModalOpen] = useState(false)
  const [mockOtp, setMockOtp] = useState(null)
  const [generalError, setGeneralError] = useState('')

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validate = () => {
    const errs = {}
    if (!formData.businessName.trim()) errs.businessName = 'Business name is required'
    if (!formData.panNumber.trim()) {
      errs.panNumber = `${formData.taxType} number is required`
    } else if (!/^\d{9}$/.test(formData.panNumber.replace(/\s|-/g, ''))) {
      errs.panNumber = `Please enter a valid 9-digit ${formData.taxType} number`
    }

    if (!formData.ownerName.trim()) errs.ownerName = 'Your name is required'
    if (!formData.email.trim()) {
      errs.email = 'Email address is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      errs.password = 'Password is required'
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters'
    }

    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGeneralError('')

    if (!validate()) return

    setSubmitting(true)
    try {
      // Dispatch verification code via Nodemailer
      const res = await sendVerificationCode(formData.email.trim(), 'signup')
      if (res.mockCode) {
        setMockOtp(res.mockCode)
      }
      setOtpModalOpen(true)
    } catch (err) {
      setGeneralError(err.message || 'Failed to send verification code. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleVerifyOtp = async (code) => {
    // Complete signup with verified code
    await signup({
      ...formData,
      code,
    })
    setOtpModalOpen(false)
    navigate('/dashboard', { replace: true })
  }

  const handleResendOtp = async () => {
    const res = await sendVerificationCode(formData.email.trim(), 'signup')
    if (res.mockCode) setMockOtp(res.mockCode)
  }

  return (
    <div className="min-h-screen bg-slate-100/80 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-sans antialiased">
      {/* Main Split Card Container */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-200/90 grid grid-cols-1 lg:grid-cols-12 transition-all">
        {/* Left Visual Column */}
        <div className="lg:col-span-5 flex flex-col h-full">
          <AuthShowcasePanel />
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-7 p-7 sm:p-9 lg:p-11 flex flex-col justify-center bg-gradient-to-t from-brand-100/60 via-brand-50/40 to-white">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Create your account
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-500 leading-relaxed">
              Register your business (vendor) and owner login. The owner receives the <span className="font-semibold text-slate-700">Admin</span> role.
            </p>
          </div>

          {generalError && (
            <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{generalError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* ── SECTION 1: BUSINESS (VENDOR) ── */}
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                BUSINESS (VENDOR)
              </div>

              <div className="space-y-3.5">
                {/* Business Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Business Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    placeholder="e.g., Aura Commerce Pvt. Ltd."
                    className={`w-full h-10 px-3.5 rounded-lg border text-sm bg-white text-slate-900 transition outline-none placeholder:text-slate-400 ${
                      errors.businessName
                        ? 'border-rose-300 ring-2 ring-rose-500/10'
                        : 'border-slate-200 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/15'
                    }`}
                  />
                  {errors.businessName && <p className="text-[11px] text-rose-600 mt-1">{errors.businessName}</p>}
                </div>

                {/* Tax Registration Type Toggle Pills */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Tax Registration Type <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100/90 rounded-xl border border-slate-200/80 max-w-sm">
                    <button
                      type="button"
                      onClick={() => handleInputChange('taxType', 'PAN')}
                      className={`py-1.5 px-4 text-xs font-bold rounded-lg transition-all ${
                        formData.taxType === 'PAN'
                          ? 'bg-brand-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      PAN
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInputChange('taxType', 'VAT')}
                      className={`py-1.5 px-4 text-xs font-bold rounded-lg transition-all ${
                        formData.taxType === 'VAT'
                          ? 'bg-brand-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      VAT
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    {formData.taxType === 'PAN'
                      ? 'PAN registered — for businesses below the VAT threshold (no VAT charging).'
                      : 'VAT registered — 13% VAT charging enabled on invoices & bills.'}
                  </p>
                </div>

                {/* PAN/VAT No & Phone (2 columns) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {formData.taxType} No. <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.panNumber}
                      onChange={(e) => handleInputChange('panNumber', e.target.value)}
                      placeholder={`9-digit ${formData.taxType} number`}
                      className={`w-full h-10 px-3.5 rounded-lg border text-sm bg-white text-slate-900 transition outline-none placeholder:text-slate-400 ${
                        errors.panNumber
                          ? 'border-rose-300 ring-2 ring-rose-500/10'
                          : 'border-slate-200 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/15'
                      }`}
                    />
                    {errors.panNumber && <p className="text-[11px] text-rose-600 mt-1">{errors.panNumber}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="98XXXXXXXX"
                      className="w-full h-10 px-3.5 rounded-lg border border-slate-200 text-sm bg-white text-slate-900 transition outline-none placeholder:text-slate-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/15"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Ward, City, District"
                    className="w-full h-10 px-3.5 rounded-lg border border-slate-200 text-sm bg-white text-slate-900 transition outline-none placeholder:text-slate-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/15"
                  />
                </div>
              </div>
            </div>

            {/* ── SECTION 2: OWNER ACCOUNT (ADMIN) ── */}
            <div className="pt-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                OWNER ACCOUNT (ADMIN)
              </div>

              <div className="space-y-3.5">
                {/* Your Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.ownerName}
                    onChange={(e) => handleInputChange('ownerName', e.target.value)}
                    placeholder="e.g., Ram Shrestha"
                    className={`w-full h-10 px-3.5 rounded-lg border text-sm bg-white text-slate-900 transition outline-none placeholder:text-slate-400 ${
                      errors.ownerName
                        ? 'border-rose-300 ring-2 ring-rose-500/10'
                        : 'border-slate-200 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/15'
                    }`}
                  />
                  {errors.ownerName && <p className="text-[11px] text-rose-600 mt-1">{errors.ownerName}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="you@business.com"
                    className={`w-full h-10 px-3.5 rounded-lg border text-sm bg-white text-slate-900 transition outline-none placeholder:text-slate-400 ${
                      errors.email
                        ? 'border-rose-300 ring-2 ring-rose-500/10'
                        : 'border-slate-200 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/15'
                    }`}
                  />
                  {errors.email && <p className="text-[11px] text-rose-600 mt-1">{errors.email}</p>}
                </div>

                {/* Password & Confirm Password (2 columns) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Password <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Min 6 characters"
                      className={`w-full h-10 px-3.5 rounded-lg border text-sm bg-white text-slate-900 transition outline-none placeholder:text-slate-400 ${
                        errors.password
                          ? 'border-rose-300 ring-2 ring-rose-500/10'
                          : 'border-slate-200 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/15'
                      }`}
                    />
                    {errors.password && <p className="text-[11px] text-rose-600 mt-1">{errors.password}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Confirm Password <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      placeholder="••••••••"
                      className={`w-full h-10 px-3.5 rounded-lg border text-sm bg-white text-slate-900 transition outline-none placeholder:text-slate-400 ${
                        errors.confirmPassword
                          ? 'border-rose-300 ring-2 ring-rose-500/10'
                          : 'border-slate-200 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/15'
                      }`}
                    />
                    {errors.confirmPassword && (
                      <p className="text-[11px] text-rose-600 mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full h-11 rounded-xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-semibold text-sm transition-all shadow-md shadow-brand-500/20 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
              >
                {submitting ? 'Sending Verification Code...' : 'Create Business Account'}
              </button>
            </div>

            {/* Divider */}
            <div className="relative py-1 flex items-center gap-3">
              <div className="flex-1 border-t border-slate-200" />
              <span className="text-[11px] font-semibold text-slate-400 uppercase">
                OR
              </span>
              <div className="flex-1 border-t border-slate-200" />
            </div>

            {/* Already registered */}
            <div className="text-center text-xs text-slate-500">
              Already registered?{' '}
              <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700 hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* 6-Digit Email Verification Modal */}
      <VerificationModal
        open={otpModalOpen}
        onClose={() => setOtpModalOpen(false)}
        email={formData.email}
        onVerify={handleVerifyOtp}
        onResend={handleResendOtp}
        mockCode={mockOtp}
        title="Verify Your Business Email"
        subtitle="We sent a 6-digit verification code to"
      />
    </div>
  )
}

import { useState } from 'react'
import { KeyRound, Mail, ShieldCheck, UserCheck, AlertCircle, CheckCircle2, Sliders } from 'lucide-react'
import Button from '../ui/Button'
import VerificationModal from '../auth/VerificationModal'
import { useAuth } from '../../context/AuthContext'
import { sendVerificationCode, changeEmail, changePassword } from '../../services/authService'

export default function SecuritySettings() {
  const { user, business, updateUser, updateBusiness } = useAuth()

  // Profile fields
  const [profileName, setProfileName] = useState(user?.name || '')
  const [profilePhone, setProfilePhone] = useState(user?.phone || '')
  const [profileSuccess, setProfileSuccess] = useState('')

  // Email Change State
  const [newEmail, setNewEmail] = useState('')
  const [emailModalOpen, setEmailModalOpen] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [emailSuccess, setEmailSuccess] = useState('')
  const [emailMockCode, setEmailMockCode] = useState(null)

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordModalOpen, setPasswordModalOpen] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [passwordMockCode, setPasswordMockCode] = useState(null)

  // Business Configuration State
  const [taxType, setTaxType] = useState(business?.taxType || 'PAN')
  const [panNumber, setPanNumber] = useState(business?.panNumber || business?.panVat || '')
  const [currencySymbol, setCurrencySymbol] = useState('NPR')
  const [fiscalYear, setFiscalYear] = useState('2081/82')
  const [configSuccess, setConfigSuccess] = useState('')

  // Sync state when user or business updates in AuthContext
  useEffect(() => {
    if (user) {
      if (user.name) setProfileName(user.name)
      if (user.phone) setProfilePhone(user.phone)
    }
    if (business) {
      if (business.taxType) setTaxType(business.taxType)
      if (business.panNumber || business.panVat) setPanNumber(business.panNumber || business.panVat)
    }
  }, [user, business])

  // ── Profile Update ──
  const handleSaveProfile = (e) => {
    e.preventDefault()
    updateUser({ name: profileName, phone: profilePhone })
    setProfileSuccess('Profile details updated successfully.')
    setTimeout(() => setProfileSuccess(''), 4000)
  }

  // ── Initiate Email Change ──
  const handleInitiateEmailChange = async (e) => {
    e.preventDefault()
    setEmailError('')
    setEmailSuccess('')

    if (!newEmail.trim()) {
      setEmailError('Please enter a new email address')
      return
    }
    if (newEmail.trim().toLowerCase() === user?.email?.toLowerCase()) {
      setEmailError('New email must be different from your current email')
      return
    }

    setEmailLoading(true)
    try {
      // Send verification code to the NEW email address
      const res = await sendVerificationCode(newEmail.trim(), 'change_email')
      if (res.mockCode) setEmailMockCode(res.mockCode)
      setEmailModalOpen(true)
    } catch (err) {
      setEmailError(err.message || 'Failed to send verification code')
    } finally {
      setEmailLoading(false)
    }
  }

  const handleVerifyEmailChange = async (code) => {
    await changeEmail(user.email, newEmail.trim(), code)
    updateUser({ email: newEmail.trim() })
    setEmailModalOpen(false)
    setNewEmail('')
    setEmailSuccess('Your email address has been successfully updated!')
    setTimeout(() => setEmailSuccess(''), 5000)
  }

  // ── Initiate Password Change ──
  const handleInitiatePasswordChange = async (e) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')

    if (!currentPassword) {
      setPasswordError('Please enter your current password')
      return
    }
    if (!newPassword || newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match')
      return
    }

    setPasswordLoading(true)
    try {
      // Send code to CURRENT email address for verification
      const res = await sendVerificationCode(user.email, 'change_password')
      if (res.mockCode) setPasswordMockCode(res.mockCode)
      setPasswordModalOpen(true)
    } catch (err) {
      setPasswordError(err.message || 'Failed to send verification code')
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleVerifyPasswordChange = async (code) => {
    await changePassword(user.email, currentPassword, newPassword, code)
    setPasswordModalOpen(false)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setPasswordSuccess('Password has been successfully changed!')
    setTimeout(() => setPasswordSuccess(''), 5000)
  }

  // ── Save Business Configuration ──
  const handleSaveConfig = (e) => {
    e.preventDefault()
    updateBusiness({
      taxType,
      panNumber,
      currencySymbol,
      fiscalYear,
    })
    setConfigSuccess('Business system configuration saved successfully.')
    setTimeout(() => setConfigSuccess(''), 4000)
  }

  return (
    <div className="space-y-8">
      {/* ── CARD 1: OWNER ACCOUNT PROFILE ── */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Owner Account Profile</h3>
            <p className="text-xs text-slate-500">View and update your personal details and system privileges.</p>
          </div>
        </div>

        {profileSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{profileSuccess}</span>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Owner Name</label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full h-10 px-3.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/15"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={profilePhone}
                onChange={(e) => setProfilePhone(e.target.value)}
                className="w-full h-10 px-3.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/15"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                {user?.role || 'Owner / Administrator'}
              </span>
              <span className="text-xs text-slate-400">Current Email: <strong className="text-slate-700 font-mono">{user?.email}</strong></span>
            </div>
            <Button type="submit" variant="secondary" className="text-xs">
              Save Profile Details
            </Button>
          </div>
        </form>
      </div>

      {/* ── CARD 2: CHANGE EMAIL (WITH NODEMAILER VERIFICATION) ── */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Change Account Email</h3>
            <p className="text-xs text-slate-500">
              For security, a 6-digit verification code will be sent via Nodemailer to the new email address to confirm ownership.
            </p>
          </div>
        </div>

        {emailSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{emailSuccess}</span>
          </div>
        )}

        {emailError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{emailError}</span>
          </div>
        )}

        <form onSubmit={handleInitiateEmailChange} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Current Email</label>
            <input
              type="text"
              disabled
              value={user?.email || ''}
              className="w-full h-10 px-3.5 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">New Email Address</label>
            <input
              type="email"
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="new.email@business.com"
              className="w-full h-10 px-3.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/15"
            />
          </div>

          <Button type="submit" disabled={emailLoading} className="text-xs">
            {emailLoading ? 'Sending Verification Code...' : 'Verify & Update Email'}
          </Button>
        </form>
      </div>

      {/* ── CARD 3: CHANGE PASSWORD (WITH NODEMAILER VERIFICATION) ── */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-5">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Change Password</h3>
            <p className="text-xs text-slate-500">
              Update your account password. A 6-digit confirmation code will be sent via Nodemailer to your registered email address.
            </p>
          </div>
        </div>

        {passwordSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{passwordSuccess}</span>
          </div>
        )}

        {passwordError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{passwordError}</span>
          </div>
        )}

        <form onSubmit={handleInitiatePasswordChange} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-10 px-3.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/15"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full h-10 px-3.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/15"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-10 px-3.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/15"
              />
            </div>
          </div>

          <Button type="submit" disabled={passwordLoading} className="text-xs">
            {passwordLoading ? 'Sending Verification Code...' : 'Send Verification & Change Password'}
          </Button>
        </form>
      </div>

      {/* ── CARD 4: OWNER BUSINESS & SYSTEM CONFIGURATION ── */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Owner System & Tax Configuration</h3>
            <p className="text-xs text-slate-500">Configure business tax registration type, currency, and fiscal calendar.</p>
          </div>
        </div>

        {configSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{configSuccess}</span>
          </div>
        )}

        <form onSubmit={handleSaveConfig} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tax Registration Mode</label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200 max-w-xs">
                <button
                  type="button"
                  onClick={() => setTaxType('PAN')}
                  className={`py-1 px-3 text-xs font-bold rounded-lg transition ${
                    taxType === 'PAN' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  PAN Registered
                </button>
                <button
                  type="button"
                  onClick={() => setTaxType('VAT')}
                  className={`py-1 px-3 text-xs font-bold rounded-lg transition ${
                    taxType === 'VAT' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  VAT (13%) Registered
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tax / PAN Number</label>
              <input
                type="text"
                value={panNumber}
                onChange={(e) => setPanNumber(e.target.value)}
                placeholder="9-digit PAN/VAT number"
                className="w-full h-10 px-3.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/15"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Currency</label>
              <select
                value={currencySymbol}
                onChange={(e) => setCurrencySymbol(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm bg-white outline-none focus:border-blue-600"
              >
                <option value="NPR">NPR (Nepalese Rupee — रु)</option>
                <option value="USD">USD ($)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Fiscal Year</label>
              <select
                value={fiscalYear}
                onChange={(e) => setFiscalYear(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm bg-white outline-none focus:border-blue-600"
              >
                <option value="2081/82">FY 2081/82 (2024/25)</option>
                <option value="2082/83">FY 2082/83 (2025/26)</option>
                <option value="2080/81">FY 2080/81 (2023/24)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" className="text-xs">
              Save Configuration
            </Button>
          </div>
        </form>
      </div>

      {/* ── MODALS FOR EMAIL & PASSWORD OTP VERIFICATION ── */}
      <VerificationModal
        open={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        email={newEmail}
        onVerify={handleVerifyEmailChange}
        onResend={() => sendVerificationCode(newEmail.trim(), 'change_email')}
        mockCode={emailMockCode}
        title="Verify New Email Address"
        subtitle="A 6-digit verification code was sent to"
      />

      <VerificationModal
        open={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        email={user?.email}
        onVerify={handleVerifyPasswordChange}
        onResend={() => sendVerificationCode(user.email, 'change_password')}
        mockCode={passwordMockCode}
        title="Confirm Password Change"
        subtitle="Security code sent to your registered email:"
      />
    </div>
  )
}

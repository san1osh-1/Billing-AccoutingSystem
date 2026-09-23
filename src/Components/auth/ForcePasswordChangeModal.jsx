import { useState } from 'react'
import { CheckCircle, Lock, ShieldCheck, Mail } from 'lucide-react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { forceChangePassword } from '../../services/authService'
import { useAuth } from '../../context/AuthContext'
import { useTranslation } from '../../i18n/LanguageContext'

export default function ForcePasswordChangeModal({ open, email }) {
  const { t } = useTranslation()
  const { user, updateUser } = useAuth()
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const userEmail = email || user?.email || ''

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!code.trim() || code.trim().length !== 6) {
      setError(t('invalid_otp_code') || 'Please enter the 6-digit verification code sent to your Gmail.')
      return
    }

    if (!newPassword || newPassword.length < 6) {
      setError(t('password_too_short') || 'New password must be at least 6 characters.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError(t('passwords_do_not_match') || 'Passwords do not match.')
      return
    }

    try {
      setLoading(true)
      const res = await forceChangePassword(userEmail, code.trim(), newPassword)
      setSuccess(true)
      
      setTimeout(() => {
        updateUser({
          mustChangePassword: false,
          isVerified: true,
          firstLoggedInAt: res.first_logged_in_at || new Date().toISOString()
        })
      }, 1500)

    } catch (err) {
      setError(err.message || 'Verification failed. Please check your Gmail code.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={() => {}} // Non-closable until completed
      title={t('first_login_verification_title') || 'Gmail OTP Verification & Password Setup'}
      size="md"
    >
      {success ? (
        <div className="py-8 text-center space-y-4">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            {t('verification_success_title') || 'Gmail Verified Successfully!'}
          </h3>
          <p className="text-sm text-slate-600">
            {t('verification_success_desc') || 'Your password has been updated and your staff account is now active.'}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-800 leading-relaxed">
              <span className="font-semibold block mb-0.5">
                {t('first_login_notice') || 'First Time Staff Verification Required'}
              </span>
              {t('first_login_instructions') || 'Please check your Gmail for the 6-digit verification OTP code and choose a new secure password.'}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              {t('gmail_address') || 'Gmail Address'}
            </label>
            <div className="flex items-center gap-2 p-2.5 bg-slate-100 rounded-lg border border-slate-200 text-sm text-slate-700 font-medium">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{userEmail}</span>
            </div>
          </div>

          <Input
            label={t('verification_code') || '6-Digit Gmail OTP Code'}
            placeholder="123456"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
            required
            autoFocus
          />

          <Input
            label={t('new_password') || 'New Password'}
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
          />

          <Input
            label={t('confirm_new_password') || 'Confirm New Password'}
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
          />

          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs font-medium text-rose-600">
              {error}
            </div>
          )}

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full justify-center py-2.5"
              loading={loading}
            >
              {t('verify_and_save_password') || 'Verify Gmail & Save Password'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  )
}

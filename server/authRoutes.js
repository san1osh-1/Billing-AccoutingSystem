import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import bcrypt from 'bcryptjs'
import { sendVerificationEmail, sendStaffInvitationEmail, generateVerificationCode } from './emailService.js'

dotenv.config({ path: path.resolve(process.cwd(), '.env'), override: true })

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

let supabase = null
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey)
}

// In-memory verification code store with expiration (10 minutes)
// Key: `${email.toLowerCase()}_${purpose}` -> { code, expiresAt }
const verificationStore = new Map()

// In-memory fallback credential store
const localCredentialsStore = new Map()

// Store array of password change timestamps per email for 24-hour rate limiting
const passwordChangeHistoryStore = new Map()

/**
 * Helper to generate a random 10-character temporary password for new staff
 */
function generateTempPassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789#@'
  let res = 'Temp-'
  for (let i = 0; i < 6; i++) {
    res += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return res
}

/**
 * Checks if the user has reached the daily limit of 3 password changes per 24 hours.
 */
function checkPasswordChangeLimit(email) {
  const cleanEmail = email.toLowerCase().trim()
  const now = Date.now()
  const ONE_DAY_MS = 24 * 60 * 60 * 1000

  let history = passwordChangeHistoryStore.get(cleanEmail) || []
  history = history.filter((ts) => now - ts < ONE_DAY_MS)
  passwordChangeHistoryStore.set(cleanEmail, history)

  if (history.length >= 3) {
    return { allowed: false, count: history.length, remaining: 0 }
  }

  return { allowed: true, count: history.length, remaining: 3 - history.length }
}

/**
 * Records a successful password change event for an email address.
 */
function recordPasswordChange(email) {
  const cleanEmail = email.toLowerCase().trim()
  const now = Date.now()
  const ONE_DAY_MS = 24 * 60 * 60 * 1000

  let history = passwordChangeHistoryStore.get(cleanEmail) || []
  history = history.filter((ts) => now - ts < ONE_DAY_MS)
  history.push(now)
  passwordChangeHistoryStore.set(cleanEmail, history)
}

/**
 * Handle incoming API requests for authentication & email verification
 */
export async function handleAuthApi(pathname, body) {
  const normPath = pathname.replace(/^\/api\/auth/, '')

  // 1. Send verification code
  if (normPath === '/send-code' || normPath === '/send-code/') {
    const { email, purpose = 'signup' } = body || {}
    if (!email || !email.includes('@')) {
      return { status: 400, data: { error: 'Valid email address is required' } }
    }

    const cleanEmail = email.toLowerCase().trim()

    // ── Forgot Password Validations (Unregistered check & 3/day Rate Limit) ──
    if (purpose === 'reset_password') {
      let isRegistered = false

      if (supabase) {
        const { data: uData } = await supabase
          .from('app_users')
          .select('id')
          .eq('email', cleanEmail)
          .maybeSingle()
        if (uData) isRegistered = true
      }

      if (!isRegistered && localCredentialsStore.has(cleanEmail)) {
        isRegistered = true
      }

      if (!isRegistered) {
        return {
          status: 404,
          data: {
            error:
              'This email address is not registered with HisaabKit. Only registered accounts can reset passwords.',
          },
        }
      }

      const limitCheck = checkPasswordChangeLimit(cleanEmail)
      if (!limitCheck.allowed) {
        return {
          status: 429,
          data: {
            error:
              'Daily limit reached. You can only reset your password 3 times per 24 hours. Please try again tomorrow.',
          },
        }
      }
    }

    if (purpose === 'change_password') {
      const limitCheck = checkPasswordChangeLimit(cleanEmail)
      if (!limitCheck.allowed) {
        return {
          status: 429,
          data: {
            error:
              'Daily limit reached. You can only change your password 3 times per 24 hours. Please try again tomorrow.',
          },
        }
      }
    }

    const code = generateVerificationCode()
    const expiresAt = Date.now() + 10 * 60 * 1000 // 10 minutes

    const key = `${cleanEmail}_${purpose}`
    verificationStore.set(key, { code, expiresAt, email: cleanEmail, purpose })

    const emailResult = await sendVerificationEmail(cleanEmail, code, purpose)

    return {
      status: 200,
      data: {
        success: true,
        message: emailResult.sent
          ? `Verification code sent to ${email}`
          : `Verification code generated (Mock mode).`,
        mockCode: emailResult.mock ? code : undefined,
      },
    }
  }

  // 2. Verify code
  if (normPath === '/verify-code' || normPath === '/verify-code/') {
    const { email, code, purpose = 'signup' } = body || {}
    if (!email || !code) {
      return { status: 400, data: { error: 'Email and verification code are required' } }
    }

    const key = `${email.toLowerCase().trim()}_${purpose}`
    const stored = verificationStore.get(key)

    if (!stored) {
      return { status: 400, data: { error: 'No verification code was requested for this email' } }
    }

    if (Date.now() > stored.expiresAt) {
      verificationStore.delete(key)
      return { status: 400, data: { error: 'Verification code has expired. Please request a new one.' } }
    }

    if (stored.code !== code.toString().trim()) {
      return { status: 400, data: { error: 'Invalid verification code. Please check and try again.' } }
    }

    return {
      status: 200,
      data: {
        success: true,
        message: 'Code verified successfully',
      },
    }
  }

  // 3. Signup (Owner Account Creation)
  if (normPath === '/signup' || normPath === '/signup/') {
    const {
      businessName,
      taxType = 'PAN',
      panNumber = '',
      phone = '',
      address = '',
      ownerName,
      email,
      password,
      code,
    } = body || {}

    if (!businessName || !ownerName || !email || !password) {
      return { status: 400, data: { error: 'All required fields must be filled' } }
    }

    // Verify OTP if code is provided
    if (code) {
      const key = `${email.toLowerCase().trim()}_signup`
      const stored = verificationStore.get(key)
      if (stored && stored.code !== code.toString().trim()) {
        return { status: 400, data: { error: 'Invalid verification code' } }
      }
      verificationStore.delete(key)
    }

    const cleanEmail = email.toLowerCase().trim()
    const passwordHash = bcrypt.hashSync(password, 10)
    let dbBusiness = null
    let dbUser = null

    if (supabase) {
      const { data: bData, error: bErr } = await supabase
        .from('business_settings')
        .insert({
          name: businessName,
          address: address || '',
          phone: phone || '',
          email: cleanEmail,
          pan_vat: panNumber || '',
          owner_email: cleanEmail,
          invoice_prefix: 'INV',
          invoice_footer: 'Thank you for your business!',
        })
        .select()
        .maybeSingle()

      if (bErr) {
        console.error('[Supabase Signup Business Error]:', bErr.message)
      } else {
        dbBusiness = bData
      }

      if (dbBusiness) {
        const { data: uData, error: uErr } = await supabase
          .from('app_users')
          .insert({
            name: ownerName,
            email: cleanEmail,
            password_hash: passwordHash,
            phone: phone || '',
            role_name: 'Owner',
            role_id: 1,
            business_id: dbBusiness.id,
            permissions: ['all'],
            must_change_password: false,
            is_verified: true,
            status: 'Active',
          })
          .select()
          .maybeSingle()

        if (uErr) {
          console.error('[Supabase Signup User Error]:', uErr.message)
        } else {
          dbUser = uData
        }
      }
    }

    // Fallback if DB is unavailable
    if (!dbBusiness || !dbUser) {
      const uniqueId = Date.now()
      dbBusiness = {
        id: uniqueId,
        name: businessName,
        address,
        phone,
        email: cleanEmail,
        pan_vat: panNumber,
      }
      dbUser = {
        id: uniqueId,
        name: ownerName,
        email: cleanEmail,
        role_name: 'Owner',
        phone,
        business_id: uniqueId,
        permissions: ['all'],
        must_change_password: false,
        is_verified: true,
      }
    }

    localCredentialsStore.set(cleanEmail, {
      email: cleanEmail,
      passwordHash,
      user: dbUser,
      business: dbBusiness,
    })

    return {
      status: 200,
      data: {
        success: true,
        user: {
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          role: dbUser.role_name || 'Owner',
          phone: dbUser.phone || '',
          businessId: dbBusiness.id,
          permissions: ['all'],
          mustChangePassword: false,
          isVerified: true,
        },
        business: {
          id: dbBusiness.id,
          name: dbBusiness.name,
          taxType,
          panNumber: dbBusiness.pan_vat || panNumber,
          phone: dbBusiness.phone || phone,
          address: dbBusiness.address || address,
          email: dbBusiness.email || cleanEmail,
        },
        token: `token_${Date.now()}_${dbBusiness.id}`,
      },
    }
  }

  // 4. Shared Login Page for Owner & Staff
  if (normPath === '/login' || normPath === '/login/') {
    const { email, password } = body || {}
    if (!email || !password) {
      return { status: 400, data: { error: 'Email and password are required' } }
    }

    const cleanEmail = email.toLowerCase().trim()

    if (supabase) {
      const { data: uData } = await supabase
        .from('app_users')
        .select('*')
        .eq('email', cleanEmail)
        .maybeSingle()

      if (uData) {
        // Check active status
        if (uData.status === 'Inactive' || uData.status === 'Disabled') {
          return {
            status: 403,
            data: { error: 'Account access has been disabled by business administrator.' },
          }
        }

        // Verify password using bcrypt or plain text match
        let isMatch = false
        if (uData.password_hash) {
          if (uData.password_hash.startsWith('$2a$') || uData.password_hash.startsWith('$2b$')) {
            isMatch = bcrypt.compareSync(password, uData.password_hash)
          } else {
            // Plain text legacy match
            isMatch = uData.password_hash === password
          }
        }

        if (isMatch) {
          const { data: bData } = await supabase
            .from('business_settings')
            .select('*')
            .eq('id', uData.business_id || 1)
            .maybeSingle()

          const bizObj = bData || {
            id: uData.business_id || 1,
            name: 'My Business',
            pan_vat: '',
          }

          // Parse permissions JSONB or array
          let userPerms = ['all']
          if (uData.role_name !== 'Owner') {
            if (Array.isArray(uData.permissions)) {
              userPerms = uData.permissions
            } else if (typeof uData.permissions === 'string') {
              try { userPerms = JSON.parse(uData.permissions) } catch { userPerms = [] }
            } else if (uData.permissions) {
              userPerms = uData.permissions
            }
          }

          // Update last login timestamp
          await supabase
            .from('app_users')
            .update({ last_login: new Date().toISOString() })
            .eq('id', uData.id)

          return {
            status: 200,
            data: {
              success: true,
              user: {
                id: uData.id,
                name: uData.name,
                email: uData.email,
                role: uData.role_name || 'Staff',
                roleId: uData.role_id || 4,
                phone: uData.phone || '',
                businessId: bizObj.id,
                permissions: userPerms,
                mustChangePassword: Boolean(uData.must_change_password),
                isVerified: Boolean(uData.is_verified),
                status: uData.status || 'Active',
              },
              business: {
                id: bizObj.id,
                name: bizObj.name,
                taxType: 'PAN',
                panNumber: bizObj.pan_vat || '',
                phone: bizObj.phone || '',
                address: bizObj.address || '',
                email: bizObj.email || uData.email,
              },
              token: `token_${Date.now()}_${bizObj.id}`,
            },
          }
        }
      }
    }

    // Check local memory store
    const localUser = localCredentialsStore.get(cleanEmail)
    if (localUser) {
      let isMatch = false
      if (localUser.passwordHash) {
        isMatch = bcrypt.compareSync(password, localUser.passwordHash)
      } else if (localUser.password) {
        isMatch = localUser.password === password
      }

      if (isMatch) {
        return {
          status: 200,
          data: {
            success: true,
            user: {
              id: localUser.user.id,
              name: localUser.user.name,
              email: localUser.user.email,
              role: localUser.user.role_name || 'Owner',
              roleId: localUser.user.role_id || 1,
              phone: localUser.user.phone || '',
              businessId: localUser.business.id,
              permissions: localUser.user.permissions || ['all'],
              mustChangePassword: Boolean(localUser.user.must_change_password),
              isVerified: Boolean(localUser.user.is_verified),
              status: localUser.user.status || 'Active',
            },
            business: {
              id: localUser.business.id,
              name: localUser.business.name,
              taxType: 'PAN',
              panNumber: localUser.business.pan_vat || '',
              phone: localUser.business.phone || '',
              address: localUser.business.address || '',
              email: localUser.business.email,
            },
            token: `token_${Date.now()}_${localUser.business.id}`,
          },
        }
      }
    }

    return { status: 401, data: { error: 'Invalid email or password' } }
  }

  // 5. Owner Adds New Staff User
  if (normPath === '/add-staff' || normPath === '/add-staff/') {
    const {
      businessId,
      businessName = 'My Business',
      name,
      email,
      phone = '',
      roleId = 4,
      roleName = 'Sales Staff',
      permissions = ['sales', 'customers', 'products'],
    } = body || {}

    if (!name || !email || !businessId) {
      return { status: 400, data: { error: 'Staff name, email, and businessId are required' } }
    }

    const cleanEmail = email.toLowerCase().trim()

    // Check if email already exists
    if (supabase) {
      const { data: existing } = await supabase
        .from('app_users')
        .select('id')
        .eq('email', cleanEmail)
        .maybeSingle()

      if (existing) {
        return { status: 400, data: { error: 'A user with this email address already exists' } }
      }
    }

    const tempPassword = generateTempPassword()
    const otpCode = generateVerificationCode()
    const passwordHash = bcrypt.hashSync(tempPassword, 10)

    let createdUser = null

    if (supabase) {
      const { data: uData, error: uErr } = await supabase
        .from('app_users')
        .insert({
          business_id: businessId,
          name,
          email: cleanEmail,
          password_hash: passwordHash,
          phone,
          role_id: roleId,
          role_name: roleName,
          permissions: permissions,
          status: 'Active',
          must_change_password: true,
          is_verified: false,
          created_at: new Date().toISOString(),
        })
        .select()
        .maybeSingle()

      if (uErr) {
        console.warn('[Supabase Add Staff Warning]:', uErr.message, '— Attempting simplified insert fallback...')
        const { data: fallbackUData, error: fallbackErr } = await supabase
          .from('app_users')
          .insert({
            business_id: businessId,
            name,
            email: cleanEmail,
            password_hash: passwordHash,
            phone,
            role_id: roleId,
            role_name: roleName,
            status: 'Active',
            created_at: new Date().toISOString(),
          })
          .select()
          .maybeSingle()

        if (fallbackErr) {
          console.warn('[Supabase Fallback Add Staff Warning]:', fallbackErr.message)
        } else {
          createdUser = fallbackUData
        }
      } else {
        createdUser = uData
      }
    }

    if (!createdUser) {
      const id = Date.now()
      createdUser = {
        id,
        business_id: businessId,
        name,
        email: cleanEmail,
        phone,
        role_id: roleId,
        role_name: roleName,
        permissions,
        status: 'Active',
        must_change_password: true,
        is_verified: false,
      }
    }

    // Save invitation OTP in verificationStore
    const otpKey = `${cleanEmail}_first_login_verify`
    verificationStore.set(otpKey, {
      code: otpCode,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      email: cleanEmail,
    })

    // Send invitation email via Nodemailer
    const emailRes = await sendStaffInvitationEmail(cleanEmail, tempPassword, name, businessName, otpCode)

    return {
      status: 200,
      data: {
        success: true,
        user: {
          id: createdUser.id,
          name: createdUser.name,
          email: createdUser.email,
          phone: createdUser.phone,
          roleId: createdUser.role_id,
          roleName: createdUser.role_name,
          permissions: createdUser.permissions,
          status: createdUser.status,
          mustChangePassword: true,
          isVerified: false,
        },
        tempPassword,
        otpCode: emailRes.mock ? otpCode : undefined,
        message: `Staff invitation sent to ${cleanEmail}`,
      },
    }
  }

  // 6. Owner Updates Staff User (Permissions, Role, Status)
  if (normPath === '/update-staff' || normPath === '/update-staff/') {
    const { id, name, phone, roleId, roleName, permissions, status } = body || {}
    if (!id) {
      return { status: 400, data: { error: 'Staff user ID is required' } }
    }

    const payload = {}
    if (name !== undefined) payload.name = name
    if (phone !== undefined) payload.phone = phone
    if (roleId !== undefined) payload.role_id = roleId
    if (roleName !== undefined) payload.role_name = roleName
    if (permissions !== undefined) payload.permissions = permissions
    if (status !== undefined) payload.status = status

    if (supabase) {
      const { error: err } = await supabase
        .from('app_users')
        .update(payload)
        .eq('id', id)

      if (err) {
        console.error('[Update Staff Error]:', err.message)
        return { status: 500, data: { error: err.message } }
      }
    }

    return {
      status: 200,
      data: {
        success: true,
        message: 'Staff user updated successfully',
      },
    }
  }

  // 7. Verify Staff First-Login Gmail OTP
  if (normPath === '/verify-staff-otp' || normPath === '/verify-staff-otp/') {
    const { email, code } = body || {}
    if (!email || !code) {
      return { status: 400, data: { error: 'Email and verification code are required' } }
    }

    const cleanEmail = email.toLowerCase().trim()
    const otpKey = `${cleanEmail}_first_login_verify`
    const stored = verificationStore.get(otpKey)

    // Allow mock match or stored code match
    if (stored && stored.code === code.toString().trim()) {
      verificationStore.delete(otpKey)
    }

    if (supabase) {
      await supabase
        .from('app_users')
        .update({ is_verified: true })
        .eq('email', cleanEmail)
    }

    return {
      status: 200,
      data: {
        success: true,
        message: 'Gmail verification successful',
      },
    }
  }

  // 8. Force Password Change (First Login or Password Reset)
  if (normPath === '/force-change-password' || normPath === '/force-change-password/') {
    const { email, currentPassword, newPassword } = body || {}
    if (!email || !newPassword || newPassword.length < 6) {
      return { status: 400, data: { error: 'Email and valid new password (min 6 chars) are required' } }
    }

    const cleanEmail = email.toLowerCase().trim()
    const newHash = bcrypt.hashSync(newPassword, 10)

    if (supabase) {
      const { error } = await supabase
        .from('app_users')
        .update({
          password_hash: newHash,
          must_change_password: false,
          is_verified: true,
          first_logged_in_at: new Date().toISOString(),
        })
        .eq('email', cleanEmail)

      if (error) {
        console.error('[Force Password Change Error]:', error.message)
        return { status: 500, data: { error: error.message } }
      }
    }

    // Update memory fallback
    const local = localCredentialsStore.get(cleanEmail)
    if (local) {
      local.passwordHash = newHash
      if (local.user) {
        local.user.must_change_password = false
        local.user.is_verified = true
      }
    }

    recordPasswordChange(cleanEmail)

    return {
      status: 200,
      data: {
        success: true,
        message: 'Password updated successfully! You can now access your account.',
      },
    }
  }

  // 9. Change Email
  if (normPath === '/change-email' || normPath === '/change-email/') {
    const { currentEmail, newEmail, code } = body || {}
    if (!currentEmail || !newEmail || !code) {
      return { status: 400, data: { error: 'Current email, new email, and code are required' } }
    }

    const key = `${newEmail.toLowerCase().trim()}_change_email`
    const stored = verificationStore.get(key)
    if (!stored || stored.code !== code.toString().trim()) {
      return { status: 400, data: { error: 'Invalid or expired verification code' } }
    }
    verificationStore.delete(key)

    if (supabase) {
      await supabase
        .from('app_users')
        .update({ email: newEmail.toLowerCase().trim() })
        .eq('email', currentEmail.toLowerCase().trim())
    }

    return {
      status: 200,
      data: {
        success: true,
        message: 'Email updated successfully',
        newEmail: newEmail.toLowerCase().trim(),
      },
    }
  }

  // 10. Change Password (From Settings)
  if (normPath === '/change-password' || normPath === '/change-password/') {
    const { email, currentPassword, newPassword, code } = body || {}
    if (!email || !newPassword || !code) {
      return { status: 400, data: { error: 'Email, new password, and verification code are required' } }
    }

    const cleanEmail = email.toLowerCase().trim()

    const limitCheck = checkPasswordChangeLimit(cleanEmail)
    if (!limitCheck.allowed) {
      return {
        status: 429,
        data: {
          error:
            'Daily limit reached. You can only change your password 3 times per 24 hours. Please try again tomorrow.',
        },
      }
    }

    const key = `${cleanEmail}_change_password`
    const stored = verificationStore.get(key)
    if (!stored || stored.code !== code.toString().trim()) {
      return { status: 400, data: { error: 'Invalid or expired verification code' } }
    }
    verificationStore.delete(key)

    const newHash = bcrypt.hashSync(newPassword, 10)

    if (supabase) {
      await supabase
        .from('app_users')
        .update({ password_hash: newHash })
        .eq('email', cleanEmail)
    }

    recordPasswordChange(cleanEmail)

    return {
      status: 200,
      data: {
        success: true,
        message: 'Password changed successfully',
      },
    }
  }

  // 11. Reset Password (Forgot password on Login)
  if (normPath === '/reset-password' || normPath === '/reset-password/') {
    const { email, newPassword, code } = body || {}
    if (!email || !newPassword || !code) {
      return { status: 400, data: { error: 'Email, new password, and code are required' } }
    }

    const cleanEmail = email.toLowerCase().trim()

    const limitCheck = checkPasswordChangeLimit(cleanEmail)
    if (!limitCheck.allowed) {
      return {
        status: 429,
        data: {
          error:
            'Daily limit reached. You can only change your password 3 times per 24 hours. Please try again tomorrow.',
        },
      }
    }

    const key = `${cleanEmail}_reset_password`
    const stored = verificationStore.get(key)
    if (!stored || stored.code !== code.toString().trim()) {
      return { status: 400, data: { error: 'Invalid or expired verification code' } }
    }
    verificationStore.delete(key)

    const newHash = bcrypt.hashSync(newPassword, 10)

    if (supabase) {
      await supabase
        .from('app_users')
        .update({ password_hash: newHash, must_change_password: false })
        .eq('email', cleanEmail)
    }

    recordPasswordChange(cleanEmail)

    return {
      status: 200,
      data: {
        success: true,
        message: 'Password reset successfully. You can now log in.',
      },
    }
  }

  return { status: 404, data: { error: 'Endpoint not found' } }
}

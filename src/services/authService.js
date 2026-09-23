const API_BASE = import.meta.env.VITE_API_URL || '/api/auth'

/**
 * Send a 6-digit verification code to the given email address
 * @param {string} email
 * @param {'signup' | 'change_email' | 'change_password' | 'reset_password'} purpose
 */
export async function sendVerificationCode(email, purpose = 'signup') {
  try {
    const res = await fetch(`${API_BASE}/send-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, purpose }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Failed to send verification code')
    return data
  } catch (err) {
    console.error('sendVerificationCode error:', err)
    throw err
  }
}

/**
 * Verify a 6-digit code against email & purpose
 */
export async function verifyCode(email, code, purpose = 'signup') {
  try {
    const res = await fetch(`${API_BASE}/verify-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code, purpose }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Code verification failed')
    return data
  } catch (err) {
    console.error('verifyCode error:', err)
    throw err
  }
}

/**
 * Register business vendor and owner account
 */
export async function registerAccount(signupData) {
  try {
    const res = await fetch(`${API_BASE}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signupData),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Account registration failed')
    return data
  } catch (err) {
    console.error('registerAccount error:', err)
    throw err
  }
}

/**
 * Log in with email and password
 */
export async function loginAccount(email, password) {
  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Login failed')
    return data
  } catch (err) {
    console.error('loginAccount error:', err)
    throw err
  }
}

/**
 * Change owner email with verification code
 */
export async function changeEmail(currentEmail, newEmail, code) {
  try {
    const res = await fetch(`${API_BASE}/change-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentEmail, newEmail, code }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Failed to update email')
    return data
  } catch (err) {
    console.error('changeEmail error:', err)
    throw err
  }
}

/**
 * Change owner password with verification code
 */
export async function changePassword(email, currentPassword, newPassword, code) {
  try {
    const res = await fetch(`${API_BASE}/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, currentPassword, newPassword, code }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Failed to update password')
    return data
  } catch (err) {
    console.error('changePassword error:', err)
    throw err
  }
}

/**
 * Reset password using verification code
 */
export async function resetPassword(email, newPassword, code) {
  try {
    const res = await fetch(`${API_BASE}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, newPassword, code }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Failed to reset password')
    return data
  } catch (err) {
    console.error('resetPassword error:', err)
    throw err
  }
}

/**
 * Owner adds staff member
 */
export async function addStaffUser(staffData) {
  try {
    const res = await fetch(`${API_BASE}/add-staff`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(staffData),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Failed to add staff member')
    return data
  } catch (err) {
    console.error('addStaffUser error:', err)
    throw err
  }
}

/**
 * Owner updates staff member permissions or details
 */
export async function updateStaffUser(staffId, staffData) {
  try {
    const res = await fetch(`${API_BASE}/update-staff`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ staffId, ...staffData }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Failed to update staff member')
    return data
  } catch (err) {
    console.error('updateStaffUser error:', err)
    throw err
  }
}

/**
 * Verify staff 6-digit Gmail OTP code
 */
export async function verifyStaffOtp(email, code) {
  try {
    const res = await fetch(`${API_BASE}/verify-staff-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Invalid verification code')
    return data
  } catch (err) {
    console.error('verifyStaffOtp error:', err)
    throw err
  }
}

/**
 * Force staff password change on first login
 */
export async function forceChangePassword(email, code, newPassword) {
  try {
    const res = await fetch(`${API_BASE}/force-change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code, newPassword }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Failed to set new password')
    return data
  } catch (err) {
    console.error('forceChangePassword error:', err)
    throw err
  }
}


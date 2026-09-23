import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import path from 'path'

/**
 * Creates and returns a Nodemailer transporter.
 * Dynamically reloads .env so any runtime credential updates take effect immediately.
 */
function createTransporter() {
  dotenv.config({ path: path.resolve(process.cwd(), '.env'), override: true })

  const gmailUser = (process.env.GMAIL_USER || process.env.VITE_GMAIL_USER || '').trim()
  const gmailPass = (process.env.GMAIL_APP_PASSWORD || process.env.VITE_GMAIL_APP_PASSWORD || '').trim()

  if (gmailUser && gmailPass) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    })
  }

  // Fallback to custom SMTP if defined
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  }

  return null
}

/**
 * Generate a 6-digit numeric verification code
 */
export function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Sends a verification code email using Nodemailer
 */
export async function sendVerificationEmail(toEmail, code, purpose = 'signup') {
  const transporter = createTransporter()
  const fromName = process.env.EMAIL_FROM_NAME || 'HisaabKit'
  const fromAddress = (process.env.EMAIL_FROM_ADDRESS || process.env.GMAIL_USER || 'noreply@hisaabkit.com').trim()

  const purposeTitles = {
    signup: {
      subject: `Your HisaabKit Verification Code: ${code}`,
      title: 'Verify Your Email Address',
      message: 'Thank you for registering your business with HisaabKit. Please use the verification code below to activate your account:',
    },
    change_email: {
      subject: `Verify Your New Email Address: ${code}`,
      title: 'Confirm Email Address Change',
      message: 'You requested to update your account email address. Please use the verification code below to confirm this change:',
    },
    change_password: {
      subject: `Password Change Verification Code: ${code}`,
      title: 'Security Verification for Password Change',
      message: 'A request was made to change your HisaabKit account password. Please enter the verification code below to proceed:',
    },
    reset_password: {
      subject: `Password Reset Code: ${code}`,
      title: 'Reset Your Password',
      message: 'We received a request to reset your password. Use the verification code below to set a new password:',
    },
  }

  const { subject, title, message } = purposeTitles[purpose] || purposeTitles.signup

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
          .container { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 36px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
          .brand { display: flex; align-items: center; gap: 10px; margin-bottom: 24px; }
          .logo-badge { width: 36px; height: 36px; background: linear-gradient(135deg, #2563eb, #1d4ed8); border-radius: 8px; color: #ffffff; font-weight: bold; font-size: 18px; display: inline-flex; align-items: center; justify-content: center; text-align: center; line-height: 36px; }
          .brand-name { font-size: 20px; font-weight: bold; color: #0f172a; margin-left: 10px; display: inline-block; vertical-align: middle; }
          h2 { margin-top: 0; font-size: 20px; font-weight: 700; color: #0f172a; }
          p { font-size: 14px; line-height: 1.6; color: #475569; margin: 12px 0; }
          .code-box { background: #eff6ff; border: 2px dashed #93c5fd; border-radius: 12px; padding: 18px; text-align: center; margin: 24px 0; }
          .code { font-family: monospace, Courier; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #1d4ed8; }
          .footer { font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 18px; margin-top: 24px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="brand">
            <span class="logo-badge">ह</span>
            <span class="brand-name">HisaabKit</span>
          </div>
          <h2>${title}</h2>
          <p>${message}</p>
          <div class="code-box">
            <div class="code">${code}</div>
          </div>
          <p style="font-size: 13px; color: #64748b;">This verification code will expire in <strong>10 minutes</strong>. If you did not request this code, you can safely ignore this email.</p>
          <div class="footer">
            © ${new Date().getFullYear()} HisaabKit Nepal. Smart Billing & Accounting SaaS.
          </div>
        </div>
      </body>
    </html>
  `

  if (!transporter) {
    console.warn(`[Nodemailer Notice] GMAIL_USER / GMAIL_APP_PASSWORD is not configured in .env file!`)
    console.warn(`[Nodemailer Mock Dispatch] Verification Code for ${toEmail} (${purpose}): [ ${code} ]`)
    return {
      sent: false,
      code,
      mock: true,
      message: 'Nodemailer Gmail credentials not configured in .env. Code logged to console & returned for testing.',
    }
  }

  try {
    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromAddress}>`,
      to: toEmail,
      subject,
      text: `${title}\n\nYour 6-digit verification code is: ${code}\n\nThis code expires in 10 minutes.`,
      html: htmlContent,
    })

    console.log(`[Nodemailer Success] Verification email sent to ${toEmail}: ${info.messageId}`)
    return { sent: true, messageId: info.messageId, code }
  } catch (error) {
    console.error('[Nodemailer Error] Failed to send email via Gmail SMTP:', error.message)
    return {
      sent: false,
      error: error.message,
      code,
      mock: true,
    }
  }
}

/**
 * Sends a staff invitation email containing app login link & temporary credentials
 */
export async function sendStaffInvitationEmail(toEmail, tempPassword, staffName, businessName, verificationCode) {
  const transporter = createTransporter()
  const fromName = process.env.EMAIL_FROM_NAME || 'HisaabKit'
  const fromAddress = (process.env.EMAIL_FROM_ADDRESS || process.env.GMAIL_USER || 'noreply@hisaabkit.com').trim()
  const appUrl = (process.env.APP_URL || process.env.VITE_APP_URL || 'http://localhost:5173').replace(/\/$/, '')

  const loginUrl = `${appUrl}/login`
  const subject = `Welcome to HisaabKit — You've been added to ${businessName}`

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
          .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 36px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
          .brand { display: flex; align-items: center; gap: 10px; margin-bottom: 24px; }
          .logo-badge { width: 36px; height: 36px; background: linear-gradient(135deg, #2563eb, #1d4ed8); border-radius: 8px; color: #ffffff; font-weight: bold; font-size: 18px; display: inline-flex; align-items: center; justify-content: center; text-align: center; line-height: 36px; }
          .brand-name { font-size: 20px; font-weight: bold; color: #0f172a; margin-left: 10px; display: inline-block; vertical-align: middle; }
          h2 { margin-top: 0; font-size: 20px; font-weight: 700; color: #0f172a; }
          p { font-size: 14px; line-height: 1.6; color: #475569; margin: 12px 0; }
          .cred-box { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 12px; padding: 18px; margin: 20px 0; }
          .cred-label { font-size: 11px; font-weight: 700; uppercase; color: #64748b; letter-spacing: 0.5px; }
          .cred-value { font-family: monospace, Courier; font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 10px; }
          .btn { display: inline-block; background: #2563eb; color: #ffffff !important; font-weight: 600; font-size: 14px; padding: 12px 24px; border-radius: 10px; text-decoration: none; margin-top: 16px; text-align: center; }
          .footer { font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 18px; margin-top: 24px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="brand">
            <span class="logo-badge">ह</span>
            <span class="brand-name">HisaabKit</span>
          </div>
          <h2>Hello ${staffName},</h2>
          <p>You have been invited to join <strong>${businessName}</strong> on HisaabKit (Smart Billing & Accounting SaaS).</p>
          
          <div class="cred-box">
            <div class="cred-label">YOUR LOGIN EMAIL</div>
            <div class="cred-value">${toEmail}</div>
            
            <div class="cred-label">ONE-TIME TEMPORARY PASSWORD</div>
            <div class="cred-value">${tempPassword}</div>

            <div class="cred-label">FIRST-TIME GMAIL VERIFICATION CODE</div>
            <div class="cred-value" style="color: #1d4ed8; font-size: 20px;">${verificationCode}</div>
          </div>

          <p>For security, you will be required to verify your Gmail with this 6-digit code and set a new password upon your first login.</p>

          <div style="text-center">
            <a href="${loginUrl}" class="btn">Click Here to Open HisaabKit & Sign In</a>
          </div>

          <div class="footer">
            © ${new Date().getFullYear()} HisaabKit Nepal. Smart Billing & Accounting SaaS.
          </div>
        </div>
      </body>
    </html>
  `

  if (!transporter) {
    console.warn(`[Nodemailer Notice] GMAIL_USER / GMAIL_APP_PASSWORD not set in .env!`)
    console.warn(`[Nodemailer Mock Dispatch] Staff Invitation to ${toEmail}: Temp Pass [ ${tempPassword} ], OTP Code [ ${verificationCode} ]`)
    return {
      sent: false,
      tempPassword,
      verificationCode,
      mock: true,
    }
  }

  try {
    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromAddress}>`,
      to: toEmail,
      subject,
      text: `Hello ${staffName},\n\nYou have been added to ${businessName} on HisaabKit.\n\nLogin URL: ${loginUrl}\nEmail: ${toEmail}\nTemporary Password: ${tempPassword}\nVerification Code: ${verificationCode}\n\nPlease change your temporary password upon first login.`,
      html: htmlContent,
    })

    console.log(`[Nodemailer Success] Staff invitation sent to ${toEmail}: ${info.messageId}`)
    return { sent: true, messageId: info.messageId, tempPassword, verificationCode }
  } catch (error) {
    console.error('[Nodemailer Error] Failed to send staff invitation:', error.message)
    return {
      sent: false,
      error: error.message,
      tempPassword,
      verificationCode,
      mock: true,
    }
  }
}

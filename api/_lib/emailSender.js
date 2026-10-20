import nodemailer from 'nodemailer';
import { Resend } from 'resend';

/**
 * Send an email via configured provider:
 * 1. 'gmail' (default if GMAIL_USER & GMAIL_APP_PASSWORD are provided) -> Nodemailer SMTP
 * 2. 'resend' (if RESEND_API_KEY is provided and selected or fallback) -> Resend SDK
 *
 * @param {object} options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Subject line
 * @param {string} options.text - Plain text content
 * @param {string} options.html - HTML content
 * @param {string} [options.provider] - 'gmail' | 'resend' | 'auto'
 */
export async function sendEmail({ to, subject, text, html, provider = 'auto' }) {
  if (!to) {
    throw new Error('Recipient email is required');
  }

  const hasGmailConfig = Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
  const hasResendConfig = Boolean(process.env.RESEND_API_KEY);

  let selectedProvider = provider;
  if (selectedProvider === 'auto') {
    if (process.env.EMAIL_PROVIDER) {
      selectedProvider = process.env.EMAIL_PROVIDER.toLowerCase();
    } else if (hasGmailConfig) {
      selectedProvider = 'gmail';
    } else if (hasResendConfig) {
      selectedProvider = 'resend';
    } else {
      throw new Error('No email provider credentials configured (GMAIL_USER / GMAIL_APP_PASSWORD or RESEND_API_KEY).');
    }
  }

  if (selectedProvider === 'gmail') {
    if (!hasGmailConfig) {
      throw new Error('Gmail SMTP is selected but GMAIL_USER or GMAIL_APP_PASSWORD is not set.');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    const fromName = process.env.SENDER_NAME || 'Birthday Bliss';
    const fromAddress = `"${fromName}" <${process.env.GMAIL_USER}>`;

    const info = await transporter.sendMail({
      from: fromAddress,
      to,
      subject,
      text,
      html
    });

    return {
      success: true,
      provider: 'gmail',
      messageId: info.messageId
    };
  }

  if (selectedProvider === 'resend') {
    if (!hasResendConfig) {
      throw new Error('Resend is selected but RESEND_API_KEY is not set.');
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const fromAddress = process.env.RESEND_FROM_EMAIL ||
      process.env.VITE_RESEND_FROM_EMAIL ||
      'Birthday Bliss <onboarding@resend.dev>';

    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: [to],
      subject,
      text,
      html
    });

    if (error) {
      throw new Error(`Resend error: ${error.message}`);
    }

    return {
      success: true,
      provider: 'resend',
      messageId: data.id
    };
  }

  throw new Error(`Unsupported email provider: ${selectedProvider}`);
}

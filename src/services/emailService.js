/**
 * EmailJS Auto-Send Service
 * Sends birthday wish emails automatically when a draft is approved.
 * Uses EmailJS (client-side, no backend needed, free 200 emails/month).
 *
 * Setup (2 min):
 *  1. Create free account at https://www.emailjs.com
 *  2. Add "Email Service" → Gmail (connect your Gmail account)
 *  3. Create "Email Template" with variables: {{to_email}}, {{to_name}}, {{from_name}}, {{message}}, {{subject}}
 *  4. Add your keys to .env:
 *       VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
 *       VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
 *       VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxxxx
 */
import emailjs from '@emailjs/browser';

const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export const isEmailConfigured = Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);

/**
 * Send a birthday wish email automatically.
 * @param {object} params
 * @param {string} params.toEmail      - Recipient email address
 * @param {string} params.toName       - Recipient name
 * @param {string} params.fromName     - Sender name (your name)
 * @param {string} params.message      - Birthday wish message body
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function sendBirthdayEmail({ toEmail, toName, fromName, message }) {
  if (!isEmailConfigured) {
    return {
      success: false,
      error: 'EmailJS not configured. Please add VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY to your .env file.'
    };
  }

  if (!toEmail) {
    return { success: false, error: 'No email address provided for this friend.' };
  }

  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        to_email: toEmail,
        to_name: toName,
        from_name: fromName || 'BirthWish',
        subject: `🎂 Happy Birthday, ${toName}!`,
        message: message,
        reply_to: ''
      },
      PUBLIC_KEY
    );

    return { success: true };
  } catch (err) {
    console.error('EmailJS send error:', err);
    return {
      success: false,
      error: err?.text || err?.message || 'Failed to send email. Check your EmailJS configuration.'
    };
  }
}

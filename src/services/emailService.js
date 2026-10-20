/**
 * Client-Side Birthday Email Dispatch Service
 *
 * Sends emails by invoking the Vercel serverless function (/api/send-email).
 * The server securely forwards the email through either:
 * - Gmail SMTP (free with Gmail App Password)
 * - Resend API (optional)
 *
 * No email passwords, SMTP keys, or secret tokens are ever exposed to the client.
 */

export const isEmailConfigured = true;

/**
 * Send a birthday wish email via Vercel Serverless Function -> Configured Email Provider.
 * @param {object} params
 * @param {string} params.toEmail   - Recipient email address
 * @param {string} params.toName    - Recipient name
 * @param {string} params.fromName  - Sender display name
 * @param {string} params.message   - Birthday wish message body
 * @param {boolean} [params.testOnly] - Dry-run test flag
 * @returns {Promise<{success: boolean, error?: string, provider?: string}>}
 */
export async function sendBirthdayEmail({ toEmail, toName, fromName, message, testOnly = false }) {
  if (!toEmail) {
    return { success: false, error: 'No email address provided for this friend.' };
  }

  try {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        toEmail,
        toName,
        fromName: fromName || 'Birthday Bliss',
        message,
        testOnly
      })
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      return {
        success: false,
        error: data.error || `Server responded with status ${res.status}`
      };
    }

    return {
      success: true,
      provider: data.provider,
      messageId: data.messageId,
      dryRun: data.dryRun
    };
  } catch (err) {
    console.error('Email dispatch error:', err);
    return {
      success: false,
      error: err?.message || 'Failed to communicate with email serverless function.'
    };
  }
}

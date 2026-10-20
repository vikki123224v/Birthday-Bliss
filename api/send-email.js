import { sendEmail } from './_lib/emailSender.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { toEmail, toName, fromName, message, testOnly } = req.body || {};

  if (!toEmail) {
    return res.status(400).json({ error: 'toEmail is required.' });
  }
  if (!message) {
    return res.status(400).json({ error: 'message is required.' });
  }

  // If dry-run test mode requested, do not dispatch real email
  if (testOnly) {
    return res.status(200).json({
      success: true,
      dryRun: true,
      message: `Test email validated successfully for ${toEmail}. No real email was sent.`
    });
  }

  try {
    const subject = `🎂 Happy Birthday, ${toName || 'there'}!`;
    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#ffffff;border-radius:12px;border:1px solid #f3f4f6">
        <h1 style="color:#f59e0b;font-size:26px;margin-bottom:12px">🎂 Happy Birthday!</h1>
        <p style="font-size:16px;line-height:1.7;color:#374151">
          ${message.replace(/\n/g, '<br>')}
        </p>
        <p style="font-size:13px;color:#9ca3af;margin-top:32px;border-top:1px solid #f3f4f6;padding-top:16px">
          Sent with ❤️ via Birthday Bliss — ${fromName || 'Your Friend'}
        </p>
      </div>
    `;

    const result = await sendEmail({
      to: toEmail,
      subject,
      text: message,
      html
    });

    return res.status(200).json({
      success: true,
      provider: result.provider,
      messageId: result.messageId
    });
  } catch (err) {
    console.error('Error in /api/send-email:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to dispatch email'
    });
  }
}

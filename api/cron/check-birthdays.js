import { getAdminDb } from './_lib/firebaseAdmin.js';
import { sendEmail } from './_lib/emailSender.js';
import { isBirthdayToday, getNowInTimezone } from './_lib/birthdayMatcher.js';

export default async function handler(req, res) {
  // Allow only GET (standard for cron) and POST
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 1. Verify Vercel Cron Secret
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.authorization;

  if (cronSecret) {
    if (authHeader !== `Bearer ${cronSecret}`) {
      console.warn('⛔ Unauthorized cron invocation attempt');
      return res.status(401).json({ error: 'Unauthorized: Invalid or missing CRON_SECRET' });
    }
  } else {
    // If running in development without CRON_SECRET configured
    console.warn('⚠️ CRON_SECRET is not set in environment variables. Running in unprotected mode.');
  }

  const dryRun = req.query.dryRun === 'true' || req.query.test === 'true';

  try {
    const db = getAdminDb();
    const targetDate = getNowInTimezone('Asia/Kolkata');
    const targetYear = targetDate.getFullYear();
    const dateStamp = targetDate.toISOString().slice(0, 10);

    console.log(`⏰ Daily birthday cron started for date ${dateStamp} (Asia/Kolkata)...`);

    const usersSnapshot = await db.collection('users').get();
    const results = {
      date: dateStamp,
      timezone: 'Asia/Kolkata',
      totalUsersProcessed: usersSnapshot.size,
      draftsCreated: 0,
      autoSentEmails: 0,
      skippedDisabled: 0,
      alreadySentOrExisting: 0,
      errors: [],
      details: []
    };

    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const userData = userDoc.data() || {};

      // If user globally disabled reminders, skip
      if (userData.birthdayReminder === false) {
        results.skippedDisabled++;
        continue;
      }

      const friendsRef = db.collection('users').doc(userId).collection('friends');
      const draftsRef = db.collection('users').doc(userId).collection('drafts');
      const deliveryLogsRef = db.collection('users').doc(userId).collection('deliveryLogs');

      const friendsSnap = await friendsRef.get();

      for (const friendDoc of friendsSnap.docs) {
        const friendId = friendDoc.id;
        const friend = friendDoc.data() || {};

        if (!friend.birthdate) continue;

        const bdayCheck = isBirthdayToday(friend.birthdate, targetDate);
        if (!bdayCheck.isToday) continue;

        const channel = friend.preferredChannel || userData.defaultChannel || 'Email';
        const isAutoSendEnabled = friend.autoSend === true;
        const recipientEmail = friend.email ? friend.email.trim() : '';

        // Duplicate prevention check 1: Check existing drafts for this friend & targetYear
        const existingDraftsSnap = await draftsRef
          .where('friendId', '==', friendId)
          .where('targetYear', '==', targetYear)
          .limit(1)
          .get();

        const draftAlreadyExists = !existingDraftsSnap.empty;

        // Duplicate prevention check 2: Check persistent delivery logs
        const existingLogsSnap = await deliveryLogsRef
          .where('friendId', '==', friendId)
          .where('targetYear', '==', targetYear)
          .where('status', 'in', ['delivered', 'sent'])
          .limit(1)
          .get();

        const alreadyDispatched = !existingLogsSnap.empty;

        if (alreadyDispatched) {
          results.alreadySentOrExisting++;
          results.details.push({
            user: userId,
            friend: friend.name,
            action: 'skipped',
            reason: 'Already sent for this year'
          });
          continue;
        }

        const ageText = bdayCheck.turningAge ? ` ${bdayCheck.turningAge}` : '';
        const defaultGreeting = friend.customMessage ||
          `Happy${ageText} Birthday, ${friend.name}! 🎂 Wishing you a wonderful day filled with happiness and a fantastic year ahead!`;

        // If friend has autoSend enabled and channel is Email:
        if (isAutoSendEnabled && channel === 'Email' && recipientEmail) {
          if (dryRun) {
            results.autoSentEmails++;
            results.details.push({
              user: userId,
              friend: friend.name,
              email: recipientEmail,
              action: 'dry_run_auto_send',
              message: defaultGreeting
            });
            continue;
          }

          try {
            console.log(`✉️ Auto-sending birthday email to ${recipientEmail} for ${friend.name}...`);

            const sendResult = await sendEmail({
              to: recipientEmail,
              subject: `🎂 Happy Birthday, ${friend.name}!`,
              text: defaultGreeting,
              html: `
                <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#ffffff;border-radius:12px;border:1px solid #f3f4f6">
                  <h1 style="color:#f59e0b;font-size:26px;margin-bottom:12px">🎂 Happy Birthday!</h1>
                  <p style="font-size:16px;line-height:1.7;color:#374151">
                    ${defaultGreeting.replace(/\n/g, '<br>')}
                  </p>
                  <p style="font-size:13px;color:#9ca3af;margin-top:32px;border-top:1px solid #f3f4f6;padding-top:16px">
                    Sent automatically with ❤️ via Birthday Bliss — ${userData.name || 'Your Friend'}
                  </p>
                </div>
              `
            });

            // Record in delivery logs (persistent send history)
            await deliveryLogsRef.add({
              friendId,
              targetYear,
              recipient: friend.name,
              channel: 'Email',
              email: recipientEmail,
              message: defaultGreeting,
              status: 'delivered',
              provider: sendResult.provider,
              providerId: sendResult.messageId || '',
              autoSent: true,
              date: targetDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
              timestamp: new Date().toISOString()
            });

            // If a draft existed, update it as sent
            if (draftAlreadyExists) {
              const draftId = existingDraftsSnap.docs[0].id;
              await draftsRef.doc(draftId).update({
                status: 'approved',
                deliveryStatus: 'delivered',
                autoSent: true,
                completedAt: new Date().toISOString()
              });
            }

            results.autoSentEmails++;
            results.details.push({
              user: userId,
              friend: friend.name,
              action: 'auto_sent',
              provider: sendResult.provider
            });
          } catch (sendErr) {
            console.error(`❌ Failed to send email to ${recipientEmail}:`, sendErr.message);

            await deliveryLogsRef.add({
              friendId,
              targetYear,
              recipient: friend.name,
              channel: 'Email',
              email: recipientEmail,
              message: defaultGreeting,
              status: 'failed',
              errorReason: sendErr.message,
              autoSent: true,
              timestamp: new Date().toISOString()
            });

            results.errors.push({
              friend: friend.name,
              error: sendErr.message
            });
          }
        } else {
          // If autoSend is disabled (default) OR channel is not Email:
          // Create or maintain a pending draft for explicit user approval!
          if (!draftAlreadyExists) {
            const draftData = {
              friendId,
              friendName: friend.name,
              targetYear,
              birthdayDetails: `${bdayCheck.turningAge ? bdayCheck.turningAge + ' today · ' : ''}${channel}`,
              phone: friend.phone || '',
              email: recipientEmail,
              channel,
              message: defaultGreeting,
              status: 'pending',
              autoSend: Boolean(friend.autoSend),
              createdAt: new Date().toISOString()
            };

            await draftsRef.add(draftData);
            results.draftsCreated++;
            results.details.push({
              user: userId,
              friend: friend.name,
              action: 'draft_created',
              channel
            });
          } else {
            results.alreadySentOrExisting++;
          }
        }
      }
    }

    console.log('✅ Daily birthday cron job completed:', results);
    return res.status(200).json({ success: true, results });
  } catch (error) {
    console.error('❌ Daily cron failed:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

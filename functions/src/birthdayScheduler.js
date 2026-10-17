/**
 * Firebase Cloud Function: Scheduled Daily Birthday Detection
 * Runs daily at 00:00 (configured time zone)
 *
 * Rules:
 * 1. Checks all active users who have birthdayReminder enabled.
 * 2. Evaluates friend birthdays matching today's month and day.
 * 3. Handles leap year (Feb 29 on non-leap year falls on Feb 28).
 * 4. Generates pending drafts for any friend celebrating today or within upcoming threshold.
 * 5. Uses idempotency checks to prevent duplicate drafts for the same friend, birthday year, and channel.
 * 6. NEVER sends messages automatically without explicit user authorization and approval.
 */

const { onSchedule } = require('firebase-functions/v2/scheduler');
const admin = require('firebase-admin');
const { createBirthdayDraftsForUser } = require('./createBirthdayDrafts');

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * Scheduled cron job running every hour to match user-specific time zones
 */
exports.dailyBirthdayScheduler = onSchedule('every 1 hours', async (event) => {
  console.log('⏰ Running daily birthday scheduler batch...');

  try {
    const usersSnapshot = await db.collection('users').get();
    
    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      const userId = userDoc.id;

      // Skip if reminders are disabled
      if (userData.birthdayReminder === false) {
        continue;
      }

      const userTimezone = userData.timezone || 'Asia/Kolkata';
      const notificationTime = userData.notificationTime || '09:00';

      // Check current hour in user's timezone
      const nowInTz = new Date(new Date().toLocaleString('en-US', { timeZone: userTimezone }));
      const [targetHour] = notificationTime.split(':').map(Number);

      if (nowInTz.getHours() === targetHour) {
        console.log(`🎂 Processing birthday drafts for user ${userId} in timezone ${userTimezone}`);
        await createBirthdayDraftsForUser(db, userId, userData, nowInTz);
      }
    }

    console.log('✅ Daily birthday scheduler completed successfully.');
  } catch (err) {
    console.error('❌ Error executing daily birthday scheduler:', err);
    throw err;
  }
});

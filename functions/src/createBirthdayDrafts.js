/**
 * Cloud Function Helper: Create Birthday Drafts for a User
 * Enforces:
 * - Leap year recognition (Feb 29 on non-leap years celebrated Feb 28)
 * - Duplicate prevention per friendId, targetYear, and channel
 * - Template personalization with name and age
 */

function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function parseBirthdateParts(str) {
  if (!str) return { month: 1, day: 1, year: 2000 };
  const parts = str.split('-').map(Number);
  if (parts.length === 3) {
    if (parts[0] > 1000) return { year: parts[0], month: parts[1], day: parts[2] };
    return { day: parts[0], month: parts[1], year: parts[2] };
  }
  return { month: 1, day: 1, year: 2000 };
}

async function createBirthdayDraftsForUser(db, userId, userData, currentDate) {
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();
  const currentYear = currentDate.getFullYear();

  const friendsRef = db.collection('users').doc(userId).collection('friends');
  const draftsRef = db.collection('users').doc(userId).collection('drafts');

  const friendsSnap = await friendsRef.get();

  for (const friendDoc of friendsSnap.docs) {
    const friend = friendDoc.data();
    const friendId = friendDoc.id;

    const { month: bMonth, day: bDay, year: bYear } = parseBirthdateParts(friend.birthdate);

    // Leap-year rule
    let effectiveDay = bDay;
    if (bMonth === 2 && bDay === 29 && !isLeapYear(currentYear)) {
      effectiveDay = 28;
    }

    // Check if birthday is today
    if (bMonth === currentMonth && effectiveDay === currentDay) {
      const channel = friend.preferredChannel || userData.defaultChannel || 'WhatsApp';
      const age = currentYear - bYear;

      // Duplicate prevention query
      const existingDraftQuery = await draftsRef
        .where('friendId', '==', friendId)
        .where('targetYear', '==', currentYear)
        .where('channel', '==', channel)
        .limit(1)
        .get();

      if (!existingDraftQuery.empty) {
        console.log(`ℹ️ Draft already exists for ${friend.name} (${currentYear}), skipping.`);
        continue;
      }

      // Generate personalized message
      const defaultGreeting = friend.customMessage ||
        `Happy Birthday ${friend.name}! 🎂 Wishing you a fantastic year ahead filled with happiness, success, and new adventures!`;

      const draftDoc = {
        friendId,
        friendName: friend.name,
        targetYear: currentYear,
        birthdayDetails: `${age} today · ${channel}`,
        phone: friend.phone || '',
        email: friend.email || '',
        channel,
        message: defaultGreeting,
        status: 'pending', // Explicit approval required
        createdAt: new Date().toISOString()
      };

      await draftsRef.add(draftDoc);
      console.log(`✨ Created pending draft for ${friend.name}`);
    }
  }
}

module.exports = { createBirthdayDraftsForUser };

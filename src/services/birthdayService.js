/**
 * Birthday Calculation & Logic Service
 * Handles:
 * - Month/day comparisons
 * - Cross-year boundary next-birthday resolution
 * - Leap year (Feb 29) handling: on non-leap years, falls on Feb 28 by default
 * - Days remaining calculation
 * - Upcoming age calculation
 * - Dynamic greeting template generation
 */

/**
 * Check if a given year is a leap year
 * @param {number} year 
 * @returns {boolean}
 */
export function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * Parses date string (YYYY-MM-DD or DD-MM-YYYY) safely into a local Date object
 * @param {string|Date} dateInput 
 * @returns {{ year: number, month: number, day: number }} 1-indexed month (1-12)
 */
export function parseBirthdateParts(dateInput) {
  if (!dateInput) return { year: 2000, month: 1, day: 1 };
  
  if (dateInput instanceof Date) {
    return {
      year: dateInput.getFullYear(),
      month: dateInput.getMonth() + 1,
      day: dateInput.getDate()
    };
  }

  const str = String(dateInput).trim();
  // Handle YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
    const [y, m, d] = str.split('-').map(Number);
    return { year: y, month: m, day: d };
  }
  // Handle DD-MM-YYYY
  if (/^\d{2}-\d{2}-\d{4}/.test(str)) {
    const [d, m, y] = str.split('-').map(Number);
    return { year: y, month: m, day: d };
  }

  const d = new Date(str);
  if (!isNaN(d.getTime())) {
    return {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate()
    };
  }

  return { year: 2000, month: 1, day: 1 };
}

/**
 * Calculate the next occurrence date for a birthday relative to referenceDate (defaults to today)
 * Rule for Feb 29: In a non-leap year, the birthday is celebrated on Feb 28.
 * 
 * @param {string|Date} birthdate 
 * @param {Date} [referenceDate] 
 * @returns {{ nextDate: Date, nextYear: number, age: number, daysLeft: number, isToday: boolean, isTomorrow: boolean }}
 */
export function getNextBirthdayInfo(birthdate, referenceDate = new Date()) {
  const { year: birthYear, month: birthMonth, day: birthDay } = parseBirthdateParts(birthdate);
  
  const refYear = referenceDate.getFullYear();
  const refMonth = referenceDate.getMonth() + 1;
  const refDay = referenceDate.getDate();

  // Create clean midnight reference date
  const refMidnight = new Date(refYear, refMonth - 1, refDay, 0, 0, 0, 0);

  // Determine effective day for this year (handling Feb 29)
  const getEffectiveDay = (targetYear) => {
    if (birthMonth === 2 && birthDay === 29) {
      return isLeapYear(targetYear) ? 29 : 28;
    }
    return birthDay;
  };

  // Check this year's occurrence
  let targetYear = refYear;
  let targetDay = getEffectiveDay(targetYear);
  let targetDate = new Date(targetYear, birthMonth - 1, targetDay, 0, 0, 0, 0);

  // If this year's birthday has already passed (strictly before today midnight), next is next year
  if (targetDate.getTime() < refMidnight.getTime()) {
    targetYear = refYear + 1;
    targetDay = getEffectiveDay(targetYear);
    targetDate = new Date(targetYear, birthMonth - 1, targetDay, 0, 0, 0, 0);
  }

  const msPerDay = 1000 * 60 * 60 * 24;
  const diffTime = targetDate.getTime() - refMidnight.getTime();
  const daysLeft = Math.round(diffTime / msPerDay);

  const isToday = (birthMonth === refMonth && getEffectiveDay(refYear) === refDay);
  const isTomorrow = daysLeft === 1;
  const age = targetYear - birthYear;

  return {
    nextDate: targetDate,
    nextYear: targetYear,
    age,
    daysLeft: isToday ? 0 : daysLeft,
    isToday,
    isTomorrow
  };
}

/**
 * Format a birth date nicely for display (e.g., "20 Oct" or "20 Oct 2004")
 */
export function formatBirthdayDisplay(birthdate, includeYear = true) {
  const { year, month, day } = parseBirthdateParts(birthdate);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthName = months[month - 1] || '';
  if (includeYear && year) {
    return `${day} ${monthName} ${year}`;
  }
  return `${day} ${monthName}`;
}

/**
 * Message template library with styles
 */
export const MESSAGE_TEMPLATES = {
  friendly: [
    "Happy Birthday {name}! 🎂 Wishing you a fantastic year ahead filled with happiness, success, and new adventures!",
    "Wishing you the happiest of birthdays, {name}! 🎉 May your day be as bright and wonderful as you are!",
    "Happy Birthday {name}! 🥳 Hope you have an incredible day celebrating another amazing year!"
  ],
  funny: [
    "Happy Birthday {name}! 🎂 You're not getting older, you're just leveling up! Cheers to another year of awesome memories!",
    "Happy Birthday {name}! 🍕 Don't count the candles, just enjoy the glow (and eat extra cake)!",
    "Happy Birthday {name}! 🎈 Another year closer to getting those senior citizen discounts! Have a blast!"
  ],
  emotional: [
    "Happy Birthday {name}! 🌸 May your day be filled with love, joy, and positivity. So grateful to have you in my life!",
    "Dearest {name}, wishing you peace, boundless joy, and all the love your heart can hold on your special day. 💖 Happy Birthday!",
    "Happy Birthday {name}! 🌟 Thank you for bringing so much warmth and light into the world. Wishing you the happiest year yet!"
  ],
  formal: [
    "Wishing you a very Happy Birthday, {name}. May this upcoming year bring you continued health, prosperity, and success in all your endeavors.",
    "Warmest wishes on your birthday, {name}! May the coming year be filled with accomplishment, joy, and good fortune.",
    "Happy Birthday {name}! Wishing you great health, happiness, and continued achievements in the year ahead."
  ]
};

/**
 * Generate personalized message from template
 */
export function generateMessage(name, style = 'friendly', age = null, relationship = 'Friend') {
  const cleanName = name || 'Friend';
  const templates = MESSAGE_TEMPLATES[style.toLowerCase()] || MESSAGE_TEMPLATES.friendly;
  const chosen = templates[0];
  
  let msg = chosen.replace(/{name}/g, cleanName);
  if (age) {
    msg = msg.replace(/{age}/g, String(age));
  }
  return msg;
}

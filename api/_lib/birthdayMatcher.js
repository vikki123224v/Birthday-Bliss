/**
 * Birthday detection, leap year handling, and matching logic.
 */

export function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

export function parseBirthdateParts(str) {
  if (!str) return { month: 1, day: 1, year: 2000 };
  const parts = str.split('-').map(Number);
  if (parts.length === 3) {
    if (parts[0] > 1000) return { year: parts[0], month: parts[1], day: parts[2] };
    return { day: parts[0], month: parts[1], year: parts[2] };
  }
  return { month: 1, day: 1, year: 2000 };
}

/**
 * Checks if a friend celebrates their birthday on the given target date (month and day).
 * Handles leap years: if born Feb 29 and targetYear is not a leap year, celebrates on Feb 28.
 */
export function isBirthdayToday(birthdateStr, targetDate) {
  const { month: bMonth, day: bDay, year: bYear } = parseBirthdateParts(birthdateStr);
  const targetMonth = targetDate.getMonth() + 1;
  const targetDay = targetDate.getDate();
  const targetYear = targetDate.getFullYear();

  let effectiveDay = bDay;
  if (bMonth === 2 && bDay === 29 && !isLeapYear(targetYear)) {
    effectiveDay = 28;
  }

  const matches = bMonth === targetMonth && effectiveDay === targetDay;
  const turningAge = bYear ? targetYear - bYear : null;

  return {
    isToday: matches,
    turningAge,
    effectiveDay,
    bMonth
  };
}

/**
 * Returns current Date in specified timezone (default 'Asia/Kolkata')
 */
export function getNowInTimezone(timeZone = 'Asia/Kolkata') {
  const now = new Date();
  const tzString = now.toLocaleString('en-US', { timeZone });
  return new Date(tzString);
}

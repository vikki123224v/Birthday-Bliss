/**
 * Friend Management Service
 * Provides CRUD, search, birthday calculations, and sorting.
 * Data is stored per-user using a userId-scoped localStorage key.
 * New users start with an EMPTY list — no demo data.
 */
import { getNextBirthdayInfo } from './birthdayService';

/** Build a user-scoped storage key */
const storageKey = (userId) => `birthwish_friends_${userId}`;

export const friendService = {
  /**
   * Get all friends enriched with current countdown, age, and next birthday.
   * @param {string} userId - The current user's unique ID
   */
  getAll(userId) {
    if (!userId) return [];
    let friends = [];
    try {
      const stored = localStorage.getItem(storageKey(userId));
      friends = stored ? JSON.parse(stored) : [];
      // First time: initialise with an empty array for this user
      if (!stored) {
        localStorage.setItem(storageKey(userId), JSON.stringify([]));
      }
    } catch (e) {
      console.error('Error reading friends data:', e);
      friends = [];
    }

    // Enrich every friend with accurate live countdown
    const today = new Date();
    return friends.map(friend => {
      const bdayInfo = getNextBirthdayInfo(friend.birthdate, today);
      return {
        ...friend,
        nextDate: bdayInfo.nextDate,
        nextYear: bdayInfo.nextYear,
        age: bdayInfo.age,
        daysLeft: bdayInfo.daysLeft,
        isToday: bdayInfo.isToday,
        isTomorrow: bdayInfo.isTomorrow
      };
    });
  },

  /** Get friends sorted by next upcoming birthday */
  getAllSortedByUpcoming(userId) {
    const list = this.getAll(userId);
    return list.sort((a, b) => a.daysLeft - b.daysLeft);
  },

  /** Friends celebrating birthday today */
  getTodayBirthdays(userId) {
    return this.getAll(userId).filter(f => f.isToday);
  },

  /** Upcoming birthdays excluding today, sorted */
  getUpcomingBirthdays(userId, limit = 10) {
    const sorted = this.getAllSortedByUpcoming(userId).filter(f => !f.isToday);
    return limit ? sorted.slice(0, limit) : sorted;
  },

  /** Get single friend by id */
  getById(userId, id) {
    const friends = this.getAll(userId);
    return friends.find(f => f.id === id) || null;
  },

  /** Add a new friend */
  add(userId, data) {
    const rawList = this.getRawList(userId);
    const newFriend = {
      id: `friend_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: data.name.trim(),
      birthdate: data.birthdate,
      phone: data.phone?.trim() || '',
      email: data.email?.trim() || '',
      relationship: data.relationship || 'Friend',
      preferredChannel: data.preferredChannel || 'WhatsApp',
      customMessage: data.customMessage?.trim() || '',
      avatar: data.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(data.name)}`,
      notes: data.notes?.trim() || '',
      createdAt: new Date().toISOString()
    };

    const updated = [newFriend, ...rawList];
    localStorage.setItem(storageKey(userId), JSON.stringify(updated));
    return newFriend;
  },

  /** Update an existing friend */
  update(userId, id, updates) {
    const rawList = this.getRawList(userId);
    const index = rawList.findIndex(f => f.id === id);
    if (index === -1) throw new Error('Friend not found');

    const updatedFriend = {
      ...rawList[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    rawList[index] = updatedFriend;
    localStorage.setItem(storageKey(userId), JSON.stringify(rawList));
    return updatedFriend;
  },

  /** Delete a friend by ID */
  delete(userId, id) {
    const rawList = this.getRawList(userId);
    const filtered = rawList.filter(f => f.id !== id);
    localStorage.setItem(storageKey(userId), JSON.stringify(filtered));
    return true;
  },

  /** Raw list without dynamic enrichments (for clean storage) */
  getRawList(userId) {
    if (!userId) return [];
    try {
      const stored = localStorage.getItem(storageKey(userId));
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  /** Clear all data for a user (used on account deletion) */
  clearUserData(userId) {
    if (userId) localStorage.removeItem(storageKey(userId));
  }
};

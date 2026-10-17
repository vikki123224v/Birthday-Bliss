/**
 * Friend Management Service
 * Provides CRUD, search, birthday calculations, and sorting
 */
import { INITIAL_FRIENDS } from '../data/initialData';
import { getNextBirthdayInfo } from './birthdayService';

const FRIENDS_STORAGE_KEY = 'birthwish_friends_data';

export const friendService = {
  /**
   * Get all friends enriched with current countdown, age, and next birthday
   */
  getAll() {
    let friends = [];
    try {
      const stored = localStorage.getItem(FRIENDS_STORAGE_KEY);
      if (stored) {
        friends = JSON.parse(stored);
      } else {
        friends = INITIAL_FRIENDS;
        localStorage.setItem(FRIENDS_STORAGE_KEY, JSON.stringify(friends));
      }
    } catch (e) {
      console.error('Error reading friends data:', e);
      friends = INITIAL_FRIENDS;
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

  /**
   * Get friends sorted by next upcoming birthday
   */
  getAllSortedByUpcoming() {
    const list = this.getAll();
    return list.sort((a, b) => a.daysLeft - b.daysLeft);
  },

  /**
   * Friends celebrating birthday today
   */
  getTodayBirthdays() {
    return this.getAll().filter(f => f.isToday);
  },

  /**
   * Upcoming birthdays excluding today, sorted
   */
  getUpcomingBirthdays(limit = 10) {
    const sorted = this.getAllSortedByUpcoming().filter(f => !f.isToday);
    return limit ? sorted.slice(0, limit) : sorted;
  },

  /**
   * Get single friend by id
   */
  getById(id) {
    const friends = this.getAll();
    return friends.find(f => f.id === id) || null;
  },

  /**
   * Add a new friend
   */
  add(data) {
    const rawList = this.getRawList();
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
    localStorage.setItem(FRIENDS_STORAGE_KEY, JSON.stringify(updated));
    return newFriend;
  },

  /**
   * Update an existing friend
   */
  update(id, updates) {
    const rawList = this.getRawList();
    const index = rawList.findIndex(f => f.id === id);
    if (index === -1) throw new Error('Friend not found');

    const updatedFriend = {
      ...rawList[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    rawList[index] = updatedFriend;
    localStorage.setItem(FRIENDS_STORAGE_KEY, JSON.stringify(rawList));
    return updatedFriend;
  },

  /**
   * Delete a friend by ID
   */
  delete(id) {
    const rawList = this.getRawList();
    const filtered = rawList.filter(f => f.id !== id);
    localStorage.setItem(FRIENDS_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  /**
   * Raw list without dynamic enrichments (for clean storage)
   */
  getRawList() {
    try {
      const stored = localStorage.getItem(FRIENDS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : INITIAL_FRIENDS;
    } catch {
      return INITIAL_FRIENDS;
    }
  },

  /**
   * Reset data to initial state
   */
  resetToInitial() {
    localStorage.setItem(FRIENDS_STORAGE_KEY, JSON.stringify(INITIAL_FRIENDS));
    return this.getAll();
  }
};

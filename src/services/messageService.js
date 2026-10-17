/**
 * Message & Draft Approval Service
 * Manages drafts, approvals, rejections, delivery logs, and message dispatch links.
 * Data is stored per-user using a userId-scoped localStorage key.
 * New users start with EMPTY drafts and history — no demo data.
 */

/** Build user-scoped storage keys */
const draftsKey = (userId) => `birthwish_drafts_${userId}`;
const historyKey = (userId) => `birthwish_history_${userId}`;

export const messageService = {
  /** Get all drafts for a user */
  getDrafts(userId) {
    if (!userId) return [];
    try {
      const stored = localStorage.getItem(draftsKey(userId));
      if (stored) return JSON.parse(stored);
      // First time: initialise with empty array
      localStorage.setItem(draftsKey(userId), JSON.stringify([]));
      return [];
    } catch {
      return [];
    }
  },

  /** Get pending drafts count */
  getPendingCount(userId) {
    return this.getDrafts(userId).filter(d => d.status === 'pending').length;
  },

  /** Update message content of a draft */
  updateDraft(userId, id, newMessage) {
    const drafts = this.getDrafts(userId);
    const index = drafts.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Draft not found');
    drafts[index].message = newMessage;
    localStorage.setItem(draftsKey(userId), JSON.stringify(drafts));
    return drafts[index];
  },

  /**
   * Approve draft
   * Updates draft status to 'approved' and records an entry in the History log.
   */
  approveDraft(userId, id) {
    const drafts = this.getDrafts(userId);
    const index = drafts.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Draft not found');

    const draft = drafts[index];
    draft.status = 'approved';
    draft.approvedAt = new Date().toISOString();
    localStorage.setItem(draftsKey(userId), JSON.stringify(drafts));

    // Record in history log
    this.addHistoryEntry(userId, {
      recipient: draft.friendName,
      channel: draft.channel,
      phone: draft.phone,
      email: draft.email,
      message: draft.message,
      status: 'approved',
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: new Date().toISOString()
    });

    return draft;
  },

  /** Reject draft */
  rejectDraft(userId, id, reason = 'Rejected by user') {
    const drafts = this.getDrafts(userId);
    const index = drafts.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Draft not found');

    const draft = drafts[index];
    draft.status = 'rejected';
    draft.rejectedAt = new Date().toISOString();
    draft.rejectReason = reason;
    localStorage.setItem(draftsKey(userId), JSON.stringify(drafts));

    // Record in history
    this.addHistoryEntry(userId, {
      recipient: draft.friendName,
      channel: draft.channel,
      phone: draft.phone,
      email: draft.email,
      message: draft.message,
      status: 'rejected',
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: new Date().toISOString()
    });

    return draft;
  },

  /** Create a new draft with duplicate prevention check */
  createDraft(userId, draftData) {
    const drafts = this.getDrafts(userId);
    const targetYear = new Date().getFullYear();

    // Prevent duplicate draft for the same friend, targetYear, and channel
    const duplicate = drafts.find(d =>
      d.friendId === draftData.friendId &&
      d.channel === draftData.channel &&
      d.status !== 'rejected' &&
      new Date(d.createdAt).getFullYear() === targetYear
    );

    if (duplicate) {
      console.warn(`Draft already exists for ${draftData.friendName} for year ${targetYear}`);
      return duplicate;
    }

    const newDraft = {
      id: `draft_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      ...draftData
    };

    const updated = [newDraft, ...drafts];
    localStorage.setItem(draftsKey(userId), JSON.stringify(updated));
    return newDraft;
  },

  /** Get delivery & approval history */
  getHistory(userId) {
    if (!userId) return [];
    try {
      const stored = localStorage.getItem(historyKey(userId));
      if (stored) return JSON.parse(stored);
      localStorage.setItem(historyKey(userId), JSON.stringify([]));
      return [];
    } catch {
      return [];
    }
  },

  /** Add entry to history log */
  addHistoryEntry(userId, entry) {
    const history = this.getHistory(userId);
    const newEntry = {
      id: `hist_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      ...entry
    };
    const updated = [newEntry, ...history];
    localStorage.setItem(historyKey(userId), JSON.stringify(updated));
    return newEntry;
  },

  /** Generate real direct WhatsApp Web/App click-to-chat URL */
  getWhatsAppUrl(phone, message) {
    const cleanPhone = (phone || '').replace(/[^0-9]/g, '');
    const encodedMsg = encodeURIComponent(message || '');
    if (cleanPhone) {
      return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMsg}`;
    }
    return `https://api.whatsapp.com/send?text=${encodedMsg}`;
  },

  /** Generate real mailto link */
  getMailtoUrl(email, subject, body) {
    const cleanEmail = encodeURIComponent(email || '');
    const encSubject = encodeURIComponent(subject || 'Happy Birthday! 🎂🎉');
    const encBody = encodeURIComponent(body || '');
    return `mailto:${cleanEmail}?subject=${encSubject}&body=${encBody}`;
  },

  /** Generate SMS intent link */
  getSmsUrl(phone, body) {
    const cleanPhone = (phone || '').replace(/[^0-9+]/g, '');
    const encBody = encodeURIComponent(body || '');
    return `sms:${cleanPhone}?body=${encBody}`;
  },

  /** Clear all data for a user */
  clearUserData(userId) {
    if (userId) {
      localStorage.removeItem(draftsKey(userId));
      localStorage.removeItem(historyKey(userId));
    }
  }
};

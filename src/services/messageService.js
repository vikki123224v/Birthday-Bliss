/**
 * Message & Draft Approval Service
 * Manages drafts, approvals, rejections, delivery logs, and message dispatch links
 */
import { INITIAL_DRAFTS, INITIAL_HISTORY } from '../data/initialData';

const DRAFTS_STORAGE_KEY = 'birthwish_drafts_data';
const HISTORY_STORAGE_KEY = 'birthwish_history_data';

export const messageService = {
  /**
   * Get all drafts
   */
  getDrafts() {
    try {
      const stored = localStorage.getItem(DRAFTS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
      localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(INITIAL_DRAFTS));
      return INITIAL_DRAFTS;
    } catch {
      return INITIAL_DRAFTS;
    }
  },

  /**
   * Get pending drafts count
   */
  getPendingCount() {
    return this.getDrafts().filter(d => d.status === 'pending').length;
  },

  /**
   * Update message content of a draft
   */
  updateDraft(id, newMessage) {
    const drafts = this.getDrafts();
    const index = drafts.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Draft not found');
    drafts[index].message = newMessage;
    localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(drafts));
    return drafts[index];
  },

  /**
   * Approve draft
   * Updates draft status to 'approved' and records an entry in the History log.
   */
  approveDraft(id) {
    const drafts = this.getDrafts();
    const index = drafts.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Draft not found');

    const draft = drafts[index];
    draft.status = 'approved';
    draft.approvedAt = new Date().toISOString();
    localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(drafts));

    // Record in history log
    this.addHistoryEntry({
      recipient: draft.friendName,
      channel: draft.channel,
      phone: draft.phone,
      email: draft.email,
      message: draft.message,
      status: 'approved', // Transparent status (approved for dispatch / manual send)
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: new Date().toISOString()
    });

    return draft;
  },

  /**
   * Reject draft
   */
  rejectDraft(id, reason = 'Rejected by user') {
    const drafts = this.getDrafts();
    const index = drafts.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Draft not found');

    const draft = drafts[index];
    draft.status = 'rejected';
    draft.rejectedAt = new Date().toISOString();
    draft.rejectReason = reason;
    localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(drafts));

    // Record in history
    this.addHistoryEntry({
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

  /**
   * Create a new draft with duplicate prevention check
   */
  createDraft(draftData) {
    const drafts = this.getDrafts();
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
    localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(updated));
    return newDraft;
  },

  /**
   * Get delivery & approval history
   */
  getHistory() {
    try {
      const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(INITIAL_HISTORY));
      return INITIAL_HISTORY;
    } catch {
      return INITIAL_HISTORY;
    }
  },

  /**
   * Add entry to history log
   */
  addHistoryEntry(entry) {
    const history = this.getHistory();
    const newEntry = {
      id: `hist_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      ...entry
    };
    const updated = [newEntry, ...history];
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    return newEntry;
  },

  /**
   * Generate real direct WhatsApp Web/App click-to-chat URL
   */
  getWhatsAppUrl(phone, message) {
    const cleanPhone = (phone || '').replace(/[^0-9]/g, '');
    const encodedMsg = encodeURIComponent(message || '');
    if (cleanPhone) {
      return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMsg}`;
    }
    return `https://api.whatsapp.com/send?text=${encodedMsg}`;
  },

  /**
   * Generate real mailto link
   */
  getMailtoUrl(email, subject, body) {
    const cleanEmail = encodeURIComponent(email || '');
    const encSubject = encodeURIComponent(subject || 'Happy Birthday! 🎂🎉');
    const encBody = encodeURIComponent(body || '');
    return `mailto:${cleanEmail}?subject=${encSubject}&body=${encBody}`;
  },

  /**
   * Generate SMS intent link
   */
  getSmsUrl(phone, body) {
    const cleanPhone = (phone || '').replace(/[^0-9+]/g, '');
    const encBody = encodeURIComponent(body || '');
    return `sms:${cleanPhone}?body=${encBody}`;
  },

  /**
   * Reset drafts & history to initial state
   */
  resetToInitial() {
    localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(INITIAL_DRAFTS));
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(INITIAL_HISTORY));
  }
};

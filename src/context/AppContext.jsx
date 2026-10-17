import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';
import { friendService } from '../services/friendService';
import { messageService } from '../services/messageService';
import { authService } from '../services/authService';
import { generateMessage } from '../services/birthdayService';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [friends, setFriends] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load all data
  const loadData = useCallback(() => {
    try {
      const allFriends = friendService.getAllSortedByUpcoming();
      const allDrafts = messageService.getDrafts();
      const allHistory = messageService.getHistory();
      setFriends(allFriends);
      setDrafts(allDrafts);
      setHistory(allHistory);
    } catch (err) {
      console.error('Failed to load application data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Derived Birthday lists
  const todayBirthdays = useMemo(() => {
    return friends.filter(f => f.isToday);
  }, [friends]);

  const upcomingBirthdays = useMemo(() => {
    return friends.filter(f => !f.isToday);
  }, [friends]);

  // Stat numbers calculated directly from actual data
  const stats = useMemo(() => {
    const pendingDrafts = drafts.filter(d => d.status === 'pending');
    return {
      totalFriends: friends.length,
      todayBirthdays: todayBirthdays.length,
      upcomingBirthdays: upcomingBirthdays.slice(0, 10).length,
      pendingApprovals: pendingDrafts.length
    };
  }, [friends, todayBirthdays, upcomingBirthdays, drafts]);

  // Celebratory confetti trigger
  const triggerConfetti = useCallback((options = {}) => {
    try {
      confetti({
        particleCount: options.particleCount || 80,
        spread: options.spread || 70,
        origin: options.origin || { y: 0.6 },
        colors: ['#FF4F91', '#FF8066', '#FFD166', '#06D6A0', '#118AB2', '#7928CA']
      });
    } catch (e) {
      console.log('Confetti effect executed');
    }
  }, []);

  // Friend actions
  const addFriend = useCallback((friendData) => {
    try {
      const created = friendService.add(friendData);
      loadData();
      toast.success(`${created.name} added to your circle! 🎉`);
      
      // If their birthday is today or soon, automatically generate a draft
      const newFriendEnriched = friendService.getById(created.id);
      if (newFriendEnriched && (newFriendEnriched.isToday || newFriendEnriched.daysLeft <= 7)) {
        const defaultMsg = created.customMessage || generateMessage(created.name, user?.defaultGreetingStyle || 'friendly', newFriendEnriched.age);
        messageService.createDraft({
          friendId: created.id,
          friendName: created.name,
          avatar: created.avatar,
          birthdayDetails: newFriendEnriched.isToday ? `${newFriendEnriched.age} today · ${created.preferredChannel}` : `In ${newFriendEnriched.daysLeft} days · ${created.preferredChannel}`,
          phone: created.phone,
          email: created.email,
          channel: created.preferredChannel,
          message: defaultMsg
        });
        loadData();
      }
      return created;
    } catch (err) {
      toast.error('Could not save friend. Please check fields.');
      throw err;
    }
  }, [loadData, user]);

  const updateFriend = useCallback((id, updates) => {
    try {
      const updated = friendService.update(id, updates);
      loadData();
      toast.success(`${updated.name}'s details updated ✨`);
      return updated;
    } catch (err) {
      toast.error('Could not update friend.');
      throw err;
    }
  }, [loadData]);

  const deleteFriend = useCallback((id) => {
    try {
      const friend = friendService.getById(id);
      friendService.delete(id);
      loadData();
      toast.success(`${friend?.name || 'Friend'} removed`);
    } catch (err) {
      toast.error('Could not remove friend.');
    }
  }, [loadData]);

  // Draft actions
  const updateDraft = useCallback((id, message) => {
    try {
      const updated = messageService.updateDraft(id, message);
      loadData();
      toast.success('Draft message updated');
      return updated;
    } catch (err) {
      toast.error('Failed to update draft');
    }
  }, [loadData]);

  const approveDraft = useCallback((id, shouldOpenChannel = false) => {
    try {
      const approved = messageService.approveDraft(id);
      loadData();
      triggerConfetti();
      toast.success(`Birthday wish for ${approved.friendName} approved! 🎂`);

      if (shouldOpenChannel) {
        if (approved.channel === 'WhatsApp' && approved.phone) {
          const url = messageService.getWhatsAppUrl(approved.phone, approved.message);
          window.open(url, '_blank', 'noopener,noreferrer');
        } else if (approved.channel === 'Email' && approved.email) {
          const url = messageService.getMailtoUrl(approved.email, `Happy Birthday ${approved.friendName}! 🎂`, approved.message);
          window.location.href = url;
        }
      }
      return approved;
    } catch (err) {
      toast.error('Could not approve draft');
    }
  }, [loadData, triggerConfetti]);

  const rejectDraft = useCallback((id, reason) => {
    try {
      const rejected = messageService.rejectDraft(id, reason);
      loadData();
      toast('Wish draft rejected', { icon: '🚫' });
      return rejected;
    } catch (err) {
      toast.error('Could not reject draft');
    }
  }, [loadData]);

  const sendWishNow = useCallback((friend) => {
    // Check if there is an existing draft
    const existingDraft = drafts.find(d => d.friendId === friend.id && d.status === 'pending');
    if (existingDraft) {
      return existingDraft;
    }

    const defaultMsg = friend.customMessage || generateMessage(friend.name, user?.defaultGreetingStyle || 'friendly', friend.age);
    const newDraft = messageService.createDraft({
      friendId: friend.id,
      friendName: friend.name,
      avatar: friend.avatar,
      birthdayDetails: friend.isToday ? `${friend.age} today · ${friend.preferredChannel}` : `In ${friend.daysLeft} days · ${friend.preferredChannel}`,
      phone: friend.phone,
      email: friend.email,
      channel: friend.preferredChannel,
      message: defaultMsg
    });
    loadData();
    return newDraft;
  }, [drafts, user, loadData]);

  // User Profile
  const updateUserProfile = useCallback((updates) => {
    const updated = authService.updateUserProfile(updates);
    setUser(updated);
    toast.success('Settings saved');
    return updated;
  }, []);

  const resetAllDemoData = useCallback(() => {
    friendService.resetToInitial();
    messageService.resetToInitial();
    loadData();
    toast.success('Sample data restored!');
  }, [loadData]);

  const value = {
    user,
    setUser,
    updateUserProfile,
    friends,
    loading,
    todayBirthdays,
    upcomingBirthdays,
    stats,
    drafts,
    history,
    addFriend,
    updateFriend,
    deleteFriend,
    updateDraft,
    approveDraft,
    rejectDraft,
    sendWishNow,
    triggerConfetti,
    resetAllDemoData,
    reload: loadData
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

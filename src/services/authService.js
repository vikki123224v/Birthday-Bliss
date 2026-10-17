/**
 * Authentication Service
 * Manages user session with Firebase Auth or Local Demo storage
 */
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as fbSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile as fbUpdateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from './firebase';
import { INITIAL_USER } from '../data/initialData';

const AUTH_STORAGE_KEY = 'birthwish_user_session';

export const authService = {
  getCurrentUser() {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading user session:', e);
    }
    // Default to initial user for instant seamless experience
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(INITIAL_USER));
    return INITIAL_USER;
  },

  async login(email, password) {
    if (isFirebaseConfigured && auth) {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const user = {
        id: cred.user.uid,
        name: cred.user.displayName || email.split('@')[0],
        email: cred.user.email,
        avatar: cred.user.photoURL || INITIAL_USER.avatar,
        timezone: 'Asia/Kolkata',
        notificationTime: '09:00',
        birthdayReminder: true,
        defaultChannel: 'WhatsApp',
        defaultGreetingStyle: 'friendly'
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      return user;
    }

    // Local / Prototype auth
    const stored = this.getCurrentUser();
    const user = {
      ...stored,
      email: email || stored.email,
      name: email ? email.split('@')[0].replace(/[._]/g, ' ') : stored.name
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    return user;
  },

  async loginWithGoogle() {
    if (isFirebaseConfigured && auth) {
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      provider.setCustomParameters({ prompt: 'select_account' });
      
      const cred = await signInWithPopup(auth, provider);
      const user = {
        id: cred.user.uid,
        name: cred.user.displayName || cred.user.email.split('@')[0],
        email: cred.user.email,
        avatar: cred.user.photoURL || INITIAL_USER.avatar,
        timezone: 'Asia/Kolkata',
        notificationTime: '09:00',
        birthdayReminder: true,
        defaultChannel: 'WhatsApp',
        defaultGreetingStyle: 'friendly'
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      return user;
    }

    // Fallback: If Firebase keys aren't configured yet, simulate Google sign-in
    const demoGoogleUser = {
      id: `google_${Date.now()}`,
      name: 'Vighneshwara',
      email: 'vighneshwara.google@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      timezone: 'Asia/Kolkata',
      notificationTime: '09:00',
      birthdayReminder: true,
      defaultChannel: 'WhatsApp',
      defaultGreetingStyle: 'friendly'
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(demoGoogleUser));
    return demoGoogleUser;
  },

  async signup(name, email, password) {
    if (isFirebaseConfigured && auth) {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (name) {
        await fbUpdateProfile(cred.user, { displayName: name });
      }
      const user = {
        id: cred.user.uid,
        name: name || email.split('@')[0],
        email: cred.user.email,
        avatar: INITIAL_USER.avatar,
        timezone: 'Asia/Kolkata',
        notificationTime: '09:00',
        birthdayReminder: true,
        defaultChannel: 'WhatsApp',
        defaultGreetingStyle: 'friendly'
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      return user;
    }

    // Prototype Signup
    const newUser = {
      ...INITIAL_USER,
      id: `usr_${Date.now()}`,
      name: name || 'Celebrator',
      email: email || 'user@example.com'
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    return newUser;
  },

  async logout() {
    if (isFirebaseConfigured && auth) {
      await fbSignOut(auth);
    }
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return true;
  },

  async resetPassword(email) {
    if (isFirebaseConfigured && auth) {
      await sendPasswordResetEmail(auth, email);
      return true;
    }
    // Simulation
    return true;
  },

  updateUserProfile(updates) {
    const current = this.getCurrentUser();
    const updated = { ...current, ...updates };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  subscribe(callback) {
    if (isFirebaseConfigured && auth) {
      return onAuthStateChanged(auth, (fbUser) => {
        if (fbUser) {
          const u = {
            id: fbUser.uid,
            name: fbUser.displayName || fbUser.email.split('@')[0],
            email: fbUser.email,
            avatar: fbUser.photoURL || INITIAL_USER.avatar
          };
          callback(u);
        } else {
          callback(null);
        }
      });
    }
    callback(this.getCurrentUser());
    return () => {};
  }
};

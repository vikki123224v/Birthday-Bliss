/**
 * Initial Seed Data for Birthday Bliss
 * Perfectly matches the UI reference and guarantees realistic live behavior.
 */

// Helper to get dynamic date offset from today
function getOffsetDate(daysOffset, birthYear) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  const year = birthYear || (d.getFullYear() - 24);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const currentYear = new Date().getFullYear();

export const INITIAL_USER = {
  id: 'usr_vighn_01',
  name: 'Vighneshwara',
  email: 'vighn@example.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  timezone: 'Asia/Kolkata',
  notificationTime: '09:00',
  birthdayReminder: true,
  defaultChannel: 'WhatsApp',
  defaultGreetingStyle: 'friendly',
  plan: 'free'
};

export const INITIAL_FRIENDS = [
  {
    id: 'friend_amit',
    name: 'Amit Singh',
    birthdate: getOffsetDate(0, currentYear - 22), // Turns 22 TODAY!
    phone: '+91 98765 43210',
    email: 'amit.singh@example.com',
    relationship: 'Best Friend',
    preferredChannel: 'WhatsApp',
    customMessage: 'Happy Birthday Amit! 🎂 Wishing you a fantastic year ahead filled with happiness, success and new adventures!',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    notes: 'Likes photography and traveling'
  },
  {
    id: 'friend_priya',
    name: 'Priya Verma',
    birthdate: getOffsetDate(3, currentYear - 24), // 3 days left
    phone: '+91 98123 45678',
    email: 'priya.v@example.com',
    relationship: 'Friend',
    preferredChannel: 'Email',
    customMessage: 'Happy Birthday Priya! 🌸 May your day be filled with love, joy and positivity.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    notes: 'Loves classical music and novels'
  },
  {
    id: 'friend_rahul',
    name: 'Rahul Sharma',
    birthdate: getOffsetDate(7, currentYear - 26), // 7 days left
    phone: '+91 98456 78901',
    email: 'rahul.s@example.com',
    relationship: 'Colleague',
    preferredChannel: 'WhatsApp',
    customMessage: 'Happy Birthday Rahul! 🌟 Wishing you another incredible year of growth and great health!',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    notes: 'Coffee lover and tech enthusiast'
  },
  {
    id: 'friend_neha',
    name: 'Neha Kapoor',
    birthdate: getOffsetDate(12, currentYear - 23), // 12 days left
    phone: '+91 99876 54321',
    email: 'neha.k@example.com',
    relationship: 'Sister',
    preferredChannel: 'Email',
    customMessage: 'Happy Birthday to my sweet sister Neha! 💕 Keep shining bright always!',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    notes: 'Sister'
  },
  {
    id: 'friend_karan',
    name: 'Karan Mehta',
    birthdate: getOffsetDate(42, currentYear - 27), // 42 days left
    phone: '+91 97123 98765',
    email: 'karan.m@example.com',
    relationship: 'Friend',
    preferredChannel: 'SMS',
    customMessage: 'Happy Birthday Karan! 🎈 Another year closer to senior discounts, have a blast!',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    notes: 'College roommate'
  },
  {
    id: 'friend_ananya',
    name: 'Ananya Roy',
    birthdate: getOffsetDate(55, currentYear - 25),
    phone: '+91 96543 21098',
    email: 'ananya.roy@example.com',
    relationship: 'Best Friend',
    preferredChannel: 'WhatsApp',
    customMessage: 'Wishing you all the joy and laughter today, Ananya! 🎂✨',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    notes: 'High school friend'
  },
  {
    id: 'friend_arjun',
    name: 'Arjun Das',
    birthdate: getOffsetDate(78, currentYear - 28),
    phone: '+91 95432 10987',
    email: 'arjun.das@example.com',
    relationship: 'Family',
    preferredChannel: 'WhatsApp',
    customMessage: 'Wishing you joy, good health, and success always, Arjun! 🥳',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    notes: 'Cousin'
  },
  {
    id: 'friend_sneha',
    name: 'Sneha Patel',
    birthdate: getOffsetDate(92, currentYear - 24),
    phone: '+91 94321 09876',
    email: 'sneha.patel@example.com',
    relationship: 'Friend',
    preferredChannel: 'Email',
    customMessage: 'Happy Birthday Sneha! Wishing you endless success and joy!',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    notes: 'Art school batchmate'
  },
  {
    id: 'friend_rohit',
    name: 'Rohit Gupta',
    birthdate: getOffsetDate(115, currentYear - 29),
    phone: '+91 93210 98765',
    email: 'rohit.gupta@example.com',
    relationship: 'Colleague',
    preferredChannel: 'WhatsApp',
    customMessage: 'Happy Birthday Rohit! Have a wonderful day celebrating!',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    notes: 'Lead developer'
  },
  {
    id: 'friend_maya',
    name: 'Maya Rao',
    birthdate: getOffsetDate(140, currentYear - 26),
    phone: '+91 92109 87654',
    email: 'maya.rao@example.com',
    relationship: 'Friend',
    preferredChannel: 'WhatsApp',
    customMessage: 'Happy Birthday Maya! May this year bring you all the good things you deserve.',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    notes: 'Dance class'
  },
  {
    id: 'friend_vikram',
    name: 'Vikram Joshi',
    birthdate: getOffsetDate(185, currentYear - 30),
    phone: '+91 91098 76543',
    email: 'vikram.joshi@example.com',
    relationship: 'Family',
    preferredChannel: 'SMS',
    customMessage: 'Happy 30th Milestone Birthday Vikram! Cheers to the next adventure!',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    notes: 'Brother-in-law'
  },
  {
    id: 'friend_tanvi',
    name: 'Tanvi Shah',
    birthdate: getOffsetDate(220, currentYear - 22),
    phone: '+91 90987 65432',
    email: 'tanvi.shah@example.com',
    relationship: 'Friend',
    preferredChannel: 'WhatsApp',
    customMessage: 'Happy Birthday Tanvi! Keep shining and inspiring everyone around you!',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    notes: 'Graphic designer'
  }
];

export const INITIAL_DRAFTS = [
  {
    id: 'draft_amit_01',
    friendId: 'friend_amit',
    friendName: 'Amit Singh',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    birthdayDetails: '22 today · WhatsApp',
    phone: '+91 98765 43210',
    email: 'amit.singh@example.com',
    channel: 'WhatsApp',
    message: 'Happy Birthday Amit! 🎂 Wishing you a fantastic year ahead filled with happiness, success and new adventures!',
    status: 'pending', // 'pending' | 'approved' | 'rejected'
    createdAt: new Date().toISOString()
  },
  {
    id: 'draft_priya_01',
    friendId: 'friend_priya',
    friendName: 'Priya Verma',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    birthdayDetails: 'In 3 days · Email',
    phone: '+91 98123 45678',
    email: 'priya.v@example.com',
    channel: 'Email',
    message: 'Happy Birthday Priya! 🌸 May your day be filled with love, joy and positivity.',
    status: 'pending',
    createdAt: new Date().toISOString()
  },
  {
    id: 'draft_rahul_01',
    friendId: 'friend_rahul',
    friendName: 'Rahul Sharma',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    birthdayDetails: 'In 7 days · WhatsApp',
    phone: '+91 98456 78901',
    email: 'rahul.s@example.com',
    channel: 'WhatsApp',
    message: 'Happy Birthday Rahul! 🌟 Wishing you another incredible year of growth and great health!',
    status: 'pending',
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_HISTORY = [
  {
    id: 'hist_01',
    recipient: 'Rahul Sharma',
    channel: 'WhatsApp',
    phone: '+91 98456 78901',
    message: 'Happy Birthday Rahul! 🌟 Hope you have an awesome celebration today with friends and family!',
    status: 'sent',
    date: '27 Oct 2025, 09:05 AM',
    timestamp: new Date(Date.now() - 365 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'hist_02',
    recipient: 'Neha Kapoor',
    channel: 'Email',
    email: 'neha.k@example.com',
    message: 'Happy Birthday to my sweet sister Neha! 💕 Keep shining bright always and stay blessed.',
    status: 'delivered',
    date: '14 Oct 2026, 09:00 AM',
    timestamp: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'hist_03',
    recipient: 'Amit Singh',
    channel: 'WhatsApp',
    phone: '+91 98765 43210',
    message: 'Wishing you a day full of happiness, great laughs and sweet memories Amit! 🎂',
    status: 'approved',
    date: '1 Oct 2026, 11:30 AM',
    timestamp: new Date(Date.now() - 16 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'hist_04',
    recipient: 'Priya Verma',
    channel: 'SMS',
    phone: '+91 98123 45678',
    message: 'Happy Birthday Priya! Wishing you immense happiness and health this year.',
    status: 'failed',
    date: '23 Sep 2026, 09:00 AM',
    errorReason: 'SMS Gateway response: recipient mobile temporarily unreachable',
    timestamp: new Date(Date.now() - 24 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'hist_05',
    recipient: 'Karan Mehta',
    channel: 'Email',
    email: 'karan.m@example.com',
    message: 'Happy Birthday Karan! Another year of great memories together.',
    status: 'rejected',
    date: '10 Sep 2026, 04:15 PM',
    timestamp: new Date(Date.now() - 37 * 24 * 3600 * 1000).toISOString()
  }
];

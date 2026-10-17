# 🎂 Birthday Bliss (BirthWish) — Personal Birthday Wishes Assistant

> **"Good things are worth celebrating. Keep the people you love close, one birthday at a time."**

[![Vercel Deployment](https://img.shields.io/badge/Deployment-Live%20on%20Vercel-success?style=for-the-badge&logo=vercel)](https://birth-wish-three.vercel.app)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-purple?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%7C%20Firestore-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-pink?style=for-the-badge)](LICENSE)

---

## 🌟 Overview

**Birthday Bliss** is a responsive, modern web application designed to help people never miss a loved one's special day. Users enter their friends' birthdays once, and the platform automatically calculates live countdowns, detects birthdays in their configured time zone, generates personalized greeting drafts, and requires **explicit approval** before dispatching wishes via WhatsApp, Email, or SMS.

🌐 **Live Demo:** [https://birth-wish-three.vercel.app](https://birth-wish-three.vercel.app)  
📦 **GitHub Repo:** [https://github.com/vikki123224v/Birthday-Bliss.git](https://github.com/vikki123224v/Birthday-Bliss.git)

---

## ✨ Key Features

### 1. 📊 Interactive Dashboard
- **Welcoming Hero Banner:** Vibrant pink-coral gradient featuring custom 3D celebration illustrations with today's birthday highlights.
- **Dynamic Live Statistics:** 
  - Total friends in your circle
  - Birthdays today (calculated from actual calendar dates)
  - Upcoming celebrations (sorted chronologically)
  - Message drafts awaiting your explicit approval
- **Countdown Indicators:** Accurate countdown badges (*Today! 🎉*, *Tomorrow*, *X days left*).

### 2. 👥 Complete Friends Management
- **Add / Edit Friends:** Record name, date of birth, phone number, email address, relationship, preferred delivery channel, and personalized greetings.
- **Quick Template Assistant:** 1-click generators for **Friendly**, **Funny**, **Heartfelt**, and **Formal** wishes.
- **Search & Filters:** Search by name or relationship; filter by *All*, *Upcoming*, or *Alphabetical (A-Z)*.
- **Safe Deletion:** Deletion confirmation dialogs to prevent accidental loss of contacts.

### 3. 🛡️ Message Approval Center (Human-in-the-Loop)
- **Zero Auto-Dispatch Without Consent:** Drafts are prepared for review, ensuring no message is ever sent without your review.
- **In-Line Draft Editing:** Tweak messages and verify character counts before approving.
- **Confetti Celebrations:** Rich visual celebration triggers via `canvas-confetti` upon approval.
- **Direct Dispatch Action:** Instant click-to-chat links for WhatsApp (`https://wa.me/...`) and `mailto:` email integration.

### 4. 📜 Delivery Audit History
- Transparent logs categorizing wishes as **Pending**, **Approved**, **Sent**, **Delivered**, **Rejected**, or **Failed**.
- Includes gateway response codes and timestamp tracking.

### 5. 🔐 Dual-Mode Authentication (Firebase & Demo)
- **Google Authentication:** Sign in directly using Google Popup OAuth.
- **Email & Password:** Support for registration, login, and password resets.
- **Instant Demo Access:** 1-click test mode for exploring the dashboard without signup.
- **Isolated User Storage:** Ready for Firestore rules enforcing strict UID data partitioning.

### 6. ⚙️ User Settings & Data Portability
- **Time Zone Awareness:** Configured time zone (defaulting to `Asia/Kolkata`) for scheduled checks.
- **Reminder Time & Toggles:** Customizable alert hours and reminder toggles.
- **Data Export & Reset:** Export entire friends and message records as JSON backups anytime.

---

## 🎨 Design System & Color Palette

Built with a modern SaaS aesthetic following **Template 3: Colorful & Fun**:

| Token | Hex Code | Description |
| :--- | :---: | :--- |
| **Primary Pink** | `#FF4F91` | Primary brand accent & active states |
| **Coral** | `#FF8066` | Vibrant secondary accents & hero gradients |
| **Soft Background** | `#FFF5F7` | Comfortable, eye-friendly app background |
| **Pure White** | `#FFFFFF` | Elevated card surfaces |
| **Lavender** | `#F0E9FF` | Subtle tags and pill highlights |
| **Dark Plum** | `#30243A` | High-contrast readable typography |
| **Muted Slate** | `#8D8295` | Secondary text & labels |
| **Success Green** | `#10B981` | Delivered status & verified badges |

Typography: Powered by **Plus Jakarta Sans** and **Outfit** via Google Fonts.

---

## 🏗️ Architecture & Tech Stack

```
Birth_Wish/
├── functions/                     # Firebase Cloud Functions (Backend)
│   └── src/
│       ├── birthdayScheduler.js   # Hourly cron job checking user timezones
│       ├── createBirthdayDrafts.js# Deduplicated draft generator with leap-day logic
│       └── sendApprovedMessage.js # Secure caller-verified message dispatcher
├── src/
│   ├── components/
│   │   ├── birthday/              # BirthdayHero, StatCard, TodayBirthdayCard
│   │   ├── common/                # Avatar, Badge, ConfirmDialog, Modal, EmptyState
│   │   ├── friends/               # FriendCard, FriendFormModal
│   │   ├── layout/                # AppLayout, Sidebar, Topbar, BottomNav, MobileDrawer
│   │   └── messages/              # ApprovalCard
│   ├── context/                   # AppContext (central reactive state)
│   ├── data/                      # Initial seed dataset
│   ├── pages/                     # Dashboard, Friends, Approvals, History, Settings, Login
│   ├── services/                  # authService, birthdayService, friendService, messageService, firebase
│   └── styles/                    # theme.css, animations.css, global.css
├── firestore.rules                # Security rules enforcing strict UID isolation
└── vercel.json                    # Single-Page Application (SPA) routing config
```

- **Frontend:** React 19, Vite 8, React Router 7, Framer Motion, Lucide React, React Hot Toast, date-fns, canvas-confetti.
- **Backend / Cloud Services:** Firebase Authentication (Google + Email), Cloud Firestore, Firebase Cloud Functions (v2).
- **Deployment:** Vercel (Web SPA) & Capacitor (ready for Android APK build).

---

## ⚡ Quick Start (Local Development)

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vikki123224v/Birthday-Bliss.git
   cd Birthday-Bliss
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment (Optional):**
   Copy `.env.example` to `.env` if connecting to a custom Firebase project:
   ```bash
   cp .env.example .env
   ```
   *(Without environment variables, the app runs in full offline demo mode with local storage persistence).*

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:5173/` in your browser.

5. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🔒 Security & Privacy Rules

- **Strict Access Control:** Every user's friends list and messages are isolated to `/users/{userId}/**` in Firestore.
- **Zero Unapproved Dispatch:** The dispatch service validates authentication tokens and explicit draft approval flags before invoking delivery channels.
- **No Hardcoded Secrets:** Provider tokens and private keys are designed exclusively for server-side Cloud Function execution.

---

## 🤝 Contributing

Contributions, feedback, and feature suggestions are welcome!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Clock, 
  Globe, 
  Bell, 
  MessageSquare, 
  Smile, 
  Sparkles, 
  Download, 
  RotateCcw, 
  LogOut, 
  Shield, 
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Avatar } from '../components/common/Avatar';
import { authService } from '../services/authService';
import { isFirebaseConfigured } from '../services/firebase';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import toast from 'react-hot-toast';

export const Settings = () => {
  const { user, updateUserProfile, resetAllDemoData, triggerConfetti } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || 'Vighneshwara',
    email: user?.email || 'vighn@example.com',
    timezone: user?.timezone || 'Asia/Kolkata',
    notificationTime: user?.notificationTime || '09:00',
    birthdayReminder: user?.birthdayReminder ?? true,
    defaultChannel: user?.defaultChannel || 'WhatsApp',
    defaultGreetingStyle: user?.defaultGreetingStyle || 'friendly'
  });

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleToggleReminder = () => {
    const updated = !formData.birthdayReminder;
    setFormData(prev => ({ ...prev, birthdayReminder: updated }));
    updateUserProfile({ birthdayReminder: updated });
  };

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    updateUserProfile({ [field]: value });
  };

  const handleExportData = () => {
    const data = {
      user: authService.getCurrentUser(),
      friends: JSON.parse(localStorage.getItem('birthwish_friends_data') || '[]'),
      drafts: JSON.parse(localStorage.getItem('birthwish_drafts_data') || '[]'),
      history: JSON.parse(localStorage.getItem('birthwish_history_data') || '[]'),
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `birthwish_export_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    toast.success('Data exported successfully!');
  };

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '780px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Account & Settings</h1>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginTop: '2px' }}>
          Configure notifications, time zones, default greetings, and data preferences.
        </p>
      </div>

      {/* User Profile Card */}
      <div
        className="card"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Avatar src={user?.avatar} name={formData.name} size={60} showBorder />
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{formData.name}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{formData.email}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
              <span className="badge badge-today" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                Free Plan
              </span>
            </div>
          </div>
        </div>

        <button
          className="btn btn-secondary btn-sm"
          onClick={() => {
            const newName = prompt('Enter new display name:', formData.name);
            if (newName && newName.trim()) {
              handleFieldChange('name', newName.trim());
            }
          }}
        >
          Edit Profile
        </button>
      </div>

      {/* App Preferences */}
      <div className="card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '18px' }}>
          App Preferences
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Time Zone */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Globe size={20} color="var(--primary-pink)" />
              <div>
                <h5 style={{ fontSize: '0.92rem', fontWeight: 700 }}>Time Zone</h5>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Used for server-side scheduled birthday checks
                </p>
              </div>
            </div>
            <select
              className="form-select"
              style={{ width: 'auto', minWidth: '180px' }}
              value={formData.timezone}
              onChange={(e) => handleFieldChange('timezone', e.target.value)}
            >
              <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
              <option value="America/New_York">America/New_York (EST)</option>
              <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
              <option value="Europe/London">Europe/London (GMT)</option>
              <option value="Asia/Dubai">Asia/Dubai (GST)</option>
              <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
            </select>
          </div>

          <div style={{ height: '1px', backgroundColor: 'var(--border-light)' }} />

          {/* Notification Time */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Clock size={20} color="var(--primary-pink)" />
              <div>
                <h5 style={{ fontSize: '0.92rem', fontWeight: 700 }}>Notification Time</h5>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Time of day when pending drafts are generated
                </p>
              </div>
            </div>
            <input
              type="time"
              className="form-input"
              style={{ width: 'auto' }}
              value={formData.notificationTime}
              onChange={(e) => handleFieldChange('notificationTime', e.target.value)}
            />
          </div>

          <div style={{ height: '1px', backgroundColor: 'var(--border-light)' }} />

          {/* Birthday Reminder Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Bell size={20} color="var(--primary-pink)" />
              <div>
                <h5 style={{ fontSize: '0.92rem', fontWeight: 700 }}>Birthday Reminder</h5>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Enable automatic detection and draft preparation
                </p>
              </div>
            </div>
            {/* Custom iOS style toggle switch */}
            <div
              onClick={handleToggleReminder}
              style={{
                width: '48px',
                height: '26px',
                backgroundColor: formData.birthdayReminder ? 'var(--primary-pink)' : '#D1D5DB',
                borderRadius: '9999px',
                padding: '2px',
                cursor: 'pointer',
                transition: 'background-color 0.25s ease',
                position: 'relative'
              }}
            >
              <div
                style={{
                  width: '22px',
                  height: '22px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '50%',
                  transform: formData.birthdayReminder ? 'translateX(22px)' : 'translateX(0)',
                  transition: 'transform 0.25s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
              />
            </div>
          </div>

          <div style={{ height: '1px', backgroundColor: 'var(--border-light)' }} />

          {/* Default Channel */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <MessageSquare size={20} color="var(--primary-pink)" />
              <div>
                <h5 style={{ fontSize: '0.92rem', fontWeight: 700 }}>Default Channel</h5>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Primary channel for new friends
                </p>
              </div>
            </div>
            <select
              className="form-select"
              style={{ width: 'auto', minWidth: '160px' }}
              value={formData.defaultChannel}
              onChange={(e) => handleFieldChange('defaultChannel', e.target.value)}
            >
              <option value="WhatsApp">💬 WhatsApp</option>
              <option value="Email">✉️ Email</option>
              <option value="SMS">📱 SMS</option>
            </select>
          </div>

          <div style={{ height: '1px', backgroundColor: 'var(--border-light)' }} />

          {/* Default Message Style */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Smile size={20} color="var(--primary-pink)" />
              <div>
                <h5 style={{ fontSize: '0.92rem', fontWeight: 700 }}>Default Greeting Style</h5>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Default template tone applied to new drafts
                </p>
              </div>
            </div>
            <select
              className="form-select"
              style={{ width: 'auto', minWidth: '160px' }}
              value={formData.defaultGreetingStyle}
              onChange={(e) => handleFieldChange('defaultGreetingStyle', e.target.value)}
            >
              <option value="friendly">🎂 Friendly & Warm</option>
              <option value="funny">🍕 Funny & Playful</option>
              <option value="emotional">🌸 Heartfelt & Emotional</option>
              <option value="formal">🌟 Professional & Formal</option>
            </select>
          </div>
        </div>
      </div>

      {/* Backend Integration Status */}
      <div
        className="card"
        style={{
          padding: '20px',
          border: '1.5px solid #E0F2FE',
          backgroundColor: '#F8FAFC'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <Shield size={20} color="#0284C7" />
          <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Architecture & Cloud Status</h4>
        </div>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>
          {isFirebaseConfigured
            ? '🔥 Live Firebase connection active with Cloud Firestore & Authentication.'
            : '📦 Local Prototype Store active. All friend records, drafts, and settings are securely isolated and persisted in your browser.'}
        </p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary btn-sm" onClick={handleExportData}>
            <Download size={14} /> Export Backup (JSON)
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => setShowResetConfirm(true)}>
            <RotateCcw size={14} /> Reset Demo Data
          </button>
        </div>
      </div>

      {/* Logout Action */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
        <button
          className="btn btn-reject"
          onClick={handleLogout}
          style={{ gap: '8px' }}
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Reset Confirmation */}
      <ConfirmDialog
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={resetAllDemoData}
        title="Reset Demo Data"
        message="This will reset all friends, drafts, and message history back to the original sample dataset with Amit Singh, Priya Verma, and others."
        confirmText="Reset Now"
      />
    </div>
  );
};

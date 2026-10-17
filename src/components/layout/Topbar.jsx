import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Menu, 
  Search, 
  Bell, 
  Calendar as CalendarIcon, 
  Plus,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Avatar } from '../common/Avatar';

export const Topbar = ({ onOpenMenu, onOpenAddFriend }) => {
  const { user, stats, triggerConfetti } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Current formatted date
  const todayFormatted = new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date());

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/friends?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header
      style={{
        height: 'var(--topbar-height)',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--border-light)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
        position: 'sticky',
        top: 0,
        zIndex: 90,
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)'
      }}
    >
      {/* Left: Mobile hamburger & search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, maxWidth: '440px' }}>
        <button
          className="btn-icon mobile-only"
          onClick={onOpenMenu}
          aria-label="Open navigation menu"
          style={{ display: 'none' }}
        >
          <Menu size={22} />
        </button>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} style={{ width: '100%', position: 'relative' }}>
          <Search
            size={18}
            color="var(--text-muted)"
            style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            className="form-input"
            placeholder="Search friends, birthdays..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              paddingLeft: '40px',
              paddingTop: '9px',
              paddingBottom: '9px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.88rem',
              backgroundColor: '#F8F6FA'
            }}
          />
        </form>
      </div>

      {/* Right: Date, Notifications, Add Friend, Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Date badge */}
        <div
          className="date-pill"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#FFF0F5',
            color: 'var(--primary-pink)',
            padding: '7px 14px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.84rem',
            fontWeight: 700
          }}
        >
          <CalendarIcon size={15} />
          <span>{todayFormatted}</span>
        </div>

        {/* Quick Add Friend Button */}
        <button
          className="btn btn-primary btn-sm desktop-only"
          onClick={onOpenAddFriend}
        >
          <Plus size={16} /> Add Friend
        </button>

        {/* Notifications Icon with pending approvals count */}
        <button
          className="btn-icon"
          onClick={() => navigate('/approvals')}
          style={{ position: 'relative' }}
          title="Review pending birthday wishes"
          aria-label="Notifications"
        >
          <Bell size={20} />
          {stats.pendingApprovals > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                width: '18px',
                height: '18px',
                backgroundColor: 'var(--primary-pink)',
                color: '#FFFFFF',
                borderRadius: '50%',
                fontSize: '0.68rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(255, 79, 145, 0.4)'
              }}
            >
              {stats.pendingApprovals}
            </span>
          )}
        </button>

        {/* User Avatar */}
        <div
          onClick={() => navigate('/settings')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          title="Go to Settings"
        >
          <Avatar src={user?.avatar} name={user?.name || 'Vighneshwara'} size={38} showBorder />
        </div>
      </div>

      <style>{`
        @media (max-width: 1023px) {
          .mobile-only {
            display: inline-flex !important;
          }
          header {
            padding: 0 16px !important;
          }
          .date-pill {
            display: none !important;
          }
          .desktop-only {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};

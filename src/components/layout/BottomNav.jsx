import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, Plus, CheckSquare, Settings } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BottomNav = ({ onOpenAddFriend }) => {
  const { stats } = useApp();

  return (
    <nav
      className="bottom-nav"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 'var(--bottombar-height)',
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid var(--border-light)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 100,
        padding: '0 8px',
        boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.04)'
      }}
    >
      <NavLink
        to="/"
        className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
      >
        <Home size={20} />
        <span>Home</span>
      </NavLink>

      <NavLink
        to="/friends"
        className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
      >
        <Users size={20} />
        <span>Friends</span>
      </NavLink>

      {/* Floating Center Action Button */}
      <div style={{ position: 'relative', top: '-14px' }}>
        <button
          onClick={onOpenAddFriend}
          aria-label="Add new friend"
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'var(--gradient-primary)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 18px rgba(255, 79, 145, 0.45)',
            border: '3px solid #FFFFFF',
            transform: 'scale(1.05)'
          }}
          className="animate-bounce-slight"
        >
          <Plus size={24} strokeWidth={2.8} />
        </button>
      </div>

      <NavLink
        to="/approvals"
        className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
        style={{ position: 'relative' }}
      >
        <CheckSquare size={20} />
        <span>Approvals</span>
        {stats.pendingApprovals > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-2px',
              right: '14px',
              backgroundColor: 'var(--primary-pink)',
              color: '#FFFFFF',
              fontSize: '0.65rem',
              fontWeight: 800,
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {stats.pendingApprovals}
          </span>
        )}
      </NavLink>

      <NavLink
        to="/settings"
        className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
      >
        <Settings size={20} />
        <span>Settings</span>
      </NavLink>

      <style>{`
        .bottom-nav {
          display: none;
        }
        @media (max-width: 1023px) {
          .bottom-nav {
            display: flex;
          }
        }
        .bottom-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          color: var(--text-muted);
          font-size: 0.72rem;
          font-weight: 600;
          padding: 6px 12px;
          transition: all 0.2s ease;
        }
        .bottom-nav-item.active {
          color: var(--primary-pink);
        }
      `}</style>
    </nav>
  );
};

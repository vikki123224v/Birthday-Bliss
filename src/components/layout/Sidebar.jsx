import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  History, 
  Settings, 
  Sparkles, 
  ChevronRight,
  Gift
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Avatar } from '../common/Avatar';

export const Sidebar = () => {
  const { user, stats, triggerConfetti } = useApp();

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/friends', label: 'Friends', icon: Users, badge: null },
    { to: '/approvals', label: 'Approvals', icon: CheckSquare, badge: stats.pendingApprovals > 0 ? stats.pendingApprovals : null },
    { to: '/history', label: 'History', icon: History, badge: null },
    { to: '/settings', label: 'Settings', icon: Settings, badge: null },
  ];

  return (
    <aside
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        width: 'var(--sidebar-width)',
        backgroundColor: '#FFFFFF',
        borderRight: '1px solid var(--border-light)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100,
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: '24px 20px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}
      >
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'var(--gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem',
            boxShadow: 'var(--shadow-primary)'
          }}
          className="animate-bounce-slight"
        >
          🎂
        </div>
        <div>
          <h2
            style={{
              fontSize: '1.2rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #FF4F91 0%, #FF8066 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.3px'
            }}
          >
            Birthday Bliss
          </h2>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            Never miss a celebration
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ padding: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '11px 16px',
                borderRadius: 'var(--radius-md)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.94rem',
                color: isActive ? 'var(--primary-pink)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--primary-pink-light)' : 'transparent',
                transition: 'all 0.2s ease',
              })}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Icon size={19} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  style={{
                    backgroundColor: 'var(--primary-pink)',
                    color: '#FFFFFF',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    minWidth: '20px',
                    textAlign: 'center'
                  }}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Promotional Card */}
      <div style={{ padding: '14px' }}>
        <div
          style={{
            background: 'var(--gradient-upgrade)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px',
            textAlign: 'center',
            border: '1px solid #FFE6EE',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              margin: '0 auto 10px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(255, 79, 145, 0.15)'
            }}
          >
            <Gift size={22} color="var(--primary-pink)" />
          </div>
          <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '4px' }}>
            Make every birthday special!
          </h4>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
            Automated SMS & WhatsApp dispatch
          </p>
          <button
            className="btn btn-primary btn-sm"
            style={{ width: '100%', fontSize: '0.8rem' }}
            onClick={() => triggerConfetti({ particleCount: 50 })}
          >
            <Sparkles size={14} /> Upgrade
          </button>
        </div>
      </div>

      {/* User Profile Card */}
      <div
        style={{
          padding: '14px 16px',
          borderTop: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          transition: 'background-color 0.2s ease'
        }}
        onClick={() => window.location.href = '#/settings'}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
          <Avatar src={user?.avatar} name={user?.name || 'Vighneshwara'} size={38} />
          <div style={{ minWidth: 0 }}>
            <h5
              style={{
                fontSize: '0.86rem',
                fontWeight: 700,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {user?.name || 'Vighneshwara'}
            </h5>
            <p
              style={{
                fontSize: '0.72rem',
                color: 'var(--text-muted)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {user?.email || 'vighn@example.com'}
            </p>
          </div>
        </div>
        <ChevronRight size={16} color="var(--text-muted)" />
      </div>
    </aside>
  );
};

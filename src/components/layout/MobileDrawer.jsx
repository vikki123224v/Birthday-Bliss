import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Home, 
  Users, 
  CheckSquare, 
  History, 
  Settings, 
  Sparkles, 
  LogOut 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Avatar } from '../common/Avatar';
import { authService } from '../../services/authService';

export const MobileDrawer = ({ isOpen, onClose }) => {
  const { user, stats, triggerConfetti } = useApp();

  const handleLogout = async () => {
    await authService.logout();
    onClose();
    window.location.href = '#/login';
  };

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/friends', label: 'Friends', icon: Users },
    { to: '/approvals', label: 'Approvals', icon: CheckSquare, badge: stats.pendingApprovals },
    { to: '/history', label: 'History', icon: History },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(48, 36, 58, 0.45)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex'
          }}
          onClick={onClose}
        >
          <motion.div
            style={{
              width: '82%',
              maxWidth: '320px',
              backgroundColor: '#FFFFFF',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
              overflowY: 'auto'
            }}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-light)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.4rem' }}>🎂</span>
                <span style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--primary-pink)' }}>
                  Birthday Bliss
                </span>
              </div>
              <button className="btn-icon" onClick={onClose} aria-label="Close menu">
                <X size={20} />
              </button>
            </div>

            {/* Profile Bar */}
            <div
              style={{
                padding: '18px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: '#FFF9FA',
                borderBottom: '1px solid var(--border-light)'
              }}
            >
              <Avatar src={user?.avatar} name={user?.name || 'Vighneshwara'} size={44} />
              <div>
                <h4 style={{ fontSize: '0.94rem', fontWeight: 700 }}>{user?.name || 'Vighneshwara'}</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{user?.email || 'vighn@example.com'}</p>
              </div>
            </div>

            {/* Navigation */}
            <div style={{ padding: '16px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    style={({ isActive }) => ({
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '0.95rem',
                      color: isActive ? 'var(--primary-pink)' : 'var(--text-secondary)',
                      backgroundColor: isActive ? 'var(--primary-pink-light)' : 'transparent',
                    })}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge > 0 && (
                      <span
                        style={{
                          backgroundColor: 'var(--primary-pink)',
                          color: '#FFFFFF',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '9999px'
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>

            {/* Upgrade Promo */}
            <div style={{ padding: '14px 16px' }}>
              <div
                style={{
                  background: 'var(--gradient-upgrade)',
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                  border: '1px solid #FFE4ED'
                }}
              >
                <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>🎁</div>
                <h5 style={{ fontSize: '0.85rem', fontWeight: 700 }}>Spread more smiles</h5>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Upgrade to Premium for auto SMS
                </p>
                <button
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%', fontSize: '0.78rem' }}
                  onClick={() => triggerConfetti()}
                >
                  <Sparkles size={13} /> Upgrade
                </button>
              </div>
            </div>

            {/* Logout */}
            <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-light)' }}>
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: 'var(--color-danger)',
                  fontWeight: 600,
                  fontSize: '0.92rem'
                }}
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

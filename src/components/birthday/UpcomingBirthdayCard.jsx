import React, { useState } from 'react';
import { MoreVertical, Send, Edit, Trash2 } from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { formatBirthdayDisplay } from '../../services/birthdayService';

export const UpcomingBirthdayCard = ({ friend, onSendWish, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 14px',
        borderRadius: 'var(--radius-md)',
        transition: 'background-color 0.2s ease',
        position: 'relative'
      }}
      className="upcoming-item-row"
      onMouseLeave={() => setShowMenu(false)}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <Avatar src={friend.avatar} name={friend.name} size={42} />
        <div>
          <h5 style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--text-dark)' }}>
            {friend.name}
          </h5>
          <p style={{ fontSize: '0.8rem', color: 'var(--primary-pink)', fontWeight: 600 }}>
            {friend.daysLeft === 1 ? 'Tomorrow' : `${friend.daysLeft} days left`}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span
          style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--text-muted)'
          }}
        >
          {formatBirthdayDisplay(friend.birthdate, false)}
        </span>

        {/* Action Menu */}
        <div style={{ position: 'relative' }}>
          <button
            className="btn-icon"
            style={{ width: '32px', height: '32px' }}
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            aria-label="Options"
          >
            <MoreVertical size={16} />
          </button>

          {showMenu && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '100%',
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                border: '1px solid var(--border-light)',
                zIndex: 50,
                minWidth: '150px',
                padding: '6px'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '0.84rem',
                  borderRadius: '6px',
                  color: 'var(--text-dark)'
                }}
                onClick={() => {
                  setShowMenu(false);
                  onSendWish(friend);
                }}
              >
                <Send size={14} color="var(--primary-pink)" />
                <span>Prepare Wish</span>
              </button>

              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '0.84rem',
                  borderRadius: '6px',
                  color: 'var(--text-dark)'
                }}
                onClick={() => {
                  setShowMenu(false);
                  onEdit(friend);
                }}
              >
                <Edit size={14} />
                <span>Edit Friend</span>
              </button>

              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '0.84rem',
                  borderRadius: '6px',
                  color: 'var(--color-danger)'
                }}
                onClick={() => {
                  setShowMenu(false);
                  onDelete(friend.id);
                }}
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .upcoming-item-row:hover {
          background-color: #FFF8FA;
        }
      `}</style>
    </div>
  );
};

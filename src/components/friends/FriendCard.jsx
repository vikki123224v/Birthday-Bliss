import React from 'react';
import { Phone, Mail, Calendar, Send, Edit, Trash2 } from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { ChannelBadge } from '../common/Badge';
import { formatBirthdayDisplay } from '../../services/birthdayService';

export const FriendCard = ({
  friend,
  onSendWish,
  onEdit,
  onDelete
}) => {
  return (
    <div
      className="card card-hover"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '20px',
        position: 'relative'
      }}
    >
      {/* Top row: Avatar + Name + Countdown */}
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Avatar src={friend.avatar} name={friend.name} size={50} showBorder />
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                {friend.name}
              </h4>
              <span
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  backgroundColor: '#FAF5FF',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  border: '1px solid #F0E6FF',
                  fontWeight: 600
                }}
              >
                {friend.relationship}
              </span>
            </div>
          </div>

          <div>
            {friend.isToday ? (
              <span className="badge badge-today">Today! 🎉</span>
            ) : (
              <span className="badge badge-countdown">
                {friend.daysLeft === 1 ? 'Tomorrow' : `${friend.daysLeft}d left`}
              </span>
            )}
          </div>
        </div>

        {/* Birthday Date & Age Info */}
        <div
          style={{
            backgroundColor: '#FFF9FA',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            <Calendar size={15} color="var(--primary-pink)" />
            <span>{formatBirthdayDisplay(friend.birthdate, true)}</span>
          </div>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary-pink)' }}>
            Turning {friend.age}
          </span>
        </div>

        {/* Contact & Channel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {friend.phone && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Phone size={14} />
              <span>{friend.phone}</span>
            </div>
          )}
          {friend.email && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={14} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{friend.email}</span>
            </div>
          )}
          <div style={{ marginTop: '4px' }}>
            <ChannelBadge channel={friend.preferredChannel} />
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div
        style={{
          borderTop: '1px solid var(--border-light)',
          paddingTop: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px'
        }}
      >
        <button
          className="btn btn-primary btn-sm"
          onClick={() => onSendWish(friend)}
          style={{ flex: 1 }}
        >
          <Send size={13} />
          <span>Send Wish</span>
        </button>

        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            className="btn-icon"
            style={{ width: '34px', height: '34px' }}
            onClick={() => onEdit(friend)}
            title="Edit friend details"
            aria-label="Edit"
          >
            <Edit size={16} />
          </button>
          <button
            className="btn-icon"
            style={{ width: '34px', height: '34px', color: 'var(--color-danger)' }}
            onClick={() => onDelete(friend.id)}
            title="Delete friend"
            aria-label="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

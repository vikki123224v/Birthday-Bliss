import React from 'react';
import { Sparkles, Send } from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { ChannelBadge } from '../common/Badge';

export const TodayBirthdayCard = ({ friend, onSendWish }) => {
  return (
    <div
      className="card card-hover"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px 24px',
        border: '1.5px solid #FFE0EC',
        background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF8FA 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '5px',
          height: '100%',
          background: 'var(--gradient-primary)'
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ position: 'relative' }}>
          <Avatar src={friend.avatar} name={friend.name} size={54} showBorder />
          <span
            style={{
              position: 'absolute',
              bottom: '-4px',
              right: '-4px',
              fontSize: '1.2rem',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
            }}
          >
            🎂
          </span>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{friend.name}</h4>
            <span className="badge badge-today">Today! 🎉</span>
          </div>

          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Turns {friend.age} today</span>
            <span>•</span>
            <ChannelBadge channel={friend.preferredChannel} />
          </p>
        </div>
      </div>

      <button
        className="btn btn-primary"
        onClick={() => onSendWish(friend)}
        style={{ padding: '8px 20px', fontSize: '0.88rem' }}
      >
        <Send size={15} />
        <span>Send Wish</span>
      </button>
    </div>
  );
};

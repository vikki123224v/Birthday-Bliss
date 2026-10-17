import React from 'react';

export const EmptyState = ({
  icon = '🎉',
  title = 'No items found',
  description = 'There is nothing to display here yet.',
  action = null
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        textAlign: 'center',
        background: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        border: '1px dashed var(--border-light)'
      }}
    >
      <div
        style={{
          fontSize: '3rem',
          marginBottom: '16px',
          filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.06))'
        }}
      >
        {icon}
      </div>
      <h4
        style={{
          fontSize: '1.15rem',
          fontWeight: 700,
          color: 'var(--text-dark)',
          marginBottom: '6px'
        }}
      >
        {title}
      </h4>
      <p
        style={{
          fontSize: '0.9rem',
          color: 'var(--text-muted)',
          maxWidth: '380px',
          marginBottom: action ? '20px' : '0'
        }}
      >
        {description}
      </p>
      {action}
    </div>
  );
};

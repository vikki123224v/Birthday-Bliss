import React, { useState } from 'react';

export const Avatar = ({ 
  src, 
  name = 'User', 
  size = 44, 
  className = '', 
  showBorder = false,
  badge = null 
}) => {
  const [hasError, setHasError] = useState(false);

  const getInitials = (n) => {
    if (!n) return 'U';
    const parts = n.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  // Consistent background hue based on name
  const getBgColor = (n) => {
    const colors = [
      'linear-gradient(135deg, #FF4F91 0%, #FF8066 100%)',
      'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
      'linear-gradient(135deg, #3B82F6 0%, #2DD4BF 100%)',
      'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
      'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)'
    ];
    let hash = 0;
    for (let i = 0; i < n.length; i++) {
      hash = n.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const style = {
    width: `${size}px`,
    height: `${size}px`,
    minWidth: `${size}px`,
    borderRadius: '9999px',
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    border: showBorder ? '2.5px solid #FFFFFF' : 'none',
    boxShadow: showBorder ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
  };

  return (
    <div style={style} className={className}>
      {src && !hasError ? (
        <img
          src={src}
          alt={name}
          onError={() => setHasError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: getBgColor(name),
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: `${Math.round(size * 0.38)}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textTransform: 'uppercase'
          }}
        >
          {getInitials(name)}
        </div>
      )}
      {badge && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            transform: 'translate(15%, 15%)'
          }}
        >
          {badge}
        </div>
      )}
    </div>
  );
};

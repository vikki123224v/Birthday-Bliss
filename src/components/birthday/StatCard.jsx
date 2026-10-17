import React from 'react';
import { motion } from 'framer-motion';

export const StatCard = ({
  icon: Icon,
  iconColor = '#FF4F91',
  iconBg = '#FFF0F5',
  count = 0,
  label = 'Stat',
  onClick = null
}) => {
  return (
    <motion.div
      className="card card-hover"
      style={{
        padding: '18px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        cursor: onClick ? 'pointer' : 'default'
      }}
      onClick={onClick}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '14px',
          backgroundColor: iconBg,
          color: iconColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        <Icon size={24} />
      </div>
      <div>
        <h3
          style={{
            fontSize: '1.65rem',
            fontWeight: 800,
            lineHeight: 1.1,
            color: 'var(--text-dark)'
          }}
        >
          {count}
        </h3>
        <p
          style={{
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
            fontWeight: 600,
            marginTop: '2px'
          }}
        >
          {label}
        </p>
      </div>
    </motion.div>
  );
};

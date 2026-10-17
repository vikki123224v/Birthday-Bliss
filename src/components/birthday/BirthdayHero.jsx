import React from 'react';
import { ArrowRight, Sparkles, Gift } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BirthdayHero = ({ todayFriend, onSendWish, onAddFriend }) => {
  const { triggerConfetti } = useApp();

  const handleHeroAction = () => {
    triggerConfetti({ particleCount: 100 });
    if (todayFriend && onSendWish) {
      onSendWish(todayFriend);
    } else if (onAddFriend) {
      onAddFriend();
    }
  };

  return (
    <div
      style={{
        background: 'var(--gradient-hero)',
        borderRadius: 'var(--radius-xl)',
        padding: '32px 36px',
        color: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-primary-lg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: '220px',
        margin: '24px 0'
      }}
    >
      {/* Decorative background glow & shapes */}
      <div
        style={{
          position: 'absolute',
          top: '-30px',
          right: '-30px',
          width: '240px',
          height: '240px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-40px',
          left: '20%',
          width: '180px',
          height: '180px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }}
      />

      {/* Left Content */}
      <div style={{ maxWidth: '480px', zIndex: 2 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(255, 255, 255, 0.22)',
            backdropFilter: 'blur(8px)',
            padding: '4px 12px',
            borderRadius: '9999px',
            fontSize: '0.82rem',
            fontWeight: 700,
            marginBottom: '14px',
            letterSpacing: '0.2px'
          }}
        >
          <Sparkles size={14} />
          {todayFriend ? "Today's Birthday" : "Celebrate Together"}
        </div>

        <h2
          style={{
            fontSize: '2.1rem',
            fontWeight: 800,
            lineHeight: 1.2,
            marginBottom: '8px',
            color: '#FFFFFF',
            textShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          {todayFriend ? `${todayFriend.name} 🎉` : 'Good things are worth celebrating.'}
        </h2>

        <p
          style={{
            fontSize: '0.96rem',
            color: 'rgba(255, 255, 255, 0.94)',
            marginBottom: '22px',
            lineHeight: 1.45,
            maxWidth: '420px'
          }}
        >
          {todayFriend
            ? todayFriend.customMessage || `Wishing ${todayFriend.name} a day full of happiness, great memories and success!`
            : 'Keep the people you love close, one birthday at a time. Add friends to start automatic countdowns.'}
        </p>

        <button
          className="btn btn-white"
          onClick={handleHeroAction}
          style={{
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
            fontSize: '0.94rem',
            fontWeight: 700
          }}
        >
          <span>{todayFriend ? 'Send Wish' : 'Add First Friend'}</span>
          <ArrowRight size={17} />
        </button>
      </div>

      {/* Right Graphic / Cake Illustration */}
      <div
        className="hero-graphic desktop-only"
        style={{
          zIndex: 2,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}
      >
        {/* Cute 3D Style SVG Cake and Gifts */}
        <div style={{ position: 'relative' }} className="animate-float">
          <svg width="220" height="180" viewBox="0 0 240 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Confetti & sparkles */}
            <circle cx="20" cy="40" r="4" fill="#FFE27A" />
            <circle cx="50" cy="20" r="3" fill="#FFF" />
            <circle cx="200" cy="30" r="5" fill="#FFE27A" />
            <circle cx="220" cy="70" r="3.5" fill="#FFF" />
            <polygon points="35,65 39,75 49,75 41,81 44,91 35,85 26,91 29,81 21,75 31,75" fill="#FFE27A" opacity="0.85" />
            <polygon points="195,45 198,52 206,52 200,56 202,64 195,60 188,64 190,56 184,52 192,52" fill="#FFFFFF" opacity="0.9" />

            {/* Gift Box Left */}
            <g transform="translate(10, 100)">
              <rect x="0" y="20" width="55" height="55" rx="10" fill="#6C5CE7" />
              <rect x="22" y="20" width="11" height="55" fill="#FFEAA7" />
              <rect x="0" y="42" width="55" height="11" fill="#FFEAA7" />
              {/* Ribbon bow */}
              <ellipse cx="22" cy="18" rx="8" ry="5" fill="#FFEAA7" transform="rotate(-20 22 18)" />
              <ellipse cx="33" cy="18" rx="8" ry="5" fill="#FFEAA7" transform="rotate(20 33 18)" />
            </g>

            {/* Birthday Cake Center */}
            <g transform="translate(70, 30)">
              {/* Cake Plate */}
              <ellipse cx="65" cy="148" rx="72" ry="14" fill="#FFFFFF" opacity="0.95" />
              <ellipse cx="65" cy="145" rx="68" ry="12" fill="#F0E9FF" />

              {/* Bottom Layer */}
              <path d="M15 110 C15 110 30 140 65 140 C100 140 115 110 115 110 V85 C115 85 100 100 65 100 C30 100 15 85 15 85 Z" fill="#FFF3F6" />
              <ellipse cx="65" cy="85" rx="50" ry="14" fill="#FFFFFF" />
              {/* Cream Drips */}
              <path d="M15 86 C22 98 32 94 40 88 C48 97 58 96 65 87 C72 96 82 96 90 87 C98 94 108 97 115 86 V94 C110 100 100 102 90 95 C82 103 72 103 65 95 C58 103 48 103 40 96 C32 101 22 103 15 94 Z" fill="#FF8066" />

              {/* Top Layer */}
              <path d="M28 80 C28 80 40 100 65 100 C90 100 102 80 102 80 V55 C102 55 90 68 65 68 C40 68 28 55 28 55 Z" fill="#FFE5EC" />
              <ellipse cx="65" cy="55" rx="37" ry="12" fill="#FFFFFF" />
              {/* Cream top drips */}
              <path d="M28 55 C35 64 42 62 48 57 C55 64 62 64 65 57 C68 64 75 64 82 57 C88 62 95 64 102 55 V61 C98 67 90 69 82 63 C75 70 68 70 65 63 C62 70 55 70 48 64 C42 68 35 70 28 62 Z" fill="#FF4F91" />

              {/* Three Candles */}
              {/* Candle 1 */}
              <rect x="44" y="32" width="6" height="22" rx="3" fill="#FF7675" />
              <ellipse cx="47" cy="26" rx="4" ry="7" fill="#FDCB6E" />
              <ellipse cx="47" cy="27" rx="2" ry="4" fill="#FF7675" />

              {/* Candle 2 (Center) */}
              <rect x="62" y="24" width="6" height="28" rx="3" fill="#74B9FF" />
              <ellipse cx="65" cy="18" rx="5" ry="8" fill="#FDCB6E" />
              <ellipse cx="65" cy="19" rx="2.5" ry="5" fill="#E17055" />

              {/* Candle 3 */}
              <rect x="80" y="32" width="6" height="22" rx="3" fill="#A29BFE" />
              <ellipse cx="83" cy="26" rx="4" ry="7" fill="#FDCB6E" />
              <ellipse cx="83" cy="27" rx="2" ry="4" fill="#FF7675" />
            </g>

            {/* Gift Box Right */}
            <g transform="translate(180, 110)">
              <rect x="0" y="15" width="48" height="48" rx="8" fill="#00CEC9" />
              <rect x="19" y="15" width="10" height="48" fill="#FFEAA7" />
              <rect x="0" y="34" width="48" height="10" fill="#FFEAA7" />
              <ellipse cx="19" cy="13" rx="7" ry="4" fill="#FFEAA7" transform="rotate(-20 19 13)" />
              <ellipse cx="29" cy="13" rx="7" ry="4" fill="#FFEAA7" transform="rotate(20 29 13)" />
            </g>
          </svg>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-graphic {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

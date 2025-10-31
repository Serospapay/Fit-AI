'use client';

export default function GymLogo({ size = 'default' }: { size?: 'small' | 'default' | 'large' }) {
  const sizeClass = {
    small: 'fs-5',
    default: 'fs-4',
    large: 'fs-3'
  };

  return (
    <span className={`${sizeClass[size]} fw-bold text-decoration-none`} style={{ fontFamily: 'var(--font-bebas)' }}>
      <span style={{ 
        color: '#d4af37',
        textShadow: '4px 4px 8px rgba(0, 0, 0, 0.5)',
        letterSpacing: '4px'
      }}>
        K
      </span>
      <span style={{ 
        color: '#c0c0c0',
        textShadow: '4px 4px 8px rgba(0, 0, 0, 0.5)',
        letterSpacing: '4px',
        marginRight: '8px'
      }}>
        T
      </span>
    </span>
  );
}


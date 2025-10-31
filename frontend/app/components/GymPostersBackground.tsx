'use client';

export default function GymPostersBackground() {
  const posters = [
    { text: 'NO PAIN\nNO GAIN', size: 120, top: 5, left: 10, rotation: -5 },
    { text: 'PUSH\nBEYOND\nLIMITS', size: 100, top: 25, left: 35, rotation: 3 },
    { text: 'TRAIN\nHARD', size: 110, top: 50, left: 8, rotation: -3 },
    { text: 'STRENGTH\nPOWER\nGLORY', size: 95, top: 15, left: 60, rotation: 4 },
    { text: 'FLEX', size: 140, top: 45, left: 70, rotation: -6 },
    { text: 'IRON\nWILL', size: 105, top: 65, left: 20, rotation: 2 },
    { text: 'BE\nSTRONG', size: 100, top: 30, left: 85, rotation: -4 },
    { text: 'GAINS', size: 130, top: 70, left: 55, rotation: 5 },
  ];

  return (
    <div 
      className="position-fixed w-100 h-100"
      style={{ 
        pointerEvents: 'none', 
        zIndex: 0,
        opacity: 0.12,
        overflow: 'hidden'
      }}
    >
      {posters.map((poster, idx) => (
        <div
          key={idx}
          style={{
            position: 'absolute',
            top: `${poster.top}%`,
            left: `${poster.left}%`,
            fontSize: `${poster.size}px`,
            fontFamily: 'var(--font-bebas)',
            color: '#d4af37',
            transform: `rotate(${poster.rotation}deg)`,
            lineHeight: '1.1',
            fontWeight: 900,
            textShadow: '6px 6px 12px rgba(0, 0, 0, 0.8)',
            whiteSpace: 'pre-line',
            textAlign: 'center',
            letterSpacing: '8px',
            opacity: 1,
            filter: 'blur(1px)',
            border: '4px solid rgba(212, 175, 55, 0.15)',
            padding: '20px',
            background: 'rgba(0, 0, 0, 0.3)',
          }}
        >
          {poster.text}
        </div>
      ))}
      
      {/* Additional decorative elements */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: '200px',
          height: '300px',
          border: '4px solid rgba(212, 175, 55, 0.15)',
          transform: 'rotate(12deg)',
          background: 'rgba(0, 0, 0, 0.2)',
        }}
      ></div>
      
      <div
        style={{
          position: 'absolute',
          bottom: '15%',
          right: '15%',
          width: '150px',
          height: '150px',
          border: '3px dashed rgba(212, 175, 55, 0.15)',
          transform: 'rotate(-15deg)',
          background: 'rgba(0, 0, 0, 0.1)',
        }}
      ></div>
      
      <div
        style={{
          position: 'absolute',
          bottom: '20%',
          left: '10%',
          width: '250px',
          height: '80px',
          border: '5px double rgba(212, 175, 55, 0.15)',
          transform: 'rotate(8deg)',
          background: 'rgba(0, 0, 0, 0.1)',
        }}
      ></div>
      
      {/* Additional posters */}
      <div
        style={{
          position: 'absolute',
          top: '40%',
          right: '30%',
          fontSize: '90px',
          fontFamily: 'var(--font-bebas)',
          color: 'rgba(212, 175, 55, 0.4)',
          transform: 'rotate(-2deg)',
          lineHeight: '1.1',
          fontWeight: 900,
          textShadow: '4px 4px 8px rgba(0, 0, 0, 0.5)',
          whiteSpace: 'pre-line',
          letterSpacing: '6px',
          border: '3px solid rgba(212, 175, 55, 0.2)',
          padding: '15px',
          background: 'rgba(0, 0, 0, 0.2)',
        }}
      >
        POWER
      </div>
    </div>
  );
}


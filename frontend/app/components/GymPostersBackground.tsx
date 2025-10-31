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
        opacity: 0.06,
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
            textShadow: '4px 4px 8px rgba(0, 0, 0, 0.5)',
            whiteSpace: 'pre-line',
            textAlign: 'center',
            letterSpacing: '6px',
            opacity: 0.8,
            filter: 'blur(0.5px)',
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
          border: '3px solid rgba(212, 175, 55, 0.1)',
          transform: 'rotate(12deg)',
        }}
      ></div>
      
      <div
        style={{
          position: 'absolute',
          bottom: '15%',
          right: '15%',
          width: '150px',
          height: '150px',
          border: '2px dashed rgba(212, 175, 55, 0.1)',
          transform: 'rotate(-15deg)',
        }}
      ></div>
      
      <div
        style={{
          position: 'absolute',
          bottom: '20%',
          left: '10%',
          width: '250px',
          height: '80px',
          border: '4px double rgba(212, 175, 55, 0.1)',
          transform: 'rotate(8deg)',
        }}
      ></div>
    </div>
  );
}


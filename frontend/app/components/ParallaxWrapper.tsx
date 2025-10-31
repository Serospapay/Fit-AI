'use client';

import { useEffect, useRef } from 'react';

interface ParallaxWrapperProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export default function ParallaxWrapper({ children, speed = 0.5, className = '' }: ParallaxWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;

      const scrolled = window.pageYOffset;
      const rate = scrolled * speed;
      
      ref.current.style.transform = `translateY(${rate}px)`;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}


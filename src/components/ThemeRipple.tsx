import React, { useEffect, useState } from 'react';

interface Ripple {
  x: number;
  y: number;
  color: string;
  bgColor: string;
}

interface ThemeRippleProps {
  ripple: Ripple | null;
  onAnimationComplete: () => void;
}

const DURATION = 600; // Durasi animasi dalam milidetik

const ThemeRipple: React.FC<ThemeRippleProps> = ({ ripple, onAnimationComplete }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (ripple) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        onAnimationComplete();
        // Setelah animasi selesai, tunggu sebentar sebelum menghapus elemen
        setTimeout(() => setIsAnimating(false), DURATION);
      }, DURATION);
      return () => clearTimeout(timer);
    }
  }, [ripple, onAnimationComplete]);

  if (!ripple) return null;

  const maxRadius = Math.hypot(
    Math.max(ripple.x, window.innerWidth - ripple.x),
    Math.max(ripple.y, window.innerHeight - ripple.y)
  );

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        pointerEvents: 'none',
        backgroundColor: ripple.bgColor, // Latar belakang adalah warna tema lama
      }}
    >
      <style>
        {`
          @keyframes ripple-reveal {
            from {
              clip-path: circle(0% at ${ripple.x}px ${ripple.y}px);
            }
            to {
              clip-path: circle(${maxRadius}px at ${ripple.x}px ${ripple.y}px);
            }
          }
          .ripple-effect {
            animation: ripple-reveal ${DURATION}ms ease-out forwards;
          }
        `}
      </style>
      <div
        className="ripple-effect"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: ripple.color, // Lapisan atas adalah warna tema baru
        }}
      />
    </div>
  );
};

export default ThemeRipple;
import React, { useEffect, useState, useRef } from 'react';

// Mendefinisikan tipe data untuk properti ripple
interface Ripple {
  x: number;
  y: number;
  color: string;    // Warna tema BARU
  bgColor: string;  // Warna tema LAMA
}

interface ThemeRippleProps {
  ripple: Ripple | null;
  onAnimationComplete: () => void;
}

const DURATION = 700; // Durasi animasi dalam milidetik

const ThemeRipple: React.FC<ThemeRippleProps> = ({ ripple, onAnimationComplete }) => {
  const [activeRipple, setActiveRipple] = useState<Ripple | null>(null);

  useEffect(() => {
    if (ripple) {
      setActiveRipple(ripple);
      const animationTimer = setTimeout(() => {
        onAnimationComplete();
      }, DURATION);

      const cleanupTimer = setTimeout(() => {
        setActiveRipple(null);
      }, DURATION + 50); // Hapus elemen setelah animasi selesai

      return () => {
        clearTimeout(animationTimer);
        clearTimeout(cleanupTimer);
      };
    }
  }, [ripple, onAnimationComplete]);

  if (!activeRipple) return null;

  // Hitung radius yang dibutuhkan untuk menutupi seluruh layar dari titik klik
  const maxRadius = Math.hypot(
    Math.max(activeRipple.x, window.innerWidth - activeRipple.x),
    Math.max(activeRipple.y, window.innerHeight - activeRipple.y)
  );

  // Tentukan warna bayangan berdasarkan tema baru
  const shadowColor = activeRipple.color === '#000000' 
    ? 'rgba(255, 255, 255, 0.15)' 
    : 'rgba(0, 0, 0, 0.25)';

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
        // Latar belakang diatur ke warna tema LAMA
        backgroundColor: activeRipple.bgColor,
      }}
    >
      {/* Keyframes CSS dibuat secara dinamis untuk menangkap posisi klik */}
      <style>
        {`
          @keyframes ripple-reveal {
            from {
              clip-path: circle(0px at ${activeRipple.x}px ${activeRipple.y}px);
            }
            to {
              clip-path: circle(${maxRadius}px at ${activeRipple.x}px ${activeRipple.y}px);
            }
          }
          .ripple-effect-circle {
            animation: ripple-reveal ${DURATION}ms ease-in-out forwards;
          }
        `}
      </style>
      <div
        className="ripple-effect-circle"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          // Lapisan atas adalah warna tema BARU
          backgroundColor: activeRipple.color,
          // Tambahkan efek bayangan di sekeliling lingkaran yang membesar
          boxShadow: `0 0 50px 20px ${shadowColor}`,
        }}
      />
    </div>
  );
};

export default ThemeRipple;
import React, { useEffect, useRef } from 'react';

interface Ripple {
  x: number;
  y: number;
  maxRadius: number;
  startTime: number;
  color: string; // Warna tema BARU
  bgColor: string; // Warna tema LAMA
}

interface ThemeRippleProps {
  ripple: Ripple | null;
  onAnimationComplete: () => void;
}

const DURATION = 700; // Durasi animasi dalam milidetik

// Fungsi easing untuk gerakan yang lebih natural
function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3);
}

const ThemeRipple: React.FC<ThemeRippleProps> = ({ ripple, onAnimationComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ripple) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animationFrameId: number;

    const animate = () => {
      const elapsedTime = Date.now() - ripple.startTime;
      const progress = Math.min(elapsedTime / DURATION, 1);
      const easedProgress = easeOutCubic(progress);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Isi kanvas dengan warna latar belakang tema lama.
      ctx.fillStyle = ripple.bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Gambar lingkaran yang membesar dengan warna tema baru di atasnya.
      ctx.fillStyle = ripple.color;
      ctx.beginPath();
      ctx.arc(ripple.x, ripple.y, easedProgress * ripple.maxRadius, 0, 2 * Math.PI);
      ctx.fill();

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        onAnimationComplete();
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [ripple, onAnimationComplete]);

  if (!ripple) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    />
  );
};

export default ThemeRipple;
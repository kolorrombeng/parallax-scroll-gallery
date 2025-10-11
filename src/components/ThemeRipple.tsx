import React, { useEffect, useRef } from 'react';

interface Ripple {
  x: number;
  y: number;
  maxRadius: number;
  startTime: number;
  color: string;
}

interface ThemeRippleProps {
  ripple: Ripple | null;
  onAnimationComplete: () => void;
}

const DURATION = 800; // Durasi animasi dalam milidetik
const WAVE_COUNT = 5; // Jumlah gelombang untuk efek kedalaman
const WAVE_SPACING = 100; // Jarak antar gelombang

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

      // Gunakan fungsi "ease-out" untuk membuat gerakan terasa lebih natural
      const easeOutProgress = 1 - Math.pow(1 - progress, 4);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Gambar gelombang-gelombang riak
      for (let i = 0; i < WAVE_COUNT; i++) {
        // Setiap gelombang dimulai sedikit lebih lambat dari sebelumnya
        const waveProgress = Math.max(0, easeOutProgress - i * 0.08);

        if (waveProgress > 0) {
          const radius = waveProgress * (ripple.maxRadius + i * WAVE_SPACING);
          // Gelombang akan memudar seiring membesar
          const opacity = 0.5 * (1 - waveProgress);

          const color = ripple.color === '#000000' ? '0,0,0' : '255,255,255';
          ctx.fillStyle = `rgba(${color}, ${opacity})`;
          ctx.beginPath();
          ctx.arc(ripple.x, ripple.y, radius, 0, 2 * Math.PI);
          ctx.fill();
        }
      }

      // Gambar lingkaran utama yang mengisi layar
      const mainRadius = easeOutProgress * ripple.maxRadius;
      ctx.fillStyle = ripple.color;
      ctx.beginPath();
      ctx.arc(ripple.x, ripple.y, mainRadius, 0, 2 * Math.PI);
      ctx.fill();

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        // Panggil onAnimationComplete setelah lingkaran utama selesai
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
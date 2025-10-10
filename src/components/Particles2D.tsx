import React, { useRef, useEffect, useMemo } from 'react';
import { useTheme } from 'next-themes';

// --- KONFIGURASI PARTIKEL ---
const PARTICLE_COUNT = 1500;     // Jumlah partikel bisa dikurangi agar tidak terlalu ramai
const MAX_SPEED = 0.5;           // Kecepatan maksimum partikel
const INTERACTION_RADIUS = 120;  // Radius interaksi kursor
const REPULSION_STRENGTH = 0.5;  // Kekuatan dorongan dari kursor (dikurangi agar lebih halus)
const PARTICLE_SIZE = 1;

// Tipe data untuk partikel
interface Particle {
  x: number;
  y: number;
  vx: number; // Kecepatan horizontal
  vy: number; // Kecepatan vertikal
}

const Particles2D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const { theme } = useTheme();

  const particleColor = useMemo(() => (theme === 'dark' ? '#ffffff' : '#000000'), [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      particlesRef.current = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          // Kecepatan awal yang acak
          vx: (Math.random() - 0.5) * MAX_SPEED,
          vy: (Math.random() - 0.5) * MAX_SPEED,
        });
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current = { x: event.clientX, y: event.clientY };
    };
    const handleMouseLeave = () => {
        mouseRef.current = { x: -9999, y: -9999 };
    }
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    let animationFrameId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = particleColor;

      particlesRef.current.forEach(p => {
        // Interaksi dengan kursor
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const distance = Math.hypot(dx, dy);

        if (distance < INTERACTION_RADIUS) {
          const force = (INTERACTION_RADIUS - distance) / INTERACTION_RADIUS;
          p.vx -= (dx / distance) * force * REPULSION_STRENGTH;
          p.vy -= (dy / distance) * force * REPULSION_STRENGTH;
        }
        
        // Update posisi partikel
        p.x += p.vx;
        p.y += p.vy;

        // Logika "wrap-around": jika partikel keluar layar, muncul kembali dari sisi seberangnya
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Gambar partikel
        ctx.beginPath();
        ctx.arc(p.x, p.y, PARTICLE_SIZE, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [particleColor]);

  return (
    <canvas 
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -1,
        width: '100vw',
        height: '100vh',
      }}
    />
  );
};

export default Particles2D;
import React, { useRef, useEffect, useMemo } from 'react';
import { useTheme } from 'next-themes';

// --- KONFIGURASI PARTIKEL ---
const PARTICLE_COUNT = 1500;
const INTERACTION_RADIUS = 120;
const REPULSION_STRENGTH = 1.5; // Ditingkatkan agar interaksi mouse lebih terasa
const PARTICLE_SIZE = 0.5;

// --- KONFIGURASI GELOMBANG ---
const NOISE_SPEED = 0.003;   // Seberapa cepat pola gelombang berubah
const NOISE_SCALE = 0.004;   // Skala/kerapatan pola gelombang
const PARTICLE_SPEED = 0.3;  // Kecepatan dasar partikel mengikuti arus

// Tipe data untuk partikel
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const Particles2D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const frameRef = useRef(0); // Ref untuk melacak waktu/frame animasi
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
          vx: 0,
          vy: 0,
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

      frameRef.current++; // Majukan waktu animasi

      particlesRef.current.forEach(p => {
        // 1. Hitung sudut dari flow field (wavy motion)
        const angle = (Math.cos(p.x * NOISE_SCALE + frameRef.current * NOISE_SPEED) + Math.sin(p.y * NOISE_SCALE + frameRef.current * NOISE_SPEED)) * Math.PI;

        // Terapkan kecepatan berdasarkan sudut
        p.vx = Math.cos(angle) * PARTICLE_SPEED;
        p.vy = Math.sin(angle) * PARTICLE_SPEED;

        // 2. Interaksi dengan kursor (repulsion)
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const distance = Math.hypot(dx, dy);

        if (distance < INTERACTION_RADIUS) {
          const force = (INTERACTION_RADIUS - distance) / INTERACTION_RADIUS;
          // Tambahkan gaya dorong ke kecepatan yang sudah ada
          p.vx -= (dx / distance) * force * REPULSION_STRENGTH;
          p.vy -= (dy / distance) * force * REPULSION_STRENGTH;
        }
        
        // 3. Update posisi partikel
        p.x += p.vx;
        p.y += p.vy;

        // 4. Logika "wrap-around" agar partikel kembali muncul
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // 5. Gambar partikel
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
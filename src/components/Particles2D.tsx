// src/components/Particles2D.tsx

import React, { useRef, useEffect, useMemo } from 'react';
import { useTheme } from 'next-themes';

// --- KONFIGURASI INTERAKSI ---
const PARTICLE_COUNT = 3000;     // Jumlah partikel (lebih sedikit untuk 2D agar tetap ringan)
const INTERACTION_RADIUS = 80;   // Jarak radius interaksi dari kursor (dalam pixel)
const REPULSION_STRENGTH = 3;    // Kekuatan partikel menjauh dari kursor
const RETURN_SPEED = 0.04;       // Kecepatan partikel kembali ke posisi semula
const PARTICLE_SIZE = 1;         // Ukuran partikel

// Tipe data untuk partikel
interface Particle {
  x: number; // Posisi x saat ini
  y: number; // Posisi y saat ini
  originX: number; // Posisi x asli
  originY: number; // Posisi y asli
  vx: number; // Kecepatan horizontal
  vy: number; // Kecepatan vertikal
}

const Particles2D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 }); // Posisi awal di luar layar
  const { theme } = useTheme();

  const particleColor = useMemo(() => (theme === 'dark' ? '#ffffff' : '#000000'), [theme]);

  // Efek untuk inisialisasi canvas dan partikel
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set ukuran canvas sesuai window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Buat partikel baru saat ukuran window berubah
      particlesRef.current = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particlesRef.current.push({
          x,
          y,
          originX: x,
          originY: y,
          vx: 0,
          vy: 0,
        });
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Lacak posisi mouse
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current = { x: event.clientX, y: event.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Loop animasi
    let animationFrameId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Bersihkan canvas
      ctx.fillStyle = particleColor;

      particlesRef.current.forEach(p => {
        // Hitung jarak dari mouse
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const distance = Math.hypot(dx, dy);

        // Jika dalam radius interaksi, beri gaya dorong
        if (distance < INTERACTION_RADIUS) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (INTERACTION_RADIUS - distance) / INTERACTION_RADIUS;
          const directionX = forceDirectionX * force * REPULSION_STRENGTH;
          const directionY = forceDirectionY * force * REPULSION_STRENGTH;
          
          p.vx -= directionX;
          p.vy -= directionY;
        }

        // Beri gaya tarik kembali ke posisi awal
        p.vx += (p.originX - p.x) * RETURN_SPEED;
        p.vy += (p.originY - p.y) * RETURN_SPEED;

        // Terapkan friksi agar berhenti
        p.vx *= 0.9;
        p.vy *= 0.9;
        
        // Update posisi
        p.x += p.vx;
        p.y += p.vy;

        // Gambar partikel
        ctx.beginPath();
        ctx.arc(p.x, p.y, PARTICLE_SIZE, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
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
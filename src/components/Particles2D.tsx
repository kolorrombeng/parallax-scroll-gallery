import React, { useRef, useEffect, useMemo } from 'react';

// --- KONFIGURASI PARTIKEL ---
const PARTICLE_COUNT = 1500;
const INTERACTION_RADIUS = 150;
const REPULSION_STRENGTH = 2.5;
const PARTICLE_SIZE = 0.8;
const CONNECTION_DISTANCE = 80;
const LINE_OPACITY = 0.15;

// --- KONFIGURASI FLOW FIELD ---
const NOISE_SPEED = 0.0008;
const NOISE_SCALE = 0.003;
const PARTICLE_SPEED = 0.5;
const DAMPING = 0.95;

// --- KONFIGURASI LOOP ---
const LOOP_DURATION = 600; // Durasi loop dalam frame (10 detik di 60fps)
const RETURN_FORCE = 0.02; // Kekuatan gaya kembali ke posisi awal

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
}

const Particles2D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const frameRef = useRef(0);
  const themeRef = useRef<'light' | 'dark'>('dark');

  // Detect theme from system
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    themeRef.current = mediaQuery.matches ? 'dark' : 'light';
    
    const handleChange = (e: MediaQueryListEvent) => {
      themeRef.current = e.matches ? 'dark' : 'light';
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const getColors = () => {
    const isDark = themeRef.current === 'dark';
    return {
      particle: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.5)',
      line: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
    };
  };

  // Simplex-like noise function
  const noise = (x: number, y: number, t: number) => {
    return Math.sin(x * 0.01 + t) * Math.cos(y * 0.01 + t) * 0.5 +
           Math.sin((x + y) * 0.015 + t * 1.3) * 0.3 +
           Math.cos((x - y) * 0.008 + t * 0.7) * 0.2;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      particlesRef.current = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particlesRef.current.push({
          x,
          y,
          vx: 0,
          vy: 0,
          baseX: x,
          baseY: y,
        });
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);



    let animationFrameId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const colors = getColors();
      frameRef.current += NOISE_SPEED;

      // Update particles
      particlesRef.current.forEach(p => {
        // Flow field dengan multi-layer noise
        const noiseValue = noise(p.x, p.y, frameRef.current);
        const angle = noiseValue * Math.PI * 2;

        // Tambahkan curl noise untuk gerakan lebih organic
        const curlX = noise(p.x + 100, p.y, frameRef.current);
        const curlY = noise(p.x, p.y + 100, frameRef.current);

        p.vx += Math.cos(angle) * PARTICLE_SPEED + curlY * 0.1;
        p.vy += Math.sin(angle) * PARTICLE_SPEED - curlX * 0.1;



        // Apply damping untuk smooth motion
        p.vx *= DAMPING;
        p.vy *= DAMPING;

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around screen
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;
      });

      // Draw connections (optional, for depth)
      ctx.strokeStyle = colors.line;
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particlesRef.current.length; i++) {
        const p1 = particlesRef.current[i];
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p2 = particlesRef.current[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.hypot(dx, dy);

          if (distance < CONNECTION_DISTANCE) {
            const opacity = (1 - distance / CONNECTION_DISTANCE) * LINE_OPACITY;
            ctx.globalAlpha = opacity;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      ctx.globalAlpha = 1;
      ctx.fillStyle = colors.particle;
      particlesRef.current.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, PARTICLE_SIZE, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      background: themeRef.current === 'dark' ? '#0a0a0a' : '#f5f5f5',
      zIndex: 0 
    }}>
      <canvas 
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      />
      <div style={{
        position: 'relative',
        zIndex: 1,
        padding: '4rem 2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        color: themeRef.current === 'dark' ? '#ffffff' : '#000000',
      }}>
      </div>
    </div>
  );
};

export default Particles2D;
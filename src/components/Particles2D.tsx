import React, { useRef, useEffect, useMemo } from 'react';

// --- KONFIGURASI PARTIKEL ---
const PARTICLE_COUNT = 1200; // Dikurangi untuk performa
const INTERACTION_RADIUS = 150;
const REPULSION_STRENGTH = 2.5;
const PARTICLE_SIZE = 0.8;
const CONNECTION_DISTANCE = 80;
const LINE_OPACITY = 0.15;
const MAX_CONNECTIONS_PER_PARTICLE = 3; // Batasi jumlah koneksi per partikel

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
  const fpsRef = useRef(60);
  const lastFrameTimeRef = useRef(performance.now());

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
      const dpr = Math.min(window.devicePixelRatio, 2); // Batasi DPR untuk performa
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
      
      // Adjust particle count based on screen size
      const screenArea = window.innerWidth * window.innerHeight;
      const baseArea = 1920 * 1080;
      const adjustedCount = Math.floor(PARTICLE_COUNT * Math.min(screenArea / baseArea, 1));
      
      particlesRef.current = [];
      for (let i = 0; i < adjustedCount; i++) {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
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
      // FPS throttling untuk performa konsisten
      const now = performance.now();
      const elapsed = now - lastFrameTimeRef.current;
      const targetFrameTime = 1000 / 60; // Target 60fps
      
      if (elapsed < targetFrameTime) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }
      
      lastFrameTimeRef.current = now - (elapsed % targetFrameTime);
      
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      
      const colors = getColors();
      
      // Loop time - oscillates between 0 and LOOP_DURATION
      const loopTime = frameRef.current % LOOP_DURATION;
      const loopProgress = loopTime / LOOP_DURATION; // 0 to 1
      
      // Smooth loop dengan sine wave untuk transisi halus
      const loopPhase = Math.sin(loopProgress * Math.PI * 2) * 0.5 + 0.5;
      
      frameRef.current += 1;

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

        // Batasi jarak dari base position (soft boundary)
        const distFromBase = Math.hypot(p.x - p.baseX, p.y - p.baseY);
        if (distFromBase > 200) {
          p.x = p.baseX + (p.x - p.baseX) * 0.95;
          p.y = p.baseY + (p.y - p.baseY) * 0.95;
        }
      });

      // Draw connections (dengan optimasi)
      ctx.strokeStyle = colors.line;
      ctx.lineWidth = 0.5;
      
      // Gunakan spatial hashing sederhana untuk optimasi
      const cellSize = CONNECTION_DISTANCE;
      const cols = Math.ceil(window.innerWidth / cellSize);
      const grid: Particle[][] = Array(cols * Math.ceil(window.innerHeight / cellSize)).fill(null).map(() => []);
      
      // Masukkan partikel ke grid
      particlesRef.current.forEach(p => {
        const col = Math.floor(p.x / cellSize);
        const row = Math.floor(p.y / cellSize);
        const index = row * cols + col;
        if (grid[index]) grid[index].push(p);
      });
      
      // Draw connections hanya untuk partikel di sel yang sama atau bersebelahan
      particlesRef.current.forEach(p1 => {
        const col = Math.floor(p1.x / cellSize);
        const row = Math.floor(p1.y / cellSize);
        let connectionCount = 0;
        
        // Check sel current dan 8 sel tetangga
        for (let dy = -1; dy <= 1 && connectionCount < MAX_CONNECTIONS_PER_PARTICLE; dy++) {
          for (let dx = -1; dx <= 1 && connectionCount < MAX_CONNECTIONS_PER_PARTICLE; dx++) {
            const checkCol = col + dx;
            const checkRow = row + dy;
            const index = checkRow * cols + checkCol;
            
            if (!grid[index]) continue;
            
            for (const p2 of grid[index]) {
              if (p1 === p2 || connectionCount >= MAX_CONNECTIONS_PER_PARTICLE) continue;
              
              const dx = p1.x - p2.x;
              const dy = p1.y - p2.y;
              const distSq = dx * dx + dy * dy; // Gunakan distance squared untuk performa
              
              if (distSq < CONNECTION_DISTANCE * CONNECTION_DISTANCE) {
                const opacity = (1 - Math.sqrt(distSq) / CONNECTION_DISTANCE) * LINE_OPACITY;
                ctx.globalAlpha = opacity;
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
                connectionCount++;
              }
            }
          }
        }
      });

      // Draw particles dengan batching
      ctx.globalAlpha = 1;
      ctx.fillStyle = colors.particle;
      
      // Batch draw untuk performa lebih baik
      ctx.beginPath();
      particlesRef.current.forEach(p => {
        ctx.moveTo(p.x + PARTICLE_SIZE, p.y);
        ctx.arc(p.x, p.y, PARTICLE_SIZE, 0, Math.PI * 2);
      });
      ctx.fill();

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
          willChange: 'transform', // GPU acceleration hint
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
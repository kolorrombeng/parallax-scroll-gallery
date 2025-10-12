import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';

const PARTICLE_COUNT = 60;
const PATTERN_RADIUS = 120;
const MIN_LOADING_TIME = 1500;

interface LoadingParticle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  angle: number;
  radius: number;
  speed: number;
}

interface LoadingScreenProps {
  isLoading: boolean;
  onLoadingComplete: () => void;
}

const LoadingScreen = ({ isLoading, onLoadingComplete }: LoadingScreenProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<LoadingParticle[]>([]);
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef(Date.now());
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Setup canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Initialize particles from edges
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
      const startRadius = Math.max(canvas.width, canvas.height);
      
      return {
        x: centerX + Math.cos(angle) * startRadius,
        y: centerY + Math.sin(angle) * startRadius,
        targetX: centerX + Math.cos(angle) * PATTERN_RADIUS,
        targetY: centerY + Math.sin(angle) * PATTERN_RADIUS,
        angle,
        radius: PATTERN_RADIUS,
        speed: 0.08 + Math.random() * 0.04,
      };
    });

    // Simulate loading progress - faster increments
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return Math.min(prev + Math.random() * 8 + 2, 100);
      });
    }, 80);

    // Animation loop
    let animationFrameId: number;
    let rotation = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const isDark = theme === 'dark';
      const particleColor = isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)';
      const glowColor = isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)';

      rotation += 0.005;

      particlesRef.current.forEach((particle, i) => {
        // Move towards target with easing
        particle.x += (particle.targetX - particle.x) * particle.speed;
        particle.y += (particle.targetY - particle.y) * particle.speed;

        // Add rotation effect when formed
        const distanceToTarget = Math.hypot(
          particle.targetX - particle.x,
          particle.targetY - particle.y
        );

        if (distanceToTarget < 5) {
          const rotatedAngle = particle.angle + rotation;
          particle.targetX = centerX + Math.cos(rotatedAngle) * PATTERN_RADIUS;
          particle.targetY = centerY + Math.sin(rotatedAngle) * PATTERN_RADIUS;
        }

        // Draw particle with glow
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();

        // Add glow effect
        if (progress > 50) {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, 6, 0, Math.PI * 2);
          ctx.fillStyle = glowColor;
          ctx.fill();
        }

        // Connect to neighbors
        if (i < particlesRef.current.length - 1) {
          const next = particlesRef.current[i + 1];
          const distance = Math.hypot(next.x - particle.x, next.y - particle.y);
          
          if (distance < PATTERN_RADIUS * 1.5) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(next.x, next.y);
            ctx.strokeStyle = isDark 
              ? `rgba(255, 255, 255, ${0.1 * (1 - distance / (PATTERN_RADIUS * 1.5))})` 
              : `rgba(0, 0, 0, ${0.1 * (1 - distance / (PATTERN_RADIUS * 1.5))})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Check for completion
    const checkCompletion = () => {
      const elapsed = Date.now() - startTimeRef.current;
      if (progress >= 100 && elapsed >= MIN_LOADING_TIME) {
        onLoadingComplete();
      } else {
        setTimeout(checkCompletion, 50);
      }
    };

    checkCompletion();

    return () => {
      clearInterval(progressInterval);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, onLoadingComplete, progress]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-all duration-1000 ease-out ${
        !isLoading ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 transition-opacity duration-1000 ${
          !isLoading ? 'opacity-0' : 'opacity-100'
        }`}
      />
      
      <div className="relative z-10 text-center space-y-8">
        <div className="text-6xl font-bold text-foreground animate-fade-in">
          {Math.floor(progress)}%
        </div>
        
        <div className="w-64 h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
import React, { useEffect, useRef } from 'react';

interface Ripple {
  x: number;
  y: number;
  startTime: number;
  backgroundColor: string;
}

interface ThemeRippleProps {
  ripple: Ripple | null;
  onAnimationComplete: () => void;
}

const DURATION = 1200; // Durasi animasi dalam milidetik
const DAMPENING = 0.985; // Faktor redaman untuk gelombang

const ThemeRipple: React.FC<ThemeRippleProps> = ({ ripple, onAnimationComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const backgroundRef = useRef<HTMLCanvasElement | null>(null);

  // 1. Tangkap tampilan halaman saat ini
  useEffect(() => {
    if (ripple) {
      const mainContent = document.documentElement;
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = window.innerWidth;
      tempCanvas.height = window.innerHeight;
      const tempCtx = tempCanvas.getContext('2d');
      
      if (tempCtx) {
        // Trik untuk "screenshot": gambar ulang konten HTML ke canvas
        const xml = new XMLSerializer().serializeToString(mainContent);
        const svg = `
          <svg xmlns="http://www.w3.org/2000/svg" width="${window.innerWidth}" height="${window.innerHeight}">
            <foreignObject width="100%" height="100%">
              <div xmlns="http://www.w3.org/1999/xhtml">${xml}</div>
            </foreignObject>
          </svg>
        `;
        const img = new Image();
        const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        
        img.onload = () => {
          tempCtx.drawImage(img, 0, 0);
          backgroundRef.current = tempCanvas;
          URL.revokeObjectURL(url);
        };
        img.src = url;
      }
    } else {
        backgroundRef.current = null;
    }
  }, [ripple]);

  // 2. Animasikan riak air
  useEffect(() => {
    if (!ripple || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const width = canvas.width;
    const height = canvas.height;

    // Buffer untuk menyimpan data gelombang
    let buffer1 = new Float32Array(width * height);
    let buffer2 = new Float32Array(width * height);
    
    // Inisialisasi riak awal
    const rippleX = Math.floor(ripple.x);
    const rippleY = Math.floor(ripple.y);

    for (let y = -10; y < 10; y++) {
        for (let x = -10; x < 10; x++) {
            if (x * x + y * y < 10 * 10) {
                const index = (rippleY + y) * width + (rippleX + x);
                if (index >= 0 && index < buffer1.length) {
                    buffer1[index] = 1.0;
                }
            }
        }
    }


    const animate = () => {
      if (!backgroundRef.current) {
        animationFrameId.current = requestAnimationFrame(animate);
        return;
      }

      const imageData = ctx.createImageData(width, height);
      const destData = imageData.data;
      const srcCtx = backgroundRef.current.getContext('2d');
      if (!srcCtx) return;
      const srcData = srcCtx.getImageData(0, 0, width, height).data;

      for (let i = 0; i < width * height; i++) {
        // Kalkulasi perambatan gelombang
        const x = i % width;
        const y = Math.floor(i / width);
        let waveHeight =
          ((buffer1[((y - 1) * width + x)] || 0) +
            (buffer1[((y + 1) * width + x)] || 0) +
            (buffer1[(y * width + x - 1)] || 0) +
            (buffer1[(y * width + x + 1)] || 0)) / 2 - buffer2[i];
        
        buffer2[i] = waveHeight * DAMPENING;

        // Hitung offset distorsi
        const offsetX = Math.floor((buffer2[(y * width + x - 1)] || 0) - (buffer2[(y * width + x + 1)] || 0));
        const offsetY = Math.floor((buffer2[((y - 1) * width + x)] || 0) - (buffer2[((y + 1) * width + x)] || 0));

        // Ambil piksel dari gambar latar belakang dengan offset
        const displacedX = Math.max(0, Math.min(width - 1, x + offsetX));
        const displacedY = Math.max(0, Math.min(height - 1, y + offsetY));
        const srcIndex = (displacedY * width + displacedX) * 4;

        // Salin piksel ke buffer tujuan
        const destIndex = i * 4;
        destData[destIndex] = srcData[srcIndex];
        destData[destIndex + 1] = srcData[srcIndex + 1];
        destData[destIndex + 2] = srcData[srcIndex + 2];
        destData[destIndex + 3] = 255;
      }
      
      // Tukar buffer untuk frame berikutnya
      [buffer1, buffer2] = [buffer2, buffer1];

      ctx.putImageData(imageData, 0, 0);

      // Fade in ke warna tema baru
      const elapsedTime = Date.now() - ripple.startTime;
      const progress = Math.min(elapsedTime / DURATION, 1);
      ctx.fillStyle = ripple.color;
      ctx.globalAlpha = Math.pow(progress, 3); // easeInCubic
      ctx.fillRect(0, 0, width, height);
      ctx.globalAlpha = 1.0;

      if (progress < 1) {
        animationFrameId.current = requestAnimationFrame(animate);
      } else {
        onAnimationComplete();
      }
    };

    animate();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
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
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface Ripple {
  x: number;
  y: number;
  startTime: number;
  color: [number, number, number];      // Warna tema BARU (RGB: 0-1)
  bgColor: [number, number, number];    // Warna tema LAMA (RGB: 0-1)
}

interface ThemeRippleProps {
  ripple: Ripple | null;
  onAnimationComplete: () => void;
}

const DURATION = 1500; // Durasi animasi dalam milidetik

// --- Shader untuk Efek Riak Air ---
const RippleMaterial = shaderMaterial(
  // Uniforms (data yang dikirim dari React ke shader)
  {
    uTime: 0,
    uResolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
    uCenter: new THREE.Vector2(0.5, 0.5),
    uColor: new THREE.Color(0, 0, 0),
    uBgColor: new THREE.Color(1, 1, 1),
  },
  // Vertex Shader: Memanipulasi posisi vertex untuk membuat gelombang
  /*glsl*/`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader: Memanipulasi warna piksel untuk distorsi & transisi
  /*glsl*/`
    uniform float uTime;
    uniform vec2 uResolution;
    uniform vec2 uCenter;
    uniform vec3 uColor;
    uniform vec3 uBgColor;
    varying vec2 vUv;

    void main() {
      float progress = min(uTime, 1.0);
      float easedProgress = 1.0 - pow(1.0 - progress, 4.0);

      // Hitung jarak dari pusat riak
      float dist = distance(vUv, uCenter);
      
      // Definisikan gelombang utama
      float rippleWave = smoothstep(easedProgress * 0.5, easedProgress * 0.5 + 0.05, dist);

      // Buat gelombang sekunder yang lebih kecil untuk detail
      float innerWave = 1.0 - smoothstep(easedProgress * 0.45, easedProgress * 0.45 + 0.03, dist);
      
      // Gabungkan gelombang untuk menciptakan efek distorsi
      float combinedWave = rippleWave + innerWave * 0.1;

      // Efek distorsi (refraction)
      vec2 distortedUv = vUv + (normalize(uCenter - vUv) * 0.05 * innerWave * (1.0 - easedProgress));

      // Pilih warna berdasarkan posisi riak
      vec3 finalColor = mix(uBgColor, uColor, combinedWave);

      // Aplikasikan distorsi hanya pada warna latar belakang lama
      if (dist > easedProgress * 0.5) {
         // Simulasikan distorsi dengan noise sederhana
         finalColor += (sin(dist * 80.0 - uTime * 20.0)) * 0.02 * (1.0 - easedProgress);
      }
      
      // Tambahkan efek chromatic aberration pada tepi gelombang untuk realisme
      float chromaticAberration = (innerWave * 0.5 + rippleWave) * 0.01 * (1.0 - easedProgress);
      finalColor.r += chromaticAberration;
      finalColor.b -= chromaticAberration;

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
);

// Komponen internal untuk menangani logika animasi
const RippleEffect: React.FC<ThemeRippleProps> = ({ ripple, onAnimationComplete }) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => ({
    uTime: 0,
    uResolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
    uCenter: new THREE.Vector2(ripple?.x || 0.5, 1.0 - (ripple?.y || 0.5)),
    uColor: new THREE.Color(...(ripple?.color || [0,0,0])),
    uBgColor: new THREE.Color(...(ripple?.bgColor || [1,1,1])),
  }), [ripple]);

  useFrame(() => {
    if (!ripple || !materialRef.current) return;

    const elapsedTime = Date.now() - ripple.startTime;
    const progress = Math.min(elapsedTime / DURATION, 1.0);
    
    materialRef.current.uniforms.uTime.value = progress;

    if (progress >= 1) {
      onAnimationComplete();
    }
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <primitive object={RippleMaterial} ref={materialRef} attach="material" {...uniforms} />
    </mesh>
  );
};

const ThemeRipple: React.FC<ThemeRippleProps> = ({ ripple, onAnimationComplete }) => {
  if (!ripple) return null;

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
      }}
    >
      <Canvas camera={{ position: [0, 0, 1], fov: 50 }}>
        <RippleEffect ripple={ripple} onAnimationComplete={onAnimationComplete} />
      </Canvas>
    </div>
  );
};

export default ThemeRipple;
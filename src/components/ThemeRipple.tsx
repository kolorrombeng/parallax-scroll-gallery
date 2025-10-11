import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Mendefinisikan tipe data untuk properti ripple
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
// Ini adalah kode GLSL (OpenGL Shading Language) yang berjalan di GPU
const RippleMaterial = shaderMaterial(
  // Uniforms: Data yang dikirim dari React ke shader
  {
    uTime: 0,
    uCenter: new THREE.Vector2(0.5, 0.5),
    uColor: new THREE.Color(0, 0, 0),
    uBgColor: new THREE.Color(1, 1, 1),
    uResolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
  },
  // Vertex Shader: Menyiapkan koordinat
  /*glsl*/`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader: Menggambar setiap piksel
  /*glsl*/`
    uniform float uTime;
    uniform vec2 uCenter;
    uniform vec3 uColor;
    uniform vec3 uBgColor;
    varying vec2 vUv;

    // Fungsi noise untuk membuat distorsi acak seperti air
    float random (vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    void main() {
      float progress = min(uTime, 1.0);
      float easedProgress = 1.0 - pow(1.0 - progress, 4.0); // easeOutQuart

      vec2 p = vUv - uCenter;
      float len = length(p);

      // Membuat beberapa gelombang konsentris
      float ripple = sin(len * 25.0 - uTime * 10.0) * 0.01;
      float shockwave = 1.0 - smoothstep(easedProgress - 0.05, easedProgress, len);
      ripple *= shockwave;

      // Efek distorsi (refraction)
      vec2 distortedUv = vUv + p * ripple * (1.0 - easedProgress);

      // Tentukan warna berdasarkan posisi gelombang
      float mixValue = smoothstep(easedProgress - 0.1, easedProgress, length(distortedUv - uCenter));
      
      vec3 finalColor = mix(uBgColor, uColor, mixValue);

      // Tambahkan noise halus untuk tekstur air
      finalColor += (random(vUv + uTime) - 0.5) * 0.02;

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
);

// Komponen internal untuk menjalankan loop animasi
const RippleEffect: React.FC<ThemeRippleProps> = ({ ripple, onAnimationComplete }) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Memoize uniforms untuk mencegah pembuatan ulang yang tidak perlu
  const uniforms = useMemo(() => ({
    uTime: 0,
    uCenter: new THREE.Vector2(ripple?.x || 0.5, 1.0 - (ripple?.y || 0.5)),
    uColor: new THREE.Color(...(ripple?.color || [0, 0, 0])),
    uBgColor: new THREE.Color(...(ripple?.bgColor || [1, 1, 1])),
    uResolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
  }), [ripple]);

  useFrame(() => {
    if (!ripple || !materialRef.current) return;

    const elapsedTime = Date.now() - ripple.startTime;
    const progress = Math.min(elapsedTime / DURATION, 1.0);
    
    // Update uniform 'uTime' di setiap frame
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

// Komponen utama yang merender Canvas
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
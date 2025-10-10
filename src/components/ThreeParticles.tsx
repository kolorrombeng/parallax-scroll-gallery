import * as THREE from 'three';
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { useTheme } from 'next-themes';

// Komponen Internal untuk Logika Partikel
function ParticleSystem() {
  const { theme } = useTheme();
  const particleColor = theme === 'dark' ? '#ffffff' : '#000000';
  const pointsRef = useRef<any>();

  // Buat posisi acak untuk partikel menggunakan useMemo agar tidak dibuat ulang setiap render
  const positions = useMemo(() => {
    const count = 5000;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < pos.length; i++) {
      pos[i] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, []);

  // Gunakan useFrame untuk menganimasikan partikel pada setiap frame
  useFrame((state, delta) => {
    if (pointsRef.current) {
      // Buat rotasi lembut pada seluruh sistem partikel
      pointsRef.current.rotation.y += delta / 15;
      pointsRef.current.rotation.x += delta / 20;

      // Logika interaktivitas untuk menjauh dari kursor
      const { pointer } = state;
      const positions = pointsRef.current.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
          const x = positions[i];
          const y = positions[i + 1];

          // Hitung jarak partikel dari kursor dalam ruang 2D
          const distance = Math.sqrt((x - pointer.x * 5) ** 2 + (y - -pointer.y * 5) ** 2);

          // Jika jaraknya dekat, dorong partikel menjauh
          if (distance < 1.5) {
              positions[i] += (x - pointer.x * 5) * 0.02;
              positions[i + 1] += (y - -pointer.y * 5) * 0.02;
          }
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={particleColor}
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </Points>
  );
}

// Komponen Utama yang akan Anda ekspor
const ThreeParticles = () => {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, zIndex: -1, width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 2] }}>
        <ParticleSystem />
      </Canvas>
    </div>
  );
};

export default ThreeParticles;
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { useState, useMemo, useRef } from 'react';
import { useTheme } from 'next-themes';

const ThreeParticles = () => {
  const { theme } = useTheme();
  const particleColor = theme === 'dark' ? '#ffffff' : '#000000';

  // Komponen internal untuk partikel
  function Particles() {
    const ref = useRef<any>();

    // Buat posisi acak untuk setiap partikel
    const [points] = useState(() => {
      const positions = new Float32Array(5000 * 3); // 5000 partikel, masing-masing 3 koordinat (x, y, z)
      for (let i = 0; i < positions.length; i++) {
        positions[i] = (Math.random() - 0.5) * 10; // Sebar partikel dalam ruang -5 sampai 5
      }
      return new THREE.BufferAttribute(positions, 3);
    });

    // Hook 'useFrame' berjalan pada setiap frame
    useFrame((state, delta) => {
      if (ref.current) {
        // Animasikan rotasi seluruh grup partikel
        ref.current.rotation.x += delta / 20;
        ref.current.rotation.y += delta / 25;

        // Logika Interaktivitas: Partikel menjauh dari mouse
        const { pointer } = state;
        const positions = ref.current.geometry.attributes.position.array;

        for (let i = 0; i < positions.length; i += 3) {
          const x = positions[i];
          const y = positions[i + 1];
          const z = positions[i + 2];

          const distance = Math.sqrt(
            (x - pointer.x * 5) ** 2 + (y - pointer.y * 5) ** 2
          );

          // Jika dekat dengan kursor, dorong partikel menjauh
          if (distance < 1.5) {
            positions[i] += (x - pointer.x * 5) * 0.01;
            positions[i + 1] += (y - pointer.y * 5) * 0.01;
          }
        }
        ref.current.geometry.attributes.position.needsUpdate = true;
      }
    });

    return (
      <Points ref={ref} positions={points.array} stride={3} frustumCulled={false}>
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

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, zIndex: -1, width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 2] }}>
        <Particles />
      </Canvas>
    </div>
  );
};

export default ThreeParticles;
import * as THREE from 'three';
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { useTheme } from 'next-themes';

// --- KONFIGURASI INTERAKSI ---
const INTERACTION_RADIUS = 1.5; // Jarak radius interaksi kursor
const REPULSION_STRENGTH = 0.5; // Kekuatan partikel menjauh dari kursor
const RETURN_SPEED = 0.01;      // Kecepatan partikel kembali ke posisi semula

// Komponen Internal untuk Logika Partikel
function ParticleSystem() {
  const { theme } = useTheme();
  const particleColor = theme === 'dark' ? '#ffffff' : '#000000';
  const pointsRef = useRef<any>();

  // Buat dan simpan posisi acak awal untuk partikel
  const { initialPositions, currentPositions } = useMemo(() => {
    const count = 5000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < positions.length; i++) {
      positions[i] = (Math.random() - 0.5) * 10;
    }
    return {
      initialPositions: new Float32Array(positions), // Salinan untuk posisi asli
      currentPositions: positions,                   // Array yang akan dianimasikan
    };
  }, []);

  // Gunakan useFrame untuk menganimasikan partikel pada setiap frame
  useFrame((state, delta) => {
    if (pointsRef.current) {
      // Rotasi lembut pada seluruh sistem partikel
      pointsRef.current.rotation.y += delta / 15;
      pointsRef.current.rotation.x += delta / 20;

      // Logika interaktivitas yang disempurnakan
      const { pointer } = state;
      const positions = pointsRef.current.geometry.attributes.position.array;
      const worldPointer = new THREE.Vector3(pointer.x * 5, -pointer.y * 5, 0);

      for (let i = 0; i < positions.length; i += 3) {
        const particlePosition = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]);
        const initialPosition = new THREE.Vector3(initialPositions[i], initialPositions[i + 1], initialPositions[i + 2]);
        
        // 1. Hitung efek menjauh (repulsion) dari kursor
        const distance = particlePosition.distanceTo(worldPointer);
        if (distance < INTERACTION_RADIUS) {
          const repulsionForce = new THREE.Vector3().subVectors(particlePosition, worldPointer).normalize();
          // Kekuatan dorongan berbanding terbalik dengan jarak (semakin dekat semakin kuat)
          const strength = (1 - distance / INTERACTION_RADIUS) * REPULSION_STRENGTH;
          particlePosition.addScaledVector(repulsionForce, strength * delta * 30);
        }

        // 2. Hitung efek kembali ke posisi semula
        const returnForce = new THREE.Vector3().subVectors(initialPosition, particlePosition).multiplyScalar(RETURN_SPEED);
        particlePosition.add(returnForce);
        
        // Update posisi partikel
        positions[i] = particlePosition.x;
        positions[i + 1] = particlePosition.y;
        positions[i + 2] = particlePosition.z;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <Points ref={pointsRef} positions={currentPositions} stride={3} frustumCulled={false}>
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
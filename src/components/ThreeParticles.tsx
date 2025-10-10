import * as THREE from 'three';
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { useTheme } from 'next-themes';

// --- KONFIGURASI INTERAKSI ---
const INTERACTION_RADIUS = 2;   // Jarak radius interaksi dari kursor
const REPULSION_STRENGTH = 0.1; // Kekuatan partikel menjauh dari kursor
const RETURN_SPEED = 0.02;      // Kecepatan partikel kembali ke posisi semula

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
      positions[i] = (Math.random() - 0.5) * 15;
    }
    return {
      initialPositions: new Float32Array(positions), // Salinan untuk posisi asli
      currentPositions: positions,                   // Array yang akan dianimasikan
    };
  }, []);

  const tempParticlePosition = useMemo(() => new THREE.Vector3(), []);
  const tempInitialPosition = useMemo(() => new THREE.Vector3(), []);
  const tempWorldPointer = useMemo(() => new THREE.Vector3(), []);
  const tempRepulsionForce = useMemo(() => new THREE.Vector3(), []);
  const tempReturnForce = useMemo(() => new THREE.Vector3(), []);

  // Gunakan useFrame untuk menganimasikan partikel pada setiap frame
  useFrame((state, delta) => {
    if (pointsRef.current) {
      // Rotasi lembut pada seluruh sistem partikel
      pointsRef.current.rotation.y += delta / 20;

      const { pointer, viewport } = state;
      const positions = pointsRef.current.geometry.attributes.position.array;
      
      // Terjemahkan posisi kursor (dari -1 ke 1) ke koordinat dunia 3D
      tempWorldPointer.set(
        (pointer.x * viewport.width) / 2, 
        (pointer.y * viewport.height) / 2, 
        0
      );

      for (let i = 0; i < positions.length; i += 3) {
        tempParticlePosition.set(positions[i], positions[i + 1], positions[i + 2]);
        tempInitialPosition.set(initialPositions[i], initialPositions[i + 1], initialPositions[i + 2]);
        
        // 1. Hitung efek menjauh (repulsion) dari kursor
        const distance = tempParticlePosition.distanceTo(tempWorldPointer);
        
        if (distance < INTERACTION_RADIUS) {
          // Hitung vektor dari pointer ke partikel
          tempRepulsionForce.subVectors(tempParticlePosition, tempWorldPointer).normalize();
          // Kekuatan dorongan berbanding terbalik dengan jarak
          const strength = (1 - distance / INTERACTION_RADIUS) * REPULSION_STRENGTH;
          tempParticlePosition.addScaledVector(tempRepulsionForce, strength);
        }

        // 2. Hitung efek kembali ke posisi semula
        tempReturnForce.subVectors(tempInitialPosition, tempParticlePosition).multiplyScalar(RETURN_SPEED);
        tempParticlePosition.add(tempReturnForce);
        
        // Update posisi partikel di dalam array
        positions[i] = tempParticlePosition.x;
        positions[i + 1] = tempParticlePosition.y;
        positions[i + 2] = tempParticlePosition.z;
      }
      // Beri tahu Three.js bahwa posisi perlu diperbarui di GPU
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
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ParticleSystem />
      </Canvas>
    </div>
  );
};

export default ThreeParticles;
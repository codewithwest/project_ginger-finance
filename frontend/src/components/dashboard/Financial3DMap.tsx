'use client';

import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text, ContactShadows, PresentationControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

interface AssetData {
  _id: string;
  name: string;
  category: string;
  currentValue: number;
}

interface Financial3DMapProps {
  assets: AssetData[];
}

function AssetNode({ 
  asset, 
  position, 
  color, 
  onSelect 
}: { 
  asset: AssetData; 
  position: [number, number, number]; 
  color: string; 
  onSelect: (asset: AssetData) => void 
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const size = Math.log10(asset.currentValue || 1) * 0.2 + 0.1;

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(time * 0.5) * 0.2;
      meshRef.current.rotation.y += 0.01;
    }
  });

  let geometry;
  switch(asset.category) {
    case 'Land':
      geometry = <sphereGeometry args={[size * 0.6, 32, 32]} />;
      break;
    case 'Vehicle':
      geometry = <boxGeometry args={[size * 1.2, size * 0.6, size * 0.8]} />;
      break;
    case 'Livestock':
      geometry = <capsuleGeometry args={[size * 0.4, size * 0.6, 4, 8]} />;
      break;
    default:
      geometry = <octahedronGeometry args={[size * 0.7]} />;
  }

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh 
        position={position} 
        ref={meshRef} 
        onClick={(event) => {
          event.stopPropagation();
          onSelect(asset);
        }}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'auto')}
      >
        {geometry}
        <meshStandardMaterial 
          color={color} 
          roughness={0.1} 
          metalness={0.8}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>
      <Text
        position={[position[0], position[1] + size + 0.3, position[2]]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {asset.name}
      </Text>
    </Float>
  );
}

export default function Financial3DMap({ assets }: Financial3DMapProps) {
  const [selectedAsset, setSelectedAsset] = useState<AssetData | null>(null);
  // Use useMemo and deterministic positions to fix "impure function" error
  const nodes = useMemo(() => {
    return assets.map((asset, index) => {
      const angle = (index / assets.length) * Math.PI * 2;
      const radius = 3 + (index % 3) * 0.5; // Deterministic radius

      return {
        asset,
        position: [
          Math.cos(angle) * radius,
          (index % 2 === 0 ? 1 : -1) * 0.5,
          Math.sin(angle) * radius,
        ] as [number, number, number],
        color: asset.category === 'Land' ? '#48bb78' : asset.category === 'Vehicle' ? '#4299e1' : '#ed64a1',
      };
    });
  }, [assets]);

  return (
    <div style={{ width: '100%', height: '500px', background: 'radial-gradient(circle at center, #1a202c, #0d1117)', borderRadius: '24px', overflow: 'hidden', position: 'relative' }}>
      <Canvas camera={{ position: [0, 5, 10], fov: 45 }}>
        <color attach="background" args={['#0d1117']} />
        <Environment preset="city" />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        
        <PresentationControls
          global
          rotation={[0, 0, 0]}
          polar={[-Math.PI / 3, Math.PI / 3]}
          azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
        >
          <group>
            {nodes.map((node) => (
              <AssetNode 
                key={node.asset._id} 
                {...node} 
                onSelect={(asset) => setSelectedAsset(asset)} 
              />
            ))}
          </group>
        </PresentationControls>

        <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
      </Canvas>
      
      <div style={{ position: 'absolute', bottom: '20px', left: '20px', color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', pointerEvents: 'none' }}>
        Interact to Rotate • Scroll to Zoom • Click Asset for Details
      </div>

      {selectedAsset && (
        <div className="glass-card" style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '1.25rem',
          width: '240px',
          animation: 'slideInRight 0.3s ease-out',
          zIndex: 10,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span className="badge" style={{ fontSize: '0.65rem' }}>{selectedAsset.category}</span>
            <button 
              onClick={() => setSelectedAsset(null)}
              style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
            >
              ×
            </button>
          </div>
          <h4 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>{selectedAsset.name}</h4>
          <p style={{ color: '#4fa3e0', fontWeight: 600, fontSize: '0.9rem' }}>
            R {selectedAsset.currentValue.toLocaleString()}
          </p>
        </div>
      )}

      <style jsx>{`
        @keyframes slideInRight {
          from { transform: translateX(20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

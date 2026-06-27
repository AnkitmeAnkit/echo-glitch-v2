import { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function GlassShards() {
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useRef(new THREE.Object3D());
  const mouseTarget = useRef({ x: 0, y: 0 });
  useThree();

  // Use ref to store per-instance data for stable random positions
  const basePositions = useRef<{ x: number; y: number; z: number }[]>([]);

  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(1.2, 0.25);
    shape.lineTo(1.75, 1.1);
    shape.lineTo(1.4, 1.85);
    shape.lineTo(0.35, 1.9);
    shape.lineTo(-0.35, 1.2);
    shape.lineTo(-0.2, 0.3);
    shape.lineTo(0, 0);

    const extrudeSettings = {
      depth: 0.05,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 2,
    };

    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geo.center();
    return geo;
  }, []);

  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        transparent: true,
        opacity: 0.35,
        transmission: 0.6,
        metalness: 0.1,
        roughness: 0.05,
        color: '#a5b4fc',
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    []
  );

  useEffect(() => {
    if (!instancedMeshRef.current) return;
    const mesh = instancedMeshRef.current;
    const tempPositions: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < 30; i++) {
      dummy.current.position.x = Math.random() * 18 - 9;
      dummy.current.position.y = Math.random() * 14 - 7;
      dummy.current.position.z = Math.random() * 4 - 2;
      dummy.current.rotation.x = Math.random() * Math.PI * 2;
      dummy.current.rotation.y = Math.random() * Math.PI * 2;
      dummy.current.scale.setScalar(0.3 + Math.random() * 0.5);
      dummy.current.updateMatrix();
      mesh.setMatrixAt(i, dummy.current.matrix);
      tempPositions.push({
        x: dummy.current.position.x,
        y: dummy.current.position.y,
        z: dummy.current.position.z,
      });
    }
    mesh.instanceMatrix.needsUpdate = true;
    basePositions.current = tempPositions;
  }, []);

  useFrame((frameState) => {
    if (!instancedMeshRef.current) return;
    const mesh = instancedMeshRef.current;

    const { x, y } = frameState.pointer;
    mouseTarget.current.x = x * 10;
    mouseTarget.current.y = y * 7;

    for (let i = 0; i < 30; i++) {
      mesh.getMatrixAt(i, dummy.current.matrix);
      dummy.current.matrix.decompose(
        dummy.current.position,
        dummy.current.quaternion,
        dummy.current.scale
      );

      const lookVec = new THREE.Vector3(
        mouseTarget.current.x,
        mouseTarget.current.y,
        5
      );
      const worldPos = dummy.current.position.clone();
      lookVec.lerp(worldPos, 0.98);
      dummy.current.lookAt(lookVec);

      dummy.current.updateMatrix();
      mesh.setMatrixAt(i, dummy.current.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={instancedMeshRef}
      args={[geometry, material, 30]}
    />
  );
}

export default function ReactiveGlassField() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ alpha: true, antialias: true }}
        style={{ position: 'absolute', inset: 0, zIndex: 0 }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#6C63FF" />
        <pointLight position={[-10, -10, 5]} intensity={0.3} color="#00BFA6" />
        <GlassShards />
      </Canvas>
      {/* Gradient overlay */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(244,247,249,0.3) 0%, rgba(244,247,249,0.7) 70%, rgba(244,247,249,0.95) 100%)',
        }}
      />
    </div>
  );
}

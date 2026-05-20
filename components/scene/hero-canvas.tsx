"use client";

import { Float, Line, OrbitControls, PerspectiveCamera, Sphere } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

const points = [
  [-2.4, 1.1, -0.8],
  [-1.2, -0.2, -1.3],
  [0, 1.6, -0.4],
  [1.2, -1.1, -0.6],
  [2.1, 0.5, -1.1],
  [0.8, 0.3, 1.1]
] as const;

function Network() {
  return (
    <group>
      {points.map((point, index) => (
        <Float key={index} speed={2.2} rotationIntensity={0.3} floatIntensity={0.55}>
          <Sphere args={[0.08, 32, 32]} position={[...point]}>
            <meshStandardMaterial color={index % 2 === 0 ? "#103D2E" : "#B29267"} emissive="#103D2E" emissiveIntensity={0.7} />
          </Sphere>
        </Float>
      ))}
      {points.slice(0, -1).map((point, index) => (
        <Line
          key={index}
          points={[point, points[index + 1]]}
          color={index % 2 === 0 ? "#103D2E" : "#B29267"}
          lineWidth={1}
          transparent
          opacity={0.55}
        />
      ))}
    </group>
  );
}

export function HeroCanvas() {
  return (
    <Canvas className="h-full w-full" dpr={[1, 1.5]}>
      <color attach="background" args={["transparent"]} />
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <ambientLight intensity={1.1} />
      <pointLight position={[2, 3, 4]} intensity={16} color="#B29267" />
      <pointLight position={[-2, -1, 2]} intensity={8} color="#103D2E" />
      <group rotation={[-0.15, 0.45, 0.1]}>
        <mesh rotation={[-Math.PI / 2.4, 0, 0]} position={[0, -1.75, -1.2]}>
          <planeGeometry args={[8, 8, 12, 12]} />
          <meshStandardMaterial color="#103D2E" wireframe transparent opacity={0.4} />
        </mesh>
        <Network />
      </group>
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.6} />
    </Canvas>
  );
}

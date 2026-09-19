import { ContactShadows, Environment } from '@react-three/drei'

export default function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight castShadow color="#d8fff7" intensity={3.2} position={[4, 7, 8]} />
      <pointLight color="#45dfbe" distance={12} intensity={16} position={[4, 2, 4]} />
      <pointLight color="#726cff" distance={14} intensity={18} position={[-5, -2, 3]} />
      <Environment preset="city" environmentIntensity={0.45} />
      <ContactShadows blur={2.4} color="#02060a" opacity={0.7} position={[0, -2.5, 0]} scale={12} />
    </>
  )
}

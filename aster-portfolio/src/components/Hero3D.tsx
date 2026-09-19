import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { Line, OrbitControls, Sparkles, Text } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { AnimatePresence, motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import * as THREE from 'three'

const skills = [
  { id: 'java', label: 'Java', color: '#65b7ff', detail: 'JVM, concurrency and collections' },
  { id: 'spring', label: 'Spring Boot', color: '#62e0b0', detail: 'REST APIs, security and cloud services' },
  { id: 'kafka', label: 'Kafka', color: '#c7a2ff', detail: 'Event streaming and durable workflows' },
  { id: 'aws', label: 'AWS', color: '#ffc86b', detail: 'Cloud infrastructure and DevOps' },
  { id: 'redis', label: 'Redis', color: '#ff849c', detail: 'Caching and distributed rate limiting' },
  { id: 'postgresql', label: 'PostgreSQL', color: '#76baff', detail: 'Data modeling and query performance' },
  { id: 'microservices', label: 'Microservices', color: '#72e4d3', detail: 'Distributed systems and design patterns' },
  { id: 'system-design', label: 'System Design', color: '#9b9cff', detail: 'Architecture, resilience and scalability' },
]

const packetSeeds = Array.from({ length: 64 }, (_, index) => index)

function Reactor({ active, onClick }: { active: boolean; onClick: () => void }) {
  const group = useRef<THREE.Group>(null)
  const rings = useRef<THREE.Group>(null)
  useFrame(({ clock, mouse }) => {
    if (!group.current || !rings.current) return
    const t = clock.elapsedTime
    group.current.rotation.y = t * 0.16 + mouse.x * 0.12
    group.current.rotation.x = Math.sin(t * 0.6) * 0.07 + mouse.y * 0.08
    group.current.scale.setScalar(1 + Math.sin(t * 2.4) * (active ? 0.075 : 0.035))
    rings.current.rotation.z = t * -0.32
    rings.current.rotation.x = Math.sin(t * 0.45) * 0.15
  })
  return (
    <group ref={group} onClick={(event) => { event.stopPropagation(); onClick() }}>
      <mesh castShadow>
        <icosahedronGeometry args={[1.18, 5]} />
        <meshPhysicalMaterial color="#123d50" emissive="#19cfff" emissiveIntensity={active ? 5 : 2.7} metalness={0.65} roughness={0.12} clearcoat={1} transmission={0.12} />
      </mesh>
      <mesh scale={1.33}>
        <icosahedronGeometry args={[1, 4]} />
        <meshBasicMaterial color="#47edff" transparent opacity={0.2} wireframe />
      </mesh>
      <mesh scale={1.12}>
        <icosahedronGeometry args={[1, 3]} />
        <meshBasicMaterial color="#47edff" transparent opacity={0.08} wireframe />
      </mesh>
      <group ref={rings}>
        {[1.48, 1.75, 2.02].map((radius, index) => (
          <mesh key={radius} rotation={[index * 0.6, index * 0.35, index * 0.5]}>
            <torusGeometry args={[radius, index === 1 ? 0.035 : 0.014, 10, 128]} />
            <meshBasicMaterial color="#4bdbff" transparent opacity={index === 1 ? 0.7 : 0.22} />
          </mesh>
        ))}
      </group>
      <pointLight color="#35ddff" intensity={active ? 16 : 8} distance={8} />
      <Text position={[0, -0.08, 1.28]} fontSize={0.56} color="#ffffff" anchorX="center" outlineWidth={0.035} outlineColor="#19cfff" outlineOpacity={1} fillOpacity={1}>ASTER</Text>
      <Text position={[0, -0.52, 1.28]} fontSize={0.13} color="#b2faff" anchorX="center">BUILD · SCALE · LEARN</Text>
    </group>
  )
}

function OrbitRing({ index }: { index: number }) {
  const ref = useRef<THREE.Mesh>(null)
  const radius = 3.05 + index * 0.42
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * (index % 2 ? -0.08 : 0.055)
  })
  return (
    <mesh ref={ref} rotation={[Math.PI / 2 + index * 0.22, index * 0.16, index * 0.28]}>
      <torusGeometry args={[radius, index === 1 ? 0.027 : 0.012, 8, 160]} />
      <meshBasicMaterial color={index % 2 ? '#b773ff' : '#45dcff'} transparent opacity={index === 1 ? 0.48 : 0.24} />
    </mesh>
  )
}

function SkillNode({ skill, index, selected, onSelect }: { skill: typeof skills[number]; index: number; selected: boolean; onSelect: () => void }) {
  const group = useRef<THREE.Group>(null)
  const angle = (index / skills.length) * Math.PI * 2 - Math.PI / 2
  const radius = 3.8 + (index % 2) * 0.38
  const position: [number, number, number] = [Math.cos(angle) * radius, Math.sin(angle) * radius, Math.sin(angle * 2) * 0.35]
  const priority = skill.id === 'postgresql' || skill.id === 'aws' || skill.id === 'java'
  const priorityColor = skill.id === 'java' ? '#ffbf69' : skill.id === 'aws' ? '#ff9f43' : '#67c7ff'
  const labelColor = priority ? priorityColor : selected ? '#ffffff' : skill.color
  useFrame(({ clock }) => {
    if (!group.current) return
    group.current.position.y = position[1] + Math.sin(clock.elapsedTime * 1.1 + index) * 0.08
    group.current.rotation.y += 0.006
  })
  return (
    <group ref={group} position={position} onClick={(event) => { event.stopPropagation(); onSelect() }} onPointerOver={(event) => { event.stopPropagation(); document.body.style.cursor = 'pointer' }} onPointerOut={() => { document.body.style.cursor = 'default' }}>
      <mesh scale={selected ? 1.2 : 1} onClick={(event) => { event.stopPropagation(); onSelect() }} onPointerOver={(event) => { event.stopPropagation(); document.body.style.cursor = 'pointer' }} onPointerOut={() => { document.body.style.cursor = 'default' }}>
        <sphereGeometry args={[0.25, 24, 24]} />
        <meshPhysicalMaterial color={priority ? '#173b52' : '#102c42'} emissive={priority ? priorityColor : skill.color} emissiveIntensity={selected ? 5.5 : priority ? 4.4 : 2.3} metalness={0.4} roughness={0.14} clearcoat={1} toneMapped={false} />
      </mesh>
      <mesh scale={selected || priority ? 1.45 : 1.2}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshBasicMaterial color={priority ? priorityColor : skill.color} transparent opacity={selected ? 0.32 : priority ? 0.3 : 0.1} wireframe />
      </mesh>
      <Text position={[0, 0.45, 0]} fontSize={priority ? 0.25 : 0.22} color={labelColor} anchorX="center" outlineWidth={priority ? 0.025 : 0.01} outlineColor="#061421">{skill.label}</Text>
    </group>
  )
}

function Packets({ active }: { active: string | null }) {
  const refs = useRef<(THREE.Mesh | null)[]>([])
  useFrame(({ clock }) => {
    refs.current.forEach((packet, index) => {
      if (!packet) return
      const lane = index % skills.length
      const angle = (lane / skills.length) * Math.PI * 2 - Math.PI / 2
      const progress = (clock.elapsedTime * (active ? 0.34 : 0.2) + index * 0.17) % 1
      const radius = (3.8 + (lane % 2) * 0.38) * progress
      packet.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, Math.sin(angle * 2) * progress * 0.35)
      packet.scale.setScalar(0.55 + Math.sin(progress * Math.PI) * 0.8)
    })
  })
  return <>{packetSeeds.map((seed) => <mesh key={seed} ref={(node) => { refs.current[seed] = node }}><sphereGeometry args={[0.035, 6, 6]} /><meshBasicMaterial color={active ? '#ffffff' : '#6beaff'} /></mesh>)}</>
}

function HolographicScene({ selected, onSelect, onCore }: { selected: string | null; onSelect: (id: string) => void; onCore: () => void }) {
  const { viewport } = useThree()
  const graph = useRef<THREE.Group>(null)
  useFrame(({ mouse }) => {
    if (!graph.current) return
    graph.current.rotation.y += (mouse.x * 0.08 - graph.current.rotation.y) * 0.016
    graph.current.rotation.x += (-mouse.y * 0.06 - graph.current.rotation.x) * 0.016
  })
  return (
    <>
      <color attach="background" args={['#030914']} />
      <fog attach="fog" args={['#030914', 9, 23]} />
      <ambientLight intensity={0.28} />
      <directionalLight color="#c9faff" intensity={2.8} position={[4, 7, 8]} />
      <pointLight color="#20dfff" intensity={15} distance={14} position={[4, 2, 4]} />
      <pointLight color="#b05cff" intensity={19} distance={16} position={[-5, -3, 4]} />
      <Sparkles count={420} scale={[18, 14, 9]} size={1.2} speed={0.18} color="#82bbff" />
      <group ref={graph} scale={viewport.width < 7 ? 0.62 : 0.78}>
        <Reactor active={selected === 'core'} onClick={onCore} />
        {[0, 1, 2, 3].map((index) => <OrbitRing key={index} index={index} />)}
        {skills.map((skill, index) => <group key={skill.id}><Line points={[[0, 0, 0], [Math.cos((index / skills.length) * Math.PI * 2 - Math.PI / 2) * (3.8 + (index % 2) * 0.38), Math.sin((index / skills.length) * Math.PI * 2 - Math.PI / 2) * (3.8 + (index % 2) * 0.38), 0]]} color={skill.color} transparent opacity={selected === skill.id ? 0.85 : 0.25} lineWidth={selected === skill.id ? 2 : 0.8} /><SkillNode skill={skill} index={index} selected={selected === skill.id} onSelect={() => onSelect(skill.id)} /></group>)}
        <Packets active={selected} />
      </group>
      <EffectComposer multisampling={0}><Bloom intensity={2.5} luminanceThreshold={0.2} luminanceSmoothing={0.9} mipmapBlur /><Vignette eskil={false} offset={0.15} darkness={0.72} /></EffectComposer>
    </>
  )
}

function InfoPanel({ skillId, onClose, onOpenSkills }: { skillId: string; onClose: () => void; onOpenSkills: (skillId: string) => void }) {
  const skill = skills.find((item) => item.id === skillId)
  if (!skill) return null
  return <motion.aside className="hero3d-info" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}><button className="hero3d-close" onClick={onClose} aria-label="Close details"><X size={15} /></button><div className="eyebrow">HOLOGRAPHIC NODE</div><h3>{skill.label}</h3><p>{skill.detail}</p><dl><dt>Projects</dt><dd>Distributed Rate Limiter · Online Judge</dd><dt>Experience</dt><dd>3.8+ years building production systems</dd><dt>Related technologies</dt><dd>Java · Spring Cloud · Kubernetes</dd></dl><button className="button primary hero3d-info-action" onClick={() => onOpenSkills(skill.id)}>Open {skill.label} skills</button></motion.aside>
}

export default function Hero3D() {
  const [selected, setSelected] = useState<string | null>(null)
  const navigate = useNavigate()
  const openSkills = (skillId: string) => navigate(`/skills#${skillId}`)
  return (
    <motion.section className="hero3d glass" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
      <Canvas camera={{ position: [0, 0, 15], fov: 48 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }} onCreated={({ gl }) => gl.setClearColor('#030914', 1)}>
        <HolographicScene selected={selected} onSelect={setSelected} onCore={() => setSelected('core')} />
        <OrbitControls enablePan={false}   minDistance={15} enableZoom={false} autoRotate={!selected} autoRotateSpeed={0.16} enableDamping dampingFactor={0.08} />
      </Canvas>
      <div className="hero3d-tooltip">{selected ? 'Node selected · inspect system details' : 'Hover and click a node to inspect'}</div>
      <AnimatePresence>{selected && selected !== 'core' && <InfoPanel skillId={selected} onClose={() => setSelected(null)} onOpenSkills={openSkills} />}</AnimatePresence>
    </motion.section>
  )
}

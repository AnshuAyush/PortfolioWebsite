import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Line, OrbitControls, Sparkles, Text } from '@react-three/drei'
import { motion } from 'framer-motion'
import { RotateCcw, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import * as THREE from 'three'

const systems = [
  { id: 'java', label: 'Java', color: '#78b7ff', angle: 0, detail: 'JVM, concurrency and collections', route: '/skills#java' },
  { id: 'spring', label: 'Spring Boot', color: '#66ddb0', angle: Math.PI / 3, detail: 'Services, APIs and cloud-native apps', route: '/skills#spring' },
  { id: 'kafka', label: 'Kafka', color: '#c3a2ff', angle: Math.PI * 2 / 3, detail: 'Event streaming and durable workflows', route: '/skills#kafka' },
  { id: 'redis', label: 'Redis', color: '#ff879b', angle: Math.PI, detail: 'Caching and distributed rate limiting', route: '/skills#redis' },
  { id: 'aws', label: 'AWS', color: '#ffc66e', angle: Math.PI * 4 / 3, detail: 'Compute, storage and cloud infrastructure', route: '/skills#aws' },
  { id: 'system-design', label: 'System Design', color: '#76dfd0', angle: Math.PI * 5 / 3, detail: 'Scale, resilience and architecture', route: '/skills#system-design' },
]

const packetSeeds = Array.from({ length: 48 }, (_, index) => ({
  id: index,
  route: index % systems.length,
  offset: (index * 0.173) % 1,
}))

function ReactorCore({ onClick, active }) {
  const reactor = useRef()
  const rings = useRef()

  useFrame(({ clock, mouse }) => {
    if (!reactor.current || !rings.current) return
    const time = clock.elapsedTime
    reactor.current.rotation.y = time * 0.18 + mouse.x * 0.12
    reactor.current.rotation.x = Math.sin(time * 0.45) * 0.08 + mouse.y * 0.06
    reactor.current.scale.setScalar(1 + Math.sin(time * 2.2) * (active ? 0.08 : 0.035))
    rings.current.rotation.z = time * -0.25
    rings.current.rotation.x = Math.sin(time * 0.6) * 0.08
  })

  return (
    <group ref={reactor} onClick={(event) => { event.stopPropagation(); onClick() }}>
      <mesh castShadow>
        <icosahedronGeometry args={[1.05, 4]} />
        <meshPhysicalMaterial color="#163b42" emissive="#35d7b1" emissiveIntensity={active ? 1.2 : 0.7} metalness={0.85} roughness={0.16} clearcoat={1} clearcoatRoughness={0.08} />
      </mesh>
      <mesh scale={1.24}>
        <icosahedronGeometry args={[1, 3]} />
        <meshPhysicalMaterial color="#5de5c6" emissive="#1fb494" emissiveIntensity={active ? 0.8 : 0.4} transparent opacity={0.12} transmission={0.35} roughness={0.08} metalness={0.15} wireframe />
      </mesh>
      <group ref={rings}>
        {[1.3, 1.55, 1.8].map((radius, index) => (
          <mesh key={radius} rotation={[index * 0.65, index * 0.35, index * 0.5]}>
            <torusGeometry args={[radius, index === 1 ? 0.025 : 0.012, 10, 96]} />
            <meshBasicMaterial color={index === 1 ? '#b2fff1' : '#3cae9b'} transparent opacity={index === 1 ? 0.75 : 0.35} />
          </mesh>
        ))}
      </group>
      <pointLight color="#49e7c2" intensity={active ? 4 : 2.2} distance={8} />
      <Text position={[0, -2.05, 0]} fontSize={0.34} color="#b1ffed" anchorX="center" outlineWidth={0.012} outlineColor="#123b3a">ASTER</Text>
      <Text position={[0, -2.38, 0]} fontSize={0.14} color="#7894a1" anchorX="center">DISTRIBUTED SYSTEMS CORE</Text>
    </group>
  )
}

function OrbitBand({ system, index, selected, traversed, onSelect }) {
  const group = useRef()
  const radius = 3.25 + index * 0.28
  const position = [Math.cos(system.angle) * radius, Math.sin(system.angle) * radius, Math.sin(system.angle * 2) * 0.42]

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.z += delta * (index % 2 ? -0.09 : 0.065)
  })

  return (
    <group ref={group}>
      <mesh rotation={[Math.PI / 2, 0, index * 0.08]}>
        <torusGeometry args={[radius, selected ? 0.035 : 0.016, 8, 128]} />
        <meshBasicMaterial color={system.color} transparent opacity={selected ? 0.85 : 0.22} />
      </mesh>
      <mesh position={position} onClick={(event) => { event.stopPropagation(); onSelect(system) }} onPointerOver={(event) => { event.stopPropagation(); event.object.scale.setScalar(1.2) }} onPointerOut={(event) => event.object.scale.setScalar(1)}>
        <sphereGeometry args={[selected || traversed ? 0.3 : 0.22, 20, 20]} />
        <meshPhysicalMaterial color={system.color} emissive={system.color} emissiveIntensity={selected || traversed ? 4 : 1.5} metalness={0.35} roughness={0.2} clearcoat={1} />
      </mesh>
      <Text position={[position[0], position[1] + 0.52, position[2]]} fontSize={0.235} color={selected || traversed ? '#ffffff' : system.color} anchorX="center" outlineWidth={0.01} outlineColor="#071018">{system.label}</Text>
    </group>
  )
}

function DataPacket({ system, seed, active }) {
  const ref = useRef()
  const start = useMemo(() => new THREE.Vector3(0, 0, 0), [])
  const end = useMemo(() => new THREE.Vector3(Math.cos(system.angle) * 3.6, Math.sin(system.angle) * 3.6, Math.sin(system.angle * 2) * 0.35), [system.angle])
  const progress = useRef(seed.offset)

  useFrame((_, delta) => {
    progress.current = (progress.current + delta * (active ? 0.42 : 0.2)) % 1
    if (ref.current) {
      ref.current.position.lerpVectors(start, end, progress.current)
      ref.current.scale.setScalar(0.7 + Math.sin(progress.current * Math.PI) * 0.8)
    }
  })

  return <mesh ref={ref}><sphereGeometry args={[0.045, 8, 8]} /><meshBasicMaterial color={active ? '#ffffff' : system.color} toneMapped={false} /></mesh>
}

function EnergyConduit({ system, index, active }) {
  const points = useMemo(() => {
    const end = [Math.cos(system.angle) * (3.25 + index * 0.28), Math.sin(system.angle) * (3.25 + index * 0.28), Math.sin(system.angle * 2) * 0.42]
    return [[0, 0, 0], [end[0] * 0.45, end[1] * 0.45, 0.12], end]
  }, [index, system.angle])
  return <Line points={points} color={active ? '#ffffff' : system.color} transparent opacity={active ? 0.9 : 0.28} lineWidth={active ? 2.5 : 0.8} />
}

function Scene({ selected, traversed, onSelect, onCore }) {
  const group = useRef()
  const { viewport } = useThree()
  useFrame(({ mouse }) => {
    if (!group.current) return
    group.current.rotation.y += (mouse.x * 0.08 - group.current.rotation.y) * 0.015
    group.current.rotation.x += (-mouse.y * 0.05 - group.current.rotation.x) * 0.015
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, viewport.width > 8 ? 0 : mouse.x * 0.25, 0.02)
  })

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[4, 7, 8]} color="#d9fff8" intensity={3.5} castShadow />
      <pointLight position={[-6, -4, 5]} color="#746bff" intensity={18} distance={14} />
      <pointLight position={[5, 1, 3]} color="#34d7bd" intensity={14} distance={12} />
      <Sparkles count={320} scale={[18, 13, 8]} size={1.15} speed={0.22} color="#8dbbff" />
      <group ref={group} scale={viewport.width < 6 ? 0.78 : 1}>
        <ReactorCore active={traversed.includes('core')} onClick={onCore} />
        {systems.map((system, index) => (
          <group key={system.id}>
            <OrbitBand system={system} index={index} selected={selected?.id === system.id} traversed={traversed.includes(system.id)} onSelect={onSelect} />
            <EnergyConduit system={system} index={index} active={traversed.includes(system.id)} />
            {packetSeeds.filter((seed) => seed.route === index).map((seed) => <DataPacket key={seed.id} system={system} seed={seed} active={traversed.includes(system.id)} />)}
          </group>
        ))}
      </group>
    </>
  )
}

export default function DistributedSystemsCore() {
  const [selected, setSelected] = useState(null)
  const [traversed, setTraversed] = useState([])
  const [running, setRunning] = useState(false)
  const timer = useRef()
  const navigate = useNavigate()
  const runBfs = () => {
    clearInterval(timer.current)
    const order = ['core', ...systems.map((system) => system.id)]
    let index = 0
    setRunning(true)
    setSelected(null)
    setTraversed([])
    timer.current = setInterval(() => {
      setTraversed((current) => [...current, order[index]])
      index += 1
      if (index === order.length) {
        clearInterval(timer.current)
        setTimeout(() => setRunning(false), 900)
      }
    }, 360)
  }
  useEffect(() => () => clearInterval(timer.current), [])
  const reset = () => { clearInterval(timer.current); setRunning(false); setSelected(null); setTraversed([]) }
  const status = useMemo(() => selected ? selected.label : running ? 'BFS traversal' : 'READY', [selected, running])

  return (
    <motion.div className="systems-core glass" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.55 }}>
      <div className="core-title">distributed_systems_core.tsx</div>
      <div className="core-fallback">
        <div className="fallback-orbit fallback-orbit-one" />
        <div className="fallback-orbit fallback-orbit-two" />
        <div className="fallback-energy fallback-energy-one" />
        <div className="fallback-energy fallback-energy-two" />
        <div className="fallback-reactor-shadow" />
        <button className="fallback-core" onClick={runBfs}><span className="fallback-core-ring" /><b>ASTER</b><span>distributed systems</span></button>
        {systems.map((system, index) => <button key={system.id} className={`fallback-node fallback-node-${index} ${selected?.id === system.id ? 'is-selected' : ''} ${traversed.includes(system.id) ? 'is-traversed' : ''}`} style={{ '--node-color': system.color }} onClick={() => setSelected(system)} onMouseEnter={() => setSelected(system)}>{system.label}</button>)}
        <div className="fallback-scanline" />
      </div>
      <Canvas camera={{ position: [0, 0, 16], fov: 52 }} dpr={[1, 1.5]} shadows gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }} onCreated={({ gl }) => gl.setClearColor('#080b10', 1)}>
        <Scene selected={selected} traversed={traversed} onSelect={setSelected} onCore={runBfs} />
        <OrbitControls enablePan={false} minDistance={9} maxDistance={24} autoRotate={!selected && !running} autoRotateSpeed={0.22} enableDamping dampingFactor={0.08} />
      </Canvas>
      <button className="core-reset" onClick={reset}><RotateCcw size={13} /> Reset core view</button>
      {selected && <motion.aside className="core-inspector" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }}><button onClick={() => setSelected(null)} aria-label="Close"><X size={15} /></button><div className="eyebrow">COMPONENT INSPECTOR</div><h3>{selected.label}</h3><p>{selected.detail}</p><span>Projects</span><strong>{selected.id === 'kafka' ? 'Event-driven Systems, Online Judge' : 'API Modernization, Distributed Rate Limiter'}</strong><span>Experience</span><strong>3.8+ years</strong><span>Related technologies</span><strong>Microservices · Kafka · Spring Cloud</strong><button className="button primary" onClick={() => navigate(selected.route)}>Open skill page</button></motion.aside>}
    </motion.div>
  )
}

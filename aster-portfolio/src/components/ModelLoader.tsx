import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

type Props = { onHover: (hovered: boolean) => void; onSelect: () => void }

export default function ModelLoader({ onHover, onSelect }: Props) {
  const model = useGLTF('/models/engineering-core.glb')
  const group = useRef<THREE.Group>(null)

  useFrame(({ clock, mouse }) => {
    if (!group.current) return
    group.current.rotation.y = clock.elapsedTime * 0.12 + mouse.x * 0.08
    group.current.position.y = Math.sin(clock.elapsedTime * 1.2) * 0.08
  })

  return (
    <group ref={group} scale={2.5} onClick={(event) => { event.stopPropagation(); onSelect() }} onPointerOver={(event) => { event.stopPropagation(); onHover(true) }} onPointerOut={() => onHover(false)}>
      <primitive object={model.scene} />
    </group>
  )
}

useGLTF.preload('/models/engineering-core.glb')

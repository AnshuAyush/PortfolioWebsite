import { motion } from 'framer-motion'
import { X } from 'lucide-react'

type Props = { onClose: () => void }

export default function InfoPanel({ onClose }: Props) {
  return (
    <motion.aside className="hero3d-info" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
      <button className="hero3d-close" onClick={onClose} aria-label="Close engineering core details"><X size={15} /></button>
      <div className="eyebrow">ENGINEERING CORE</div>
      <h3>Distributed Systems Engine</h3>
      <p>A cinematic model of the systems, events, and services behind resilient software.</p>
      <dl>
        <dt>Architecture</dt><dd>Event-driven microservices</dd>
        <dt>Runtime</dt><dd>Java · Spring Boot · Kafka</dd>
        <dt>Infrastructure</dt><dd>AWS · Redis · PostgreSQL</dd>
      </dl>
    </motion.aside>
  )
}

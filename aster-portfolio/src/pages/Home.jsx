import { ArrowRight, Download } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import NavigationStack from '../components/NavigationStack'
import Hero3D from '../components/Hero3D'
export default function Home() { return <div className="hero"><div className="hero-background" aria-label="Interactive engineering knowledge graph background"><Hero3D/></div><motion.div className="hero-copy" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.55}}><div className="eyebrow">01 / software engineer</div><h1>Aster<span>.</span></h1><p className="hero-lede">Backend-focused engineer with 3.8+ years of experience building scalable distributed systems using Java, Spring Boot, Kafka, SQL/NoSQL, Cloud technologies, and Microservices.</p><div className="hero-actions"><Link to="/projects" className="button primary">Explore my graph <ArrowRight size={15}/></Link><a href="/resume.pdf" download className="button ghost"><Download size={15}/> Download resume</a></div></motion.div><div className="hero-visual"><NavigationStack/></div></div> }

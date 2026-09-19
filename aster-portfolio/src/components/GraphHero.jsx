import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { createPortal } from 'react-dom'
import { Background, Controls, Handle, Position, ReactFlow, ReactFlowProvider, useReactFlow } from 'reactflow'
import { useNavigate } from 'react-router-dom'

const pages = [
  { id: 'about', label: 'About', position: { x: 30, y: 80 } },
  { id: 'skills', label: 'Skills', position: { x: 300, y: 30 } },
  { id: 'projects', label: 'Projects', position: { x: 470, y: 190 } },
  { id: 'experience', label: 'Experience', position: { x: 285, y: 350 } },
  { id: 'contact', label: 'Contact', position: { x: 30, y: 300 } },
]

function Node({ data }) {
  const navigate = useNavigate()
  const clickTimer = useRef()
  const pressTimer = useRef()
  const finishPress = () => {
    clearTimeout(pressTimer.current)
    pressTimer.current = null
  }
  const click = () => {
    clearTimeout(clickTimer.current)
    clickTimer.current = setTimeout(() => {
      if (data.center) data.onTraverse('bfs')
      else navigate(data.path)
    }, 220)
  }
  const doubleClick = () => {
    clearTimeout(clickTimer.current)
    if (data.center) data.onTraverse('dfs')
  }
  return <div className={`flow-node ${data.center ? 'center' : ''} ${data.active ? 'traversing' : ''}`} onClick={click} onDoubleClick={doubleClick} onContextMenu={(event) => { event.preventDefault(); data.onStats() }} onPointerDown={() => { if (data.center) pressTimer.current = setTimeout(data.onCenter, 700) }} onPointerUp={finishPress} onPointerLeave={finishPress}>
    <Handle type="target" position={Position.Left} style={{ opacity: 0 }} /><span className="node-dot"/>{data.label}<Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
  </div>
}
const nodeTypes = { portfolio: Node }

function TraversalOverlay({ state, onReplay, onInsights }) {
  if (!state.mode && !state.stats) return null
  if (state.stats) return <motion.div className="graph-overlay stats-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}><div className="overlay-title">Portfolio Graph Metrics</div><div className="stats-grid"><span>Vertices<strong>6</strong></span><span>Edges<strong>5</strong></span><span>Components<strong>1</strong></span><span>Depth<strong>3</strong></span></div><button className="overlay-button" onClick={state.onClose}>Close metrics</button></motion.div>
  return <motion.div className={`graph-overlay traversal-terminal ${state.complete ? 'traversal-complete' : ''}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ opacity: { duration: state.complete ? 3.5 : .35 }, y: { duration: .35 } }}><div className="terminal-heading"><span className="status-pulse"/> {state.mode === 'dfs' ? 'DEPTH FIRST SEARCH' : 'BREADTH FIRST SEARCH'}</div><div className="terminal-log">{state.logs.map((line, index) => <div key={`${line}-${index}`} className={line.startsWith('Visited') ? 'visited-log' : ''}>{line}</div>)}{state.complete && <div className="complete-log">Traversal Complete</div>}</div>{state.complete && <><div className="node-info"><div className="overlay-title">Node Information</div><p><b>Name</b>Aster</p><p><b>Role</b>Software Development Engineer</p><p><b>Experience</b>3.8+ Years</p><p><b>Core Technologies</b>Java · Spring Boot · Kafka · Microservices · System Design</p></div><button className="overlay-button" onClick={onInsights}>{state.insights ? 'Hide Algorithm Insights' : 'Algorithm Insights'}</button>{state.insights && <div className="insights"><span>Graph Type<strong>Undirected Portfolio Graph</strong></span><span>Traversal<strong>{state.mode === 'dfs' ? 'Depth First Search' : 'Breadth First Search'}</strong></span><span>Complexity<strong>Time O(V + E) · Space O(V)</strong></span></div>}</>}<button className="overlay-button replay" onClick={onReplay}>Replay Traversal</button></motion.div>
}

function GraphCanvas() {
  const { setCenter } = useReactFlow()
  const [traversal, setTraversal] = useState({ mode: null, visited: [], logs: [], complete: false, insights: false, stats: false })
  const timer = useRef()
  const run = (mode) => {
    clearInterval(timer.current)
    const order = mode === 'dfs' ? ['home', 'about', 'skills', 'projects', 'experience', 'contact'] : ['home', 'about', 'skills', 'projects', 'experience', 'contact']
    setTraversal({ mode, visited: [], logs: ['Traversal Started...', `Queue: [${mode === 'dfs' ? 'stack' : 'About, Skills, Projects'}]`], complete: false, insights: false, stats: false })
    let index = 0
    timer.current = setInterval(() => {
      const id = order[index]
      const label = id === 'home' ? 'Home' : pages.find((page) => page.id === id).label
      const remaining = order.slice(index + 1).filter((item) => item !== 'home').map((item) => pages.find((page) => page.id === item).label)
      setTraversal((current) => ({ ...current, visited: [...current.visited, id], logs: [...current.logs, `Visited: ${label}`, remaining.length ? `${mode === 'dfs' ? 'Stack' : 'Queue'}: [${remaining.join(', ')}]` : ''] }))
      index += 1
      if (index === order.length) { clearInterval(timer.current); setTimeout(() => setTraversal((current) => ({ ...current, complete: true })), 400) }
    }, 650)
  }
  useEffect(() => () => clearInterval(timer.current), [])
  useEffect(() => {
    const focusGraph = () => {
      const graph = document.querySelector('.graph-panel')
      graph?.classList.remove('graph-focus')
      void graph?.offsetWidth
      graph?.classList.add('graph-focus')
    }
    window.addEventListener('focus-navigation-graph', focusGraph)
    return () => window.removeEventListener('focus-navigation-graph', focusGraph)
  }, [])
  useEffect(() => {
    if (!traversal.complete) return undefined
    const dismissTimer = setTimeout(() => setTraversal((current) => ({ ...current, mode: null, logs: [], complete: false, insights: false })), 4200)
    return () => clearTimeout(dismissTimer)
  }, [traversal.complete])
  const baseNodes = useMemo(() => [{ id: 'home', type: 'portfolio', data: { label: 'Aster', center: true }, position: { x: 245, y: 190 } }, ...pages.map((page) => ({ ...page, type: 'portfolio', data: { label: page.label, path: `/${page.id}` } }))], [])
  const nodes = useMemo(() => baseNodes.map((node) => ({ ...node, data: { ...node.data, active: traversal.visited.includes(node.id), onTraverse: run, onStats: () => setTraversal((current) => ({ ...current, stats: true })), onCenter: () => setCenter(300, 260, 1.25, { duration: 700 }) } })), [baseNodes, traversal.visited, setCenter])
  const edges = useMemo(() => pages.map((page) => ({ id: `home-${page.id}`, source: 'home', target: page.id, animated: true, style: { stroke: traversal.visited.includes(page.id) ? '#57d9b9' : '#365164', strokeWidth: traversal.visited.includes(page.id) ? 2.5 : 1.5 } })), [traversal.visited])
  const overlay = <TraversalOverlay state={{ ...traversal, onClose: () => setTraversal((current) => ({ ...current, stats: false })) }} onReplay={() => run(traversal.mode || 'bfs')} onInsights={() => setTraversal((current) => ({ ...current, insights: !current.insights }))}/>
  return <><ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView fitViewOptions={{ padding: .3 }} nodesDraggable={false} proOptions={{ hideAttribution: true }}><Background gap={28} size={1}/><Controls showInteractive={false}/></ReactFlow>{typeof document !== 'undefined' && createPortal(overlay, document.body)}</>
}

export default function GraphHero() {
  return <motion.div className="graph-panel glass" initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .6 }}><ReactFlowProvider><GraphCanvas/></ReactFlowProvider></motion.div>
}

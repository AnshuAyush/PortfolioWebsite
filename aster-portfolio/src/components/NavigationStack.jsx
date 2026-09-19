// import { AnimatePresence, motion } from 'framer-motion'
// import { ChevronRight, CornerDownRight, Layers3 } from 'lucide-react'
// import { Link, useLocation } from 'react-router-dom'

// const routeStacks = {
//   '/': [{ label: 'Home', path: '/' }],
//   '/about': [{ label: 'Home', path: '/' }, { label: 'About', path: '/about' }],
//   '/skills': [{ label: 'Home', path: '/' }, { label: 'Skills', path: '/skills' }],
//   '/projects': [{ label: 'Home', path: '/' }, { label: 'Projects', path: '/projects' }, { label: 'Online Judge', path: '/projects' }],
//   '/experience': [{ label: 'Home', path: '/' }, { label: 'Experience', path: '/experience' }],
//   '/contact': [{ label: 'Home', path: '/' }, { label: 'Contact', path: '/contact' }],
// }

// export default function NavigationStack() {
//   const { pathname } = useLocation()
//   const stack = routeStacks[pathname] || routeStacks['/']
//   const handleStackClick = (event, path) => {
//     if (path !== '/' || pathname !== '/') return
//     event.preventDefault()
//     const graph = document.querySelector('.graph-panel')
//     if (!graph) return
//     const top = graph.getBoundingClientRect().top + window.scrollY - (window.innerHeight - graph.offsetHeight) / 2
//     window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
//     window.dispatchEvent(new CustomEvent('focus-navigation-graph'))
//   }

//   return <motion.section className="navigation-stack glass" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2 }}>
//     <div className="stack-heading"><div><div className="stack-label"><Layers3 size={14}/> EXECUTION STACK</div><p>Current traversal path</p></div><span className="stack-status"><i/> ACTIVE</span></div>
//     <div className="stack-rows" aria-label="Current navigation stack">
//       <AnimatePresence mode="popLayout" initial={false}>
//         {stack.map((item, index) => {
//           const active = index === stack.length - 1
//           return <motion.div className={`stack-line ${active ? 'active' : 'dimmed'}`} key={`${item.label}-${index}`} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} transition={{ duration: .22, delay: index * .04 }}>
//             {index > 0 ? <CornerDownRight size={14} className="stack-branch"/> : <span className="stack-index">{String(index + 1).padStart(2, '0')}</span>}
//             <Link to={item.path} onClick={(event) => handleStackClick(event, item.path)}><span className="stack-node">[ {item.label} ]</span></Link>
//             {active && <ChevronRight size={13} className="stack-caret"/>}
//           </motion.div>
//         })}
//       </AnimatePresence>
//     </div>
//   </motion.section>
// }

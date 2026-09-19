import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const links = [['About', '/about'], ['Skills', '/skills'], ['Projects', '/projects'], ['Experience', '/experience'], ['Contact', '/contact']]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  return <header className="nav">
    <NavLink to="/" className="brand" onClick={() => setOpen(false)}><span className="brand-mark">A</span><span>aster<span style={{color:'#57d9b9'}}>.dev</span></span></NavLink>
    <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <X size={20}/> : <Menu size={20}/>}</button>
    <nav className={`nav-links ${open ? 'open' : ''}`}>{links.map(([label, path]) => <NavLink key={path} to={path} onClick={() => setOpen(false)}>{label}</NavLink>)}</nav>
  </header>
}

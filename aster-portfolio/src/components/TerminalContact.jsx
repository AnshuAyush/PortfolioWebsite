import { useState } from 'react'
import { Download, ExternalLink, Mail } from 'lucide-react'
const outputs = {
  help: `Available commands:
  email      show my email address
  linkedin   open my LinkedIn profile
  github     open my GitHub profile
  resume     download my resume
  clear      clear the terminal`,
  email: 'You can reach me at anshuayush2002@gmail.com',
  linkedin: 'You can reach me on LinkedIn: linkedin.com/in/anshu-ayush/',
  github: 'You can reach me on GitHub: github.com/AnshuAyush',
}
const contactUrls = { email: 'mailto:anshuayush2002@gmail.com', linkedin: 'https://linkedin.com/in/anshu-ayush/', github: 'http://github.com/AnshuAyush' }
export default function TerminalContact() { const [history, setHistory] = useState(['Welcome to aster.dev terminal.', 'Type “help” to see available commands.']); const [value, setValue] = useState(''); const run = (event) => { event.preventDefault(); const command = value.trim().toLowerCase(); if (command === 'clear') setHistory([]); else if (command === 'resume') { setHistory([...history, `$ ${command}`, 'Downloading resume.pdf...']); const a = document.createElement('a'); a.href = '/resume.pdf'; a.download = 'Aster-Resume.pdf'; a.click(); setTimeout(() => setHistory((current) => [...current, 'Downloaded resume.pdf']), 650) } else if (command) { setHistory([...history, `$ ${command}`, outputs[command] || `command not found: ${command}`]); if (contactUrls[command]) window.open(contactUrls[command], command === 'email' ? '_self' : '_blank', 'noopener,noreferrer') } setValue('') }; return <div className="terminal glass"><div className="terminal-output">{history.map((line, i) => <div key={i} className={line.startsWith('aster') || line.includes('aster.') ? 'accent' : ''}>{line}</div>)}</div><form className="terminal-form" onSubmit={run}><label>contact@aster.dev:~$</label><input autoFocus value={value} onChange={e => setValue(e.target.value)} aria-label="Terminal command"/></form></div> }
export function ContactLinks() { return <div className="contact-aside glass"><h3>Open channels</h3><a className="contact-link" href="mailto:anshuayush2002@gmail.com"><Mail size={16}/> anshuayush2002@gmail.com</a><a className="contact-link" href="https://linkedin.com/in/anshu-ayush/" target="_blank" rel="noreferrer"><ExternalLink size={16}/> LinkedIn / anshu-ayush</a><a className="contact-link" href="http://github.com/AnshuAyush" target="_blank" rel="noreferrer"><ExternalLink size={16}/> GitHub / AnshuAyush</a><a className="contact-link" href="/resume.pdf" download><Download size={16}/> Download resume.pdf</a></div> }

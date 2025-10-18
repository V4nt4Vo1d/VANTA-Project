import { motion } from 'framer-motion'
import { StatusBadge } from './StatusBadge'
import type { Project } from '../data/projects'

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.a
      href={project.href}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-5 hover:border-white/20"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition" style={{
        background:
          'radial-gradient(600px circle at var(--x,50%) var(--y,50%), color-mix(in oklab, var(--accent), transparent 80%), transparent 40%)',
      }} />
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold leading-tight">{project.title}</h3>
        <StatusBadge status={project.status} />
      </div>
      <p className="mt-2 text-sm text-zinc-400">{project.blurb}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.tags.map((t) => (
          <span key={t} className="text-xs rounded-full border border-white/10 bg-black/40 px-2 py-1 text-zinc-300">{t}</span>
        ))}
      </div>
    </motion.a>
  )
}

// Hover glow helper (sets CSS vars --x / --y)
if (typeof window !== 'undefined') {
  window.addEventListener('pointermove', (e) => {
    const target = (e.target as HTMLElement)?.closest?.('.group')
    if (!target) return
    const rect = (target as HTMLElement).getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    ;(target as HTMLElement).style.setProperty('--x', `${x}%`)
    ;(target as HTMLElement).style.setProperty('--y', `${y}%`)
  })
}
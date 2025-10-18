export function StatusBadge({ status }: { status: ProjectStatus }) {
  const classes = (() => {
    switch (status) {
      case 'Live': return 'border-emerald-400/40 text-emerald-300 bg-emerald-400/10'
      case 'Beta': return 'border-sky-400/40 text-sky-300 bg-sky-400/10'
      case 'Alpha': return 'border-cyan-400/40 text-cyan-300 bg-cyan-400/10'
      case 'Prototype': return 'border-purple-400/40 text-purple-300 bg-purple-400/10'
      case 'WIP': return 'border-amber-400/40 text-amber-300 bg-amber-400/10'
      case 'Concept': return 'border-fuchsia-400/40 text-fuchsia-300 bg-fuchsia-400/10'
      default: return 'border-zinc-400/40 text-zinc-300 bg-zinc-400/10'
    }
  })()
  return <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs border ${classes}`}>{status}</span>
}

export type ProjectStatus = 'Idea' | 'WIP' | 'Alpha' | 'Beta' | 'Prototype' | 'Shipped' | 'Concept' | 'Live'
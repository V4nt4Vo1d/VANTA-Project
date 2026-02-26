import { useState, useRef, useEffect } from 'react'

export default function HelpDropdown() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-xl border border-white/10 px-3 py-1.5 text-sm hover:border-white/20 flex items-center gap-2"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        Help
        <svg
          width="14"
          height="14"
          viewBox="0 0 20 20"
          fill="none"
          className={`${open ? 'rotate-180' : ''} transition-transform`}
        >
          <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 rounded-xl bg-black/80 border border-white/10 p-3 shadow-lg z-40">
          <p className="text-sm text-zinc-300">Lost in the void? Quick links and troubleshooting.</p>
          <ul className="mt-3 space-y-2">
            <li>
              <a href="help.html" className="block text-sm text-zinc-200 hover:bg-white/5 rounded px-2 py-1">
                Full help page
              </a>
            </li>
            <li>
              <a href="suggestions.html" className="block text-sm text-zinc-200 hover:bg-white/5 rounded px-2 py-1">
                Suggestions page
              </a>
            </li>
            <li>
              <a href="#contact" className="block text-sm text-zinc-200 hover:bg-white/5 rounded px-2 py-1">
                Contact
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}

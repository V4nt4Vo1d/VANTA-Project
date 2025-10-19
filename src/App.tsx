import { useState, useEffect, useMemo } from 'react'
import { DeltaBackdrop } from './components/DeltaBackdrop'
import { Hero } from './components/Hero'
import { ProjectCard } from './components/ProjectCard'
import { CATEGORIES, NAV, LOGO_SRC, type Category } from './data/constants'
import { PROJECTS } from './data/projects'

export default function App() {
  // existing state
  const [category, setCategory] = useState<Category>('All')
  const [query, setQuery] = useState('')

  // NEW: mobile menu state
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const filtered = useMemo(
    () =>
      PROJECTS.filter(
        (p) =>
          (category === 'All' || p.category === category) &&
          (p.title.toLowerCase().includes(query.toLowerCase()) ||
            p.blurb.toLowerCase().includes(query.toLowerCase()) ||
            p.tags.join(' ').toLowerCase().includes(query.toLowerCase()))
      ),
    [category, query]
  )

  return (
    <div className="min-h-screen text-zinc-200 bg-[#0a0a0f]">
      <DeltaBackdrop />

      {/* HEADER with mobile menu */}
      <header className="sticky top-0 z-30 border-b border-white/10 backdrop-blur supports-[backdrop-filter]:bg-black/40">
        <nav
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
          aria-label="Main"
        >
          {/* Brand */}
          <a href="#" className="flex items-center gap-3 min-w-0">
            <img src={LOGO_SRC} alt="VANT∆" className="h-10 w-10 object-contain shrink-0" />
            {/* Keep title hidden on small screens to prevent collision */}
            <span className="hidden sm:block font-semibold tracking-widest text-sm truncate">
              THE VANT∆ PROJECT
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-4">
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`} className="text-sm text-zinc-300 hover:text-white transition">
                {n.label}
              </a>
            ))}
            <a
              href="https://github.com/v4nt4vo1d"
              className="rounded-xl border border-white/10 px-3 py-1.5 text-sm hover:border-white/20"
            >
              GitHub
            </a>
          </div>

          {/* Mobile hamburger */}
          <div className="sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 p-2 hover:border-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-controls="mobile-menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? (
                // Close icon
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ) : (
                // Hamburger icon
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* Mobile slide-down panel */}
        <div
          id="mobile-menu"
          className={`sm:hidden overflow-hidden transition-[max-height] duration-300 ${menuOpen ? 'max-h-96' : 'max-h-0'}`}
        >
          <div className="px-4 pb-4 pt-2 border-t border-white/10 bg-black/60 backdrop-blur supports-[backdrop-filter]:bg-black/40">
            <div className="flex flex-col gap-2">
              {NAV.map((n) => (
                <a
                  key={n.id}
                  href={`#${n.id}`}
                  className="rounded-lg px-3 py-2 text-sm text-zinc-200 hover:bg-white/5"
                  onClick={() => setMenuOpen(false)}
                >
                  {n.label}
                </a>
              ))}
              <a
                href="https://github.com/v4nt4vo1d"
                className="rounded-lg px-3 py-2 text-sm text-zinc-200 hover:bg-white/5"
                onClick={() => setMenuOpen(false)}
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main>
        <Hero />

        <section id="projects" className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Projects</h2>
              <p className="text-zinc-400 mt-1">
                A living portfolio. Here are all my current projects, in progress and completed.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects…"
                className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm w-48 sm:w-64"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {filtered.map((p, i) => (
              <ProjectCard key={p.title} project={p} index={i} />
            ))}
          </div>
        </section>

        <section
          id="about"
          className="relative flex flex-col items-center justify-center mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 text-center"
        >
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-4">
              About the Project
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              The VANT∆ Project is a unified space for experiments in full-stack web development,
              networking, and web utilities. I’m at the beginning of my
              full-stack development journey, building on a foundation in networking,
              security, and systems design. The VANT∆ Project is my living portfolio, a
              space to explore how the principles of infrastructure translate into the
              creative side of the web. My goal is to grow from what I already know about systems
              into crafting the systems themselves and turning years of technical
              groundwork into a new layer of development and design.
            </p>
          </div>
        </section>



        {/* <section id="about" className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="grid md:grid-cols-3 gap-10 items-start">
            <div className="md:col-span-2">
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">About the Project</h2>
              <p className="mt-3 text-zinc-300 leading-relaxed">
                The VANT∆ Project is a unified space for experiments in full-stack web, network tooling, and game-adjacent
                utilities. I’m at the beginning of my full-stack development journey, building on a foundation in networking,
                security, and systems design. The VANT∆ Project is my living portfolio, a space to explore how the
                principles of infrastructure translate into the creative side of software. Each build here reflects that
                blend of logic and curiosity: connecting networks, interfaces, and ideas through hands-on experimentation. My
                goal is to grow from what I already know about systems into crafting the systems themselves and turning years
                of technical groundwork into a new layer of development and design.
              </p>
              <p className="mt-3 text-zinc-400">- VANT∆</p>
            </div>
            <div className="rounded-2xl border border-white/10 p-6 bg-white/[0.03]">
              <h3 className="font-medium">Stack & Focus</h3>
              <ul className="mt-3 space-y-2 text-sm text-zinc-300">
                <li>• React + TypeScript + Tailwind</li>
                <li>• Lightweight animations via Framer Motion</li>
                <li>• JSON-driven projects data; future: GitHub API</li>
                <li>• Accessibility and PWA on the roadmap</li>
              </ul>
            </div>
          </div>
        </section>*/}

        <section id="contact" className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="rounded-2xl border border-white/10 p-8 bg-white/[0.03]">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Let’s collaborate</h2>
                <p className="mt-2 text-zinc-400">Have an idea, a suggestion, or a feature request? Ping me.</p>
              </div>
              <div className="flex items-center gap-3">
                <a href="mailto:v4nt4vo1d@gmail.com" className="rounded-xl border border-white/10 px-4 py-2 hover:border-white/20" target="_blank" rel="noopener noreferrer">
                  Email
                </a>
                <a href="https://github.com/v4nt4vo1d" className="rounded-xl border border-white/10 px-4 py-2 hover:border-white/20" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/jacob-r-2228a8206?trk=people-guest_people_search-card"
                  className="rounded-xl border border-white/10 px-4 py-2 hover:border-white/20"
                  target="_blank" rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
                <br />
                <a
                href={`${import.meta.env.BASE_URL}resume.html`}
                className="rounded-xl border border-white/10 px-4 py-2 hover:border-white/20"
              >
                Résumé
              </a>

              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-10 text-center text-xs text-zinc-500">
        <p>© {new Date().getFullYear()} THE VANT∆ PROJECT · Built with curiosity, caffeine, and mistakes.</p>
      </footer>
    </div>
  )
}
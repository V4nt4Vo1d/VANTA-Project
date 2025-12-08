import { useState, useEffect, useMemo } from 'react'
import { DeltaBackdrop } from './components/DeltaBackdrop'
import { Hero } from './components/Hero'
import { ProjectCard } from './components/ProjectCard'
import { CATEGORIES, NAV, LOGO_SRC, type Category } from './data/constants'
import { PROJECTS } from './data/projects'
import DiscordStatus from "./components/DiscordStatus";
import { supabase } from "./supabaseClient";
import { supabase as supabaseClient } from "./supabaseClient";

// Disabled Logout Logic for front page but keeping for future use

// import VantaLogin from "./components/VantaLogin"; 



export default function App() {

  const [category, setCategory] = useState<Category>('All')
  const [query, setQuery] = useState('')

  
  const [menuOpen, setMenuOpen] = useState(false)


  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);


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

    if (authLoading) return null;

    //Disabled Logout Logic for front page but keeping for future use

    // if (!session) {
    //   return <VantaLogin onAuthenticated={() => window.location.reload()} />;
    // }
    // async function handleLogout() {
    //   await supabase.auth.signOut();
    //   window.location.reload();
    // }

    return (

    <div className="min-h-screen text-zinc-200 bg-[#0a0a0f] overflow-x-clip">
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
              rel="noopener noreferrer"
              target="_blank"
            >
              GitHub
            </a>
            <a
              href="streams.html"
              className="rounded-xl border border-white/10 px-3 py-1.5 text-sm hover:border-white/20"
            >
              Streams
            </a>

            {/* Disabled Logout Button for front page but keeping for future use */}

            {/* <button
              onClick={handleLogout}
              className="rounded-xl border border-red-500/40 px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10 transition"
            >
              Logout
            </button> */}

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
                rel="noopener noreferrer"
                target="_blank"
                onClick={() => setMenuOpen(false)}
              >
                GitHub
              </a>
              <a
              href="under-construction.html"
              className="rounded-xl border border-white/10 px-3 py-1.5 text-sm hover:border-white/20"
            >
              New Stuff!!
            </a>

              {/* Disabled Logout Button for front page but keeping for future use */}
            {/* <button
              onClick={() => { handleLogout(); setMenuOpen(false); }}
              className="rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 text-left"
            >
              Logout
            </button> */}

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
              networking, security, and web utilities. I’m at the beginning of my
              full-stack development journey, building on a foundation in networking,
              security, and systems design. The VANT∆ Project is my living portfolio, a
              space to explore how the principles of infrastructure translate into the
              creative side of the web. My goal is to grow from what I already know about systems
              into crafting the systems themselves and turning years of technical
              groundwork into a new layer of development and design.
            </p>
          </div>
        </section>

        <section id="contact" className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="rounded-2xl border border-white/10 p-8 bg-white/[0.03]">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Here are some links to connect!</h2>
                <p className="mt-2 text-zinc-400">If you have any questions or want to connect, feel free to reach out.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3 [overflow-wrap:anywhere]">
                <a href="https://discord.com/users/347416011928240128" className="rounded-xl border border-white/10 px-4 py-2 hover:border-white/20" target="_blank" rel="noopener noreferrer">
                  Discord
                </a>
                <a href="https://github.com/v4nt4vo1d" className="rounded-xl border border-white/10 px-4 py-2 hover:border-white/20" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
                <a href="mailto:v4nt4vo1d@gmail.com" className="rounded-xl border border-white/10 px-4 py-2 hover:border-white/20" target="_blank" rel="noopener noreferrer">
                  Email
                </a>
                <a href="https://tryhackme.com/p/VANTA" className="rounded-xl border border-white/10 px-4 py-2 hover:border-white/20" target="_blank" rel="noopener noreferrer">
                  TryHackMe
                </a>
                <a href="https://www.twitch.tv/vantaxxtv" className="rounded-xl border border-white/10 px-4 py-2 hover:border-white/20" target="_blank" rel="noopener noreferrer">
                  Twitch
                </a>
                <a href="https://www.youtube.com/@VANTAxxTV" className="rounded-xl border border-white/10 px-4 py-2 hover:border-white/20" target="_blank" rel="noopener noreferrer">
                  YouTube
                </a>
                <a
                  href="https://www.linkedin.com/in/jacob-r-2228a8206?trk=people-guest_people_search-card"
                  className="rounded-xl border border-white/10 px-4 py-2 hover:border-white/20"
                  target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
                <a
                href={`${import.meta.env.BASE_URL}resume.html`}
                className="rounded-xl border border-white/10 px-4 py-2 hover:border-white/20">
                Résumé
              </a>
              </div>
              <div className="mt-6 w-full max-w-sm space-y-3">
                <DiscordStatus discordId="347416011928240128" />

                <iframe src="https://tryhackme.com/api/v2/badges/public-profile?userPublicId=1887232"
                className="w-full rounded-xl outline-none focus:outline-none"
                scrolling="no">
                </iframe>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-10 text-center text-xs text-zinc-500">
        <p>© {new Date().getFullYear()} THE VANT∆ PROJECT</p>
      </footer>
    </div>
  )
}
import { motion } from 'framer-motion'
import { LOGO_SRC } from '../data/constants'

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-5xl font-black tracking-tight"
            >
              THE VANT<span className="text-[color:var(--accent)]">∆</span> PROJECT
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="mt-4 text-zinc-300 max-w-prose"
            >
              A portfolio of experiments in web development, networking, and applications. Some basic pages work today; others
              are a work in progress and are not yet functional.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-8 flex items-center gap-3"
            >
              <a
                href="#projects"
                className="rounded-xl bg-[color:var(--accent)]/10 border border-[color:var(--accent)]/40 px-4 py-2 text-sm hover:bg-[color:var(--accent)]/20"
              >
                Explore Projects
              </a>
              <a
                href="https://github.com/v4nt4vo1d"
                className="rounded-xl border border-white/10 px-4 py-2 text-sm hover:border-white/20"
              >
                View GitHub
              </a>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-[4/3] w-full rounded-2xl border border-white/10 overflow-hidden bg-white/[0.02]">
              <div className="absolute inset-0 pointer-events-none" style={{
                background:
                  'radial-gradient(600px circle at 20% 30%, color-mix(in oklab, var(--accent), transparent 86%), transparent 40%),' +
                  'radial-gradient(600px circle at 80% 70%, color-mix(in oklab, var(--accent2), transparent 86%), transparent 40%)',
              }} />
              <div className="h-full w-full grid place-items-center">
                <img src={LOGO_SRC} alt="VANT∆ logo" className="h-56 sm:h-72 lg:h-80 opacity-95 w-auto" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
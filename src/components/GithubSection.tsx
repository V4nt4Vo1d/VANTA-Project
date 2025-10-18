import { useGithub, type GithubRepo } from '../hooks/useGithub'
import { motion } from 'framer-motion'

function RepoItem({ repo, i }: { repo: GithubRepo; i: number }) {
  return (
    <motion.a
      href={repo.html_url}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.03 }}
      className="block rounded-xl border border-white/10 p-4 hover:border-white/20 bg-white/[0.02]"
    >
      <div className="flex items-center justify-between gap-4">
        <h4 className="font-medium">{repo.name}</h4>
        <div className="text-xs text-zinc-400 whitespace-nowrap">
          ⭐ {repo.stargazers_count} · 🍴 {repo.forks_count}
        </div>
      </div>
      {repo.description && <p className="text-sm text-zinc-400 mt-1">{repo.description}</p>}
      <div className="mt-3 text-xs text-zinc-500 flex gap-3">
        {repo.language && <span className="border border-white/10 rounded-full px-2 py-0.5">{repo.language}</span>}
        <span>Updated {new Date(repo.updated_at).toLocaleDateString()}</span>
      </div>
    </motion.a>
  )
}

export function GithubSection() {
  const { user, repos, loading, error } = useGithub()

  return (
    <section id="github" className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">GitHub</h2>
          <p className="text-zinc-400 mt-1">Auto‑pulled profile and repos, sorted by recent activity.</p>
        </div>
        {user && (
          <a href={user.html_url} target="_blank" rel="noreferrer" className="text-sm text-zinc-300 hover:text-white">
            View Profile →
          </a>
        )}
      </div>

      {loading && <p className="mt-6 text-zinc-400">Fetching from GitHub…</p>}
      {error && <p className="mt-6 text-red-400">GitHub error: {error}</p>}

      {user && (
        <div className="mt-8 flex items-center gap-5 rounded-2xl border border-white/10 p-5 bg-white/[0.03]">
          <img
            src={user.avatar_url}
            alt={user.login}
            className="h-16 w-16 rounded-full border border-white/10"
            loading="lazy"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium">{user.name ?? user.login}</h3>
              <span className="text-xs text-zinc-400">@{user.login}</span>
            </div>
            {user.bio && <p className="text-sm text-zinc-400 mt-1">{user.bio}</p>}
            <p className="text-xs text-zinc-500 mt-1">
              {user.followers} followers · {user.following} following · {user.public_repos} public repos
            </p>
          </div>
        </div>
      )}

      {repos && repos.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
          {repos.map((r, i) => <RepoItem key={r.id} repo={r} i={i} />)}
        </div>
      )}
    </section>
  )
}
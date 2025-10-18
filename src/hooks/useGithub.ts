// src/hooks/useGithub.ts
import { useEffect, useState } from 'react'
import { GITHUB_USER, PINNED_REPOS, BLOCK_REPOS, MAX_REPOS } from '../data/constants'

type GithubUser = {
  avatar_url: string
  html_url: string
  login: string
  name: string | null
  bio: string | null
  followers: number
  following: number
  public_repos: number
}

export type GithubRepo = {
  id: number
  name?: string
  full_name?: string
  html_url: string
  description: string | null
  stargazers_count: number
  forks_count: number
  language: string | null
  updated_at: string
  archived: boolean
  fork: boolean
  topics?: string[]
}

export function useGithub() {
  const [user, setUser] = useState<GithubUser | null>(null)
  const [repos, setRepos] = useState<GithubRepo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function fetchAll() {
      setLoading(true)
      setError(null)
      try {
        const headers: Record<string, string> = {
          Accept: 'application/vnd.github+json',
          // 'X-GitHub-Api-Version': '2022-11-28', //
        }

        // ---- User ----
        const ures = await fetch(`https://api.github.com/users/${GITHUB_USER}`, { headers })
        if (!ures.ok) throw new Error(`User request failed: ${ures.status}`)
        const udata: GithubUser = await ures.json()

        // ---- Repos ----
        const rres = await fetch(
          `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=100`,
          { headers }
        )
        if (!rres.ok) throw new Error(`Repos request failed: ${rres.status}`)
        let rdata: GithubRepo[] = await rres.json()

        // Hygiene filters (forks/archived/no name)
        rdata = rdata.filter(r => !r.fork && !r.archived && !!r.name && !!r.html_url)

        // ---- Blocklist (by name or owner/name) ----
        if (BLOCK_REPOS.length) {
          const block = new Set(BLOCK_REPOS.map(s => s.toLowerCase()))
          rdata = rdata.filter(r => {
            const name = r?.name?.toLowerCase?.() || ''
            const full = r?.full_name?.toLowerCase?.() || ''
            return !block.has(name) && !block.has(full)
          })
        }

        // ---- Allowlist (pinned) ----
        // If PINNED_REPOS has entries, show ONLY those, in that exact order.
        if (PINNED_REPOS.length) {
          const pinOrder = PINNED_REPOS.map(s => s.toLowerCase())
          const byKey = new Map<string, GithubRepo>()
          for (const repo of rdata) {
            const name = repo?.name?.toLowerCase?.() || ''
            const full = repo?.full_name?.toLowerCase?.() || ''
            if (name) byKey.set(name, repo)
            if (full) byKey.set(full, repo)
            const ownerName = repo?.html_url?.split?.('github.com/')[1]?.toLowerCase?.() || ''
            if (ownerName) byKey.set(ownerName, repo)
          }
          rdata = pinOrder.map(key => byKey.get(key)).filter(Boolean) as GithubRepo[]
        }

        // ---- Clamp ----
        if (typeof MAX_REPOS === 'number') rdata = rdata.slice(0, MAX_REPOS)

        if (!cancelled) {
          setUser(udata)
          setRepos(rdata)
          setLoading(false)
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message ?? 'Unknown GitHub error')
          setLoading(false)
        }
      }
    }
    fetchAll()
    return () => { cancelled = true }
  }, [])

  return { user, repos, loading, error }
}

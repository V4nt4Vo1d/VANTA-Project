export const LOGO_SRC = `${import.meta.env.BASE_URL}logo-vanta.svg`
export const NAV = [
  { id: 'projects', label: 'Projects' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
] as const

export const CATEGORIES = ['All', 'Web', 'Applications', 'Security'] as const
export type Category = typeof CATEGORIES[number]

export const GITHUB_USER = 'v4nt4vo1d'

// Show only these, in this order.
export const PINNED_REPOS: string[] = [
  // 'v4nt4vo1d/odin-recipies',
  // 'foundations-flexbox-landingpage',
  // 'TACNET',
  // 'THE VANT∆ PROJECT',
];


export const BLOCK_REPOS: string[] = [
  // 'old-test',
  // 'sandbox',
];

export const MAX_REPOS = 12;

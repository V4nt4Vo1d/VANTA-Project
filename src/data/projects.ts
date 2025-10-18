import type { Category } from './constants'
import type { ProjectStatus } from '../components/StatusBadge'

export type Project = {
  title: string
  blurb: string
  tags: string[]
  href: string
  status: ProjectStatus
  category: Category | 'Game-tools' | string
}

export const PROJECTS: Project[] = [
  {
    title: 'Odin Recipies',
    blurb: 'A clean, hand-coded HTML site that lists a few favorite recipes—built from scratch to sharpen my basics in structure, linking, and Git workflow.',
    tags: ['HTML', 'CSS', 'Git'],
    href: 'https://v4nt4vo1d.github.io/odin-recipes/',
    status: 'Live',
    category: 'Web',
  },
  {
    title: 'Foundations Landing Page',
    blurb: 'A custom landing page built from the ground up with HTML and CSS, focused on layout design, flexbox, and bringing a polished, professional look to a static site.',
    tags: ['HTML', 'CSS', 'Flexbox'],
    href: 'https://v4nt4vo1d.github.io/foundations-flexbox-landingpage/',
    status: 'Live',
    category: 'Web',
  },
  {
    title: 'TACNET',
    blurb: 'A dynamic web app inspired by Star Citizen, designed to manage ships and systems, interactively—built to progressively explore JavaScript logic, modular UI design, API integration, and feature full-stack integration.',
    tags: ['JavaScript', 'API', 'Full-Stack'],
    href: 'https://tacnet.space',
    status: 'Concept',
    category: 'Web',
  },
  {
    title: 'The Vant∆ Project',
    blurb: 'An evolving personal portfolio built as an interactive web app, designed to grow alongside my skills and projects while exploring modern front-end structure, data integration, and creative UI design.',
    tags: ['TypeScript', 'front-end', 'Security'],
    href: 'https://vantaproject.space',
    status: 'Beta',
    category: 'Web',
  },
]
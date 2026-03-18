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
  // {
  //   title: 'Odin Recipies',
  //   blurb: 'A clean, hand-coded HTML site that lists a few favorite recipes—built from scratch to sharpen my basics in structure, linking, and Git workflow.',
  //   tags: ['HTML', 'CSS', 'Git'],
  //   href: './odin-recipes/index.html',
  //   status: 'Live',
  //   category: 'Web',
  // },
  // {
  //   title: 'Foundations Landing Page',
  //   blurb: 'A custom landing page built from the ground up with HTML and CSS, focused on layout design, flexbox, and bringing a polished, professional look to a static site.',
  //   tags: ['HTML', 'CSS', 'Flexbox'],
  //   href: './foundations-flexbox-landingpage/index.html',
  //   status: 'Live',
  //   category: 'Web',
  // },
  //   {
  //   title: 'The VANT∆ Project',
  //   blurb: 'An evolving personal portfolio built as an interactive web app, designed to grow alongside my skills and projects while exploring modern front-end structure, data integration, and creative UI design.',
  //   tags: ['TypeScript', 'Front-end', 'Security'],
  //   href: '#',
  //   status: 'Beta',
  //   category: 'Web',
  // },
  {
    title: 'Project Hub',
    blurb: 'A collection of small, focused web projects designed to explore front-end concepts, layouts, API calls, and interactive features—built to hone my skills in HTML, CSS, TypeScript, and JavaScript through practical applications.',
    tags: ['HTML', 'CSS', 'JavaScript', 'TypeScript'],
    href: 'https://projects.vantaproject.space',
    status: 'Live',
    category: 'Web',
  },
  {
    title: 'Fahxey',
    blurb: 'A website built for Fahxey – a Twitch streamer and content creator, designed to showcase their brand and content while showcasing examples of my skills in front-end development, UI design, and API integration.',
    tags: ['TypeScript', 'UI'],
    href: 'https://fahxey.com',
    status: 'Beta',
    category: 'Web',
  },
  {
    title: 'Rocket League',
    blurb: 'A website to showcase NRG (Not Really Good) Rocket League stats, built to explore API integration, and data visualization, while creating a useful tool for tracking personal and team in-game performance.',
    tags: ['TypeScript', 'UI'],
    href: 'https://rl.vantaproject.space',
    status: 'Beta',
    category: 'Web',
  },
  {
    title: 'Settings Helper',
    blurb: 'Coming soon – a browser-based utility used to centralize settings across various platforms, providing a unified interface for locating preferences and settings.',
    tags: ['TypeScript', 'UI'],
    href: 'https://settings.vantaproject.space',
    status: 'Concept',
    category: 'Web',
  },
  {
    title: 'Weather Widget',
    blurb: 'Coming soon – a lightweight, minimalist display intended for digital signage or dashboard use, fetching live weather data and presenting current conditions alongside a clean, responsive layout to illustrate real‑time API integration.',
    tags: ['API', 'CSS'],
    href: '/under-construction.html',
    status: 'Coming Soon',
    category: 'Applications',
  },
  {
    title: 'Network Monitor',
    blurb: 'Coming soon – a web application that will render graphical views of local network activity, show connected devices and traffic stats in real‑time, and serve as a learning exercise in React, TypeScript, and websockets.',
    tags: ['React', 'TypeScript'],
    href: '/under-construction.html',
    status: 'Coming Soon',
    category: 'Web',
  },
  // {
  //   title: 'TACNET',
  //   blurb: 'A dynamic web app inspired by Star Citizen, designed to manage ships and systems, interactively—built to progressively explore JavaScript logic, modular UI design, API integration, and feature full-stack integration.',
  //   tags: ['JavaScript', 'API', 'Full-Stack'],
  //   href: 'https://tacnet.space',
  //   status: 'Concept',
  //   category: 'Applications',
  // },

]
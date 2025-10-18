export function DeltaBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0" style={{
        background: `
          radial-gradient(1200px 600px at 20% -20%, color-mix(in oklab, var(--accent), transparent 92%), transparent),
          radial-gradient(1200px 600px at 120% 20%, color-mix(in oklab, var(--accent2), transparent 92%), transparent),
          repeating-linear-gradient(
            45deg,
            color-mix(in oklab, white, transparent 96%) 0px,
            transparent 2px,
            transparent 24px
          )
        `,
      }} />
      <div className="absolute inset-0 opacity-[0.035]" style={{
        backgroundImage: `
          radial-gradient(circle at 50% 50%, transparent 0 24px, currentColor 24px 25px, transparent 25px),
          radial-gradient(circle at 0 0, currentColor 0 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px, 96px 96px',
        color: '#0ff',
        maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
      }} />
      <svg className="absolute inset-0 w-full h-full opacity-[0.06]">
        <defs>
          <pattern id="delta" width="60" height="60" patternUnits="userSpaceOnUse">
            <text x="8" y="44" fontSize="44" fontFamily="ui-sans-serif, system-ui">∆</text>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#delta)" />
      </svg>
    </div>
  )
}
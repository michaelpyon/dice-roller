import { useEffect, useRef } from 'react'

const projects = [
  {
    name: 'Subway Shame',
    tagline: 'Is my train fucked? NYC subway shame scores with live MTA data.',
    stack: ['Python', 'Flask', 'MTA API'],
    status: 'Live on Railway',
    color: 'var(--color-subway)',
    url: 'https://subway.pyon.dev',
  },
  {
    name: 'ShooterDigest',
    tagline: 'Weekly FPS intelligence. Steam concurrents, Reddit sentiment, press coverage.',
    stack: ['Python', 'Flask', 'Steam API', 'Reddit API'],
    status: 'Live on Railway',
    color: 'var(--color-shooter)',
    url: 'https://shooter.pyon.dev',
  },
  {
    name: 'VintageMap',
    tagline: 'Enter a year, see global wine quality ratings by region.',
    stack: ['React', 'Next.js', 'Tailwind'],
    status: 'Live on Railway',
    color: 'var(--color-vintage)',
    url: 'https://vintage.pyon.dev',
  },
  {
    name: 'MassageOS',
    tagline: 'Massage booking with an anatomical body map. Click where it hurts.',
    stack: ['React', 'Next.js', 'Tailwind'],
    status: 'Live on Railway',
    color: 'var(--color-massage)',
    url: 'https://massage.pyon.dev',
  },
  {
    name: 'Random Pin Cuisine',
    tagline: 'Drop a pin anywhere on Earth. Find that cuisine in NYC.',
    stack: ['React', 'Next.js', 'Google Maps API'],
    status: 'Deploying soon',
    color: 'var(--color-pin)',
    url: 'https://pin.pyon.dev',
  },
]

function Card({ project, index }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
          observer.unobserve(el)
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <a
      ref={ref}
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-lg border border-border bg-surface p-6 transition-all duration-300 hover:bg-surface-hover hover:border-transparent group"
      style={{
        opacity: 0,
        transform: 'translateY(20px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease, background-color 0.3s ease, border-color 0.3s ease',
        transitionDelay: `${index * 80}ms`,
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <h2
          className="text-lg font-semibold tracking-tight transition-colors duration-300"
          style={{ color: project.color }}
        >
          {project.name}
        </h2>
        <span
          className="text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 ml-3"
          style={{
            color: project.status === 'Live on Railway' ? '#22c55e' : '#737373',
            backgroundColor: project.status === 'Live on Railway' ? '#22c55e14' : '#73737314',
          }}
        >
          {project.status}
        </span>
      </div>

      <p className="text-text-muted text-sm leading-relaxed mb-4">
        {project.tagline}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {project.stack.map((tech) => (
          <span
            key={tech}
            className="text-[11px] text-text-muted px-2 py-0.5 rounded border border-border"
          >
            {tech}
          </span>
        ))}
      </div>

      <div
        className="h-px mt-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ backgroundColor: project.color }}
      />
    </a>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-bg">
      <header className="px-6 pt-8 pb-12 max-w-3xl mx-auto">
        <span className="text-sm text-text-muted font-mono tracking-wide">
          pyon.dev
        </span>
      </header>

      <main className="px-6 max-w-3xl mx-auto">
        <div className="grid gap-4">
          {projects.map((project, i) => (
            <Card key={project.name} project={project} index={i} />
          ))}
        </div>

        <section className="mt-20 mb-16 max-w-lg">
          <p className="text-sm text-text-muted leading-relaxed">
            Strategy operator at Xbox. These are side projects I build to stay close to the product layer, and because building things is more fun than writing decks about building things.
          </p>
        </section>
      </main>

      <footer className="px-6 pb-8 max-w-3xl mx-auto">
        <span className="text-xs text-text-muted">
          pyon.dev · 2026
        </span>
      </footer>
    </div>
  )
}

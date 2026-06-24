const shots = [
  { src: './screenshots/routing.jpg',   label: 'Routing',   caption: 'Per-channel sliders bound to a live 7.1 speaker layout around the listener.' },
  { src: './screenshots/equalizer.jpg', label: 'Equalizer', caption: '15-band LADSPA EQ — switch presets or hand-craft a custom curve.' },
  { src: './screenshots/commands.jpg',  label: 'Commands',  caption: 'Install steps for zypper + the generated module-ladspa-sink config.' },
  { src: './screenshots/notes.jpg',     label: 'Notes',     caption: 'Operational guidance + machine-specific reminders stamped into every export.' },
]

export default function Gallery() {
  return (
    <section id="screens" className="mx-auto max-w-6xl px-6 py-24">
      <div className="flex items-end justify-between gap-6">
        <div className="max-w-2xl">
          <span className="chip">Inside the app</span>
          <h2 className="mt-4 font-display text-4xl font-semibold tracking-tightest text-ink-100 sm:text-5xl">
            Four tabs, one workflow.
          </h2>
        </div>
        <p className="hidden text-sm text-ink-300 md:block">
          Click any tile to see it at full size.
        </p>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {shots.map((shot) => (
          <a
            key={shot.label}
            href={shot.src}
            target="_blank"
            rel="noreferrer"
            className="group block overflow-hidden rounded-2xl border border-white/[0.07] bg-ink-800/40 transition hover:border-moss-400/30"
          >
            <div className="aspect-[1320/700] overflow-hidden bg-ink-950">
              <img
                src={shot.src}
                alt={`${shot.label} tab — ${shot.caption}`}
                loading="lazy"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]"
              />
            </div>
            <div className="flex items-start justify-between gap-6 p-5">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-moss-300">
                  Tab · {shot.label}
                </p>
                <p className="mt-2 text-[15px] text-ink-200">{shot.caption}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}

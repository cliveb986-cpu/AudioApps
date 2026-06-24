const items = [
  'openSUSE Tumbleweed · Fedora · Ubuntu',
  'PulseAudio + LADSPA mbeq',
  'Persists to localStorage only',
  'GNOME launcher · colour + symbolic icons',
]

export default function TrustStrip() {
  return (
    <section className="border-y border-white/[0.06] bg-ink-900/40">
      <div className="mx-auto max-w-6xl px-6 py-5">
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-2 font-mono text-[11.5px] uppercase tracking-[0.12em] text-ink-300">
          {items.map((item, i) => (
            <li key={item} className="flex items-center gap-3">
              {i > 0 && <span className="h-1 w-1 rounded-full bg-ink-400" aria-hidden />}
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

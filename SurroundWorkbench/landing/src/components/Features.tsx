import { SlidersHorizontal, Equal, FileCode2, AppWindow } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type Feature = { icon: LucideIcon; title: string; body: string }

const features: Feature[] = [
  {
    icon: SlidersHorizontal,
    title: 'Per-channel calibration',
    body: 'Eight sliders for FL/FR/FC/LFE/SL/SR/RL/RR with a live speaker layout, ±6 dB master trim and an adjustable sub crossover (60–120 Hz).',
  },
  {
    icon: Equal,
    title: '15-band LADSPA EQ',
    body: 'Four presets out of the box — Flat, Cinema, Night and Dialogue lift — plus a custom mode that tracks every band change you make.',
  },
  {
    icon: FileCode2,
    title: 'Live config generation',
    body: 'Watch a ready-to-paste module-ladspa-sink config update in real time. Copy or download it as a .pa file. Notes you write are stamped into the header.',
  },
  {
    icon: AppWindow,
    title: 'GNOME native, runnable folder',
    body: 'A one-line installer registers the app in Activities and the app grid, ships colour + symbolic SVG icons, and uses python3 for the local static server.',
  },
]

export default function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-24">
      <div className="max-w-2xl">
        <span className="chip">Built for the desk</span>
        <h2 className="mt-4 font-display text-4xl font-semibold tracking-tightest text-ink-100 sm:text-5xl">
          Four panels, zero ceremony.
        </h2>
        <p className="mt-4 text-ink-200">
          Everything you need to plan, tune and publish a 7.1 chain — and nothing you don't.
        </p>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {features.map(({ icon: Icon, title, body }) => (
          <article
            key={title}
            className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-ink-800/50 p-7 transition hover:border-moss-400/30 hover:bg-ink-800/80"
          >
            <div className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-moss-500/0 blur-2xl transition group-hover:bg-moss-500/10" />
            <div className="relative flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-moss-400/10 text-moss-300 ring-1 ring-inset ring-moss-400/20">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="font-display text-xl font-semibold text-ink-100">{title}</h3>
            </div>
            <p className="relative mt-4 text-[15px] leading-relaxed text-ink-200">{body}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

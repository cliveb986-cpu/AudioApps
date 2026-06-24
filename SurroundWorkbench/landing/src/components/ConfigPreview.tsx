const cfg = `### ~/.config/pulse/default.pa.d/surround71.pa
### Pulseladspa sink for 7.1 playback
### Measure each speaker at the main listening position, confirm the true
### sink name from pactl list short sinks, and keep a backup of the last
### known-working PulseAudio config before applying changes.
load-module module-ladspa-sink \\
    sink_name=surround_eq \\
    master=alsa_output.pci-0000_00_1f.3.analog-surround-71 \\
    plugin=mbeq_1197 label=mbeq \\
    control=-4.0,-4.0,-3.0,-2.0,-1.0,0.0,1.0,1.0,2.0,2.0,3.0,3.0,2.0,0.0,-1.0
set-default-sink surround_eq
### Expected channel map: fl,fr,fc,lfe,rl,rr,sl,sr
### Suggested subwoofer crossover: 80 Hz
### Stored preset: Night mode`

export default function ConfigPreview() {
  return (
    <section className="border-t border-white/[0.06] bg-ink-900/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-24 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <span className="chip">What it exports</span>
          <h2 className="mt-4 font-display text-4xl font-semibold tracking-tightest text-ink-100 sm:text-5xl">
            Paste-ready PulseAudio,<br />not another tool to learn.
          </h2>
          <p className="mt-4 text-ink-200">
            Surround Workbench is a planner, not a runtime mixer. Every tweak ends up in a single
            file you drop under <code className="rounded bg-ink-700 px-1.5 py-0.5 font-mono text-[14px] text-moss-200">
              ~/.config/pulse/default.pa.d/
            </code> — your existing PulseAudio chain stays in charge.
          </p>
          <ul className="mt-7 space-y-3 text-sm text-ink-300">
            <li className="flex gap-3"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-moss-400" />Notes you write are stamped into the file header.</li>
            <li className="flex gap-3"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-moss-400" />Channel map and crossover land as comments for future you.</li>
            <li className="flex gap-3"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-moss-400" />Stored preset name travels with the file so it's diff-able in git.</li>
          </ul>
        </div>

        <pre className="overflow-x-auto rounded-2xl border border-white/[0.07] bg-ink-950/80 p-6 font-mono text-[12.5px] leading-6 text-ink-100 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.8)]">
          <code>{cfg}</code>
        </pre>
      </div>
    </section>
  )
}

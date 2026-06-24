const faqs = [
  {
    q: 'Does it touch my system audio?',
    a: 'No. Surround Workbench is a planner. It generates a config file you choose when (and whether) to install under ~/.config/pulse/. Nothing happens behind your back.',
  },
  {
    q: 'Where is my data stored?',
    a: 'In your browser\'s localStorage under the key surround-workbench-state-v1. Clear site data to wipe it. There is no server, no account, no telemetry.',
  },
  {
    q: 'Is this Electron / a real desktop binary?',
    a: 'No. The launcher serves the static build via python3 -m http.server on 127.0.0.1 and opens your default GNOME browser. That keeps the package tiny (~70 KB on disk) and means you can re-skin or audit it with normal web tools.',
  },
  {
    q: 'Will it work on Fedora / Ubuntu / Arch too?',
    a: 'Yes. The codebase has no openSUSE specifics — only the example install command does. Swap zypper for dnf, apt or pacman and the rest of the flow is identical.',
  },
  {
    q: 'PipeWire?',
    a: 'This release targets PulseAudio + LADSPA mbeq. If you run pure PipeWire/WirePlumber and want a native filter-chain export instead, open an issue on GitHub.',
  },
]

export default function Faq() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="max-w-2xl">
        <span className="chip">Questions</span>
        <h2 className="mt-4 font-display text-4xl font-semibold tracking-tightest text-ink-100 sm:text-5xl">
          Things you'll probably ask.
        </h2>
      </div>

      <div className="mt-10 divide-y divide-white/[0.06] rounded-2xl border border-white/[0.07] bg-ink-800/40">
        {faqs.map((f) => (
          <details key={f.q} className="group p-6 transition open:bg-ink-800/70">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6">
              <span className="font-display text-lg font-semibold text-ink-100">{f.q}</span>
              <span className="grid h-7 w-7 place-items-center rounded-full border border-white/10 text-ink-300 transition group-open:rotate-45 group-open:border-moss-400/40 group-open:text-moss-300">
                +
              </span>
            </summary>
            <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-ink-200">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

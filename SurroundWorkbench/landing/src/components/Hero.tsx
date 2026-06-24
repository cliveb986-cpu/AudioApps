import { ArrowRight, Download, Github, Terminal } from 'lucide-react'
import { DOWNLOAD_URL, GITHUB_REPO, VERSION } from '../config'

export default function Hero() {
  return (
    <section className="relative">
      <div className="aura pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 pt-10 pb-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pt-20 lg:pb-32">
        {/* Left: copy */}
        <div className="relative">
          <div className="reveal reveal-1 flex flex-wrap items-center gap-2">
            <span className="chip">{VERSION} · For GNOME on Linux</span>
            <span className="chip" style={{ background: 'rgba(255,255,255,0.04)', color: '#a8afb8', borderColor: 'rgba(255,255,255,0.08)' }}>
              No account · No cloud · 72 KB
            </span>
          </div>

          <h1 className="reveal reveal-2 mt-6 font-display text-[44px] font-semibold leading-[1.02] tracking-tightest text-ink-100 sm:text-[58px] lg:text-[68px]">
            Tune 7.1 surround<br />
            <span className="bg-gradient-to-r from-moss-200 via-moss-400 to-cyan-300 bg-clip-text text-transparent">
              like a workstation.
            </span>
          </h1>

          <p className="reveal reveal-3 mt-6 max-w-xl text-[17px] leading-relaxed text-ink-200">
            A local-first PulseAudio LADSPA planner for openSUSE Tumbleweed, Fedora and Ubuntu.
            Dial in your speakers, watch the EQ react, copy the generated config straight into{' '}
            <code className="rounded bg-ink-700 px-1.5 py-0.5 font-mono text-[14px] text-moss-200">~/.config/pulse/</code>.
            Everything stays on your machine.
          </p>

          <div className="reveal reveal-4 mt-9 flex flex-wrap items-center gap-3">
            <a
              href={DOWNLOAD_URL}
              className="group inline-flex items-center gap-2.5 rounded-full bg-moss-400 px-6 py-3.5 text-base font-semibold text-ink-950 shadow-[0_0_0_1px_rgba(52,211,153,0.45),0_20px_50px_-15px_rgba(52,211,153,0.7)] transition hover:-translate-y-0.5 hover:bg-moss-300"
              data-testid="hero-download-cta"
            >
              <Download className="h-5 w-5" />
              Download for Linux
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </a>
            <a
              href={GITHUB_REPO}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.02] px-5 py-3.5 text-base text-ink-100 transition hover:border-white/20 hover:bg-white/[0.05]"
            >
              <Github className="h-5 w-5" />
              View source
            </a>
          </div>

          <div className="reveal reveal-5 mt-8 flex items-center gap-3 font-mono text-[12.5px] text-ink-300">
            <Terminal className="h-4 w-4 text-moss-300" />
            <code className="caret">$ ./launch-app.sh</code>
          </div>
        </div>

        {/* Right: framed product screenshot */}
        <div className="reveal reveal-3 relative">
          <div className="relative">
            {/* glow */}
            <div className="absolute -inset-6 -z-10 rounded-[28px] bg-gradient-to-tr from-moss-500/20 via-transparent to-cyan-400/10 blur-2xl" />
            {/* window chrome */}
            <div className="overflow-hidden rounded-xl border border-white/10 bg-ink-800 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]">
              <div className="flex items-center gap-2 border-b border-white/5 bg-ink-900/80 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                <span className="ml-4 font-mono text-xs text-ink-300">
                  surround-workbench · 127.0.0.1:5173
                </span>
              </div>
              <img
                src="./screenshots/hero.jpg"
                alt="Surround Workbench hero — readiness checklist showing 3/3 ready and the publish actions"
                className="block w-full"
                width={1320}
                height={540}
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

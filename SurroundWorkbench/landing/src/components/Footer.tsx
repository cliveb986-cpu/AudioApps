import { Github, Download } from 'lucide-react'
import { AUTHOR, DOWNLOAD_URL, GITHUB_REPO, VERSION } from '../config'

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/[0.06] bg-ink-950/80">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-16 md:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <img src="./surround-workbench.svg" alt="" width={28} height={28} className="rounded-md" />
            <span className="font-display text-[15px] font-semibold tracking-tight text-ink-100">
              Surround Workbench
            </span>
          </div>
          <p className="mt-4 max-w-md text-sm text-ink-300">
            A local-first 7.1 surround EQ planner for GNOME Linux. Built because tuning a
            home setup shouldn't require a SaaS account.
          </p>
          <p className="mt-6 font-mono text-[11.5px] uppercase tracking-[0.14em] text-ink-400">
            {VERSION} · MIT-style · {AUTHOR}
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 md:items-end">
          <a
            href={DOWNLOAD_URL}
            className="inline-flex items-center gap-2 rounded-full bg-moss-400 px-5 py-2.5 text-sm font-semibold text-ink-950 transition hover:bg-moss-300"
          >
            <Download className="h-4 w-4" />
            Download .zip
          </a>
          <a
            href={GITHUB_REPO}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm text-ink-300 transition hover:text-ink-100"
          >
            <Github className="h-4 w-4" />
            github.com/…/surroundsound-workbench
          </a>
          <a
            href={`${GITHUB_REPO}/issues/new`}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-ink-300 transition hover:text-ink-100"
          >
            Report a bug
          </a>
        </div>
      </div>

      <div className="border-t border-white/[0.04] py-5 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-ink-400">
        Designed offline · tuned at the desk · runs nowhere but yours
      </div>
    </footer>
  )
}

import { Github, Download } from 'lucide-react'
import { DOWNLOAD_URL, GITHUB_REPO } from '../config'

export default function Nav() {
  return (
    <nav className="relative z-20 mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
      <a href="#" className="flex items-center gap-2.5">
        <img src="./surround-workbench.svg" alt="" width={28} height={28} className="rounded-md" />
        <span className="font-display text-[15px] font-semibold tracking-tight text-ink-100">
          Surround Workbench
        </span>
      </a>

      <div className="flex items-center gap-2">
        <a
          href={GITHUB_REPO}
          target="_blank"
          rel="noreferrer"
          className="hidden items-center gap-2 rounded-full border border-white/10 px-3.5 py-2 text-sm text-ink-200 transition hover:border-white/20 hover:text-ink-100 sm:inline-flex"
        >
          <Github className="h-4 w-4" />
          GitHub
        </a>
        <a
          href={DOWNLOAD_URL}
          className="inline-flex items-center gap-2 rounded-full bg-moss-400 px-4 py-2 text-sm font-semibold text-ink-950 shadow-[0_0_0_1px_rgba(52,211,153,0.4),0_10px_24px_-12px_rgba(52,211,153,0.6)] transition hover:bg-moss-300"
        >
          <Download className="h-4 w-4" />
          Download
        </a>
      </div>
    </nav>
  )
}

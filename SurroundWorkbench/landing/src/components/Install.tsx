import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { DOWNLOAD_URL } from '../config'

const steps = [
  {
    title: 'Install Node + Python',
    body: 'One-time prerequisites on Tumbleweed.',
    cmd: 'sudo zypper install nodejs20 npm20 python3',
  },
  {
    title: 'Grab the zip',
    body: 'Latest stable build from GitHub Releases.',
    cmd: `curl -L -o ~/Downloads/SurroundWorkbench-standalone.zip \\\n     ${DOWNLOAD_URL}\nunzip ~/Downloads/SurroundWorkbench-standalone.zip -d ~/Apps/`,
  },
  {
    title: 'Run it',
    body: 'First run installs deps & builds; later runs start in <2 s.',
    cmd: 'cd ~/Apps/SurroundWorkbench\nchmod +x launch-app.sh install-gnome-launcher.sh\n./launch-app.sh',
  },
  {
    title: 'Pin it to GNOME (optional)',
    body: 'Adds it to Activities search, the app grid and your desktop.',
    cmd: './install-gnome-launcher.sh',
  },
]

function CodeBlock({ code, idx }: { code: string; idx: number }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch {
      /* ignore */
    }
  }
  return (
    <div className="relative">
      <pre
        className="overflow-x-auto rounded-lg border border-white/[0.06] bg-ink-950/80 p-4 font-mono text-[12.5px] leading-6 text-ink-100"
        data-testid={`install-cmd-${idx}`}
      >
        <code>{code}</code>
      </pre>
      <button
        type="button"
        onClick={handleCopy}
        className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-md border border-white/10 bg-ink-800/80 px-2 py-1 text-[11px] text-ink-200 transition hover:border-moss-400/40 hover:text-moss-200"
        aria-label="Copy command"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-moss-300" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  )
}

export default function Install() {
  return (
    <section id="install" className="border-t border-white/[0.06] bg-ink-900/40">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <span className="chip">Install</span>
          <h2 className="mt-4 font-display text-4xl font-semibold tracking-tightest text-ink-100 sm:text-5xl">
            Four commands.<br />Then you're tuning.
          </h2>
          <p className="mt-4 text-ink-200">
            Tested on openSUSE Tumbleweed with GNOME on Wayland. Works the same way on Fedora and
            Ubuntu — just swap{' '}
            <code className="rounded bg-ink-700 px-1.5 py-0.5 font-mono text-[13px] text-moss-200">
              zypper
            </code>{' '}
            for your package manager.
          </p>

          <p className="mt-8 text-sm text-ink-300">
            Already have Node 20+ installed? Skip step 1.
          </p>
        </div>

        <ol className="space-y-7">
          {steps.map((step, i) => (
            <li key={step.title} className="grid grid-cols-[40px_1fr] gap-4">
              <span className="grid h-9 w-9 place-items-center rounded-full border border-moss-400/30 bg-moss-400/10 font-mono text-sm font-bold text-moss-200">
                {i + 1}
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold text-ink-100">{step.title}</h3>
                <p className="mt-1 text-sm text-ink-300">{step.body}</p>
                <div className="mt-3">
                  <CodeBlock code={step.cmd} idx={i} />
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

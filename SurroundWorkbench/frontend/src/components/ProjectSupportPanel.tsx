import { Folder, Monitor, Search, Terminal } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert'
import { Badge } from '../components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { projectStatus } from '../utils/surroundWorkbench'

export default function ProjectSupportPanel() {
  const status = projectStatus

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_1fr]" data-testid="project-support-panel">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Folder className="h-4 w-4" />
            Project layout
          </div>
          <CardTitle className="text-xl">Standalone runnable folder</CardTitle>
          <CardDescription>
            This is a fully local Vite + React app. No backend or cloud dependency — every preference is
            saved to your browser's local storage.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" data-testid="project-name-badge">
              {status.projectName}
            </Badge>
            <Badge variant="outline">Local-first</Badge>
          </div>

          {status.directories.map((directory) => (
            <div key={directory.name} className="rounded-lg border bg-background p-4">
              <div className="flex items-center gap-2">
                <Folder className="h-4 w-4 text-primary" />
                <p className="font-medium font-mono">{directory.name}</p>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{directory.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Monitor className="h-4 w-4" />
            GNOME launcher
          </div>
          <CardTitle className="text-xl">One-shot install for GNOME / Wayland</CardTitle>
          <CardDescription>
            Run the installer once to register the app in the Activities overview, the app grid, and
            (optionally) your desktop.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Terminal className="h-4 w-4 text-primary" />
              Installer command
            </div>
            <pre className="mt-3 overflow-x-auto rounded-md bg-background p-3 text-sm text-foreground">
              <code data-testid="installer-command">{status.launcher.installCommand}</code>
            </pre>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Launcher script</p>
              <p className="mt-2 font-medium font-mono">{status.launcher.launcherScript}</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Installer</p>
              <p className="mt-2 font-medium font-mono">{status.launcher.installerScript}</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Desktop template</p>
              <p className="mt-2 font-medium font-mono">{status.launcher.desktopTemplate}</p>
            </div>
          </div>

          <div className="space-y-3">
            {status.launcher.notes.map((note) => (
              <div key={note} className="rounded-lg border bg-background p-4 text-sm text-muted-foreground">
                {note}
              </div>
            ))}
          </div>

          <Alert>
            <Search className="h-4 w-4" />
            <AlertTitle>If the desktop icon still does not show</AlertTitle>
            <AlertDescription>
              GNOME often hides desktop icons by default. The launcher should still appear in Activities
              search and the app grid after installation.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </section>
  )
}

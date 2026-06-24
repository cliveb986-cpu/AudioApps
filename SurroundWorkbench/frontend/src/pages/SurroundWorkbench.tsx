import { useMemo, useState } from 'react'
import {
  AlertCircle,
  AudioLines,
  CheckCircle2,
  CircleHelp,
  Copy,
  Equal,
  MonitorSpeaker,
  RotateCcw,
  SlidersHorizontal,
  User,
  Volume2,
} from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'
import { Slider } from '../components/ui/slider'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Textarea } from '../components/ui/textarea'
import { useLocalStorageState } from '../hooks/useLocalStorageState'
import ProjectSupportPanel from '../components/ProjectSupportPanel'
import {
  cloneBands,
  commandSteps,
  createDefaultWorkbenchState,
  formatDb,
  getBandScaleClass,
  getRequiredChannel,
  presetBands,
  presetLabels,
  storageKey,
  type ChannelKey,
  type PresetKey,
} from '../utils/surroundWorkbench'

function SpeakerNode({
  label,
  position,
  totalGain,
  testid,
}: {
  label: string
  position: string
  totalGain: number
  testid: string
}) {
  return (
    <div
      data-testid={testid}
      className="flex min-h-28 flex-col items-center justify-center rounded-xl border bg-background p-4 text-center shadow-retool-sm"
    >
      <div className="flex items-center gap-2 text-sm font-medium">
        <MonitorSpeaker className="h-4 w-4 text-primary" />
        <span>{label}</span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{position}</p>
      <Badge variant="outline" className="mt-3 font-mono">
        {formatDb(totalGain)}
      </Badge>
    </div>
  )
}

function ListenerNode() {
  return (
    <div className="flex min-h-28 flex-col items-center justify-center rounded-xl border border-dashed bg-muted/40 p-4 text-center">
      <User className="h-5 w-5 text-muted-foreground" />
      <p className="mt-2 text-sm font-medium">Listening position</p>
      <p className="mt-1 text-xs text-muted-foreground">Reference seat at ear height</p>
    </div>
  )
}

export default function SurroundWorkbench() {
  const [workbench, setWorkbench] = useLocalStorageState(storageKey, createDefaultWorkbenchState())
  const [copyState, setCopyState] = useState<'idle' | 'done' | 'error'>('idle')

  const bands = workbench.bands
  const channels = workbench.channels
  const preset = workbench.preset

  const outputProfile = useMemo(
    () =>
      channels.map((channel) => ({
        ...channel,
        totalGain: channel.gain + workbench.masterGain,
      })),
    [channels, workbench.masterGain],
  )

  const eqPreview = useMemo(
    () => bands.map((band) => `${band.hz}=${band.value}`).join('; '),
    [bands],
  )

  const pulseConfig = useMemo(() => {
    const bandValues = bands.map((band) => band.value.toFixed(1)).join(',')
    const map = channels.map((channel) => channel.key).join(',')
    const noteLines = workbench.notes
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => `### ${line}`)

    return [
      '### ~/.config/pulse/default.pa.d/surround71.pa',
      '### Pulseladspa sink for 7.1 playback',
      ...noteLines,
      `load-module module-ladspa-sink sink_name=${workbench.sinkName} master=${workbench.masterSink} plugin=${workbench.pluginName} label=${workbench.pluginLabel} control=${bandValues}`,
      `set-default-sink ${workbench.sinkName}`,
      `### Expected channel map: ${map}`,
      `### Suggested subwoofer crossover: ${workbench.crossoverHz} Hz`,
      `### Stored preset: ${presetLabels[preset]}`,
    ].join('\n')
  }, [
    bands,
    channels,
    preset,
    workbench.crossoverHz,
    workbench.masterSink,
    workbench.notes,
    workbench.pluginLabel,
    workbench.pluginName,
    workbench.sinkName,
  ])

  const readinessChecks = useMemo(() => {
    const hasSinkName = workbench.masterSink.trim().length > 0
    const hasPluginName = workbench.pluginName.trim().length > 0
    const hasPluginLabel = workbench.pluginLabel.trim().length > 0
    const hasNotes = workbench.notes.trim().length > 0

    return [
      {
        label: 'Master sink selected',
        done: hasSinkName,
        detail: hasSinkName
          ? workbench.masterSink
          : 'Set the real sink from pactl list short sinks.',
      },
      {
        label: 'Plugin identifiers set',
        done: hasPluginName && hasPluginLabel,
        detail:
          hasPluginName && hasPluginLabel
            ? `${workbench.pluginName} / ${workbench.pluginLabel}`
            : 'Fill both the plugin name and label.',
      },
      {
        label: 'Deployment notes captured',
        done: hasNotes,
        detail: hasNotes
          ? 'Notes will be embedded in the generated config header.'
          : 'Add notes for your local machine.',
      },
    ]
  }, [workbench.masterSink, workbench.notes, workbench.pluginLabel, workbench.pluginName])

  const readinessScore = readinessChecks.filter((check) => check.done).length
  const isPublishReady = readinessScore === readinessChecks.length

  const updateChannelGain = (channelKey: ChannelKey, nextGain: number) => {
    setWorkbench((current) => ({
      ...current,
      channels: current.channels.map((channel) =>
        channel.key === channelKey ? { ...channel, gain: nextGain } : channel,
      ),
    }))
  }

  const updatePreset = (nextPreset: PresetKey) => {
    if (nextPreset === 'custom') {
      setWorkbench((current) => ({ ...current, preset: 'custom' }))
      return
    }

    setWorkbench((current) => ({
      ...current,
      preset: nextPreset,
      bands: cloneBands(presetBands[nextPreset]),
    }))
  }

  const updateBandValue = (index: number, nextValue: number) => {
    setWorkbench((current) => ({
      ...current,
      preset: 'custom',
      bands: current.bands.map((band, bandIndex) =>
        bandIndex === index ? { ...band, value: nextValue } : band,
      ),
    }))
  }

  const fallbackCopy = (text: string) => {
    const el = document.createElement('textarea')
    el.value = text
    el.setAttribute('readonly', '')
    el.style.position = 'absolute'
    el.style.left = '-9999px'
    document.body.appendChild(el)
    el.select()
    try {
      document.execCommand('copy')
    } finally {
      document.body.removeChild(el)
    }
  }

  const copyConfig = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(pulseConfig)
      } else {
        fallbackCopy(pulseConfig)
      }
      setCopyState('done')
      window.setTimeout(() => setCopyState('idle'), 1600)
    } catch {
      setCopyState('error')
      window.setTimeout(() => setCopyState('idle'), 2200)
    }
  }

  const downloadConfig = () => {
    const blob = new Blob([pulseConfig + '\n'], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'surround71.pa'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const resetWorkbench = () => {
    setWorkbench(createDefaultWorkbenchState())
  }

  return (
    <div className="min-h-screen bg-background text-foreground" data-testid="surround-workbench">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 md:px-8">
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="overflow-hidden">
            <CardHeader className="gap-4 border-b bg-card/70 backdrop-blur">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="secondary" className="gap-1.5">
                  <AudioLines className="h-3.5 w-3.5" />
                  GNOME Wayland
                </Badge>
                <Badge variant="outline">openSUSE / Fedora / Ubuntu</Badge>
                <Badge variant="outline">PulseAudio / PipeWire</Badge>
                <Badge variant="outline">7.1 surround</Badge>
              </div>
              <div className="space-y-2">
                <CardTitle className="text-3xl">7.1 surround workstation builder</CardTitle>
                <CardDescription className="max-w-3xl text-sm md:text-base">
                  Tune an eight-channel desktop playback chain, preview a PulseAudio LADSPA config,
                  and keep a publish-ready plan that persists locally on your machine.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="grid gap-6 pt-6 md:grid-cols-3">
              <div className="rounded-lg border bg-background p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <MonitorSpeaker className="h-4 w-4" />
                  Signal path
                </div>
                <p className="mt-3 text-sm leading-6 text-body-foreground">
                  App audio → PulseAudio → module-ladspa-sink → hardware 7.1 sink → speaker
                  calibration.
                </p>
              </div>
              <div className="rounded-lg border bg-background p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Equal className="h-4 w-4" />
                  Active EQ preset
                </div>
                <p className="mt-3 text-lg font-semibold" data-testid="active-preset-label">
                  {presetLabels[preset]}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Fifteen-band profile for LADSPA mbeq processing.
                </p>
              </div>
              <div className="rounded-lg border bg-background p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Volume2 className="h-4 w-4" />
                  Master trim
                </div>
                <p className="mt-3 text-lg font-semibold font-mono" data-testid="master-gain-display">
                  {formatDb(workbench.masterGain)}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Applied on top of per-channel offsets.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Publish readiness</CardTitle>
              <CardDescription>
                Fill in the machine-specific details before exporting the generated config.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-end justify-between gap-4 rounded-lg border bg-muted/30 p-4">
                <div>
                  <p className="text-sm text-muted-foreground">Checklist score</p>
                  <p className="text-3xl font-semibold" data-testid="readiness-score">
                    {readinessScore}/{readinessChecks.length}
                  </p>
                </div>
                <Badge variant={isPublishReady ? 'secondary' : 'outline'}>
                  {isPublishReady ? 'Ready to publish' : 'Needs review'}
                </Badge>
              </div>

              <div className="space-y-3">
                {readinessChecks.map((check) => (
                  <div key={check.label} className="flex items-start gap-3 rounded-lg border p-3">
                    {check.done ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-success" />
                    ) : (
                      <AlertCircle className="mt-0.5 h-4 w-4 text-warning" />
                    )}
                    <div>
                      <p className="font-medium">{check.label}</p>
                      <p className="text-sm text-muted-foreground">{check.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" onClick={resetWorkbench} data-testid="reset-button">
                  <RotateCcw className="h-4 w-4" />
                  Reset defaults
                </Button>
                <Button onClick={copyConfig} data-testid="copy-config-button-top">
                  <Copy className="h-4 w-4" />
                  Copy config
                </Button>
                <Button variant="outline" onClick={downloadConfig} data-testid="download-config-button">
                  Download .pa
                </Button>
              </div>

              {copyState === 'done' ? (
                <Alert variant="success" data-testid="copy-success">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Copied</AlertTitle>
                  <AlertDescription>
                    The generated PulseAudio config is on your clipboard.
                  </AlertDescription>
                </Alert>
              ) : null}

              {copyState === 'error' ? (
                <Alert variant="warning">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Clipboard unavailable</AlertTitle>
                  <AlertDescription>
                    Select the config block manually if your browser blocks clipboard access.
                  </AlertDescription>
                </Alert>
              ) : null}
            </CardContent>
          </Card>
        </section>

        <ProjectSupportPanel />

        <Tabs defaultValue="routing" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="routing" data-testid="tab-routing">
              Routing
            </TabsTrigger>
            <TabsTrigger value="equalizer" data-testid="tab-equalizer">
              Equalizer
            </TabsTrigger>
            <TabsTrigger value="commands" data-testid="tab-commands">
              Commands
            </TabsTrigger>
            <TabsTrigger value="notes" data-testid="tab-notes">
              Notes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="routing" className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Channel calibration</CardTitle>
                <CardDescription>Dial in each speaker around the listening position.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {channels.map((channel) => {
                  const totalGain = channel.gain + workbench.masterGain

                  return (
                    <div key={channel.key} className="rounded-lg border p-4">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{channel.label}</p>
                            <Badge variant="outline">{channel.position}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{channel.role}</p>
                        </div>
                        <div
                          className="text-sm font-medium font-mono"
                          data-testid={`channel-${channel.key}-output`}
                        >
                          Output: {formatDb(totalGain)}
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-4">
                        <span className="w-12 text-xs text-muted-foreground">-6 dB</span>
                        <Slider
                          data-testid={`channel-${channel.key}-slider`}
                          value={[channel.gain]}
                          min={-6}
                          max={6}
                          step={1}
                          onValueChange={(value) => {
                            const nextGain = value[0]
                            if (nextGain === undefined) return
                            updateChannelGain(channel.key, nextGain)
                          }}
                        />
                        <span className="w-12 text-right text-xs text-muted-foreground">+6 dB</span>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Speaker layout</CardTitle>
                  <CardDescription>
                    Reference 7.1 placement around the main listening position.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 md:grid-cols-3">
                    <SpeakerNode testid="speaker-fl" {...getRequiredChannel(outputProfile, 'fl')} />
                    <SpeakerNode testid="speaker-fc" {...getRequiredChannel(outputProfile, 'fc')} />
                    <SpeakerNode testid="speaker-fr" {...getRequiredChannel(outputProfile, 'fr')} />
                    <SpeakerNode testid="speaker-sl" {...getRequiredChannel(outputProfile, 'sl')} />
                    <ListenerNode />
                    <SpeakerNode testid="speaker-sr" {...getRequiredChannel(outputProfile, 'sr')} />
                    <SpeakerNode testid="speaker-rl" {...getRequiredChannel(outputProfile, 'rl')} />
                    <SpeakerNode testid="speaker-lfe" {...getRequiredChannel(outputProfile, 'lfe')} />
                    <SpeakerNode testid="speaker-rr" {...getRequiredChannel(outputProfile, 'rr')} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Hardware profile</CardTitle>
                  <CardDescription>
                    Useful targets for desktop playback and sub integration.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Master gain</span>
                      <span className="font-medium font-mono">{formatDb(workbench.masterGain)}</span>
                    </div>
                    <Slider
                      data-testid="master-gain-slider"
                      value={[workbench.masterGain]}
                      min={-6}
                      max={6}
                      step={1}
                      onValueChange={(value) => {
                        const nextValue = value[0]
                        if (nextValue === undefined) return
                        setWorkbench((current) => ({ ...current, masterGain: nextValue }))
                      }}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Subwoofer crossover</span>
                      <span className="font-medium font-mono">{workbench.crossoverHz} Hz</span>
                    </div>
                    <Slider
                      data-testid="crossover-slider"
                      value={[workbench.crossoverHz]}
                      min={60}
                      max={120}
                      step={5}
                      onValueChange={(value) => {
                        const nextValue = value[0]
                        if (nextValue === undefined) return
                        setWorkbench((current) => ({ ...current, crossoverHz: nextValue }))
                      }}
                    />
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Channel</TableHead>
                        <TableHead>Map key</TableHead>
                        <TableHead className="text-right">Net gain</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {outputProfile.map((channel) => (
                        <TableRow key={channel.key}>
                          <TableCell className="font-medium">{channel.label}</TableCell>
                          <TableCell className="font-mono">{channel.key}</TableCell>
                          <TableCell className="text-right font-mono">
                            {formatDb(channel.totalGain)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="equalizer" className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Pulseladspa EQ</CardTitle>
                <CardDescription>
                  Choose a preset, then fine-tune bands or identifiers for your machine.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="preset-select">Preset</Label>
                  <Select
                    value={preset}
                    onValueChange={(value) => updatePreset(value as PresetKey)}
                  >
                    <SelectTrigger id="preset-select" data-testid="preset-select-trigger">
                      <SelectValue placeholder="Choose a preset" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flat">Flat reference</SelectItem>
                      <SelectItem value="cinema">Cinema impact</SelectItem>
                      <SelectItem value="night">Night mode</SelectItem>
                      <SelectItem value="voice">Dialogue lift</SelectItem>
                      <SelectItem value="custom">Custom tuning</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="plugin-name">LADSPA plugin name</Label>
                    <Input
                      id="plugin-name"
                      data-testid="plugin-name-input"
                      value={workbench.pluginName}
                      onChange={(event) =>
                        setWorkbench((current) => ({
                          ...current,
                          pluginName: event.target.value,
                        }))
                      }
                      placeholder="mbeq_1197"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="plugin-label">LADSPA label</Label>
                    <Input
                      id="plugin-label"
                      data-testid="plugin-label-input"
                      value={workbench.pluginLabel}
                      onChange={(event) =>
                        setWorkbench((current) => ({
                          ...current,
                          pluginLabel: event.target.value,
                        }))
                      }
                      placeholder="mbeq"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="sink-name">Generated sink name</Label>
                    <Input
                      id="sink-name"
                      data-testid="sink-name-input"
                      value={workbench.sinkName}
                      onChange={(event) =>
                        setWorkbench((current) => ({
                          ...current,
                          sinkName: event.target.value,
                        }))
                      }
                      placeholder="surround_eq"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="master-sink">Hardware master sink</Label>
                    <Input
                      id="master-sink"
                      data-testid="master-sink-input"
                      value={workbench.masterSink}
                      onChange={(event) =>
                        setWorkbench((current) => ({
                          ...current,
                          masterSink: event.target.value,
                        }))
                      }
                      placeholder="alsa_output.pci-0000_00_1f.3.analog-surround-71"
                    />
                  </div>
                </div>

                <div className="rounded-lg border bg-muted/40 p-4 text-sm">
                  <div className="flex items-center gap-2 font-medium">
                    <SlidersHorizontal className="h-4 w-4 text-primary" />
                    Band summary
                  </div>
                  <p
                    data-testid="band-summary"
                    className="mt-2 break-words font-mono text-xs text-muted-foreground"
                  >
                    {eqPreview}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">EQ band targets</CardTitle>
                <CardDescription>
                  Adjust a band to create a custom profile. Changes are saved automatically.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {bands.map((band, index) => (
                    <div key={band.hz} className="rounded-lg border p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium font-mono">{band.label}</p>
                          <p className="mt-1 text-xs text-muted-foreground">Center {band.hz} Hz</p>
                        </div>
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold font-mono ${getBandScaleClass(band.value)}`}
                        >
                          {formatDb(band.value)}
                        </span>
                      </div>

                      <div className="mt-4 flex items-center gap-3">
                        <span className="w-10 text-xs text-muted-foreground">-6</span>
                        <Slider
                          data-testid={`band-${band.hz}-slider`}
                          value={[band.value]}
                          min={-6}
                          max={6}
                          step={1}
                          onValueChange={(value) => {
                            const nextValue = value[0]
                            if (nextValue === undefined) return
                            updateBandValue(index, nextValue)
                          }}
                        />
                        <span className="w-10 text-right text-xs text-muted-foreground">+6</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="commands" className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Install and validation</CardTitle>
                <CardDescription>
                  Suggested shell flow for GNOME Linux workstation setup.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {commandSteps.map((step, index) => (
                  <div key={step} className="rounded-lg border bg-background p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Step {index + 1}
                    </p>
                    <p className="mt-2 overflow-x-auto font-mono text-sm">{step}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-xl">Generated Pulse config</CardTitle>
                    <CardDescription>
                      Drop this into a user PulseAudio configuration include file.
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={copyConfig}
                      data-testid="copy-config-button"
                    >
                      <Copy className="h-4 w-4" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      onClick={downloadConfig}
                      data-testid="download-config-button-2"
                    >
                      Download
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <pre
                  data-testid="generated-config"
                  className="overflow-x-auto rounded-lg border bg-muted/40 p-4 text-xs leading-6 text-foreground"
                >
                  <code>{pulseConfig}</code>
                </pre>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Wayland and GNOME notes</CardTitle>
                  <CardDescription>
                    Operational guidance for keeping the desktop audio stack stable.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="rounded-lg border p-4">
                    <p className="font-medium">Use pavucontrol for sink targeting</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      GNOME Settings can switch basic profiles, but pavucontrol exposes the
                      pulseladspa sink more reliably.
                    </p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <p className="font-medium">Keep PulseAudio modules aligned</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Update pulseaudio, pulseaudio-utils, and LADSPA support together when your
                      distro rolls.
                    </p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <p className="font-medium">Verify HDMI vs analog channel maps</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Some receivers expose different channel orders; confirm the real ALSA sink
                      name before setting defaults.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Alert>
                <CircleHelp className="h-4 w-4" />
                <AlertTitle>This is a planner, not a runtime mixer</AlertTitle>
                <AlertDescription>
                  Surround Workbench plans your routing and generates config; it does not modify the
                  system on its own. Apply the generated file under <code>~/.config/pulse/</code> and
                  reload PulseAudio.
                </AlertDescription>
              </Alert>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Machine-specific notes</CardTitle>
                <CardDescription>
                  Add reminders that should ship with the generated configuration header.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="deployment-notes">Deployment notes</Label>
                  <Textarea
                    id="deployment-notes"
                    data-testid="deployment-notes-textarea"
                    value={workbench.notes}
                    onChange={(event) =>
                      setWorkbench((current) => ({ ...current, notes: event.target.value }))
                    }
                    className="min-h-40"
                    placeholder="Add your real sink name, receiver channel order, measurement notes, or rollback instructions."
                  />
                </div>

                <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
                  Notes entered here are persisted in local storage and inserted into the top of the
                  generated config block.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <footer className="pb-4 pt-2 text-center text-xs text-muted-foreground">
          Surround Workbench · local-first · data stays on this machine
        </footer>
      </div>
    </div>
  )
}

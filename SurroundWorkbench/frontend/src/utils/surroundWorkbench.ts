export type ChannelKey = 'fl' | 'fr' | 'fc' | 'lfe' | 'rl' | 'rr' | 'sl' | 'sr'
export type LibraryPresetKey = 'flat' | 'cinema' | 'night' | 'voice'
export type PresetKey = LibraryPresetKey | 'custom'

export type ChannelConfig = {
  key: ChannelKey
  label: string
  role: string
  position: string
  gain: number
}

export type EqBand = {
  label: string
  hz: number
  value: number
}

export type OutputChannel = ChannelConfig & {
  totalGain: number
}

export type WorkbenchState = {
  preset: PresetKey
  channels: ChannelConfig[]
  bands: EqBand[]
  masterGain: number
  crossoverHz: number
  pluginName: string
  pluginLabel: string
  sinkName: string
  masterSink: string
  notes: string
}

export const storageKey = 'surround-workbench-state-v1'

export const baseChannels: ChannelConfig[] = [
  { key: 'fl', label: 'Front Left', role: 'Main stereo image', position: '30° left', gain: 0 },
  { key: 'fr', label: 'Front Right', role: 'Main stereo image', position: '30° right', gain: 0 },
  { key: 'fc', label: 'Center', role: 'Dialogue anchor', position: '0° center', gain: 1 },
  { key: 'lfe', label: 'Subwoofer', role: 'Low frequency effects', position: 'Front / room-corrected', gain: 2 },
  { key: 'rl', label: 'Rear Left', role: 'Rear imaging', position: '150° left', gain: -1 },
  { key: 'rr', label: 'Rear Right', role: 'Rear imaging', position: '150° right', gain: -1 },
  { key: 'sl', label: 'Side Left', role: 'Side immersion', position: '90° left', gain: 0 },
  { key: 'sr', label: 'Side Right', role: 'Side immersion', position: '90° right', gain: 0 },
]

export const presetBands: Record<LibraryPresetKey, EqBand[]> = {
  flat: [
    { label: '25 Hz', hz: 25, value: 0 },
    { label: '40 Hz', hz: 40, value: 0 },
    { label: '63 Hz', hz: 63, value: 0 },
    { label: '100 Hz', hz: 100, value: 0 },
    { label: '160 Hz', hz: 160, value: 0 },
    { label: '250 Hz', hz: 250, value: 0 },
    { label: '400 Hz', hz: 400, value: 0 },
    { label: '630 Hz', hz: 630, value: 0 },
    { label: '1 kHz', hz: 1000, value: 0 },
    { label: '1.6 kHz', hz: 1600, value: 0 },
    { label: '2.5 kHz', hz: 2500, value: 0 },
    { label: '4 kHz', hz: 4000, value: 0 },
    { label: '6.3 kHz', hz: 6300, value: 0 },
    { label: '10 kHz', hz: 10000, value: 0 },
    { label: '16 kHz', hz: 16000, value: 0 },
  ],
  cinema: [
    { label: '25 Hz', hz: 25, value: 3 },
    { label: '40 Hz', hz: 40, value: 3 },
    { label: '63 Hz', hz: 63, value: 2 },
    { label: '100 Hz', hz: 100, value: 2 },
    { label: '160 Hz', hz: 160, value: 1 },
    { label: '250 Hz', hz: 250, value: 0 },
    { label: '400 Hz', hz: 400, value: 0 },
    { label: '630 Hz', hz: 630, value: 0 },
    { label: '1 kHz', hz: 1000, value: 1 },
    { label: '1.6 kHz', hz: 1600, value: 1 },
    { label: '2.5 kHz', hz: 2500, value: 2 },
    { label: '4 kHz', hz: 4000, value: 2 },
    { label: '6.3 kHz', hz: 6300, value: 1 },
    { label: '10 kHz', hz: 10000, value: 1 },
    { label: '16 kHz', hz: 16000, value: 0 },
  ],
  night: [
    { label: '25 Hz', hz: 25, value: -4 },
    { label: '40 Hz', hz: 40, value: -4 },
    { label: '63 Hz', hz: 63, value: -3 },
    { label: '100 Hz', hz: 100, value: -2 },
    { label: '160 Hz', hz: 160, value: -1 },
    { label: '250 Hz', hz: 250, value: 0 },
    { label: '400 Hz', hz: 400, value: 1 },
    { label: '630 Hz', hz: 630, value: 1 },
    { label: '1 kHz', hz: 1000, value: 2 },
    { label: '1.6 kHz', hz: 1600, value: 2 },
    { label: '2.5 kHz', hz: 2500, value: 3 },
    { label: '4 kHz', hz: 4000, value: 3 },
    { label: '6.3 kHz', hz: 6300, value: 2 },
    { label: '10 kHz', hz: 10000, value: 0 },
    { label: '16 kHz', hz: 16000, value: -1 },
  ],
  voice: [
    { label: '25 Hz', hz: 25, value: -3 },
    { label: '40 Hz', hz: 40, value: -3 },
    { label: '63 Hz', hz: 63, value: -2 },
    { label: '100 Hz', hz: 100, value: -1 },
    { label: '160 Hz', hz: 160, value: 0 },
    { label: '250 Hz', hz: 250, value: 1 },
    { label: '400 Hz', hz: 400, value: 2 },
    { label: '630 Hz', hz: 630, value: 2 },
    { label: '1 kHz', hz: 1000, value: 3 },
    { label: '1.6 kHz', hz: 1600, value: 4 },
    { label: '2.5 kHz', hz: 2500, value: 4 },
    { label: '4 kHz', hz: 4000, value: 3 },
    { label: '6.3 kHz', hz: 6300, value: 2 },
    { label: '10 kHz', hz: 10000, value: 1 },
    { label: '16 kHz', hz: 16000, value: -1 },
  ],
}

export const presetLabels: Record<PresetKey, string> = {
  flat: 'Flat reference',
  cinema: 'Cinema impact',
  night: 'Night mode',
  voice: 'Dialogue lift',
  custom: 'Custom tuning',
}

export const commandSteps = [
  'sudo zypper install pulseaudio pulseaudio-utils pulseaudio-equalizer pulseaudio-module-ladspa pavucontrol ladspa',
  'pulseaudio -k && pulseaudio --start',
  'pactl list short sinks',
  'speaker-test -D default -c 8 -twav',
]

export function cloneBands(bands: EqBand[]) {
  return bands.map((band) => ({ ...band }))
}

export function formatDb(value: number) {
  return `${value > 0 ? '+' : ''}${value.toFixed(0)} dB`
}

export function getBandScaleClass(value: number) {
  if (value >= 3) return 'bg-success text-success-foreground'
  if (value >= 1) return 'bg-primary text-primary-foreground'
  if (value <= -3) return 'bg-destructive text-destructive-foreground'
  if (value < 0) return 'bg-warning text-warning-foreground'
  return 'bg-secondary text-secondary-foreground'
}

export function getRequiredChannel(channels: OutputChannel[], key: ChannelKey) {
  const channel = channels.find((item) => item.key === key)
  if (!channel) throw new Error(`Missing channel: ${key}`)
  return channel
}

export function createDefaultWorkbenchState(): WorkbenchState {
  return {
    preset: 'cinema',
    channels: baseChannels.map((channel) => ({ ...channel })),
    bands: cloneBands(presetBands.cinema),
    masterGain: 0,
    crossoverHz: 80,
    pluginName: 'mbeq_1197',
    pluginLabel: 'mbeq',
    sinkName: 'surround_eq',
    masterSink: 'alsa_output.pci-0000_00_1f.3.analog-surround-71',
    notes:
      'Measure each speaker at the main listening position, confirm the true sink name from pactl list short sinks, and keep a backup of the last known-working PulseAudio config before applying changes.',
  }
}

// Static project status (was previously a Retool backend function).
export type DirectoryInfo = { name: string; description: string }
export type LauncherInfo = {
  installCommand: string
  launcherScript: string
  installerScript: string
  desktopTemplate: string
  notes: string[]
}
export type ProjectStatus = {
  projectName: string
  directories: DirectoryInfo[]
  launcher: LauncherInfo
}

export const projectStatus: ProjectStatus = {
  projectName: 'Surround Workbench',
  directories: [
    { name: 'frontend/', description: 'React application source files.' },
    { name: 'launch-app.sh', description: 'One-click launcher script (builds & serves locally).' },
    { name: 'install-gnome-launcher.sh', description: 'Installs a GNOME .desktop entry & desktop shortcut.' },
    { name: 'SurroundWorkbench.desktop', description: 'Editable .desktop launcher template.' },
  ],
  launcher: {
    installCommand: './install-gnome-launcher.sh',
    launcherScript: 'launch-app.sh',
    installerScript: 'install-gnome-launcher.sh',
    desktopTemplate: 'SurroundWorkbench.desktop',
    notes: [
      'The GNOME installer creates an application launcher in ~/.local/share/applications/.',
      'When a desktop folder exists, the installer also copies a desktop shortcut there.',
      'If desktop icons are disabled in GNOME, the launcher still appears in Activities search and the app grid.',
    ],
  },
}

// One-stop config for the landing page.
// Bump VERSION when you cut a new release tag (purely cosmetic — the download
// URL already follows :latest so it auto-points at the newest published asset).

// 1) Your public repo URL (no trailing slash).
export const GITHUB_REPO =
  'https://github.com/audio-tumblweed/surroundsound-workbench'

// 2) Download URL for the zipped app.
//    "releases/latest/download/<asset-name>" always points to the newest release
//    that has this asset attached, so you never need to change it per release.
export const DOWNLOAD_URL =
  'https://github.com/audio-tumblweed/surroundsound-workbench/releases/latest/download/SurroundWorkbench-standalone.zip'

// 3) Version string shown in the hero badge + footer.
export const VERSION = 'v1.0.0'

// 4) Name/handle for the footer line.
export const AUTHOR = 'Audio Tumbleweed'

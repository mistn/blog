import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections'

export default {
  themes: ['github-light', 'night-owl'],
  customizeTheme(theme) {
    if (theme.name === 'github-light') theme.name = 'light'
    if (theme.name === 'night-owl') theme.name = 'dark'
  },
  frames: {
    showCopyToClipboardButton: true,
  },
  emitExternalStylesheet: false,
  plugins: [pluginCollapsibleSections()],
}

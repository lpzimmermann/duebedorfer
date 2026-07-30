export type Theme = 'jassteppich' | 'puravida'

const STORAGE_KEY = 'duebedorfer-theme'

export function loadTheme(): Theme {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'puravida' ? 'puravida' : 'jassteppich'
  } catch {
    return 'jassteppich'
  }
}

export function saveTheme(theme: Theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // localStorage unavailable — theme still applies, just isn't remembered
  }
}

interface ThemeContent {
  title: string
  tagline: string
  footer: string
  suitEmoji: string[]
  confetti: string[]
}

export const THEME_CONTENT: Record<Theme, ThemeContent> = {
  jassteppich: {
    title: 'Dübendorfer',
    tagline: 'De Jass-Zähler für alli, wo am liebschte wenig Pünkt händ',
    footer: 'Dübendorfer Jass Counter',
    suitEmoji: ['🔔', '🌹', '🌰', '🛡️'],
    confetti: ['🔔', '🌹', '🌰', '🛡️', '🎉'],
  },
  puravida: {
    title: 'Pura Vida Jass',
    tagline: 'El Jass-Zähler Pura Vida – für wenig Pünkt und mucho Vida! 🌴',
    footer: 'Pura Vida Jass Counter',
    suitEmoji: ['🦜', '🌺', '🥥', '🦥'],
    confetti: ['🦜', '🌺', '🥥', '🌴', '☀️'],
  },
}

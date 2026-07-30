import type { RoundDef } from './types'

/**
 * The six rounds of a Dübendorfer game, played in order. Counting differs
 * every round except the last two, which both award a flat 5 points to a
 * single player instead of counting per-card.
 */
export const ROUNDS: RoundDef[] = [
  {
    id: 'stich',
    type: 'count',
    name: 'Stich',
    emoji: '🃏',
    description: 'Jeder Stich zählt 1 Punkt.',
    pointsPerUnit: 1,
    maxTotal: 9,
  },
  {
    id: 'schaelle',
    type: 'count',
    name: 'Schälle',
    emoji: '🔔',
    description: 'Jede Schälle zählt 1 Punkt.',
    pointsPerUnit: 1,
    maxTotal: 9,
  },
  {
    id: 'ober',
    type: 'count',
    name: 'Ober',
    emoji: '👑',
    description: 'Jeder Ober zählt 2 Punkte.',
    pointsPerUnit: 2,
    maxTotal: 4,
  },
  {
    id: 'schaelle-koenig',
    type: 'single',
    name: 'Schälle König',
    emoji: '🤴',
    description: 'Wer den Schälle König sticht, kriegt 5 Punkte.',
    points: 5,
  },
  {
    id: 'letzter-stich',
    type: 'single',
    name: 'Letzte Stich',
    emoji: '🏁',
    description: 'Wer de letscht Stich macht, kriegt 5 Punkte.',
    points: 5,
  },
  {
    id: 'elferaus',
    type: 'single',
    name: 'Elferaus',
    emoji: '🐌',
    description: 'Wer als Letschte fertig wird, kriegt 5 Punkte.',
    points: 5,
  },
]

import type { RoundDef } from './types'

/**
 * The six rounds of a Dübendorfer game, played in order. Counting differs
 * every round except the last two, which both award a flat 5 points to a
 * single player instead of counting per-card.
 *
 * How many cards/units there are to award scales with how many decks are
 * in play (a 36-card Swiss deck per deck): the Stich total also depends on
 * how many players are splitting the deck.
 */
export function buildRounds(deckCount: number, playerCount: number): RoundDef[] {
  return [
    {
      id: 'stich',
      type: 'count',
      name: 'Stich',
      emoji: '🃏',
      description: 'Jede Stich zellt 1 Punkt.',
      pointsPerUnit: 1,
      maxTotal: Math.floor((deckCount * 36) / playerCount),
    },
    {
      id: 'schaelle',
      type: 'count',
      name: 'Schälle',
      emoji: '🔔',
      description: 'Jedi Schälle zellt 1 Punkt.',
      pointsPerUnit: 1,
      maxTotal: deckCount * 9,
    },
    {
      id: 'ober',
      type: 'count',
      name: 'Ober',
      emoji: '👑',
      description: 'Jede Ober zellt 2 Pünkt.',
      pointsPerUnit: 2,
      maxTotal: deckCount * 4,
    },
    {
      id: 'schaelle-koenig',
      type: 'count',
      name: 'Schälle König',
      emoji: '🤴',
      description: 'Jede Schälle-König git 5 Pünkt.',
      pointsPerUnit: 5,
      maxTotal: deckCount,
    },
    {
      id: 'letzter-stich',
      type: 'single',
      name: 'Letschti Stich',
      emoji: '🏁',
      description: 'Wer de letscht Stich macht, überchunnt 5 Pünkt.',
      points: 5,
    },
    {
      id: 'elferaus',
      type: 'single',
      name: 'Elferaus',
      emoji: '🐌',
      description: 'Wer als Letschti fertig wird, überchunnt 5 Pünkt.',
      points: 5,
    },
  ]
}

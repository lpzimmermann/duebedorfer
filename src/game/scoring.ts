import type { GameState, Player, RoundResult } from './types'

export interface Standing {
  player: Player
  total: number
}

export function totalsByPlayer(players: Player[], results: RoundResult[]): Standing[] {
  return players
    .map((player) => ({
      player,
      total: results.reduce((sum, result) => sum + (result.scores[player.id] ?? 0), 0),
    }))
    .sort((a, b) => a.total - b.total)
}

/**
 * Who starts (and is counted first) shifts by one player every round, like
 * the lead ("Vorhand") rotating around the table in real Jass.
 */
export function rotatePlayersForRound(players: Player[], roundIndex: number): Player[] {
  if (players.length === 0) return players
  const offset = roundIndex % players.length
  return [...players.slice(offset), ...players.slice(0, offset)]
}

export function resultForRound(results: RoundResult[], roundId: string): RoundResult | undefined {
  return results.find((result) => result.roundId === roundId)
}

export function withRoundResult(state: GameState, result: RoundResult): RoundResult[] {
  const withoutRound = state.results.filter((r) => r.roundId !== result.roundId)
  return [...withoutRound, result]
}

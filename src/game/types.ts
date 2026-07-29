export interface Player {
  id: string
  name: string
}

export interface CountRound {
  id: string
  type: 'count'
  name: string
  emoji: string
  description: string
  pointsPerUnit: number
}

export interface SingleRound {
  id: string
  type: 'single'
  name: string
  emoji: string
  description: string
  points: number
}

export type RoundDef = CountRound | SingleRound

/** Points earned by each player (by id) in one round. */
export type RoundScores = Record<string, number>

export interface RoundResult {
  roundId: string
  scores: RoundScores
}

export type GamePhase = 'setup' | 'playing' | 'finished'

export interface GameState {
  phase: GamePhase
  players: Player[]
  results: RoundResult[]
  currentRound: number
}

import { useState } from 'react'
import type { Player, RoundDef, RoundScores } from '../game/types'

interface RoundScoringProps {
  round: RoundDef
  players: Player[]
  initialScores?: RoundScores
  roundNumber: number
  totalRounds: number
  onConfirm: (scores: RoundScores) => void
  onBack?: () => void
}

function countsFromScores(round: RoundDef, players: Player[], scores?: RoundScores) {
  const perUnit = round.type === 'count' ? round.pointsPerUnit : 1
  const counts: Record<string, number> = {}
  for (const player of players) {
    const points = scores?.[player.id] ?? 0
    counts[player.id] = perUnit > 0 ? Math.round(points / perUnit) : 0
  }
  return counts
}

function winnerFromScores(players: Player[], scores?: RoundScores) {
  if (!scores) return null
  const winner = players.find((player) => (scores[player.id] ?? 0) > 0)
  return winner?.id ?? null
}

function RoundScoring({
  round,
  players,
  initialScores,
  roundNumber,
  totalRounds,
  onConfirm,
  onBack,
}: RoundScoringProps) {
  const [counts, setCounts] = useState<Record<string, number>>(() =>
    countsFromScores(round, players, initialScores),
  )
  const [winnerId, setWinnerId] = useState<string | null>(() =>
    winnerFromScores(players, initialScores),
  )

  function changeCount(playerId: string, delta: number) {
    setCounts((prev) => ({
      ...prev,
      [playerId]: Math.max(0, (prev[playerId] ?? 0) + delta),
    }))
  }

  function handleConfirm() {
    if (round.type === 'count') {
      const scores: RoundScores = {}
      for (const player of players) {
        scores[player.id] = (counts[player.id] ?? 0) * round.pointsPerUnit
      }
      onConfirm(scores)
    } else {
      if (!winnerId) return
      const scores: RoundScores = {}
      for (const player of players) {
        scores[player.id] = player.id === winnerId ? round.points : 0
      }
      onConfirm(scores)
    }
  }

  const canConfirm = round.type === 'count' || winnerId !== null
  const totalCounted =
    round.type === 'count' ? Object.values(counts).reduce((a, b) => a + b, 0) : null

  return (
    <section className="round-scoring card">
      <div className="round-header">
        <span className="round-progress">
          Runde {roundNumber} / {totalRounds}
        </span>
        <h2>
          <span aria-hidden="true">{round.emoji}</span> {round.name}
        </h2>
        <p className="round-description">{round.description}</p>
      </div>

      {round.type === 'count' ? (
        <ul className="count-list">
          {players.map((player) => (
            <li key={player.id} className="count-row">
              <span className="count-name">{player.name}</span>
              <div className="stepper">
                <button
                  type="button"
                  className="icon-button"
                  aria-label={`${player.name}: eins weniger`}
                  onClick={() => changeCount(player.id, -1)}
                >
                  −
                </button>
                <span className="stepper-value">{counts[player.id] ?? 0}</span>
                <button
                  type="button"
                  className="icon-button"
                  aria-label={`${player.name}: eins meh`}
                  onClick={() => changeCount(player.id, 1)}
                >
                  +
                </button>
              </div>
              <span className="count-points">
                {(counts[player.id] ?? 0) * round.pointsPerUnit} Pkt
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="winner-list">
          {players.map((player) => (
            <li key={player.id}>
              <button
                type="button"
                className={`winner-button${winnerId === player.id ? ' selected' : ''}`}
                onClick={() => setWinnerId(player.id)}
              >
                {player.name}
                {winnerId === player.id && <span aria-hidden="true"> ✓</span>}
              </button>
            </li>
          ))}
        </ul>
      )}

      {round.type === 'count' && (
        <p className="round-total-hint">Total erfasst: {totalCounted} Stück</p>
      )}

      <div className="round-actions">
        {onBack && (
          <button type="button" className="secondary-button" onClick={onBack}>
            ← Zrugg
          </button>
        )}
        <button
          type="button"
          className="primary-button"
          disabled={!canConfirm}
          onClick={handleConfirm}
        >
          {roundNumber === totalRounds ? 'Spiel fertig 🏆' : 'Nächschti Runde →'}
        </button>
      </div>
    </section>
  )
}

export default RoundScoring

import { useState } from 'react'
import type { CountRound, Player, RoundScores } from '../game/types'
import { lastManualIndex, remainingAt, resolveForcedPlayers } from '../game/countWizard'

interface CountRoundWizardProps {
  round: CountRound
  players: Player[]
  initialScores?: RoundScores
  roundNumber: number
  totalRounds: number
  onConfirm: (scores: RoundScores) => void
  onBack?: () => void
}

type Phase = 'intro' | 'wizard' | 'review'

function countsFromScores(round: CountRound, players: Player[], scores?: RoundScores) {
  const counts: Record<string, number> = {}
  for (const player of players) {
    counts[player.id] = Math.round((scores?.[player.id] ?? 0) / round.pointsPerUnit)
  }
  return counts
}

function CountRoundWizard({
  round,
  players,
  initialScores,
  roundNumber,
  totalRounds,
  onConfirm,
  onBack,
}: CountRoundWizardProps) {
  const hasInitial = initialScores !== undefined
  const [initial] = useState(() => {
    const initialCounts = countsFromScores(round, players, initialScores)
    return {
      counts: initialCounts,
      lastManual: hasInitial ? lastManualIndex(players, round.maxTotal, initialCounts) : -1,
    }
  })
  const [phase, setPhase] = useState<Phase>(hasInitial ? 'review' : 'intro')
  const [counts, setCounts] = useState<Record<string, number>>(initial.counts)
  const [playerIndex, setPlayerIndex] = useState(0)
  const [lastManual, setLastManual] = useState(initial.lastManual)

  function startWizard() {
    const resolved = resolveForcedPlayers(players, round.maxTotal, {}, 0)
    setCounts(resolved.counts)
    setLastManual(-1)
    if (resolved.nextIndex >= players.length) {
      setPhase('review')
    } else {
      setPlayerIndex(resolved.nextIndex)
      setPhase('wizard')
    }
  }

  function pick(value: number) {
    const player = players[playerIndex]
    const updated = { ...counts, [player.id]: value }
    setLastManual(playerIndex)
    const resolved = resolveForcedPlayers(players, round.maxTotal, updated, playerIndex + 1)
    setCounts(resolved.counts)
    if (resolved.nextIndex >= players.length) {
      setPhase('review')
    } else {
      setPlayerIndex(resolved.nextIndex)
    }
  }

  function editFromReview(index: number) {
    const cleared = { ...counts }
    for (let i = index; i < players.length; i++) cleared[players[i].id] = 0
    const resolved = resolveForcedPlayers(players, round.maxTotal, cleared, index)
    setCounts(resolved.counts)
    if (resolved.nextIndex >= players.length) {
      setPhase('review')
    } else {
      setPlayerIndex(resolved.nextIndex)
      setPhase('wizard')
    }
  }

  function wizardBack() {
    if (playerIndex === 0) {
      setPhase('intro')
    } else {
      setPlayerIndex(playerIndex - 1)
    }
  }

  function reviewBack() {
    if (lastManual >= 0) {
      editFromReview(lastManual)
    } else {
      setPhase('intro')
    }
  }

  function confirm() {
    const scores: RoundScores = {}
    for (const player of players) {
      scores[player.id] = (counts[player.id] ?? 0) * round.pointsPerUnit
    }
    onConfirm(scores)
  }

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

      {phase === 'intro' && (
        <div className="wizard-intro">
          <p className="wizard-hint">
            Zellet zäme use, wär wie viel {round.name} gno hät. Los gaht's mit{' '}
            <strong>{players[0]?.name}</strong>.
          </p>
          <div className="round-actions">
            {onBack && (
              <button type="button" className="secondary-button" onClick={onBack}>
                ← Zrugg
              </button>
            )}
            <button type="button" className="primary-button" onClick={startWizard}>
              Zähle starten →
            </button>
          </div>
        </div>
      )}

      {phase === 'wizard' &&
        (() => {
          const remaining = remainingAt(players, round.maxTotal, counts, playerIndex)
          const player = players[playerIndex]
          const options = Array.from({ length: remaining + 1 }, (_, n) => n)
          return (
            <div className="wizard-dial" key={playerIndex}>
              <p className="wizard-player">
                Wie viel <strong>{round.name}</strong> hät{' '}
                <span className="wizard-player-name">{player.name}</span> gno?
              </p>
              <p className="wizard-hint">No {remaining} übrig zum verteile.</p>
              <div className="dial-grid">
                {options.map((n) => (
                  <button
                    key={n}
                    type="button"
                    className="dial-button"
                    aria-label={`${n} für ${player.name}`}
                    onClick={() => pick(n)}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <div className="round-actions">
                <button type="button" className="secondary-button" onClick={wizardBack}>
                  ← Zrugg
                </button>
              </div>
            </div>
          )
        })()}

      {phase === 'review' && (
        <div className="wizard-review">
          <ul className="count-list">
            {players.map((player, index) => (
              <li key={player.id} className="count-row">
                <span className="count-name">{player.name}</span>
                <span className="stepper-value">{counts[player.id] ?? 0}</span>
                <span className="count-points">
                  {(counts[player.id] ?? 0) * round.pointsPerUnit} Pkt
                </span>
                {index <= lastManual ? (
                  <button
                    type="button"
                    className="icon-button"
                    aria-label={`${player.name} korrigiere`}
                    onClick={() => editFromReview(index)}
                  >
                    ✎
                  </button>
                ) : (
                  <span className="icon-button-placeholder" aria-hidden="true" />
                )}
              </li>
            ))}
          </ul>
          <div className="round-actions">
            <button type="button" className="secondary-button" onClick={reviewBack}>
              ← Zrugg
            </button>
            <button type="button" className="primary-button" onClick={confirm}>
              {roundNumber === totalRounds ? 'Spiel fertig 🏆' : 'Nächschti Runde →'}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

export default CountRoundWizard

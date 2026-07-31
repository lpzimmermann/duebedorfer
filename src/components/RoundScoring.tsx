import { useState } from 'react'
import type { Player, RoundScores, SingleRound } from '../game/types'
import ElferausDiagram from './ElferausDiagram'

interface RoundScoringProps {
  round: SingleRound
  players: Player[]
  initialScores?: RoundScores
  roundNumber: number
  totalRounds: number
  onConfirm: (scores: RoundScores) => void
  onBack?: () => void
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
  const [winnerId, setWinnerId] = useState<string | null>(() =>
    winnerFromScores(players, initialScores),
  )

  function handleConfirm() {
    if (!winnerId) return
    const scores: RoundScores = {}
    for (const player of players) {
      scores[player.id] = player.id === winnerId ? round.points : 0
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

      {round.id === 'elferaus' && (
        <div className="elferaus-explainer">
          <h3>Wie gaht de Elferaus?</h3>
          <p>
            Jedi Farb fangt i de Mitti mit emene Zäni a. Drunder chunnt – aber nur, wenn s Zäni
            scho ligt – zerscht s Nüni, dennzumal s Achti, s Sibni und ganz zletscht s Sächsi.
            Obenuse gaht's glich: Under, Ober, König und Ass chöme dezue, aber jedes nur, wenn d
            Charte drunder scho ligt.
          </p>
          <ElferausDiagram />
          <p>
            Wenn du dra bisch, muesch – wenn's gaht – mindeschtens ei Charte abelege. Was witers
            gültig wär, darfsch zrugghalte. Ligt zum Bispiel scho s Eichle Nüni, darfsch (muesch
            aber nur eis) s Eichle Achti abelege. Häsch no meh gültigi Charte, chasch die o
            abelege – muesch aber nöd, und manchmal isch's taktisch besser, wenn d's nöd machsch.
          </p>
          <p>Wer als Letschti no Charte i de Hand hät, verliert d Rundi und überchunnt 5 Pünkt.</p>
        </div>
      )}

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

      <div className="round-actions">
        {onBack && (
          <button type="button" className="secondary-button" onClick={onBack}>
            ← Zrugg
          </button>
        )}
        <button
          type="button"
          className="primary-button"
          disabled={winnerId === null}
          onClick={handleConfirm}
        >
          {roundNumber === totalRounds ? 'Spiel fertig 🏆' : 'Nächschti Runde →'}
        </button>
      </div>
    </section>
  )
}

export default RoundScoring

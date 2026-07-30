import type { Standing } from '../game/scoring'
import Scoreboard from './Scoreboard'

interface GameOverProps {
  standings: Standing[]
  onNewGame: () => void
  confetti: string[]
}

function GameOver({ standings, onNewGame, confetti }: GameOverProps) {
  const winner = standings[0]

  return (
    <section className="game-over">
      <div className="confetti-row" aria-hidden="true">
        {confetti.map((emoji, i) => (
          <span key={i} className="confetti">
            {emoji}
          </span>
        ))}
      </div>

      <div className="card winner-card">
        <h2>Gwunne hät...</h2>
        <p className="winner-name">{winner?.player.name}</p>
        <p className="winner-points">{winner?.total} Pünkt – weniger gaht nöd! 👑</p>
      </div>

      <Scoreboard standings={standings} title="Schlusstand" />

      <button type="button" className="primary-button" onClick={onNewGame}>
        Neus Spiel 🔄
      </button>
    </section>
  )
}

export default GameOver

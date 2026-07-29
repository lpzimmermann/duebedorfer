import type { Standing } from '../game/scoring'
import Scoreboard from './Scoreboard'

interface GameOverProps {
  standings: Standing[]
  onNewGame: () => void
}

const CONFETTI = ['🔔', '🌹', '🌰', '🛡️', '🎉']

function GameOver({ standings, onNewGame }: GameOverProps) {
  const winner = standings[0]

  return (
    <section className="game-over">
      <div className="confetti-row" aria-hidden="true">
        {CONFETTI.map((emoji, i) => (
          <span key={i} className="confetti">
            {emoji}
          </span>
        ))}
      </div>

      <div className="card winner-card">
        <h2>Gwunne het...</h2>
        <p className="winner-name">{winner?.player.name}</p>
        <p className="winner-points">{winner?.total} Punkt – weniger geht nöd! 👑</p>
      </div>

      <Scoreboard standings={standings} title="Schlusstand" />

      <button type="button" className="primary-button" onClick={onNewGame}>
        Neus Spiel 🔄
      </button>
    </section>
  )
}

export default GameOver

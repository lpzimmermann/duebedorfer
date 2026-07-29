import type { Standing } from '../game/scoring'

interface ScoreboardProps {
  standings: Standing[]
  title?: string
}

const MEDALS = ['🥇', '🥈', '🥉']

function Scoreboard({ standings, title = 'Punktestand' }: ScoreboardProps) {
  return (
    <section className="scoreboard card">
      <h2>{title}</h2>
      <ol className="standings">
        {standings.map((standing, index) => (
          <li key={standing.player.id} className="standing-row">
            <span className="standing-rank">{MEDALS[index] ?? `${index + 1}.`}</span>
            <span className="standing-name">{standing.player.name}</span>
            <span className="standing-total">{standing.total}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default Scoreboard

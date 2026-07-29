import { useEffect, useState } from 'react'
import './App.css'
import PlayerSetup from './components/PlayerSetup'
import RoundScoring from './components/RoundScoring'
import Scoreboard from './components/Scoreboard'
import GameOver from './components/GameOver'
import { ROUNDS } from './game/rounds'
import { resultForRound, totalsByPlayer, withRoundResult } from './game/scoring'
import { clearGame, loadGame, saveGame } from './game/storage'
import type { GameState, Player, RoundScores } from './game/types'

const INITIAL_STATE: GameState = {
  phase: 'setup',
  players: [],
  results: [],
  currentRound: 0,
}

function App() {
  const [game, setGame] = useState<GameState>(() => loadGame() ?? INITIAL_STATE)

  useEffect(() => {
    if (game.phase === 'setup') {
      clearGame()
    } else {
      saveGame(game)
    }
  }, [game])

  function startGame(players: Player[]) {
    setGame({ phase: 'playing', players, results: [], currentRound: 0 })
  }

  function confirmRound(scores: RoundScores) {
    const round = ROUNDS[game.currentRound]
    const results = withRoundResult(game, { roundId: round.id, scores })
    const isLastRound = game.currentRound === ROUNDS.length - 1
    setGame({
      ...game,
      results,
      currentRound: isLastRound ? game.currentRound : game.currentRound + 1,
      phase: isLastRound ? 'finished' : 'playing',
    })
  }

  function goBack() {
    setGame((prev) => ({ ...prev, currentRound: Math.max(0, prev.currentRound - 1) }))
  }

  function newGame() {
    setGame(INITIAL_STATE)
  }

  const standings = totalsByPlayer(game.players, game.results)

  return (
    <div className="app">
      <header className="app-header">
        <h1>Dübendorfer</h1>
        <p className="tagline">De Jass-Punktezähler für alli, wo möglichst wenig wei ha</p>
      </header>

      <main className="app-main">
        {game.phase === 'setup' && <PlayerSetup onStart={startGame} />}

        {game.phase === 'playing' && (
          <div className="playing-layout">
            <RoundScoring
              round={ROUNDS[game.currentRound]}
              players={game.players}
              initialScores={resultForRound(game.results, ROUNDS[game.currentRound].id)?.scores}
              roundNumber={game.currentRound + 1}
              totalRounds={ROUNDS.length}
              onConfirm={confirmRound}
              onBack={game.currentRound > 0 ? goBack : undefined}
            />
            <Scoreboard standings={standings} />
          </div>
        )}

        {game.phase === 'finished' && <GameOver standings={standings} onNewGame={newGame} />}
      </main>

      <footer className="app-footer">
        <p>Dübendorfer Jass Counter</p>
      </footer>
    </div>
  )
}

export default App

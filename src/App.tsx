import { useEffect, useState } from 'react'
import './App.css'
import PlayerSetup from './components/PlayerSetup'
import RoundScoring from './components/RoundScoring'
import CountRoundWizard from './components/CountRoundWizard'
import Scoreboard from './components/Scoreboard'
import GameOver from './components/GameOver'
import ConfirmDialog from './components/ConfirmDialog'
import { buildRounds } from './game/rounds'
import { resultForRound, totalsByPlayer, withRoundResult } from './game/scoring'
import { clearGame, loadGame, saveGame } from './game/storage'
import type { GameState, Player, RoundScores } from './game/types'

const INITIAL_STATE: GameState = {
  phase: 'setup',
  players: [],
  deckCount: 1,
  results: [],
  currentRound: 0,
}

function App() {
  const [game, setGame] = useState<GameState>(() => loadGame() ?? INITIAL_STATE)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  useEffect(() => {
    if (game.phase === 'setup') {
      clearGame()
    } else {
      saveGame(game)
    }
  }, [game])

  const rounds = game.players.length > 0 ? buildRounds(game.deckCount || 1, game.players.length) : []

  function startGame(players: Player[], deckCount: number) {
    setGame({ phase: 'playing', players, deckCount, results: [], currentRound: 0 })
  }

  function confirmRound(scores: RoundScores) {
    const round = rounds[game.currentRound]
    const results = withRoundResult(game, { roundId: round.id, scores })
    const isLastRound = game.currentRound === rounds.length - 1
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
        {game.phase !== 'setup' && (
          <button
            type="button"
            className="reset-button"
            aria-label="Spiel zrugsetze"
            onClick={() => setShowResetConfirm(true)}
          >
            ↺
          </button>
        )}
        <h1>Dübendorfer</h1>
        <p className="tagline">Dr Jass-Zähler für alli, wo am liebschte wenig Pünkt hei</p>
      </header>

      {showResetConfirm && (
        <ConfirmDialog
          title="Spiel würklich zrugsetze?"
          message="Das löscht de ganz Punktestand vo däm Spiel. Das cha me nüme rückgängig mache."
          confirmLabel="Ja, zrugsetze"
          cancelLabel="Abbräche"
          onConfirm={() => {
            newGame()
            setShowResetConfirm(false)
          }}
          onCancel={() => setShowResetConfirm(false)}
        />
      )}

      <main className="app-main">
        {game.phase === 'setup' && <PlayerSetup onStart={startGame} />}

        {game.phase === 'playing' &&
          (() => {
            const round = rounds[game.currentRound]
            const initialScores = resultForRound(game.results, round.id)?.scores
            return (
              <div className="playing-layout">
                {round.type === 'count' ? (
                  <CountRoundWizard
                    key={round.id}
                    round={round}
                    players={game.players}
                    initialScores={initialScores}
                    roundNumber={game.currentRound + 1}
                    totalRounds={rounds.length}
                    onConfirm={confirmRound}
                    onBack={game.currentRound > 0 ? goBack : undefined}
                  />
                ) : (
                  <RoundScoring
                    key={round.id}
                    round={round}
                    players={game.players}
                    initialScores={initialScores}
                    roundNumber={game.currentRound + 1}
                    totalRounds={rounds.length}
                    onConfirm={confirmRound}
                    onBack={game.currentRound > 0 ? goBack : undefined}
                  />
                )}
                <Scoreboard standings={standings} />
              </div>
            )
          })()}

        {game.phase === 'finished' && <GameOver standings={standings} onNewGame={newGame} />}
      </main>

      <footer className="app-footer">
        <p>Dübendorfer Jass Counter</p>
      </footer>
    </div>
  )
}

export default App

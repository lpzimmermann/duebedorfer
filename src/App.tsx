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
import { loadTheme, saveTheme, THEME_CONTENT, type Theme } from './theme'

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
  const [theme, setTheme] = useState<Theme>(() => loadTheme())

  useEffect(() => {
    if (game.phase === 'setup') {
      clearGame()
    } else {
      saveGame(game)
    }
  }, [game])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    saveTheme(theme)
  }, [theme])

  const content = THEME_CONTENT[theme]

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

  function restartWithSamePlayers() {
    setGame((prev) => ({ ...prev, phase: 'playing', results: [], currentRound: 0 }))
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
        <h1>{content.title}</h1>
        <p className="tagline">{content.tagline}</p>
      </header>

      {showResetConfirm && (
        <ConfirmDialog
          title="Spiel würklich zrugsetze?"
          message="Das löscht de ganz Punktestand vo däm Spiel. Das cha me nüme rückgängig mache."
          confirmLabel="Ja, zrugsetze"
          cancelLabel="Abbräche"
          extraAction={{
            label: 'Nomol mit gliche Spieler',
            onClick: () => {
              restartWithSamePlayers()
              setShowResetConfirm(false)
            },
          }}
          onConfirm={() => {
            newGame()
            setShowResetConfirm(false)
          }}
          onCancel={() => setShowResetConfirm(false)}
        />
      )}

      <main className="app-main">
        {game.phase === 'setup' && <PlayerSetup onStart={startGame} suitEmoji={content.suitEmoji} />}

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

        {game.phase === 'finished' && (
          <GameOver standings={standings} onNewGame={newGame} confetti={content.confetti} />
        )}
      </main>

      <footer className="app-footer">
        <div className="theme-switch" role="group" aria-label="Theme wähle">
          <button
            type="button"
            className={theme === 'jassteppich' ? 'active' : ''}
            onClick={() => setTheme('jassteppich')}
          >
            🇨🇭 Jassteppich
          </button>
          <button
            type="button"
            className={theme === 'puravida' ? 'active' : ''}
            onClick={() => setTheme('puravida')}
          >
            🦜 Pura Vida
          </button>
        </div>
        <p>{content.footer}</p>
      </footer>
    </div>
  )
}

export default App

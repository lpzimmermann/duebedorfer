import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Player } from '../game/types'

const MIN_PLAYERS = 2
const MAX_PLAYERS = 8
const DECK_OPTIONS = [1, 2, 3]

interface PlayerSetupProps {
  onStart: (players: Player[], deckCount: number) => void
  suitEmoji: string[]
}

type Step = 'decks' | 'players'

function PlayerSetup({ onStart, suitEmoji }: PlayerSetupProps) {
  const [step, setStep] = useState<Step>('decks')
  const [deckCount, setDeckCount] = useState(1)
  const [names, setNames] = useState<string[]>(['', ''])

  function updateName(index: number, value: string) {
    setNames((prev) => prev.map((name, i) => (i === index ? value : name)))
  }

  function addPlayer() {
    if (names.length >= MAX_PLAYERS) return
    setNames((prev) => [...prev, ''])
  }

  function removePlayer(index: number) {
    if (names.length <= MIN_PLAYERS) return
    setNames((prev) => prev.filter((_, i) => i !== index))
  }

  const trimmedNames = names.map((name) => name.trim())
  const canStart =
    trimmedNames.length >= MIN_PLAYERS &&
    trimmedNames.every((name) => name.length > 0) &&
    new Set(trimmedNames).size === trimmedNames.length

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!canStart) return
    const players: Player[] = trimmedNames.map((name, i) => ({
      id: `${Date.now()}-${i}`,
      name,
    }))
    onStart(players, deckCount)
  }

  if (step === 'decks') {
    return (
      <div className="setup card">
        <h2>Wie viel Kartespiel? 🎴</h2>
        <p className="setup-hint">Mit meh Deck git's o meh Stich, Schälle und Ober zum verteile.</p>

        <div className="deck-options">
          {DECK_OPTIONS.map((count) => (
            <button
              key={count}
              type="button"
              className={`deck-button${deckCount === count ? ' selected' : ''}`}
              onClick={() => setDeckCount(count)}
            >
              <span className="deck-count">{count}</span>
              <span className="deck-label">Deck</span>
            </button>
          ))}
        </div>

        <button type="button" className="primary-button" onClick={() => setStep('players')}>
          Witer →
        </button>
      </div>
    )
  }

  return (
    <form className="setup card" onSubmit={handleSubmit}>
      <h2>Wär spillt mit? 🎉</h2>
      <p className="setup-hint">Zwüschet 2 und 8 Spieler:inne.</p>
      <p className="setup-hint">
        Am beschte tuesch sie i de Reihefolg yytrage, wie am Tisch gsässe wird – also eifach{' '}
        <em>de Ohrfiige nah</em>.
      </p>

      <ul className="player-list">
        {names.map((name, index) => (
          <li key={index} className="player-row">
            <span className="player-suit" aria-hidden="true">
              {suitEmoji[index % suitEmoji.length]}
            </span>
            <input
              type="text"
              value={name}
              placeholder={`Spieler:in ${index + 1}`}
              maxLength={20}
              onChange={(event) => updateName(index, event.target.value)}
            />
            {names.length > MIN_PLAYERS && (
              <button
                type="button"
                className="icon-button"
                aria-label={`Spieler:in ${index + 1} usenäh`}
                onClick={() => removePlayer(index)}
              >
                ✕
              </button>
            )}
          </li>
        ))}
      </ul>

      {names.length < MAX_PLAYERS && (
        <button type="button" className="secondary-button add-player-button" onClick={addPlayer}>
          + Spieler:in derzue
        </button>
      )}

      <div className="round-actions">
        <button type="button" className="secondary-button" onClick={() => setStep('decks')}>
          ← Zrugg
        </button>
        <button type="submit" className="primary-button" disabled={!canStart}>
          Auf gaht's 🃏
        </button>
      </div>
    </form>
  )
}

export default PlayerSetup

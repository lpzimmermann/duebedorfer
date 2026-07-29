import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Player } from '../game/types'

const MIN_PLAYERS = 2
const MAX_PLAYERS = 8
const SUIT_EMOJI = ['🔔', '🌹', '🌰', '🛡️']

interface PlayerSetupProps {
  onStart: (players: Player[]) => void
}

function PlayerSetup({ onStart }: PlayerSetupProps) {
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
    onStart(players)
  }

  return (
    <form className="setup card" onSubmit={handleSubmit}>
      <h2>Wer spillt mit? 🎉</h2>
      <p className="setup-hint">Zwüsche 2 und 8 Spieler:inne.</p>

      <ul className="player-list">
        {names.map((name, index) => (
          <li key={index} className="player-row">
            <span className="player-suit" aria-hidden="true">
              {SUIT_EMOJI[index % SUIT_EMOJI.length]}
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
                aria-label={`Spieler:in ${index + 1} entfernen`}
                onClick={() => removePlayer(index)}
              >
                ✕
              </button>
            )}
          </li>
        ))}
      </ul>

      {names.length < MAX_PLAYERS && (
        <button type="button" className="secondary-button" onClick={addPlayer}>
          + Spieler:in dezue
        </button>
      )}

      <button type="submit" className="primary-button" disabled={!canStart}>
        Los geht's 🃏
      </button>
    </form>
  )
}

export default PlayerSetup

import { useRef } from 'react'
import faaahSound from '../assets/sounds/faaah.mp3'

function MemeSoundButton() {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  function play() {
    if (!audioRef.current) {
      audioRef.current = new Audio(faaahSound)
    }
    audioRef.current.currentTime = 0
    audioRef.current.play().catch(() => {
      // Autoplay can be blocked in rare cases; nothing to recover from here.
    })
  }

  return (
    <button type="button" className="sound-button" onClick={play} aria-label="FAAAAAAAHH!">
      📢
    </button>
  )
}

export default MemeSoundButton

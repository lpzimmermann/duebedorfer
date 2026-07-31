const SUITS = [
  { emoji: '🔔', name: 'Schälle' },
  { emoji: '🌹', name: 'Rose' },
  { emoji: '🌰', name: 'Eichle' },
  { emoji: '🛡️', name: 'Schilte' },
]

const ABOVE = ['Ass', 'König', 'Ober', 'Under']
const BELOW = ['9', '8', '7', '6']

function ElferausDiagram() {
  return (
    <div className="elferaus-diagram" role="img" aria-label="Jedi Farb wachst vom Zäni us abe bis zum Sächsi und ufe bis zum Ass">
      {SUITS.map((suit) => (
        <div className="elferaus-column" key={suit.name}>
          <span className="elferaus-suit" aria-hidden="true">
            {suit.emoji}
          </span>
          {ABOVE.map((card) => (
            <span key={card} className="elferaus-card">
              {card[0]}
            </span>
          ))}
          <span className="elferaus-card elferaus-start">10</span>
          {BELOW.map((card) => (
            <span key={card} className="elferaus-card">
              {card}
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}

export default ElferausDiagram

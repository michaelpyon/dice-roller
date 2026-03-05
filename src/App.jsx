import { useState, useCallback, useEffect, useRef } from 'react'

const DOT_POSITIONS = {
  1: [[50, 50]],
  2: [[25, 25], [75, 75]],
  3: [[25, 25], [50, 50], [75, 75]],
  4: [[25, 25], [75, 25], [25, 75], [75, 75]],
  5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
  6: [[25, 25], [75, 25], [25, 50], [75, 50], [25, 75], [75, 75]],
}

function Die({ value, rolling }) {
  const dots = DOT_POSITIONS[value] || []
  return (
    <div
      className={`die ${rolling ? 'rolling' : ''}`}
    >
      {dots.map(([x, y], i) => (
        <div
          key={i}
          className="dot"
          style={{ left: `${x}%`, top: `${y}%` }}
        />
      ))}
    </div>
  )
}

function Particles({ type }) {
  const count = type === 'snake-eyes' ? 40 : 20
  return (
    <div className="particles">
      {Array.from({ length: count }, (_, i) => {
        const angle = (360 / count) * i
        const distance = 80 + Math.random() * 120
        const size = type === 'snake-eyes' ? 4 + Math.random() * 6 : 3 + Math.random() * 4
        const dx = Math.cos((angle * Math.PI) / 180) * distance
        const dy = Math.sin((angle * Math.PI) / 180) * distance
        return (
          <div
            key={i}
            className={`particle particle-${type}`}
            style={{
              '--dx': `${dx}px`,
              '--dy': `${dy}px`,
              '--size': `${size}px`,
              '--delay': `${Math.random() * 0.15}s`,
            }}
          />
        )
      })}
    </div>
  )
}

export default function App() {
  const [die1, setDie1] = useState(1)
  const [die2, setDie2] = useState(2)
  const [rolling, setRolling] = useState(false)
  const [result, setResult] = useState(null) // 'seven-eleven', 'doubles', 'snake-eyes', null
  const [streak, setStreak] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const [rollHistory, setRollHistory] = useState([])
  const timeoutRef = useRef(null)

  const roll = useCallback(() => {
    if (rolling) return
    setRolling(true)
    setShowCelebration(false)
    setResult(null)

    // Animate through random values
    let ticks = 0
    const maxTicks = 10
    const interval = setInterval(() => {
      setDie1(Math.ceil(Math.random() * 6))
      setDie2(Math.ceil(Math.random() * 6))
      ticks++
      if (ticks >= maxTicks) {
        clearInterval(interval)
        const d1 = Math.ceil(Math.random() * 6)
        const d2 = Math.ceil(Math.random() * 6)
        setDie1(d1)
        setDie2(d2)
        setRolling(false)

        const sum = d1 + d2
        const isSnakeEyes = d1 === 1 && d2 === 1
        const isDoubles = d1 === d2 && !isSnakeEyes
        const isSevenEleven = sum === 7 || sum === 11

        let newResult = null
        if (isSnakeEyes) newResult = 'snake-eyes'
        else if (isDoubles) newResult = 'doubles'
        else if (isSevenEleven) newResult = 'seven-eleven'

        setResult(newResult)
        setRollHistory(prev => [...prev.slice(-19), { d1, d2, sum, result: newResult }])

        if (newResult) {
          setStreak(prev => prev + 1)
          setShowCelebration(true)
          if (timeoutRef.current) clearTimeout(timeoutRef.current)
          timeoutRef.current = setTimeout(() => setShowCelebration(false), 2500)
        } else {
          setStreak(0)
        }
      }
    }, 60)
  }, [rolling])

  useEffect(() => {
    const handler = (e) => {
      if (e.code === 'Space' || e.key === 'Enter') {
        e.preventDefault()
        roll()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [roll])

  useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }
  }, [])

  const sum = die1 + die2
  const celebrationClass = showCelebration ? `celebration-${result}` : ''

  const resultLabel = result === 'snake-eyes'
    ? 'SNAKE EYES!'
    : result === 'doubles'
    ? 'DOUBLES!'
    : result === 'seven-eleven'
    ? sum === 7 ? 'LUCKY 7!' : 'ELEVEN!'
    : null

  return (
    <div className={`app ${celebrationClass}`} style={{ height: '100dvh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div className={`glow-overlay ${showCelebration ? `glow-${result}` : ''}`} />

      {showCelebration && <Particles type={result} />}

      <div className="container" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        {/* Fixed top section */}
        <div style={{ flexShrink: 0 }}>
          <h1 className="title">Dice Roller</h1>

          <div style={{ height: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {streak > 1 && (
              <div className={`multiplier ${showCelebration ? `mult-${result}` : ''}`} style={{ margin: 0 }}>
                <span className="mult-x">{streak}x</span>
                <span className="mult-label">STREAK</span>
              </div>
            )}
          </div>

          <div className="dice-area">
            <Die value={die1} rolling={rolling} />
            <Die value={die2} rolling={rolling} />
          </div>

          <div className="sum-display">
            {!rolling && <span className="sum-value">{sum}</span>}
          </div>

          <div style={{ height: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {showCelebration && resultLabel && (
              <div className={`result-banner banner-${result}`} style={{ margin: 0 }}>
                {resultLabel}
              </div>
            )}
          </div>

          <button
            className="roll-btn"
            onClick={roll}
            disabled={rolling}
          >
            {rolling ? 'Rolling...' : 'Roll Dice'}
          </button>

          <p className="hint">Press Space or Enter to roll</p>
        </div>

        {/* Scrollable history fills remaining space */}
        {rollHistory.length > 0 && (
          <div className="history" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <p className="history-title" style={{ flexShrink: 0 }}>History</p>
            <div className="history-rolls" style={{ flex: 1, overflowY: 'auto' }}>
              {[...rollHistory].reverse().map((r, i) => (
                <div key={i} className={`history-item ${r.result ? `hist-${r.result}` : ''}`}>
                  <span className="hist-dice">{r.d1} + {r.d2}</span>
                  <span className="hist-sum">= {r.sum}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

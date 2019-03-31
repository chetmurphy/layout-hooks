import * as React from 'react'

export function useFatBirdImage() {

  const style: React.CSSProperties = {
    userSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none',
    MozUserSelect: 'none',
    // pointerEvents: 'none'
    width: 70,
    height: 60
  }

  const [cycle, setCycle] = React.useState(0)

  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (count % 15 === 0) {
      setCycle((cycle + 1) % 8)
    }
    setCount(count + 1)
  },[])

  function frame(id: number) {
    return require(`../assets/fatBird/frame-${id + 1}.png`)
  }

  return (
    <img
      id={`frame-${cycle + 1}`}
      key={`frame-${cycle + 1}`}
      src={frame(cycle)}
      style={style}
    />
  )
}

export function useFatBird() {
  const [y, setY] = React.useState(50)

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      e.stopPropagation()
      e.preventDefault()
      if (e && e.key === 'ArrowUp') {
        setY(Math.max(y - 1, 25))
      } else if (e && e.key === 'ArrowDown') {
        setY(Math.min(y + 1, 75))
      }
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  })

  return (
    <div
    data-layout={{
      name: 'fatBird',
      location: {left: '10%', top: `${y}%`, width: 30, height: 30},
    }}
    > 
      {useFatBirdImage()}
    </div>
  )
}

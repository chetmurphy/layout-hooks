import * as React from 'react'

import { ISize } from '../types'
import ReactResizeDetector from 'react-resize-detector'
import { IBounds } from './BlockUtils'

export function useWindowSize() {
  const [size, setSize] = React.useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  React.useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight })
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return size
}

export function useContainerSize(containersize: ISize) {
  const [containerSize, setContainerSize] = React.useState({
    width: containersize ? containersize.width : 0,
    height: containersize ? containersize.height : 0
  })

  const handleResize = (width: number, height: number) => {
    setContainerSize({ width: window.innerWidth, height: window.innerHeight })
  }

  const jsx: any[] = []
  if (containersize) {
    jsx.push(null)
  } else {
    jsx.push(
      <ReactResizeDetector
        key={`contentResizeDetector ${'xx'}`}
        handleWidth={true}
        handleHeight={true}
        onResize={handleResize}
      />
    )
  }

  return [containerSize, jsx]
}

// Bounds is global for window and local to each Layout
export function useBounds(containersize: ISize) {
  useWindowSize()

  useContainerSize(containersize)

  const [bounds] = React.useState<IBounds>({
    viewport: { width: window.innerWidth, height: window.innerHeight },
    container: {
      width:containersize ? containersize.width : 0,
      height: containersize ? containersize.height : 0
    }
  })

  return bounds
}

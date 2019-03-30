import * as React from 'react'

import { ILayoutProps } from '../../../src/Layout'
import ReactResizeDetector from 'react-resize-detector'
import { IBounds } from '../../../src/components/BlockUtils'

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

export function useContainerSize(props: ILayoutProps) {
  const [containerSize, setContainerSize] = React.useState({
    width: props.containersize ? props.containersize.width : 0,
    height: props.containersize ? props.containersize.height : 0
  })

  const handleResize = (width: number, height: number) => {
    setContainerSize({ width: window.innerWidth, height: window.innerHeight })
  }

  const jsx: any[] = []
  if (props.containersize) {
    jsx.push(null)
  } else {
    jsx.push(
      <ReactResizeDetector
        key={`contentResizeDetector ${props.name}`}
        handleWidth={true}
        handleHeight={true}
        onResize={handleResize}
      />
    )
  }

  return [containerSize, jsx]
}

// Bounds is global for window and local to each Layout
export function useBounds(props: ILayoutProps) {
  const size = useWindowSize()

  const [containerSize, jsx] = useContainerSize(props)

  const [bounds, setBounds] = React.useState<IBounds>({
    viewport: { width: window.innerWidth, height: window.innerHeight },
    container: {
      width: props.containersize ? props.containersize.width : 0,
      height: props.containersize ? props.containersize.height : 0
    }
  })

  return bounds
}

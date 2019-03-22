import * as React from 'react'

import { IDataLayout, IExRect, IBlockRect } from './blockTypes'
import { useBounds } from './useBounds'
//import { ILayoutProps } from '../../../src/Layout';
import { convertExRect, layout } from './blockUtils'
import { IRect, ISize } from '../types'

const exRectInitialState: IExRect = {
  left: undefined,
  right: undefined,
  top: undefined,
  bottom: undefined,
  width: undefined,
  height: undefined
}

type ExRectAction =
  | 'setLeft'
  | 'setRight'
  | 'setTop'
  | 'setBottom'
  | 'setWidth'
  | 'setHeight'

interface IExRectAction {
  type: ExRectAction
  value: number | string
}

const exRectReducer: React.Reducer<IExRect, IExRectAction> = (
  state: IExRect,
  action: IExRectAction
) => {
  switch (action.type) {
    case 'setLeft':
      return { ...state, left: action.value }
    case 'setRight':
      return { ...state, right: action.value }
    case 'setTop':
      return { ...state, top: action.value }
    case 'setBottom':
      return { ...state, bottom: action.value }
    case 'setWidth':
      return { ...state, width: action.value }
    case 'setHeight':
      return { ...state, height: action.value }

    default:
      throw new Error(`Unexpected unexpected BlockRect action: ${action.type}`)
  }
}

export interface IBlock {
  rect: IRect
  left: number | string | undefined
}

export function Block(containersize: ISize, data: IDataLayout): IBlock {
  const [exRect, exRectDispatch] = React.useReducer(
    exRectReducer,
    data.location ? data.location : exRectInitialState
  )

  const [blockRect, setBlockRect] = React.useState<IBlockRect>({})

  const [rect, setRect] = React.useState<IRect>({
    x: 0,
    y: 0,
    width: 0,
    height: 0
  })

  const bounds = useBounds(containersize)
  React.useEffect(() => {
    // from ExRect to rect

    setBlockRect(convertExRect(exRect))

    const rect: IRect = layout(blockRect, bounds)

    setRect(rect)
  }, [containersize, exRect, blockRect])

  // React.useEffect(() => {
  //   // from rect to ExRect

  //   const rect: IRect = layout(blockRect, bounds)

  //   setBlockRect(convertExRect(exRect))

  //   const rect: IRect = layout(blockRect, bounds)

  //   setRect(rect)
  // }, [containersize, rect])

  class Block implements IBlock {
    get rect() {
      return rect
    }

    set rect(r: IRect) {
      setRect(r)
    }

    get left() {
      return blockRect.left!
    }

    set left(v: number | string) {
      exRectDispatch({ type: 'setLeft', value: v })
    }
  }
  return new Block()
}

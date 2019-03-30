import * as React from 'react'

import { IDataLayout, IExRect, IBlockRect } from '../../components/blockTypes'
import { ILayoutProps } from '../../Layout'
import { convertExRect, layout } from '../../components/blockUtils'
import { IRect } from '../../types'
import { Generator, IGenerator } from '../../generators/Generator'
import { Params } from '../../components/Params'
import { Blocks } from '../../components/Blocks'

import { useBounds } from './useBounds'

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

function Block(props: ILayoutProps, data: IDataLayout) {
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

  React.useEffect(() => {
    const bounds = useBounds(props)
    setBlockRect(convertExRect(exRect))

    const rect: IRect = layout(blockRect, bounds)

    setRect(rect)
  }, [props, exRect])

  class Block {
    get rect() {
      return rect
    }

    set rect(r: IRect) {
      setRect(r)
    }

    set left(v: number | string) {
      exRectDispatch({ type: 'setLeft', value: 10 })
    }
  }
  return new Block()
}

function init(g: IGenerator): Blocks {
  const blocks = g.blocks()
  return blocks
}
const params = new Params({ name: 'xxx' })
const g = new Generator('xxx', init, params)

const blk = Block(
  { name: 'xxx', g: g },
  { location: { left: 0, top: 0, width: 100, height: 100 } }
)

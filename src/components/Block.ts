import * as React from 'react'

import { IDataLayout, IBlockRect } from './blockTypes'
import { useBounds } from './useBounds'
import { convertExRect, layout, inverseLayout } from './blockUtils'
import { IRect, ISize, Unit } from '../types'

const deepEqual = require('deep-equal')

type BlockRectAction =
  | 'setLeft'
  | 'setRight'
  | 'setTop'
  | 'setBottom'
  | 'setWidth'
  | 'setHeight'
  | 'setAll'

interface IBlockRectAction {
  type: BlockRectAction
  value: number
  unit?: Unit
  all?: IBlockRect
}

const BlockRectReducer: React.Reducer<IBlockRect, IBlockRectAction> = (
  state: IBlockRect,
  action: IBlockRectAction
) => {
  switch (action.type) {
    case 'setLeft':
      if (action.unit) {
        return { ...state, left: action.value, leftUnit: action.unit }
      }
      return { ...state, left: action.value }
    case 'setRight':
      if (action.unit) {
        return { ...state, right: action.value, rightUnit: action.unit }
      }
      return { ...state, right: action.value }
    case 'setTop':
      if (action.unit) {
        return { ...state, top: action.value, topUnit: action.unit }
      }
      return { ...state, top: action.value }
    case 'setBottom':
      if (action.unit) {
        return { ...state, bottom: action.value, bottomUnit: action.unit }
      }
      return { ...state, bottom: action.value }
    case 'setWidth':
      if (action.unit) {
        return { ...state, width: action.value, widthUnit: action.unit }
      }
      return { ...state, width: action.value }
    case 'setHeight':
      if (action.unit) {
        return { ...state, height: action.value, heightUnit: action.unit }
      }
      return { ...state, height: action.value }
    case 'setAll':
      if (!action.all) {
        throw new Error(`Action all not defined for: ${action.type}`)
      }
      return action.all ? action.all : state
    default:
      throw new Error(`Unexpected unexpected BlockRect action: ${action.type}`)
  }
}

export interface IBlockRectDispatch {
  value: IBlockRect
  left?: number
  top?: number
  right?: number
  bottom?: number
  width?: number
  height?: number
}

export interface IBlockDispatch {
  rect: IRect
  blockRect: IBlockRectDispatch
}

export function Block(containersize: ISize, data: IDataLayout): IBlockDispatch {
  const bounds = useBounds(containersize)

  const inputBlockRect = React.useMemo(() => {
    return convertExRect(data.location)
  }, [data])

  const [blockRect, setBlockRect] = React.useReducer(
    BlockRectReducer,
    inputBlockRect
  )

  // Initial state must be consistent with data.location for correct updates
  const [rect, setRect] = React.useState<IRect>(layout(blockRect, bounds))

  const [changeBlockRect, setChangeBlockRect] = React.useState(0)
  const [changeRect, setChangeRect] = React.useState(0)

  // Update if needed
  React.useEffect(() => {
    if (changeBlockRect) {
      const r = layout(blockRect, bounds)
      if (!deepEqual(r, rect)) {
        setRect(r)
      }
      setChangeBlockRect(0)
    }

    if (changeRect) {
      const br = inverseLayout(rect, blockRect, bounds)
      if (!deepEqual(br, blockRect)) {
        setBlockRect({ type: 'setAll', value: 0, all: br })
      }
      setChangeRect(0)
    }
  }, [bounds, rect, blockRect])

  class BlockRectDispatch implements IBlockRectDispatch {
    get value() {
      return blockRect
    }
    set value(v: IBlockRect) {
      setBlockRect({ type: 'setAll', value: 0, all: blockRect })
      setChangeBlockRect(1)
    }

    get left() {
      return blockRect.left
    }
    set left(v: number | undefined) {
      if (v) {
        setBlockRect({ type: 'setLeft', value: v })
      } else {
        // remove
        const { left, leftUnit, ...noLeft } = blockRect
        setBlockRect({ type: 'setAll', value: 0, all: noLeft })
      }
      setChangeBlockRect(1)
    }

    get top() {
      return blockRect.top
    }
    set top(v: number | undefined) {
      if (v) {
        setBlockRect({ type: 'setTop', value: v })
      } else {
        // remove
        const { top, topUnit, ...noTop } = blockRect
        setBlockRect({ type: 'setAll', value: 0, all: noTop })
      }
      setChangeBlockRect(1)
    }

    get right() {
      return blockRect.right
    }
    set right(v: number | undefined) {
      if (v) {
        setBlockRect({ type: 'setRight', value: v })
      } else {
        // remove
        const { right, rightUnit, ...noRight } = blockRect
        setBlockRect({ type: 'setAll', value: 0, all: noRight })
      }
      setChangeBlockRect(1)
    }

    get bottom() {
      return blockRect.right
    }
    set bottom(v: number | undefined) {
      if (v) {
        setBlockRect({ type: 'setBottom', value: v })
      } else {
        // remove
        const { bottom, bottomUnit, ...noBottom } = blockRect
        setBlockRect({ type: 'setAll', value: 0, all: noBottom })
      }
      setChangeBlockRect(1)
    }

    get width() {
      return blockRect.right
    }
    set width(v: number | undefined) {
      if (v) {
        setBlockRect({ type: 'setWidth', value: v })
      } else {
        // remove
        const { width, widthUnit, ...noWidth } = blockRect
        setBlockRect({ type: 'setAll', value: 0, all: noWidth })
      }
      setChangeBlockRect(1)
    }

    get height() {
      return blockRect.right
    }
    set height(v: number | undefined) {
      if (v) {
        setBlockRect({ type: 'setHeight', value: v })
      } else {
        // remove
        const { height, heightUnit, ...noHeight } = blockRect
        setBlockRect({ type: 'setAll', value: 0, all: noHeight })
      }
      setChangeBlockRect(1)
    }
  }

  const blockRectDispatch = new BlockRectDispatch()

  // Class closure for Block interface
  class Block implements IBlockDispatch {
    get rect() {
      return rect
    }

    set rect(r: IRect) {
      setRect(r)
      setChangeRect(1)
    }

    get blockRect(): IBlockRectDispatch {
      return blockRectDispatch
    }
  }

  return new Block()
}

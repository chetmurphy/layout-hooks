import { IExRect } from './blockTypes'
import { Unit } from 'types'
import { AnyARecord } from 'dns';

export interface IExRectDispatch {
  value: IExRect
  left?: number | string
  top?: number | string
  right?: number | string
  bottom?: number | string
  width?: number | string
  height?: number | string
}

export type ExRectAction =
  | 'setExLeft'
  | 'setExRight'
  | 'setExTop'
  | 'setExBottom'
  | 'setExWidth'
  | 'setExHeight'
  | 'setExAll'

interface IExRectAction {
  type: ExRectAction
  payload: any


export const ExRectReducer: React.Reducer<IExRect, IExRectAction> = (
  state: IExRect,
  action: IExRectAction
) => {
  switch (action.type) {
    case 'setExLeft':
      return { ...state, left: action.payload }
    case 'setExRight':
      return { ...state, right: action.value }
    case 'setExTop':
      return { ...state, top: action.value }
    case 'setExBottom':
      return { ...state, bottom: action.value }
    case 'setExWidth':
      return { ...state, width: action.value }
    case 'setExHeight':
      return { ...state, height: action.value }
    case 'setExAll':
      return action.all ? action.all : state
    default:
      throw new Error(`Unexpected unexpected ExRect action: ${action.type}`)
  }
}

// export function BlockRectDispatchFactory(
//   exRect: IExRect,
//   setExRect: React.Dispatch<{}>
// ): IBlockRectDispatch {
//   class BlockRectDispatch implements IExRectDispatch {
//     get value() {
//       return exRect
//     }
//     set value(v: IBlockRect) {
//       setBlockRect({ type: 'setAll', value: 0, all: exRect })
//       changeBlockRect.current = 1
//     }

//     get left() {
//       return exRect.left
//     }
//     set left(v: number | undefined) {
//       if (v) {
//         setBlockRect({ type: 'setLeft', value: v })
//       } else {
//         // remove
//         const { left, leftUnit, ...noLeft } = exRect
//         setBlockRect({ type: 'setAll', value: 0, all: noLeft })
//       }
//       changeBlockRect.current = 1
//     }

//     get top() {
//       return exRect.top
//     }
//     set top(v: number | undefined) {
//       if (v) {
//         setBlockRect({ type: 'setTop', value: v })
//       } else {
//         // remove
//         const { top, topUnit, ...noTop } = exRect
//         setBlockRect({ type: 'setAll', value: 0, all: noTop })
//       }
//       changeBlockRect.current = 1
//     }

//     get right() {
//       return exRect.right
//     }
//     set right(v: number | undefined) {
//       if (v) {
//         setBlockRect({ type: 'setRight', value: v })
//       } else {
//         // remove
//         const { right, rightUnit, ...noRight } = exRect
//         setBlockRect({ type: 'setAll', value: 0, all: noRight })
//       }
//       changeBlockRect.current = 1
//     }

//     get bottom() {
//       return exRect.bottom
//     }
//     set bottom(v: number | undefined) {
//       if (v) {
//         setBlockRect({ type: 'setBottom', value: v })
//       } else {
//         // remove
//         const { bottom, bottomUnit, ...noBottom } = exRect
//         setBlockRect({ type: 'setAll', value: 0, all: noBottom })
//       }
//       changeBlockRect.current = 1
//     }

//     get width() {
//       return exRect.width
//     }
//     set width(v: number | undefined) {
//       if (v) {
//         setBlockRect({ type: 'setWidth', value: v })
//       } else {
//         // remove
//         const { width, widthUnit, ...noWidth } = exRect
//         setBlockRect({ type: 'setAll', value: 0, all: noWidth })
//       }
//       changeBlockRect.current = 1
//     }

//     get height() {
//       return exRect.height
//     }
//     set height(v: number | undefined) {
//       if (v) {
//         setBlockRect({ type: 'setHeight', value: v })
//       } else {
//         // remove
//         const { height, heightUnit, ...noHeight } = exRect
//         setBlockRect({ type: 'setAll', value: 0, all: noHeight })
//       }
//       changeBlockRect.current = 1
//     }
//   }

//   return new BlockRectDispatch()
// }



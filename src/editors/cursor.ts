import { PositionRef } from '../types'

/**
 * internal use only
 * @ignore
 */
export function cursor(ref: PositionRef) {
  let c: string = 'move'
  switch (ref) {
    case PositionRef.none: {
      break
    }
    case PositionRef.position: {
      c = 'move'
      break
    }
    case PositionRef.left: {
      c = 'w-resize'
      break
    }
    case PositionRef.right: {
      c = 'w-resize'
      break
    }
    case PositionRef.top: {
      c = 'n-resize'
      break
    }
    case PositionRef.bottom: {
      c = 'n-resize'
      break
    }
    case PositionRef.leftTop: {
      c = 'nw-resize'
      break
    }
    case PositionRef.rightTop: {
      c = 'ne-resize'
      break
    }
    case PositionRef.leftBottom: {
      c = 'ne-resize'
      break
    }
    case PositionRef.rightBottom: {
      c = 'nw-resize'
      break
    }
    default: {
      // console.error(`Invalid PositionRef in cursor ${ref}`)
      break
    }
  }
  return c
}

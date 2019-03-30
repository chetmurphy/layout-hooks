import { Block } from '../components/Block'
import { IEdit } from '../components/blockTypes'
import { IRect } from '../types'

/**
 * UpdateParamLocation computes a [location](interfaces/iexrect.html) update. This is used
 * by the editor to store changes in Params.
 */
export function updateParamLocation(
  updated: IRect,
  edit: IEdit,
  block: React.MutableRefObject<Block>
) {
  const factorX = 1 //unitFactor(block.current.blockRect.leftUnit)
  const factorY = 1 //unitFactor(block.current.blockRect.topUnit)
  return {
    name: edit.variable!,
    value: {
      x: updated.x * factorX,
      y: updated.y * factorY
    }
  }
}

/**
 * updateParamOffset computes the [offset](interfaces/ialign.html) update. This is used by the editor to store changes in Params.
 */
export function updateParamOffset(
  updated: IRect,
  edit: IEdit,
  block: React.MutableRefObject<Block>
) {
  const factorX = 1 //unitFactor(block.blockRect.leftUnit)
  const factorY = 1 //unitFactor(block.blockRect.topUnit)
  let r = {
    name: edit.variable!,
    value: {
      x: 0,
      y: 0
    }
  }
  if (block.current.align) {
    r = {
      name: edit.variable!,
      value: {
        x: block.current.align.offset.x * factorX,
        y: block.current.align.offset.y * factorY
      }
    }
  }
  return r
}

/**
 * updateParamWidth computes the width update. Use only if a generator directly uses the width
 * in computing a layout. This is used by the editor to store changes in Params.
 */
export function updateParamWidth(
  updated: IRect,
  edit: IEdit,
  block: React.MutableRefObject<Block>
) {
  const factor = 1 //unitFactor(block.blockRect.widthUnit)
  return {
    name: edit.variable!,
    value: updated.width * factor
  }
}

/**
 * updateParamWidth computes the height update. Use only if
 * a generator directly uses the height in computing a layout. This is used by the editor to store changes in Params.
 */
export function updateParamHeight(
  updated: IRect,
  edit: IEdit,
  block: React.MutableRefObject<Block>
) {
  const factor = 1 //unitFactor(block.blockRect.heightUnit)
  return {
    name: edit.variable!,
    value: updated.height * factor
  }
}

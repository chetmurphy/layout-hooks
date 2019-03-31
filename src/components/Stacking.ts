import { Params } from './Params'
import { Block } from './Block'
import { Blocks } from './Blocks'

export interface ILayersArgs {
  name: string
  params: Params
  blocks: Blocks
}

export class Stacking {
  private _params: Params
  private _blocks: Blocks

  constructor(args: ILayersArgs) {
    this._params = args.params
    this._blocks = args.blocks
  }

  public bringForward(block: React.MutableRefObject<Block>) {
    const current = block.current.zIndex
    let currentFront = Number.MAX_SAFE_INTEGER
    let max = Number.MIN_SAFE_INTEGER

    block.current.generator
      .blocks()
      .map.forEach((block: React.MutableRefObject<Block>) => {
        if (block.current.zIndex > current) {
          currentFront = block.current.zIndex
        }
        if (block.current.zIndex > max) {
          max = block.current.zIndex
        }
      })

    const value =
      currentFront < Number.MAX_SAFE_INTEGER
        ? currentFront + 1
        : max === Number.MIN_SAFE_INTEGER
        ? block.current.zIndex
        : max + 1

    this._params.set(`${block.current.name}ZIndex`, value)
    block.current.zIndex = value

    return value
  }

  public bringFront(
    blocks: React.MutableRefObject<Block> | React.MutableRefObject<Block>[]
  ) {
    const { max } = this.minMax()
    if (Array.isArray(blocks)) {
      blocks.forEach((block: React.MutableRefObject<Block>) => {
        block.current.zIndex = max + 1
      })
    } else {
      blocks.current.zIndex = max + 1
    }
  }

  public sendBackward(block: React.MutableRefObject<Block>) {
    const current = block.current.zIndex
    let currentBack = Number.MIN_SAFE_INTEGER
    let min = Number.MAX_SAFE_INTEGER

    block.current.generator
      .blocks()
      .map.forEach((block: React.MutableRefObject<Block>) => {
        if (block.current.zIndex < current) {
          currentBack = block.current.zIndex
        }
        if (block.current.zIndex < min) {
          min = block.current.zIndex
        }
      })

    const value =
      currentBack > Number.MIN_SAFE_INTEGER
        ? currentBack - 1
        : min === Number.MAX_SAFE_INTEGER
        ? block.current.zIndex
        : Math.max(0, min - 1)

    this._params.set(`${block.current.name}ZIndex`, value)
    block.current.zIndex = value

    return value
  }

  public sendBack(
    blocks: React.MutableRefObject<Block> | React.MutableRefObject<Block>[]
  ) {
    const { min } = this.minMax()
    if (Array.isArray(blocks)) {
      blocks.forEach((block: React.MutableRefObject<Block>) => {
        block.current.zIndex = Math.max(0, min - 1)
      })
    } else {
      blocks.current.zIndex = Math.max(0, min - 1)
    }
  }

  private minMax() {
    let min = Number.MAX_SAFE_INTEGER
    let max = Number.MIN_SAFE_INTEGER

    this._blocks.map.forEach((block: React.MutableRefObject<Block>) => {
      if (block.current.zIndex < min) {
        min = block.current.zIndex
      }
      if (block.current.zIndex > max) {
        max = block.current.zIndex
      }
    })

    if (min === Number.MAX_SAFE_INTEGER) {
      min = 0
    }
    if (max === Number.MIN_SAFE_INTEGER) {
      max = 0
    }

    return { min, max }
  }
}

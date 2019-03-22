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

  public bringForward(block: Block) {
    const current = block.zIndex
    let currentFront = Number.MAX_SAFE_INTEGER
    let max = Number.MIN_SAFE_INTEGER

    block.generator.blocks().map.forEach((block: Block) => {
      if (block.zIndex > current) {
        currentFront = block.zIndex
      }
      if (block.zIndex > max) {
        max = block.zIndex
      }
    })

    const value =
      currentFront < Number.MAX_SAFE_INTEGER
        ? currentFront + 1
        : max === Number.MIN_SAFE_INTEGER
        ? block.zIndex
        : max + 1

    this._params.set(`${block.name}ZIndex`, value)
    block.zIndex = value

    return value
  }

  public bringFront(blocks: Block | Block[]) {
    const { max } = this.minMax()
    if (Array.isArray(blocks)) {
      blocks.forEach((block: Block) => {
        block.zIndex = max + 1
      })
    } else {
      blocks.zIndex = max + 1
    }
  }

  public sendBackward(block: Block) {
    const current = block.zIndex
    let currentBack = Number.MIN_SAFE_INTEGER
    let min = Number.MAX_SAFE_INTEGER

    block.generator.blocks().map.forEach((block: Block) => {
      if (block.zIndex < current) {
        currentBack = block.zIndex
      }
      if (block.zIndex < min) {
        min = block.zIndex
      }
    })

    const value =
      currentBack > Number.MIN_SAFE_INTEGER
        ? currentBack - 1
        : min === Number.MAX_SAFE_INTEGER
        ? block.zIndex
        : Math.max(0, min - 1)

    this._params.set(`${block.name}ZIndex`, value)
    block.zIndex = value

    return value
  }

  public sendBack(blocks: Block | Block[]) {
    const { min } = this.minMax()
    if (Array.isArray(blocks)) {
      blocks.forEach((block: Block) => {
        block.zIndex = Math.max(0, min - 1)
      })
    } else {
      blocks.zIndex = Math.max(0, min - 1)
    }
  }

  private minMax() {
    let min = Number.MAX_SAFE_INTEGER
    let max = Number.MIN_SAFE_INTEGER

    this._blocks.map.forEach((block: Block) => {
      if (block.zIndex < min) {
        min = block.zIndex
      }
      if (block.zIndex > max) {
        max = block.zIndex
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

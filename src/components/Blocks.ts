import { IGenerator } from '../generators/Generator'
import { Block, BlockFactory } from './Block'
import { IDataLayout } from '../components/blockTypes'

/**
 * Blocks managed the Block collection.
 */

export class Blocks {
  private _blocks: Map<string, React.MutableRefObject<Block>>
  private _byIndex: React.MutableRefObject<Block>[]

  constructor(blocks: Array<[string, React.MutableRefObject<Block>]>) {
    this._byIndex = new Array()
    this._blocks = new Map(blocks)
    this._blocks.forEach(value => {
      this._byIndex.push(value)
    })
  }

  /**
   * This method returns the array of Blocks that match the
   * specified layer. If there is no layer for a Block it is treated
   * as having layer 0.
   */
  public layers(layer: number): React.MutableRefObject<Block>[] {
    const blocks: React.MutableRefObject<Block>[] = []
    this._blocks.forEach(block => {
      const blockLayer = block.current.layer
      if (blockLayer) {
        if (layer === blockLayer) {
          blocks.push(block)
        }
      } else if (layer === 0) {
        blocks.push(block)
      }
    })
    return blocks
  }

  /**
   * This gets the underlying Map <string, Block> that
   * this class manages.
   */
  get map() {
    return this._blocks
  }

  /**
   * Returns the number of blocks.
   */
  get size() {
    return this._blocks.size
  }

  /**
   * This method returns the i th block in insert order.
   */
  public find(i: number) {
    return this._byIndex[i]
  }

  /**
   * This method returns the block by name.
   */
  public get(key: string) {
    return this._blocks.get(key)
  }

  /**
   * Set will create block if it does not exist otherwise it will just update the block.
   */
  public set(p: IDataLayout, g: IGenerator): React.MutableRefObject<Block> {
    let block = this._blocks.get(p.name)
    if (block) {
      block.current.updatePosition(p)
    } else {
      block = BlockFactory(p, g)
      this._blocks.set(p.name, block)
      if (this._blocks.size > this._byIndex.length) {
        // Add to byIndex array
        this._byIndex.push(block)
      }
    }
    return block
  }
}

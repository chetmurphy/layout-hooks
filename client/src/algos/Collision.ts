import * as d3 from 'd3-quadtree'

import * as RLG from '../importRLG'

export interface ICollisionDetectionArgs {
  width: number;
  height: number;
  maxElements?: number; 
  blocks: RLG.Blocks;
}

export class CollisionDetection {

  protected _quadtree: d3.Quadtree<RLG.Block>

  constructor(args: ICollisionDetectionArgs) {

    const data: RLG.Block[] = []
    args.blocks.map.forEach((block: RLG.Block, key: string) => {
      // if (block.active && block.active()) {
            data.push(block)
      // }
    })

    this._quadtree = d3.quadtree<RLG.Block>()
        .extent([[-1, -1], [100 + 1, 100 + 1]])
        .addAll(data)

    const x = this._quadtree.find(40,40)

    if (x) {
      this._quadtree.remove(x)
    }


        
            
         

            
  }


}


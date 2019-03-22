/**
 * Converted to typescript for react-layout-generator. See:
 * https://gamedevelopment.tutsplus.com/tutorials/quick-tip-use-quadtrees-to-detect-likely-collisions-in-2d-space--gamedev-374
 * https://photonstorm.github.io/phaser-ce/Phaser.QuadTree.html
 */

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2014 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Javascript QuadTree
 * @version 1.0
 * @author Timo Hausmann
 *
 * @version 1.2, September 4th 2013
 * @author Richard Davey
 * The original code was a conversion of the Java code posted to GameDevTuts. However I've tweaked
 * it massively to add node indexing, removed lots of temp. var creation and significantly
 * increased performance as a result.
 *
 * Original version at https://github.com/timohausmann/quadtree-js/
 */

/**
 * @copyright © 2012 Timo Hausmann
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// import { IRect } from '../types';

export interface IQTBounds {
  x: number
  y: number
  width: number
  height: number
  subWidth: number
  subHeight: number
  right: number
  bottom: number
}

// export class Bounds implements IQTBounds {
//   public x: number;
//   public y: number;
//   public width: number;
//   public height: number;
//   public subWidth: number;
//   public subHeight: number;
//   public right: number;
//   public bottom: number;

//   constructor(v: IRect) {
//     this.x = v.x;
//     this.y = v.y;
//     this.width = v.width;
//     this.height = v.height;
//     this.subWidth = this.width / 2;
//     this.subHeight = this.height / 2;
//     this.right = v.x + v.width;
//     this.bottom = v.y + v.height;
//   }
// }

export interface IShadowRoot {
  bounds: IQTBounds
  quadTreeIndex: number
}

/**
 * QuadTree Constructor
 *
 * @class QuadTree
 * @classdesc A QuadTree implementation.
 * @constructor
 * @param {number} x - The top left coordinate of the quadtree.
 * @param {number} y - The top left coordinate of the quadtree.
 * @param {number} width - The width of the quadtree in pixels.
 * @param {number} height - The height of the quadtree in pixels.
 * @param {number} [maxObjects=10] - The maximum number of objects per node.
 * @param {number} [maxLevels=4] - The maximum number of levels to iterate to.
 * @param {number} [level=0] - Which level is this?
 */

// tslint:disable-next-line:max-classes-per-file
export default class QuadTree<T extends IShadowRoot> {
  private maxObjects: number
  private maxLevels: number
  private level: number
  private bounds: IQTBounds
  private objects: T[]
  private nodes: QuadTree<T>[]

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    maxObjects?: number,
    maxLevels?: number,
    level?: number
  ) {
    this.maxObjects = maxObjects || 10
    this.maxLevels = maxLevels || 4
    this.level = level || 0

    this.bounds = {
      x: Math.round(x),
      y: Math.round(y),
      width,
      height,
      subWidth: Math.floor(width / 2),
      subHeight: Math.floor(height / 2),
      right: Math.round(x) + Math.floor(width),
      bottom: Math.round(y) + Math.floor(height)
    }

    this.objects = []
    this.nodes = []
  }

  /*
   * Populates this quadtree with the members of the given Group.
   *
   * @method populate
   * @param blocks - The blocks to add to the quadtree.
   */
  public populate = (blocks: T[]) => {
    blocks.forEach((block: T) => this.insert(block))
  }

  /*
   * Return all objects that could collide with the given Sprite.
   *
   * @method retrieve
   * @param sprite - The sprite to check against.
   * @return Array with all detected objects.
   */
  public retrieve = (block: T) => {
    let returnObjects = this.objects
    block.quadTreeIndex = this.getIndex(block.bounds)

    //  Temp store for the node IDs this block is in, we can use this for fast elimination later
    // sprite.body.quadTreeIDs.push(this.ID);

    if (this.nodes[0]) {
      //  if rect fits into a subnode ..
      if (block.quadTreeIndex !== -1) {
        returnObjects = returnObjects.concat(
          this.nodes[block.quadTreeIndex].retrieve(block)
        )
      } else {
        //  if rect does not fit into a subnode, check it against all subnodes (unrolled for speed)
        returnObjects = returnObjects.concat(this.nodes[0].retrieve(block))
        returnObjects = returnObjects.concat(this.nodes[1].retrieve(block))
        returnObjects = returnObjects.concat(this.nodes[2].retrieve(block))
        returnObjects = returnObjects.concat(this.nodes[3].retrieve(block))
      }
    }

    return returnObjects
  }

  /*
   * Clear the quadtree.
   * @method clear
   */
  public clear = () => {
    this.objects = []

    for (let i = 0, len = this.nodes.length; i < len; i++) {
      if (this.nodes[i]) {
        this.nodes[i].clear()
        delete this.nodes[i]
      }
    }
  }

  // /*
  // * Handler for the populate method.
  // *
  // * @method populateHandler
  // * @param {Phaser.Sprite} sprite - The Sprite to check.
  // */
  // populateHandler = (sprite: ISprite) => {

  //   if (sprite.body && sprite.body.checkCollision.none === false && sprite.alive) {
  //     this.insert(sprite.body);
  //   }

  // }

  /*
   * Split the node into 4 subnodes
   *
   * @method split
   */
  private split = () => {
    this.level++

    //  top right node
    this.nodes[0] = new QuadTree(
      this.bounds.right,
      this.bounds.y,
      this.bounds.subWidth,
      this.bounds.subHeight,
      this.maxObjects,
      this.maxLevels,
      this.level
    )

    //  top left node
    this.nodes[1] = new QuadTree(
      this.bounds.x,
      this.bounds.y,
      this.bounds.subWidth,
      this.bounds.subHeight,
      this.maxObjects,
      this.maxLevels,
      this.level
    )

    //  bottom left node
    this.nodes[2] = new QuadTree(
      this.bounds.x,
      this.bounds.bottom,
      this.bounds.subWidth,
      this.bounds.subHeight,
      this.maxObjects,
      this.maxLevels,
      this.level
    )

    //  bottom right node
    this.nodes[3] = new QuadTree(
      this.bounds.right,
      this.bounds.bottom,
      this.bounds.subWidth,
      this.bounds.subHeight,
      this.maxObjects,
      this.maxLevels,
      this.level
    )
  }

  /*
   * Insert the object into the node. If the node exceeds the capacity, it will split and add all objects to their corresponding subnodes.
   *
   * @method insert
   * @param {Phaser.Physics.Arcade.Body|object} body - The Body object to insert into the quadtree.
   */
  private insert = (block: T) => {
    let i = 0
    let index

    //  if we have subnodes ...
    if (this.nodes[0] != null) {
      index = this.getIndex(block.bounds)

      if (index !== -1) {
        this.nodes[index].insert(block)
        return
      }
    }

    this.objects.push(block)

    if (this.objects.length > this.maxObjects && this.level < this.maxLevels) {
      //  Split if we don't already have subnodes
      if (this.nodes[0] == null) {
        this.split()
      }

      //  Add objects to subnodes
      while (i < this.objects.length) {
        index = this.getIndex(this.objects[i].bounds)

        if (index !== -1) {
          //  this is expensive - see what we can do about it
          this.nodes[index].insert(this.objects.splice(i, 1)[0])
        } else {
          i++
        }
      }
    }
  }

  /*
   * Determine which node the object belongs to.
   *
   * @method getIndex
   * @param rect - The bounds in which to check.
   * @return index - Index of the subnode (0-3), or -1 if rect cannot completely fit
   * within a subnode and is part of the parent node.
   */
  private getIndex = (rect: IQTBounds) => {
    //  default is that rect doesn't fit, i.e. it straddles the internal quadrants
    let index = -1

    if (rect.x < this.bounds.right && rect.right < this.bounds.right) {
      if (rect.y < this.bounds.bottom && rect.bottom < this.bounds.bottom) {
        //  rect fits within the top-left quadrant of this quadtree
        index = 1
      } else if (rect.y > this.bounds.bottom) {
        //  rect fits within the bottom-left quadrant of this quadtree
        index = 2
      }
    } else if (rect.x > this.bounds.right) {
      //  rect can completely fit within the right quadrants
      if (rect.y < this.bounds.bottom && rect.bottom < this.bounds.bottom) {
        //  rect fits within the top-right quadrant of this quadtree
        index = 0
      } else if (rect.y > this.bounds.bottom) {
        //  rect fits within the bottom-right quadrant of this quadtree
        index = 3
      }
    }

    return index
  }
}

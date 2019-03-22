import { IGenerator } from '../generators/Generator'
import { createExPoint } from './point'
import { IPoint } from '../types'

/**
 * Create a ExLine class from its factory createLine(g: IGenerator)
 * @param g
 *  An instance of the a generator for binding the ExLine class to its
 *  generator.
 * @returns constructor function that can be used with new to create
 * an instance of the ExLine class. The type of the class is
 * InstanceType(typeof <constructor function>).
 */
export function createExLine(g: IGenerator) {
  const fnExPoint = createExPoint(g)
  type ExPoint = InstanceType<typeof fnExPoint>

  /**
   * The ExLine class represents a line in 2D space from a start point to an
   * end point.
   */
  return class ExLine {
    /* private */ _start: ExPoint
    /* private */ _end: ExPoint

    constructor(start: ExPoint, end: ExPoint) {
      this._start = start
      this._end = end
    }

    get start(): IPoint {
      return this._start.getPoint()
    }

    get end(): IPoint {
      return this._end.getPoint()
    }

    /**
     * Returns the length of the line segment.
     */
    get length() {
      const pt1 = this.start
      const pt2 = this.end
      return Math.sqrt(Math.pow(pt1.x - pt2.x, 2) + Math.pow(pt1.y - pt2.y, 2))
    }

    /**
     * Returns the point (x,y) that is the specified
     * distance from the beginning of the line segment.
     * Returns undefined if d is less than 0 or greater than
     * the length of the line.
     * @param d
     */
    point(d: number) {
      const pt1 = this.start
      const pt2 = this.end
      const dn = d / this.length
      return {
        x: (1 - dn) * pt1.x + dn * pt2.x,
        y: (1 - dn) * pt1.y + dn * pt2.y
      }
    }

    /**
     * Computes the distance from the beginning of the
     * line segment to the point (x,y). Returns undefined if the point is
     * not on the line or the distance is negative or greater than
     * the length.
     * @param x
     * @param y
     */
    distance(x: number, y: number): number | undefined {
      const p0 = this._start.getPoint()
      const p1 = this._end.getPoint()

      // compute distance
      const d1 = (x - p0.x) / (p1.x - p0.x)
      const d2 = (y - p0.y) / (p1.y - p0.y)

      // if equal then compute distance and return. The ratios
      // d1 and d2 should be the same if the point is on a line
      // segment.
      let t: number | undefined = 0
      if (isNaN(d1) && isNaN(d2)) {
        // distance is 0
      } else if (isNaN(d1)) {
        // distance is d2
        t = d2
      } else if (isNaN(d2)) {
        // distance is d1
        t = d1
      } else {
        t = Math.abs(d1 - d2) < Number.EPSILON ? d1 : undefined
      }

      if (t === undefined) {
        return undefined
      }
      if (t < 0 || t >= 1) {
        return undefined
      }
      return t * this.length
    }

    /**
     * intersects tests if a point lies on the line segment.
     * @param x
     * @param y
     */
    intersects(x: number, y: number): boolean {
      return this.distance(x, y) !== undefined
    }
  }
}

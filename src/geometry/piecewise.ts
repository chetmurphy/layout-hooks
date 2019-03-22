// import { IPoint } from '../types'
import { createExLine } from './line'
import { IGenerator } from '../generators/Generator'

/*""
 * create factory for a Piecewise line.
 * A piecewise line is a list of line segments
 *
 * Note that the Piecewise
 * class is bound to the current Generator for converting units.
 * @param g -
 * This is the generator that this Piecewise line is bound.
 */
export function createPiecewise(g: IGenerator) {
  const ExLine = createExLine(g)
  type ExLine = InstanceType<typeof ExLine>

  return class Piecewise {
    // exported class expression may not be private or protected.ts(4094)
    // see TS #17744
    _lines: ExLine[]
    _length: number

    constructor(lines: ExLine[]) {
      this._lines = lines
      this._length = 0
    }

    /**
     * Returns the total length of the piecewise line.
     */
    get length(): number {
      if (this._length === 0) {
        let dist = 0
        this._lines.forEach(line => {
          dist += line.length
        })
        this._length = dist
      }

      return this._length
    }

    /**
     * Returns the point (x,y) that is the specified
     * distance from the beginning of the piecewise line.
     * Returns undefined if d is less than 0 or greater than
     * the length of the line.
     * @param d
     */
    public point(d: number) {
      if (d >= 0) {
        let dist = 0
        for (let i = 0; i < this._lines.length; i++) {
          const line = this._lines[i]
          if (d < dist + line.length) {
            return line.point(d - dist)
          }
          dist += line.length
        }
      }
      return undefined
    }

    /**
     * Computes the distance from the beginning of the piecewise
     * line to the point (x,y). Returns undefined if the point is
     * not on the line or the distance is negative or greater than
     * the length.
     * @param x
     * @param y
     */
    distance(x: number, y: number): number | undefined {
      let sum = 0
      for (let i = 0; i < this._lines.length; i++) {
        const line = this._lines[i]
        const d = line.distance(x, y)
        if (d === undefined) {
          sum += line.length
        } else {
          return d + sum
        }
      }
      return undefined
    }

    /**
     * intersects tests if a point lies on the piecewise
     * line.
     * @param x
     * @param y
     */
    intersects(x: number, y: number): boolean {
      // returns true if (x,y) lie on the piecewise
      // line.
      return this.distance(x, y) !== undefined
    }
  }
}

import { Unit, IPoint } from '../types'
import {
  toUnit,
  parseUnitValue,
  toXPixel,
  toYPixel
} from '../components/blockUtils'
import { IGenerator } from '../generators/Generator'

/**
 * This interface defines an input point that can include [units](#Unit). 
 * 
 * The following example specifies a point at the center of the container:

 * ```
 *  const p = {
 *    x: '50%',
 *    y: '50%'
 *  }
 * ```

 */
export interface IExPoint {
  x: number | string
  y: number | string
}

export function createExPoint(g: IGenerator) {
  return class ExPoint {
    _x: number
    _y: number
    _xUnit: Unit
    _yUnit: Unit

    constructor(point: IExPoint) {
      this.update(point)
    }

    getPoint(): IPoint {
      return { x: this.getX(), y: this.getY() }
    }

    update(pt: IExPoint) {
      this.setX(pt.x)
      this.setY(pt.y)
    }

    getX(): number {
      let x = this._x
      if (this._xUnit) {
        return toXPixel(this._x, this._xUnit, {
          container: g.containersize(),
          viewport: g.viewport()
        })
      }
      return x
    }

    getY(): number {
      let y = this._y
      if (this._yUnit) {
        return toYPixel(this._y, this._yUnit, {
          container: g.containersize(),
          viewport: g.viewport()
        })
      }
      return y
    }

    setX(v: number | string) {
      if (typeof v === 'string') {
        const unit = toUnit(v)
        this._x = parseUnitValue(v, unit)
        this._xUnit = unit
      } else {
        this._x = v
      }
    }

    setY(v: number | string) {
      if (typeof v === 'string') {
        const unit = toUnit(v)
        this._y = parseUnitValue(v, unit)
        this._yUnit = unit
      } else {
        this._y = v
      }
    }
  }
}

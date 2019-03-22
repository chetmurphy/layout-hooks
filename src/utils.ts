import { IPoint, IRect, ILine, PositionRef } from './types'

export function clone(aObject: any) {
  if (!aObject) {
    return aObject
  }

  const bObject = Array.isArray(aObject) ? [] : {}
  for (const k in aObject) {
    if (k) {
      const v = aObject[k]
      bObject[k] = typeof v === 'object' ? clone(v) : v
    }
  }
  return bObject
}

// https://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect
// Modified and converted to typescript

/**
 * lineIntersection returns the intersection of two line segments if it exists. Otherwise returns undefined.
 * @param p0
 * Start of first line segment
 * @param p1
 * End of first line segment
 * @param p2
 * Start of second line segment
 * @param p3
 * End of second line segment
 */
export function lineIntersection(
  p0: IPoint,
  p1: IPoint,
  p2: IPoint,
  p3: IPoint
): IPoint | undefined {
  const s1: IPoint = { x: p1.x - p0.x, y: p1.y - p0.y }
  const s2: IPoint = { x: p3.x - p2.x, y: p3.y - p2.y }

  const d = -s2.x * s1.y + s1.x * s2.y

  if (Math.abs(d) > Number.EPSILON) {
    const s = (-s1.y * (p0.x - p2.x) + s1.x * (p0.y - p2.y)) / d
    const t = (s2.x * (p0.y - p2.y) - s2.y * (p0.x - p2.x)) / d

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
      // Intersects
      return { x: p0.x + t * s1.x, y: p0.y + t * s1.y }
    }
  }

  return undefined // No Intersection
}

/**
 * lineRectIntersection returns the side and intersection point of a line and a rect or undefined if they do not intersect.
 * If offset is defined then return the offset on the side that intersects.
 * @param l
 * Line to test
 * @param r
 * Rectangle to test
 * @param offset
 * If defined and true then the midPoint of the side is returned.
 */
export function lineRectIntersection(l: ILine, r: IRect, offset?: number) {
  const top: ILine = {
    start: { x: r.x, y: r.y },
    end: { x: r.x + r.width, y: r.y }
  }
  const left: ILine = {
    start: { x: r.x, y: r.y },
    end: { x: r.x, y: r.y + r.height }
  }
  const right: ILine = {
    start: { x: r.x + r.width, y: r.y },
    end: { x: r.x + r.width, y: r.y + r.height }
  }
  const bottom: ILine = {
    start: { x: r.x, y: r.y + r.height },
    end: { x: r.x + r.width, y: r.y + r.height }
  }

  const topIntersection = lineIntersection(l.start, l.end, top.start, top.end)
  if (topIntersection) {
    if (offset) {
      return { ref: PositionRef.top, x: r.x + r.width * offset, y: r.y }
    }
    return { ref: PositionRef.top, x: topIntersection.x, y: topIntersection.y }
  }

  const bottomIntersection = lineIntersection(
    l.start,
    l.end,
    bottom.start,
    bottom.end
  )
  if (bottomIntersection) {
    if (offset) {
      return {
        ref: PositionRef.bottom,
        x: r.x + r.width * offset,
        y: r.y + r.height
      }
    }
    return {
      ref: PositionRef.bottom,
      x: bottomIntersection.x,
      y: bottomIntersection.y
    }
  }

  const leftIntersection = lineIntersection(
    l.start,
    l.end,
    left.start,
    left.end
  )
  if (leftIntersection) {
    if (offset) {
      return { ref: PositionRef.left, x: r.x, y: r.y + r.height * offset }
    }
    return {
      ref: PositionRef.left,
      x: leftIntersection.x,
      y: leftIntersection.y
    }
  }

  const rightIntersection = lineIntersection(
    l.start,
    l.end,
    right.start,
    right.end
  )
  if (rightIntersection) {
    if (offset) {
      return { ref: PositionRef.right, x: r.x + r.width, y: r.y + r.height / 2 }
    }
    return {
      ref: PositionRef.right,
      x: rightIntersection.x,
      y: rightIntersection.y
    }
  }

  return undefined
}

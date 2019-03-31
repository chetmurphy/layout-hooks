import * as React from 'react'

import { ILayoutProps, ILayoutState, OverflowOptions, IRect } from './types'

const prefix = require('react-prefixer')

export function mainStyle(
  props: ILayoutProps,
  state: ILayoutState
): React.CSSProperties {
  function overflowFn(options: OverflowOptions | undefined) {
    let v = 'visible'

    if (options) {
      if (options === OverflowOptions.auto) {
        v = 'auto'
      }
      if (options === OverflowOptions.hidden) {
        v = 'hidden'
      }
      if (options === OverflowOptions.scroll) {
        v = 'scroll'
      }
    }
    return v
  }

  let mainStyle: React.CSSProperties = {
    position: 'absolute'
  }

  let overflow: React.CSSProperties = {}
  if (props.overflowX && props.overflowY) {
    overflow = {
      overflowX: overflowFn(props.overflowX) as any,
      overflowY: overflowFn(props.overflowY) as any
    }
  }
  if (props.overflowX && !props.overflowY) {
    overflow = {
      overflowX: overflowFn(props.overflowX) as any
    }
  }
  if (!props.overflowX && props.overflowY) {
    overflow = {
      overflowY: overflowFn(props.overflowY) as any
    }
  }

  let size: React.CSSProperties = {
    width: '100%',
    height: '100%'
  }
  if (
    window.devicePixelRatio !== state.devicePixelRatio /* && gRoot === this */
  ) {
    size = {
      width: `${(state.width * state.devicePixelRatio) /
        window.devicePixelRatio}`,
      height: `${(state.height * state.devicePixelRatio) /
        window.devicePixelRatio}`
    }
  }
  mainStyle = {
    position: 'absolute' as 'absolute',
    left: 0,
    top: 0,
    ...size,
    ...overflow,
    ...props.style
  }
  return prefix(mainStyle)
}

/**
 * internal use only
 * Draw a bounding box around a rect.
 * @ignore
 */
export function blockSelectedStyle(rect: IRect, zIndex: number) {
  const offset = 3
  const x = rect.x - offset
  const y = rect.y - offset
  return prefix({
    boxSizing: 'border-box' as 'border-box',
    width: rect.width + offset + offset,
    height: rect.height + offset + offset,
    position: 'absolute' as 'absolute',
    transform: `translate(${x}px, ${y}px)`,
    // mozTransform: `translate(${x}px, ${y}px)`,
    // webkitTransform: `translate(${x}px, ${y}px)`,
    // transformOrigin: 0,
    borderStyle: 'dotted',
    borderWidth: '2px',
    borderColor: 'gray',
    zIndex: zIndex === 0 ? 'auto' : zIndex,
    pointerEvents: 'auto' as 'auto'
  })
}

/**
 * internal use only
 * @ignore
 */
export function blockStyle(
  style: React.CSSProperties,
  x: number,
  y: number,
  width: number,
  height: number,
  widthUnmanaged: boolean,
  heightUnmanaged: boolean,
  selected: boolean,
  zIndex: number,
  transform: string,
  transformOrigin: string
): React.CSSProperties {
  // For unmanaged elements
  let size = {}
  if (!widthUnmanaged && !heightUnmanaged) {
    size = {
      height: `${height}px`,
      width: `${width}px`
    }
  } else if (widthUnmanaged) {
    size = {
      height: `${height}px`
    }
  } else if (heightUnmanaged) {
    size = {
      width: `${width}px`
    }
  }

  const v = `translate(${x}px, ${y}px) ${transform}`

  if (transformOrigin.length) {
    return prefix({
      boxSizing: 'border-box' as 'border-box',
      ...size,
      position: 'absolute' as 'absolute',
      transform: v,
      transformOrigin: transformOrigin,
      zIndex: zIndex === 0 ? 'auto' : zIndex,
      pointerEvents: 'auto' as 'auto',
      ...style
    })
  } else {
    return prefix({
      boxSizing: 'border-box' as 'border-box',
      ...size,
      position: 'absolute' as 'absolute',
      transform: v,
      zIndex: zIndex === 0 ? 'auto' : zIndex,
      pointerEvents: 'auto' as 'auto',
      ...style
    })
  }
}

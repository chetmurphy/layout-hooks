import * as React from 'react'

import {
  IDataLayout,
  IBlockRect,
  PositionChildrenFn,
  IAlign
} from './blockTypes'
import {
  convertExRect,
  layout,
  toOrigin,
  toAlign,
  fromAlign
} from './blockUtils'
import { IRect } from '../types'
import { IGenerator } from 'generators/Generator'

const deepEqual = require('deep-equal')

export interface IRectDispatch {
  value: IBlockRect
  x: number
  y: number
  width: number
  height: number
}

export abstract class Block {
  name: string
  rect: IRect
  layer: number | undefined
  zIndex: number
  hidden: boolean
  isWidthUnmanaged: boolean
  isHeightUnmanaged: boolean
  reactTransform: string
  reactTransformOrigin: string
  positionChildren: PositionChildrenFn | undefined
  generator: IGenerator
  localParent: React.MutableRefObject<Block> | undefined
  align: IAlign | undefined

  onClick: (e: React.MouseEvent) => void
  onMouseDown: (e: React.MouseEvent) => void
  abstract updatePosition(data: IDataLayout)
  abstract setData(key: string, v: any)
  abstract getData(key: string, i: any)
}

/**
 * Factory to create a Block in the form of a reference (React.MutableRefObject<Block>).
 * @param data
 * [Options](../interfaces/idatalayout.html) for a blocks behavior. Note that a block can be
 * defined in a generator function and then referenced by name in JSX. The same
 * [data-layout](../interfaces/idatalayout.html) property is used in both places. If it is
 * defined in a generator then only the name will be used in JSX. The other properties of
 * data-layout will not be used.
 * @param g
 * The [generator](../classes/generator.html) for this Layout.
 */
export function BlockFactory(
  data: IDataLayout,
  g: IGenerator
): React.MutableRefObject<Block> {
  // console.log(`BlockFactory enter ${data.name}`)

  function getRef() {
    let ref
    if (data.align) {
      if (typeof data.align.key === 'string') {
        ref = g.lookup(data.align.key as string)
      } else {
        const blocks = g.blocks()
        if (blocks) {
          ref = blocks.find(data.align.key as number)
        }
      }
    }
    return ref
  }

  const bounds = { container: g.containersize(), viewport: g.viewport() }

  const blockRect = React.useMemo(() => {
    return convertExRect(data.location)
  }, [data.location])

  const [rect, setRect] = React.useState({ x: 0, y: 0, width: 0, height: 0 })

  type MouseEventHandler = (e: React.MouseEvent<Element, MouseEvent>) => void //((e: MouseEvent) => void) | undefined
  const _layer = React.useRef<number>()
  const _zIndex = React.useRef<number>(0)
  const _hidden = React.useRef<boolean>(false)
  const _isWidthUnmanaged = React.useRef<boolean>(false)
  const _isHeightUnmanaged = React.useRef<boolean>(false)
  const _onClick = React.useRef<MouseEventHandler>(noop)
  const _onMouseDown = React.useRef<MouseEventHandler>(noop)

  let _localParent = React.useRef<React.MutableRefObject<Block> | undefined>()

  const _reactTransform = React.useRef<string>('')
  const _reactTransformOrigin = React.useRef<string>('')

  const _data = React.useRef<Map<string, any>>(new Map())

  function noop(e: React.MouseEvent<Element, MouseEvent>) {}

  React.useEffect(() => {
    let r = layout(blockRect, bounds)

    if (data.align) {
      const ref = getRef()
      if (ref) {
        let source = toAlign(ref.rect, data.align.source)

        // Translate to self location
        source.x += data.align.offset.x
        source.y += data.align.offset.y

        // Get left top point
        const self = fromAlign(
          { ...source, width: r.width, height: r.height },
          data.align.self
        )

        r = {
          ...self,
          width: r.width,
          height: r.height
        }
      } else {
        throw new Error(
          `Layout align key ${data.align.key} not found for block ${data.name}`
        )
      }
    } else {
      if (data.origin) {
        r = toOrigin(r, data.origin)
      }
    }

    if (!deepEqual(r, rect)) {
      setRect(r)
    }
  }, [
    data.location,
    data.align,
    data.origin,
    bounds.container.width,
    bounds.container.height,
    bounds.viewport.width,
    bounds.viewport.height,
    g
  ])

  // Class closure for Block interface
  class BlockImplementation extends Block {
    get name() {
      return data.name
    }

    get rect() {
      return rect
    }

    set rect(r: IRect) {
      setRect(r)
    }

    get layer(): number | undefined {
      return _layer.current
    }

    set layer(l: number | undefined) {
      _layer.current = l
    }

    get localParent(): React.MutableRefObject<Block> | undefined {
      return _localParent.current
    }

    set localParent(b: React.MutableRefObject<Block> | undefined) {
      _localParent.current = b
    }

    get reactTransform() {
      return _reactTransform.current
    }

    get reactTransformOrigin() {
      return _reactTransformOrigin.current
    }

    get zIndex(): number {
      return _zIndex.current
    }

    set zIndex(v: number) {
      _zIndex.current = v
    }

    get align(): IAlign | undefined {
      return data.align
    }

    get hidden(): boolean {
      return _hidden.current
    }

    set hidden(v: boolean) {
      _hidden.current = v
    }

    get isWidthUnmanaged(): boolean {
      return _isWidthUnmanaged.current
    }

    get isHeightUnmanaged(): boolean {
      return _isHeightUnmanaged.current
    }

    get onClick() {
      return _onClick.current
    }

    set onClick(fn: MouseEventHandler) {
      _onClick.current = fn
    }

    get onMouseDown() {
      return _onMouseDown.current
    }

    set onMouseDown(fn: MouseEventHandler) {
      _onMouseDown.current = fn
    }

    get positionChildren(): PositionChildrenFn | undefined {
      return data.positionChildren
    }

    get generator() {
      return g
    }

    public getData(key: string, i: any) {
      const v = _data.current.get(key)
      return v ? v : i
    }

    public setData(key: string, v: any) {
      return _data.current.set(key, v)
    }

    public updatePosition(data: IDataLayout) {}
  }

  const blockRef = React.useRef<Block>(new BlockImplementation())
  blockRef.current = new BlockImplementation()
  return blockRef
}

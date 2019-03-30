import * as React from 'react'
import ReactResizeDetector from 'react-resize-detector'

import {
  ILayoutProps,
  ILayoutState,
  ServiceOptions,
  DebugLevels,
  IPoint,
  ISize,
  rectSize,
  IRect
} from 'types'

import RLGDebug from 'debug'
import { IDataLayout } from 'layout-hooks'
import { IMetaDataArgs } from 'Panel'
import { Block } from 'components/Block';
import { blockStyle, blockSelectedStyle } from 'LayoutStyle'
import { useLayoutEventHandlers } from 'LayoutEvents';

export function content(
  props: ILayoutProps,
  state: ILayoutState,
  setState: React.Dispatch<React.SetStateAction<ILayoutState>>
) {
  const count = React.Children.count(props.children)
  // gInProgress += count

  const containersize = props.g.containersize()
  RLGDebug(DebugLevels.trace)(
    `\ncontent ${props.g.name()} containersize: ${containersize.width}, ${
      containersize.height
    }`
  )

  // Phase I create if necessary
  React.Children.map(props.children, (child, i) => {
    const c = child as React.ReactElement<any>
    if (c) {
      if (c.type === React.Fragment) {
        React.Children.map(c.props.children, (nChild, ni) => {
          const nc = nChild as React.ReactElement<any>
          const nCount = React.Children.count(nc.props.children)
          createLayout(nc, ni, nCount, props)
        })
      } else {
        // tslint:disable-next-line:no-any
        createLayout(c, i, count, props)
        // }
      }
    }
  })

  const layerStyle = {
    position: 'absolute' as 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none' as 'none'
  }

  const topLayerStyle = {
    background: 'transparent',
    position: 'absolute' as 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none' as 'none'
  }

  const layers = getLayers()
  const elements: React.ReactNode[] = []

  // Phase II update

  const encapsulate = props.layers ? props.layers.encapsulate : false
  let i = 0
  for (; i < layers.length && i < layers.length; i++) {
    const layer = layers[i]
    const children = processLayout(layer, count)
    elements.push(
      encapsulate ? (
        <div key={`layer#${i}`} id={`layer#${i}`} style={layerStyle}>
          {children}
        </div>
      ) : (
        children
      )
    )
  }

  // if (elements && props.service === ServiceOptions.dnd) {
  //   elements.push(
  //     <DragDropService
  //       name={`dnd-${this.props.name}`}
  //       key={`dnd-${this.props.name}`}
  //       boundary={{
  //         x: 0,
  //         y: 0,
  //         width: this.state.width,
  //         height: this.state.height
  //       }}
  //       leftTop={this.getBoundingLeftTop()}
  //       onUpdate={this.onUpdate}
  //       g={this._g}
  //     />
  //   )
  // }

  if (layers[-1]) {
    const layer = layers[-1]
    const children = processLayout(layer, count)
    elements.push(
      encapsulate ? (
        <div key={`layer#${i}`} id={`layer#${i}`} style={topLayerStyle}>
          {children}
        </div>
      ) : (
        children
      )
    )
  }

  // if (elements && this._edit) {
  //   elements.unshift(
  //     <Select
  //       name={`select-${name}`}
  //       key={`select-${name}`}
  //       selectCallback={this.selectCallback}
  //       boundary={{
  //         x: 0,
  //         y: 0,
  //         width: this.state.width,
  //         height: this.state.height
  //       }}
  //       onUpdate={this.onUpdate}
  //       g={this._g}
  //     />
  //   )
  // }

  if (elements && props.containersize === undefined) {
    elements.push(
      <ReactResizeDetector
        key={`contentResizeDetector ${props.name}`}
        handleWidth={true}
        handleHeight={true}
        onResize={onResize}
      />
    )
  }

  let gContext = React.useRef(new Map<string, any>())

  const {rootHtmlElement} = useLayoutEventHandlers(props, state, setState)

  function onResize(width: number, height: number) {
    if (state.devicePixelRatio === window.devicePixelRatio) {
      // Not zooming
      const w = Math.floor(
        width /* *this.state.devicePixelRatio / window.devicePixelRatio */
      )
      const h = Math.floor(
        height /* * this.state.devicePixelRatio / window.devicePixelRatio */
      )

      props.g.containersize({
        width: width,
        height: height
      })

      if (rootHtmlElement.current) {
        const r = rootHtmlElement.current.getBoundingClientRect()
        props.g.leftTop({
          x: r.left,
          y: r.top
        })
      }

      RLGDebug(DebugLevels.info)('\nonResize', props.name, w, h)

      if (state.width !== w || state.height !== h) {
        setState({ ...state, width: w, height: h })
      }
    }
  }

  return elements

  
  function createLayout(
    child: JSX.Element,
    index: number,
    count: number,
    props: ILayoutProps
  ) {
    const dataLayout = child.props['data-layout'] as IDataLayout

    if (dataLayout) {
      // if (p.layout && p.name) {
      //   const ancestor = gLayouts.get(p.layout);
      //   if (ancestor) {
      //     return ancestor.createPositionedElement(child, index, count, p.name, p);
      //   }
      // } else

      if (dataLayout.name) {
        return createPositionedElement(
          child,
          index,
          count,
          dataLayout.name,
          dataLayout,
          props
        )
      }
    }

    return null
  }

  function createPositionedElement(
    child: React.ReactElement<any>,
    index: number,
    count: number,
    name: string,
    dataLayout: IDataLayout,
    props: ILayoutProps
  ) {
    let b = props.g.lookup(name)
    if (!b && props.g.create) {
      b = props.g.create({
        index,
        count,
        name,
        g: props.g,
        dataLayout
      })

      if (!b) {
        RLGDebug(DebugLevels.error)(
          `The component ${name} in layout ${props.name} could not be created`
        )
      }
    }
  }

  function processLayout(layer: React.ReactChild[], count: number) {
    return React.Children.map(layer, (child, i) => {
      const c = child as React.ReactElement<any>
      if (c) {
        // console.log(`processLayout type ${c.type}`)
        if (c.type === React.Fragment) {
          return React.Children.map(c.props.children, (nChild, ni) => {
            const nc = nChild as React.ReactElement<any>
            const nCount = React.Children.count(nc.props.children)
            return updateElement(nc, ni, nCount)
          })
        } else {
          // tslint:disable-next-line:no-any
          return updateElement(child as React.ReactElement<any>, i, count)
        }
      }
      return null
    })
  }

  function updateElement(
    child: React.ReactElement<any>,
    index: number,
    count: number
  ) {
    const dataLayout = child.props['data-layout'] as IDataLayout

    if (dataLayout) {
      // if (p.layout && p.name) {
      //   const ancestor = gLayouts.get(p.layout);
      //   if (ancestor) {
      //     const location = this.getBoundingLeftTop();
      //     const ancestorLocation = ancestor.getBoundingLeftTop();
      //     const offset = { x: ancestorLocation.x - location.x, y: ancestorLocation.y - location.y };

      //     return ancestor.updatePositionedElement(
      //       child, index, count, p.name, p, p.context, offset
      //     );
      //   }
      // } else

      if (dataLayout.name) {
        return updatePositionedElement(child, index, count, dataLayout.name)
      }
    }

    const args =
      typeof child.type === 'string'
        ? {}
        : {
            service: props.service,
            context: gContext.current,
            g: props.g,
            style: { ...props.style, ...child.props.style }
          }

    return React.cloneElement(
      child,
      {
        // id: `${dataLayout.name}`,
        ...child.props,
        ...args
      },
      child.props.children
    )
  }

  function updatePositionedElement(
    child: React.ReactElement<any>,
    index: number,
    count: number,
    name: string,
    offset?: IPoint
  ) {
    const c = props.g.containersize()
    if (c.width === 0 && c.height === 0) {
      return null
    }

    const b = props.g.lookup(name)

    if (b && !b.current.hidden) {
      const rect = b.current.rect

      RLGDebug(DebugLevels.trace)(
        `updatePositionedElement ${name} rect:`,
        b.current.rect
      )

      if ((rect.width && rect.height) || b.current.isWidthUnmanaged || b.current.isHeightUnmanaged) {
        const style = blockStyle(
          child.props.style,
          rect.x + (offset ? offset.x : 0),
          rect.y + (offset ? offset.y : 0),
          rect.width,
          rect.height,
          b.current.isWidthUnmanaged,
          b.current.isHeightUnmanaged,
          /*  TODO Select this._select ? this._select.selected(name) : */ false,
          b.current.zIndex ? b.current.zIndex : 0,
          /*  TODO Transform  b.current.reactTransform*/ '',
          /*  TODO Transform  b.current.reactTransformOrigin*/ '',
        )

        const editors = createEditors(child, b, rect)

        // gInProgress -= 1

        if (b.current.positionChildren) {
          return positionChildren(child, b, name, rect, style)
        } else {
          const editProps = props.service === ServiceOptions.edit
            ? {
                edit: props.service === ServiceOptions.edit ? 1 : 0,
                g: props.g
              }
            : {}
          const metaDataArgs: IMetaDataArgs = {
            container: rect,
            block: b.current,
            service: props.service ? props.service : ServiceOptions.none,
            g: props.g,
            context: gContext.current
            // update: this.onUpdate
          }

          class Local {
            private _b: React.MutableRefObject<Block>
            private _s: ISize

            constructor(b: React.MutableRefObject<Block>) {
              this._b = b
              this._s = rectSize(b.current.rect)
            }

            setSize(w: number, h: number) {
              if (w && h) {
                if (this._s.width !== w || this._s.height != h) {
                  this._s.width = w
                  this._s.height = h
                  const r = this._b.current.rect
                  let ws = r.width
                  let hs = r.height
                  if (this._b.current.isWidthUnmanaged) {
                    ws = w
                  } else if (this._b.current.isHeightUnmanaged) {
                    hs = h
                  }
                  this._b.current.rect = { x: r.x, y: r.y, width: ws, height: hs }
                }
              }
            }

            selectedStyle() {
              return blockSelectedStyle(this._b.current.rect, this._b.current.zIndex)
            }
          }

          const local = new Local(b)

          const args = typeof child.type === 'string' ? {} : metaDataArgs

          const cc = React.cloneElement(
            child,
            {
              ...child.props,
              ...{
                key: b.current.name,
                id: b.current.name,
                ref: (c: any) => {
                  if (c) {
                    local.setSize(c.offsetWidth, c.offsetHeight)
                  }
                },

                ...args,

                ...editProps,

                style: { ...props.style, ...child.props.style, ...style }
              }
            },
            child.props.children
          )

          let e
          // TODO _select
          // if (_select && _select.selected(name)) {
          //   e = <div key={`select${index}`} style={local.selectedStyle()} />
          // }

          return (
            <>
              {cc}
              {e ? e : null}
              {editors}
            </>
          )
        }
      }
    }

    return null
  }

  function positionChildren(
    child: React.ReactElement<any>,
    b: React.MutableRefObject<Block>,
    name: string,
    rect: IRect,
    style: React.CSSProperties
  ) {
    const editProps = {
      edit: props.service === ServiceOptions.edit ? 1 : 0,
      g: props.g
    }

    const nestedChildren = React.Children.map(
      child.props.children,
      (nestedChild, i) => {
        const nestedLayout = b.current.positionChildren!(
          b.current,
          b.current.generator,
          i,
          nestedChild.props
        )
        if (nestedLayout && nestedChild.props) {
          nestedLayout.localParent = b
          // const blocks = this._g.blocks();
          // blocks.set(nestedLayout.name, nestedLayout.position, nestedLayout.generator);

          const nestedRect = nestedLayout.rect
          const nestedStyle = blockStyle(
            nestedChild.props.style,
            nestedRect.x,
            nestedRect.y,
            nestedRect.width,
            nestedRect.height,
            b.current.isWidthUnmanaged,
            b.current.isHeightUnmanaged,
            /* TODO Select this._select ? this._select.selected(name) :*/ false,
            b.current.zIndex,
            b.current.reactTransform,
            b.current.reactTransformOrigin
          )

          const args =
            typeof nestedChild.type === 'string'
              ? {}
              : {
                  container: nestedRect,
                  block: b,
                  service: props.service,
                  g: props.g,
                  context: gContext.current
                  // update: this.onUpdate
                }

          return React.cloneElement(
            nestedChild,
            {
              ...nestedChild.props,
              ...{
                key: `${nestedChild.props.id}`,
                id: `${nestedChild.props.id}`,

                ...args,

                ...editProps,
                style: {
                  ...props.style,
                  ...nestedChild.props.style,
                  ...nestedStyle
                }
              }
            },
            nestedChild.props.children
          )
        }
        return null
      }
    )

    const args =
      typeof child.type === 'string'
        ? {}
        : {
            container: rect,
            block: b,
            service: props.service,
            g: props.g,
            context: gContext.current
            // update: this.onUpdate
          }

    return React.cloneElement(
      child,
      {
        ...child.props,
        ...{
          key: b.current.name,
          id: b.current.name,

          ...args,

          ...editProps,

          style: { ...props.style, ...child.props.style, ...style }
        }
      },
      nestedChildren
    )
  }

  function getLayers(): React.ReactChild[][] {
    const jsx: React.ReactChild[][] = []

    function push(layer: number, child: React.ReactChild) {
      if (!jsx[layer]) {
        jsx[layer] = []
      }
      jsx[layer].push(child)
    }

    const mapper =
      props.layers && props.layers.mapper
        ? props.layers.mapper
        : (layer: number) => {
            return layer
          }

    React.Children.map(props.children, child => {
      const c = child as React.ReactElement<any>
      if (c) {
        if (c.type === React.Fragment) {
          React.Children.map(c.props.children, nChild => {
            processLayer(nChild, push, child as React.ReactChild, mapper)
          })
        } else {
          processLayer(c, push, child as React.ReactChild, mapper)
        }
      }
    })

    return jsx
  }

  function processLayer(
    c: React.ReactElement<any>,
    push: (layer: number, child: React.ReactChild) => void,
    child: React.ReactChild,
    mapper: (layer: number) => number | undefined
  ) {
    const dataLayout = c.props['data-layout']
    const layer: number | undefined = dataLayout ? dataLayout.layer : 0
    if (!layer) {
      push(0, child as React.ReactChild)
    } else {
      const l = mapper(layer)
      if (l !== undefined) {
        if (l >= 0) {
          push(l, c)
        } else {
          push(-1, c)
        }
      }
    }
  }

  function createEditors(
    child: React.ReactElement<any>,
    b: React.MutableRefObject<Block>,
    rect: { y: number; x: number; width: number; height: number }
  ) {
    const editors: React.ReactChild[] = []
    // if (this._edit) {
    //   if (child.props.onMouseDown) {
    //     const fn = child.props.onMouseDown as (e: React.MouseEvent) => void
    //     b.current.onMouseDown = fn
    //   }

    //   if (child.props.onClick) {
    //     const fn = child.props.onClick as (e: React.MouseEvent) => void
    //     b.current.onClick = fn
    //   }

    //   if (b.current.editor && b.current.editor.edits) {
    //     let allowWidth = true
    //     let allowHeight = true
    //     b.current.editor.edits.forEach((item, i) => {
    //       // filter unmanaged edits
    //       if (
    //         b.current.isHeightUnmanaged &&
    //         (item.ref === PositionRef.bottom || item.ref === PositionRef.top)
    //       ) {
    //         allowWidth = false
    //       }
    //       if (
    //         b.current.isWidthUnmanaged  &&
    //         (item.ref === PositionRef.left || item.ref === PositionRef.right)
    //       ) {
    //         allowHeight = false
    //       }
    //       if (allowWidth || allowHeight) {
    //         editors.push(
    //           <EditLayout
    //             key={`edit${b.name + i}`}
    //             edit={item}
    //             block={b!}
    //             select={this._select}
    //             handle={rect}
    //             boundary={{
    //               x: 0,
    //               y: 0,
    //               width: this.state.width,
    //               height: this.state.height
    //             }}
    //             onUpdate={this.onUpdate}
    //             zIndex={b.zIndex}
    //           />
    //         )
    //       } else {
    //         RLGDebug(DebugLevels.error)(`Cannot edit ${namedPositionRef(
    //           item.ref
    //         )} for block 
    //         ${name} when width or height is set to Unit.unmanaged`)
    //       }
    //     })
    //   } else if (b.current.editor ? !b.current.editor.preventEdit : true) {
    //     // Add default position
    //     const edit = { ref: PositionRef.position }
    //     b.current.setEditDefaults(edit)
    //     editors.push(
    //       <EditLayout
    //         key={`edit${b.name}`}
    //         edit={edit}
    //         block={b!}
    //         select={this._select}
    //         handle={rect}
    //         boundary={{
    //           x: 0,
    //           y: 0,
    //           width: this.state.width,
    //           height: this.state.height
    //         }}
    //         onUpdate={this.onUpdate}
    //         zIndex={b.zIndex}
    //       />
    //     )
    //   }
    // }
    return editors
  }

}

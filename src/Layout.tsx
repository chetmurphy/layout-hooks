import * as React from 'react'
import { DebugLevels, ILayoutProps, ILayoutState, ServiceOptions } from 'types'
import { IGenerator } from 'generators/Generator'

import RLGDebug from 'debug'

import { content } from './LayoutUtils'
import { mainStyle } from 'LayoutStyle';
import { useLayoutEventHandlers } from 'LayoutEvents';

function initLayout(g: IGenerator) {
  g.reset()
  RLGDebug(DebugLevels.data)(g.dump())
}

export function Layout(props: ILayoutProps) {
  const initState: ILayoutState = {
    width: 0,
    height: 0,
    update: 0,
    contextMenu: undefined,
    contextMenuActive: false,
    devicePixelRatio: 0
  }

  const [state, setState] = React.useState(initState)

  initLayout(props.g)

  let startRendering = React.useRef(performance.now())
  function frameStart() {
    startRendering.current = performance.now()
    return null
  }

  function frameEnd() {
    const difference = performance.now() - startRendering.current
    RLGDebug(DebugLevels.timing)(`frameTime: ${difference.toFixed(4)}ms`)
    return null
  }

 const {
   onParentMouseDown, 
   onParentContextMenu,
   onRootRef
  } = useLayoutEventHandlers(props, state, setState)

  let style: React.CSSProperties = mainStyle(props, state)

  if (props.service === ServiceOptions.edit) {
    frameStart()
    return (
      /* style height of 100% necessary for ReactResizeDetector to work  */
      <div
        id={`${props.name}`}
        ref={onRootRef}
        style={style}
        onMouseDown={onParentMouseDown}
        onContextMenu={onParentContextMenu()}
      >
        <>
          {content(props, state, setState)}

          {/* {state.contextMenuActive ? (
            <ContextMenu
              commands={this.generateContextMenu(state.contextMenu)}
              location={this._menuLocation}
              bounds={{ width: state.width, height: state.height }}
              hideMenu={this.hideMenu}
              zIndex={999}
            />
          ) : null} */}

          {frameEnd()}
        </>
      </div>
    )
  }
  return (
    <div
      id={`${props.name}`}
      ref={onRootRef}
      style={style}
    >
      {content(props, state, setState)}
    </div>
  )
}

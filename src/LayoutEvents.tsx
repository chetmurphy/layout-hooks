import * as React from 'react'

import { DebugLevels, ILayoutState, ILayoutProps } from './types'

import RLGDebug from 'debug'

import { Block } from './components/Block';

export function useLayoutEventHandlers(
  props: ILayoutProps,
  state: ILayoutState,
  setState: React.Dispatch<React.SetStateAction<ILayoutState>>
) {

  const menuLocation = React.useRef({x: 0, y: 0})

  function onParentMouseDown(event: React.MouseEvent) {
    RLGDebug(DebugLevels.mouseEvents)(
      `Layout onParentMouseDown ${props.name} ${event.target}`
    )

    // TODO Select
    // if (event.button !== 2 && this._select && this._select.selected.length) {
    //   this._select.clear()
    // }

    if (event.button === 2) {
      event.stopPropagation()
      handleContextMenu(event)
    }
  }

  function onParentContextMenu(block?: React.MutableRefObject<Block>) {
    return (event: React.MouseEvent) => {
      RLGDebug(DebugLevels.mouseEvents)(
        `Layout onParentContextMenu ${props.name} ${event.target}`
      )

      event.preventDefault()
      setState({ ...state, contextMenu: block, contextMenuActive: true })
    }
  }

  function handleContextMenu(event: React.MouseEvent<Element>) {
    if (event.button === 2) {
      // Right click
      event.preventDefault()
      const currentTargetRect = event.currentTarget.getBoundingClientRect()
      const offsetX = event.pageX - currentTargetRect.left
      const offsetY = event.pageY - currentTargetRect.top
      menuLocation.current = { x: offsetX, y: offsetY }
      addEventListeners()
    } else {
      hideMenu()
    }
  }

  function hideMenu() {
    if (state.contextMenuActive) {
      setState({...state, contextMenu: undefined, contextMenuActive: false })
    }
  }

  function addEventListeners() {
    document.addEventListener('mouseup', onHtmlMouseUp)
  }

  function removeEventListeners () {
    document.removeEventListener('mouseup', onHtmlMouseUp)
  }

  function onHtmlMouseUp(event: MouseEvent) {
    if (event) {
      RLGDebug(DebugLevels.mouseEvents)(
        `Layout onHtmlMouseUp ${props.name} ${event.target}`
      )
      event.preventDefault()
      removeEventListeners()
      hideMenu()
    }
  }

  const rootHtmlElement = React.useRef<HTMLDivElement>()
  function onRootRef (element: HTMLDivElement){
    if (element) {
      rootHtmlElement.current = element
    }
  }

  // TODO Select
  // function selectCallback(instance: Select) {
  //   this._select = instance
  // }

  return {
    addEventListeners, 
    removeEventListeners, 
    onParentMouseDown, 
    onParentContextMenu, 
    handleContextMenu,
    onHtmlMouseUp,
    onRootRef,
    rootHtmlElement
  }
}

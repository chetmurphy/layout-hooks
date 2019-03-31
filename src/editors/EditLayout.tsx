import * as React from 'react'

import RLGDebug from 'debug';

// import Layout from 'src/components/Block';
import { DebugLevels, IPoint, IRect, EditorOptions } from '../types'
import { clone } from '../utils'
import { IEditor, IEditorProps, IUndo } from './Editor'

const prefix = require('react-prefixer')

/**
 * internal use only
 * @ignore
 */
interface IEditHandleProps {
  cursor?: string
  handle: IRect
  zIndex: number
}

/**
 * internal use only
 * @ignore
 */
function editStyle(args: IEditHandleProps): React.CSSProperties {
  return  prefix({
    boxSizing: 'border-box' as 'border-box',
    // transformOrigin: 0,
    transform: `translate(${args.handle.x}px, ${args.handle.y}px)`,
    width: `${args.handle.width}px`,
    height: `${args.handle.height}px`,
    position: 'absolute' as 'absolute',
    cursor: `${args.cursor}`,
    background: 'rgba(0, 0, 0, 0)',
    zIndex: args.zIndex,
    borderWidth: '4px',
    outline: 'none',
    userSelect: 'none',
    pointerEvents: 'auto'
  })
}

/**
 * internal use only
 * @ignore
 */
interface IEditLayoutState {
  activateDrag: boolean
  contextMenu: boolean
}

/**
 * internal use only
 * @ignore
 */
export class EditLayout
  extends React.Component<IEditorProps, IEditLayoutState>
  implements IEditor {
  public _startRect: IRect
  public _startOrigin: IPoint

  public _handle: IRect

  protected _ctrlKey: boolean = false
  protected _altKey: boolean = false
  protected _menuLocation: IPoint

  constructor(props: IEditorProps) {
    super(props)
    this._startRect = clone(this.props.handle)
    this._startOrigin = { x: 0, y: 0 }
    this._menuLocation = { x: 0, y: 0 }
    this.state = { activateDrag: false, contextMenu: false }

    this._handle = { x: 0, y: 0, width: 0, height: 0 }
    if (this.props.edit.updateHandle) {
      const r = props.block.current.rect
      this._handle = this.props.edit.updateHandle(r)
    }
  }

  public render = () => {
    if (this._handle) {
      return (
        <div
          id={this.props.block.current.name}
          style={editStyle({
            cursor: this.props.edit.cursor!,
            handle: this._handle,
            zIndex: this.props.zIndex
          })}
          onMouseDown={this.onMouseDown}
          /* onTouchDown={this.onTouchDown} */
          /* onContextMenu={this.onContextMenu} */
          tabIndex={0}
        />
      )
    } else {
      return null
    }
  }

  public initUpdate(x: number, y: number) {
    this._startOrigin = { x, y }
    const r = this.props.block.current.rect
    this._handle = this.props.edit.updateHandle!(r)
    this._startRect = clone(this.props.handle)
  }

  public hideMenu = () => {
    this.setState({ contextMenu: false })
  }

  public moveUpdate(x: number, y: number) {
    let deltaX = x - this._startOrigin.x
    let deltaY = y - this._startOrigin.y

    if (this._ctrlKey) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        deltaY = 0
      } else {
        deltaX = 0
      }
    }

    if (deltaX || deltaY) {
      // 1 Extend
      const r: IRect = this._startRect
      const ur: IRect = this.props.edit.extendElement!(r, deltaX, deltaY)

      // 2 Pin
      if (!this.props.editor || this.props.editor & EditorOptions.pin) {
        if (ur.x < this.props.boundary.x) {
          ur.x = this.props.boundary.x
        }
        if (ur.x + ur.width > this.props.boundary.x + this.props.boundary.width) {
          ur.x = this.props.boundary.x + this.props.boundary.width - ur.width
        }
        if (ur.y < this.props.boundary.y) {
          ur.y = this.props.boundary.y
        }
        if (
          ur.y + ur.height >
          this.props.boundary.y + this.props.boundary.height
        ) {
          ur.y = this.props.boundary.y + this.props.boundary.height - ur.height
        }
      }

      // 3 Make live

      RLGDebug(DebugLevels.trace)(
        `EditLayout update location ${this.props.block.current.name} (x: ${r.x}, y: ${
          r.y
        }) to (x: ${ur.x} y: ${ur.y})`
      )
      
      this.props.block.current.update(
        { x: ur.x, y: ur.y, width: ur.width, height: ur.height }
      )

      // update params if needed
      if (this.props.edit.updateParam) {
        const p = this.props.edit.updateParam(
          ur,
          this.props.edit,
          this.props.block
        )
        if (p) {
          this.props.block.current.generator.params().set(p.name, p.value)
        }
      }

      // 4 Update handle
      this._handle = this.props.edit.updateHandle!(ur)

      this.props.onUpdate()
    }
  }

  public redo = () => {
    // TODO
  }

  public undo = () => {
    // TODO
  }

  public push = (): IUndo => {
    // this goes on the undo/redo stack
    // the editor is stores the state needed
    // or it will be added to IUndo
    return { editor: this }
  }

  public addEventListeners = () => {
    // document.addEventListener('keydown', this.onKeyDown);
    // document.addEventListener('keyup', this.onKeyUp);
    document.addEventListener('mouseup', this.onHtmlMouseUp)
    document.addEventListener('mousemove', this.onHtmlMouseMove)

    // document.addEventListener('touchmove', this.onHtmlTouchMove)

    // document.addEventListener('mouseenter', this.onIgnore)
    // document.addEventListener('mouseleave', this.onIgnore)
    // document.addEventListener('mouseout', this.onIgnore)
    // document.addEventListener('mouseover', this.onIgnore)
    // document.addEventListener('dragenter',  this.onIgnore)
    // document.addEventListener('dragover', this.onIgnore)
    // document.addEventListener('dragleave', this.onIgnore)

    // document.addEventListener('blur', this.onIgnore);
    // document.addEventListener('focus', this.onIgnore);
  }

  public removeEventListeners = () => {
    // document.removeEventListener('keydown', this.onKeyDown);
    // document.removeEventListener('keyup', this.onKeyUp);
    document.removeEventListener('mouseup', this.onHtmlMouseUp)
    document.removeEventListener('mousemove', this.onHtmlMouseMove)
    
    // document.removeEventListener('touchmove', this.onHtmlTouchMove)

    // document.removeEventListener('mouseenter', this.onIgnore)
    // document.removeEventListener('mouseleave', this.onIgnore)
    // document.removeEventListener('mouseout', this.onIgnore)
    // document.removeEventListener('mouseover', this.onIgnore)
    // document.removeEventListener('dragenter',  this.onIgnore)
    // document.removeEventListener('dragover', this.onIgnore)
    // document.removeEventListener('dragleave', this.onIgnore)
    // document.removeEventListener('blur', this.onIgnore);
    // document.removeEventListener('focus', this.onIgnore);
  }

  public onClick = (event: React.MouseEvent) => {
    if (event.altKey) {
      const fn = this.props.block.current.onClick
      if (fn) {
        fn(event)
      }
    }
  }

  public onMouseDown = (event: React.MouseEvent) => {
    RLGDebug(DebugLevels.mouseEvents)(`EditLayout onMouseDown ${event.target['id']}`)
    
    if (!this.state.contextMenu) {
      // event.preventDefault();
      if (event.button === 2) {
        event.preventDefault()
        // Right click
        const currentTargetRect = event.currentTarget.getBoundingClientRect()
        const offsetX = event.pageX - currentTargetRect.left
        const offsetY = event.pageY - currentTargetRect.top
        this._menuLocation = { x: offsetX, y: offsetY }
      } else if (event.shiftKey) {
        // Select
        event.preventDefault()
        event.stopPropagation()
        if (this.props.select) {
          let select: boolean | undefined = true
          if (this.props.block.current.editor) {
            const editor = this.props.block.current.editor
            select = editor.selectable
            if (select === undefined) {
              select = true
            }
          }
          if (select) {
            const alreadySelected = this.props.select.selected(
              this.props.block.current.name
            )
            if (alreadySelected) {
              this.props.select.remove(this.props.block)
            } else {
              this.props.select.add(this.props.block)
            }

            this.props.onUpdate()
          }
        }
      } else if (event.altKey) {
        const fn = this.props.block.current.onClick
        if (fn) {
          fn(event)
        }
      } else {
        event.stopPropagation()
        if (this.props.select) {
          this.props.select.clear()
          this.props.onUpdate()
        }
        this.setState({ contextMenu: false })

        this.addEventListeners()

        this._ctrlKey = event.ctrlKey
        this._altKey = event.altKey

        this.initUpdate(event.clientX, event.clientY)
      }
    }
  }

  // public onTouchDown = (event: React.TouchEvent) => {
  //   // https://stackoverflow.com/questions/17130940/retrieve-the-same-offsetx-on-touch-like-mouse-event
  //   // Use tap+hold or longtap event to trigger context menu
  //   // See https://github.com/yahoo/react-dnd-touch-backend
  // }

  // public onContextMenu = (event: React.MouseEvent) => {
  //   if (event) {
  //     event.preventDefault();
  //     this.setState({ contextMenu: this.props.edit.contextMenu !== undefined });
  //   }
  // }

  // public onIgnore = (event: MouseEvent) => {
  //   if (event) {
  //     event.preventDefault()
  //     event.stopPropagation()
  //   }
  // }

  public onHtmlMouseMove = (event: MouseEvent) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
      this.moveUpdate(event.clientX, event.clientY)
    }
  }

  public onHtmlMouseUp = (event: MouseEvent) => {
    const id = event && event.target && event.target['id']
    RLGDebug(DebugLevels.mouseEvents)(`EditLayout onHtmlMouseUp ${id ? id : ''}`)

    if (event) {
      event.preventDefault()
      this.removeEventListeners()

      if (this.state.contextMenu) {
        this.setState({ contextMenu: false })
      } else {
        const block = this.props.block
        const r = block.current.rect
        block.current.update({ x: r.x, y: r.y, width: r.width, height: r.height })
      }
      this.props.onUpdate(true)
    }
  }

  public componentWillReceiveProps = (props: IEditorProps) => {
    if (this.props.edit.updateHandle) {
      this._handle = this.props.edit.updateHandle(props.handle)
    }
  }
}

import * as React from 'react'

import RLGDebug from 'debug';

import { DebugLevels, IPoint, IRect, difference, Rect } from '../types'
import { IService, IServiceProps, IUndo } from './Service'
import { Block } from '../components/Block'
// import { Control } from '../Control'

// const rbush = require('rbush')

// export { rbush }


// const gXIndex = 10
/**
 * internal use only
 * @ignore
 */
interface IServiceLayoutState {
  activateDrag: boolean
  contextMenu: boolean
  leftTop: IPoint
}

/**
 * internal use only
 * @ignore
 */
export class DragDropService
  extends React.Component<IServiceProps, IServiceLayoutState>
  implements IService {
  public _startRect: IRect
  public _startOrigin: IPoint

  protected _ctrlKey: boolean = false
  protected _altKey: boolean = false
  protected _menuLocation: IPoint

  private _jsx: JSX.Element | undefined = undefined

  // private _rbush: any
  private _root: React.RefObject<HTMLDivElement>
  private _dragData: string[] = []
  private _prevDroppable: Set<React.MutableRefObject<Block>> = new Set()
  private _dragBlock: React.MutableRefObject<Block> | undefined = undefined
  private _parentContainer: React.MutableRefObject<Block> | undefined

  constructor(props: IServiceProps) {
    super(props)
    this._startOrigin = { x: 0, y: 0 }
    this._menuLocation = { x: 0, y: 0 }
    this.state = {
      activateDrag: false,
      contextMenu: false,
      leftTop: { x: 0, y: 0 }
    }

    // this._rbush = rbush()
    this._root = React.createRef()
  }

  // componentDidMount() {}

  protected hitTest(r: Rect) {
    const blocks = this.props.g.blocks()
    const items: React.MutableRefObject<Block>[] = []
    // this._rbush.clear()
    const dragBlockParent = this._dragBlock!.current.localParent
    if (dragBlockParent) {
      blocks.map.forEach(block => {
        if (
          block.current.getData('canDrop') &&
          dragBlockParent.current.name !== block.current.name
        ) {
            if (r.intersect(block.current.rect)) {
              items.push(block)
            }
        }
      })
    }
    return items
  }

  private loadDropContainers() {
  }

  public componentWillUnmount() {
    // document.addEventListener('mousedown', this.onHtmlMouseDown)
    this.endDrag()
  }

  public startDrag = () => {
    document.addEventListener('mouseup', this.onHtmlMouseUp)
    document.addEventListener('mousemove', this.onHtmlMouseMove)
  }

  public endDrag = () => {
    this._jsx = undefined
    this._dragBlock = undefined
    this._dragData = []
    document.removeEventListener('mouseup', this.onHtmlMouseUp)
    document.removeEventListener('mousemove', this.onHtmlMouseMove)
  }

  public render = () => {
    const style = {
      boxSizing: 'border-box' as 'border-box',
      transform: `translate(${this.state.leftTop.x}px, ${
        this.state.leftTop.y
      }px)`,
      position: 'absolute' as 'absolute',
      backgroundColor: 'rgba(0, 0, 0, 0)'
    }
    return (
      <div
        id={'dnd'}
        ref={this._root}
        style={{
          background: 'transparent',
          position: 'absolute',
          width: this.props.boundary.width,
          height: this.props.boundary.height,
        }}
        onMouseDown={this.onMouseDown}
      >
        <div style={style}>{this._jsx}</div>
      </div>
    )
  }

  public hideMenu = () => {
    this.setState({ contextMenu: false })
  }

  public initUpdate(x: number, y: number) {
    this._startOrigin = { x, y }
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

  public onMouseDown = (event: React.MouseEvent) => {
     // tslint:disable-next-line:no-bitwise
    if (event.target) {
      RLGDebug(DebugLevels.mouseEvents)(`DragDrop onMouseDown ${(event.target as HTMLElement).id}`)
    }

    if (event.button === 2) {
      // context menu needed?
    }

    // Get target and corresponding Block
    let block: React.MutableRefObject<Block> | undefined = undefined
    if (this._root && this._root.current) {
      
      // Hide this layer so that we can use elementFromPoint
      this._root.current.style.visibility = 'hidden'

      let element = document.elementFromPoint(event.clientX, event.clientY)
      if (element) {
        block = this.props.g.blocks().get(element.id)

        if (block) {
          const r = element.getBoundingClientRect()
          this._startRect = {
            x: r.left - this.props.leftTop.x,
            y: r.top - this.props.leftTop.y,
            width: r.width,
            height: r.height
          }

          // Find parent block - get it now because it will change during the
          // DnD process. It is needed for endDrag.
          this._parentContainer = block.current.localParent
          this._dragBlock = block
        }
      }

      // Re-enable visible
      this._root.current.style.visibility = 'visible'
    }

    if (!block) {
      return
    }

    this.setState({
      leftTop: {
        x: this._startRect.x,
        y: this._startRect.y
      }
    })

    // get dragData
    if (this._parentContainer) {
      const dragData = this._parentContainer.current.getData('dragData')
      if (dragData) {
        this._dragData = dragData(block.current.name)
        if (!this._dragData) {
          return
        }
      }
    }

    if (this._dragData ? this._dragData.length === 0 : true) {
      this._dragData = [block.current.name]
    }

    // get drag image as JSX
    if (this._parentContainer) {
      const dragImage = this._parentContainer.current.getData('dragImage')
      if (dragImage) {
        this._jsx = dragImage(this._dragData)
      }
    }

    const dragImage = block.current.getData('dragImage')
    if (this._jsx === undefined && dragImage) {
      this._jsx = dragImage(this._dragData)
    }

    if (this._dragData.length === 0) {
      return
    }

    // Start drag
    this.loadDropContainers()
    this.startDrag()
    this.initUpdate(event.clientX, event.clientY)
  }

  public onHtmlMouseMove = (event: MouseEvent) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
      this.moveUpdate(event.clientX, event.clientY)
    }
  }

  public onHtmlMouseUp = (event: MouseEvent) => {
    const id = event && event.target && event.target['id']
    RLGDebug(DebugLevels.mouseEvents)(`DragDrop onHtmlMouseUp ${id ? id : ''}`)

    function dump(candidates: React.MutableRefObject<Block>[]) {
      RLGDebug(DebugLevels.trace)(`candidates.length ${candidates.length}`)
      candidates.forEach((b) => {
        RLGDebug(DebugLevels.trace)(`   block ${b.current.name}`)
      })
    }

    if (event) {
      event.preventDefault()

      if (this._dragBlock) {
        const ur = {
          x: this.state.leftTop.x,
          y: this.state.leftTop.y,
          width: this._startRect.width,
          height: this._startRect.height
        }
        const candidates = this.collisions(new Rect(ur))

        RLGDebug(DebugLevels.trace)(dump(candidates))

        if (candidates.length === 1) {
          const canDrop = candidates[0].current.getData('canDrop')
          if (canDrop && canDrop(this._dragData)) {
            const drop = candidates[0].current.getData('drop')
            if (drop && drop(this._dragData)) {
              if (this._parentContainer) {
                const endDrop = this._parentContainer.current.getData('endDrop')
                if (endDrop) {
                  endDrop(this._dragData)
                } else {
                  console.error(
                    `Drag container for ${this._dragBlock.current.name} does not have a endDrag handler`
                  )
                }
              } else {
                console.error(
                  `Drag container for ${this._dragBlock.current.name} does not exist. You can only drag
                  elements that are in an enabled container element.`
                )
              }
            }
          }
        }
      }
      this.endDrag()
      this.props.onUpdate()

      if (this.state.contextMenu) {
        this.setState({ contextMenu: false })
      } else {
        // const block = this.props.block
        // const r = block.rect
        // block.update({ x: r.x, y: r.y }, { width: r.width, height: r.height })
      }
      this.props.onUpdate(true)
    }
  }

  private collisions(r: Rect) {

    // Current block container already ignored
    // TODO fix this when allowing DnD to be used within a container.
    const candidates = this.hitTest(r)
    // this._rbush.search({
    //   minX: r.x,
    //   minY: r.y,
    //   maxX: r.right,
    //   maxY: r.bottom
    // })

    const verified: React.MutableRefObject<Block>[] = []
    candidates.forEach((b: React.MutableRefObject<Block>) => {
      if (r.intersect(b.current.rect)) {
        verified.push(b)
      }
    })
    return verified
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

      const ur: IRect = {
        x: this._startRect.x + deltaX,
        y: this._startRect.y + deltaY,
        width: this._startRect.width,
        height: this._startRect.height
      }

      // 2 Pin
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

      // 3 CanDrop
      const candidates = this.hitTest(new Rect(ur))

      if (RLGDebug(DebugLevels.trace).enabled) {
        RLGDebug(DebugLevels.trace)(`Drop target containers for ${this.props.name}`)
          candidates.forEach((block: React.MutableRefObject<Block>) => {
            RLGDebug(DebugLevels.trace)(`  drop target ${block.current.name}`)
        })
      }
    
      const blocks: Set<React.MutableRefObject<Block>> = new Set()
      candidates.forEach((block: React.MutableRefObject<Block>) => {
        const canDrop = block.current.getData('canDrop')
        if (canDrop && canDrop(this._dragData)) {
          blocks.add(block)
        }
      })

      let leave = difference(this._prevDroppable, blocks)

      leave.forEach(b => {
        const dragLeave = b.current.getData('dragLeave')
        if (dragLeave) {
          dragLeave()
        }
      })

      let enter = difference(blocks, this._prevDroppable)

      enter.forEach(b => {
        const dragEnter = b.current.getData('dragEnter')
        if (dragEnter) {
          dragEnter()
        }
      })

      this._prevDroppable = blocks

      RLGDebug(DebugLevels.trace)(`DragDrop update location (x: ${ur.x} y: ${ur.y})`)
 
      // 4 Update handle
      if (
        this.state.leftTop.x !== this._startRect.x + deltaX ||
        this.state.leftTop.y !== this._startRect.y + deltaY
      ) {
        this.setState({
          leftTop: {
            x: this._startRect.x + deltaX,
            y: this._startRect.y + deltaY
          }
        })
      }
    }
  }
}

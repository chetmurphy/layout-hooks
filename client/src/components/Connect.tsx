import * as React from 'react'

// These paths are for the examples only. In an application you
// would get these by importing from 'react-layout-generator'
import { 
  Block, 
  connectPoint, 
  IGenerator, 
  IOrigin, 
  lineRectIntersection, 
  PositionRef 
} from '../importRLG'

export interface IConnectRect {
  ref: PositionRef
  x: number
  y: number
}

export interface IConnectProps extends React.HTMLProps<HTMLElement> {
  blockA: string
  originA?: IOrigin
  blockB: string
  originB?: IOrigin

  g: IGenerator
}

export interface IConnectState {
  connectPointA: IConnectRect
  connectPointB: IConnectRect
}

export class Connect extends React.Component<IConnectProps, IConnectState> {


  
  private _blockA: Block | undefined
  private _blockB: Block | undefined

  constructor(props: IConnectProps) {
    super(props)

    this.state = {
      connectPointA: {ref: PositionRef.none, x: 0, y: 0},
      connectPointB: {ref: PositionRef.none, x: 0, y: 0}
    }
  }

  public componentDidMount() {
    this._blockA = this.props.g.lookup(this.props.blockA)
    if (this._blockA) {
      this._blockA.addChangeEvent('blockA', this.onChangeEvent)
    }
    this._blockB = this.props.g.lookup(this.props.blockB)
    if (this._blockB) {
      this._blockB.addChangeEvent('blockB', this.onChangeEvent)
    }

    this.onChangeEvent()
  }

  public componentWillUnmount() {
    if (this._blockA) {
      this._blockA.removeChangeEvent('blockA')
      this._blockA.sibling = this.props.blockB
    }
    if (this._blockB) {
      this._blockB.removeChangeEvent('blockB')
      this._blockB.sibling = this.props.blockA
    } 
  }

  public onChangeEvent = () => {
    if (this._blockA && this._blockB) {
      const rA = this._blockA.rect
      const rB = this._blockB.rect

      this._blockA.sibling = this.props.blockB
      this._blockB.sibling = this.props.blockA

      let originA = this.props.originA
      if (!originA) {
        originA = {x: .5, y: .5}
      }

      let originB = this.props.originB
      if (!originB) {
        originB = {x: .5, y: .5}
      }
      
      const pA = connectPoint(rA, originA)
      const pB = connectPoint(rB, originB)

      const connectPointA = lineRectIntersection({start: pA, end: pB}, rA)
      const connectPointB = lineRectIntersection({start: pA, end: pB}, rB)
      if (connectPointA && connectPointB) {
        this.setState({
          connectPointA,
          connectPointB
        })
      }
    }
  }

  public shouldComponentUpdate(nextProps: IConnectProps, nextState: IConnectState) {
    if (!this._blockA || !this._blockB) {
      return true
    }

    if (this.state.connectPointA.ref === 0 || this.state.connectPointB.ref === 0) {
      return true
    }
    return (
      Math.abs(this.state.connectPointA.x - nextState.connectPointA.x) > Number.EPSILON || 
      Math.abs(this.state.connectPointA.y - nextState.connectPointA.y) > Number.EPSILON ||
      Math.abs(this.state.connectPointB.y - nextState.connectPointB.y) > Number.EPSILON ||
      Math.abs(this.state.connectPointB.x - nextState.connectPointB.x) > Number.EPSILON 
    )
  }

  public render() {
    if (!this._blockA || !this._blockB) {
      return (
        <span>
          {`Connect cannot find ${!this._blockA ? this.props.blockA : ''} ${!this._blockB ? this.props.blockB : ''}`}
        </span>
      )
    }

    const containersize = this.props.g.containersize()

    const pA = this.state.connectPointA;
    const pB = this.state.connectPointB;

    const style = {
      pointerEvents: 'none' as 'none',
      position: 'absolute' as 'absolute'
    }

    return (
      <svg 
        style={style}
        width={containersize.width}
        height={containersize.height}
      >
        <path d={`M ${pA.x} ${pA.y} L ${pB.x} ${pB.y}`} stroke="black" strokeWidth="1" fill="none"/>
      </svg>
    )
  }

  
}

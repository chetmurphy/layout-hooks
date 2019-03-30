import * as React from 'react'

const PropTypes = require('prop-types')

import { IDataLayout } from './components/blockTypes'
import { IGenerator } from './generators/Generator'
import { Block } from './components/Block'

export interface IDraggableProps extends React.HTMLProps<HTMLDivElement> {
  name: string
  g: IGenerator
}

export class Draggable extends React.Component<IDraggableProps> {
  private _block: Block

  static propTypes = {
    name: PropTypes.string.isRequired,
    g: PropTypes.object.isRequired
  }

  constructor(props: IDraggableProps) {
    super(props)
  }

  componentDidMount() {
    const p: IDataLayout = {
      location: { left: 0, top: 0, width: 0, height: 0 }
    }
    this._block = this.props.g
      .blocks()
      .set(`${this.props.name}`, p, this.props.g)
    this._block.setData('dragImage', this.dragImage)
  }

  render() {
    const children = this.cloneChildren()
    return <div style={this.props.style}>{children}</div>
  }

  public dragImage = (ids: string[]) => {
    return this.cloneChildren()
  }

  private cloneChildren() {
    return React.Children.map(this.props.children, child => {
      if (
        this.props.style &&
        this.props.style.width &&
        this.props.style.height
      ) {
        return React.cloneElement(
          child as React.ReactElement<any>,
          {
            width: this.props.style!.width,
            height: this.props.style!.height
          },
          null
        )
      } else {
        return React.cloneElement(
          child as React.ReactElement<any>,
          {},
          null
        )
      }
    })
  }
}


import * as React from 'react'

import { IGenerator, IPoint, ISize } from '../importRLG'
import { cardPath, Face, gCards } from './Card'
import Stack, { isRedSuite } from './Stack'
import Stock from './Stock'

export default class TableauStack {
  private _stack: Stack
  private _name: string
  private _g: IGenerator

  constructor(name: string, update: () => void, g: IGenerator) {
    this._stack = new Stack(true, true, update, g)
    this._name = name
    this.canDrop = this.canDrop.bind(this)
    this.drop = this.drop.bind(this)
    this.endDrop = this.endDrop.bind(this)
    this._g = g
  }

  public clear() {
    this._stack.clear()
  }

  public get name() {
    return this._name
  }


  public populate(stock: Stock, index: number) {
    this._stack.clear()
    for (let i = 0; i <= index; i++) {
      const card = stock.pop()
      if (card) {
        this._stack.push(card)
      }
    }

    const top = this._stack.last
    if (top) {
      top.face = Face.up
    }
  }

  public cards() {
    return this._stack.cards()
  }

  public dragData = (id: string) => {
    return this._stack.dragData(id)
  }

  public dragImage = (ids: string[]) => {

    const cardSize = this._g.params().get('cardSize') as ISize
    const computedCardSpacing = this._g.params().get('computedCardSpacing') as IPoint;

    const jsx = ids.map((id, i) => {

      const style: React.CSSProperties = {
        position: "absolute",
        userSelect: 'none',
        WebkitUserSelect: 'none',
        msUserSelect: 'none',
        MozUserSelect: 'none',
        width: cardSize.width,
        height: cardSize.height,   
        transform: `translate(0px, ${ i * computedCardSpacing.y}px)`,
        // pointerEvents: 'none'
      }

      return (
        <img
          id={id}
          key={id}
          // onDragStart={this._stack.noop} // Kill built in image
          src={cardPath(id)}
          style={style}
        />
      )
    })

    // Create position context
    return <div style={{position: "absolute"}}>{jsx}</div>
  }

  public canDrop(data: string[]) {
    let result = false
    const first = gCards.get(data[0])
    if (first) {
      if (this._stack.length === 0) {
        result = first.rank === 13
      } else {
        const last = this._stack.last
        if (last) {
          result =
            last.rank - first.rank === 1 &&
            isRedSuite(last.suite) !== isRedSuite(first.suite)
        }
      }
    }

    return result
  }

  public drop(data: string[]) {
    data.forEach(name => {
      const card = gCards.get(name)
      if (card) {
        this._stack.push(card)
      }
    })
    return true
  }

  public endDrop(data: string[]) {
    data.forEach(name => {
      this._stack.pop()
    })
    // Turn up top card
    const last = this._stack.last
    if (last && last.face === Face.down) {
      last.face = Face.up
    }
    return true
  }
}

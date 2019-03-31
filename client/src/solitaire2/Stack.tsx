import * as React from 'react'

import { Draggable, IGenerator } from '../importRLG'
import Card, { Face } from './Card'

export default class Stack {
  private _stack: Card[] = []
  private _g: IGenerator

  constructor(
    drag: boolean,
    drop: boolean,
    update: () => void,
    g: IGenerator,
  ) {
    this._g = g
  }

  public clear() {
    this._stack = []
  }

  public pop = () => {
    return this._stack.pop()
  }

  public shift() {
    return this._stack.shift()
  }

  public push(card: Card) {
    return this._stack.push(card)
  }

  public unshift(card: Card) {
    this._stack.unshift(card)
  }

  public get first() {
    const length = this._stack.length
    if (length) {
      return this._stack[0]
    }
    return undefined
  }

  public get last() {
    const length = this._stack.length
    if (length) {
      return this._stack[length - 1]
    }
    return undefined
  }

  public get length() {
    return this._stack.length
  }

  public dragData(id: string) {
    let found = false
    const ids: string[] = []
    let i = 0
    for (; i < this._stack.length; i++) {
      if (!found) {
        found = this._stack[i].name === id 
      } 

      if (found) {
        ids.push(this._stack[i].name)
      }
      
    }
    return ids
  }


  
  public cards () {
    const style: React.CSSProperties = {
      userSelect: 'none',
      WebkitUserSelect: 'none',
      msUserSelect: 'none',
      MozUserSelect: 'none',
      // pointerEvents: 'none'
    }
  
    if (this._stack.length) {
      return this._stack.map((card, i) => {
        if (card.face === Face.up) {
          return (
            <Draggable
              id={card.name}
              key={card.name}
              name={card.name}
              g={this._g}
            >
              <img
                id={card.name}
                key={card.name}
                onDragStart={this.noop} // Kill built in image
                src={card.path}
                style={style}
              />
            </Draggable>
          )
        } else {
          return (
            <img
              id={card.name}
              key={`Face.down ${card.name}`}
              src={card.path}
              style={style}
            />
          )
        }
      })
    }

    // This is an empty stack
    return (
      <div
        key="empty"
        style={{
          borderWidth: 2,
          borderColor: 'black',
          borderRadius: 3,
          backgroundColor: '#FBF8EF'
        }}
      />
    )
  }

  public noop = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
  }
}

export function isRedSuite(suite: string) {
  return suite === 'H' || suite === 'D'
}

// export function allowTableauDrop(card1: Card, card2: Card | undefined) {
//   if (card2 === undefined) {
//     return true
//   }

//   return (
//     card1.rank - card2.rank === -1 &&
//     isRedSuite(card1.suite) !== isRedSuite(card2.suite)
//   )
// }

// export function allowFoundationDrop(card1: Card, card2: Card | undefined) {
//   if (card2 === undefined) {
//     return card1.rank === 1 ? true : false
//   }

//   return card1.rank - card2.rank === 1 && card1.suite === card2.suite
// }

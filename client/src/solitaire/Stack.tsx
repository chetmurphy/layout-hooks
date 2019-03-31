import * as React from 'react';

import Card, { Face } from './Card';

export type IAllowDrop = (cards: Card, topCard: Card | undefined) => boolean | undefined;

/**
 * Chrome does not handle the dataTransfer correctly for the onDragOver. Ugg...
 * The workaround is to use a global data to capture the data being transferred. 
 */

let gDataTransfer: Card[] = [];

export default class Stack {
  private _stack: Card[] = [];
  private _update: () => void;
  private _drag: boolean;
  private _drop: boolean;
  private _allowDrop: IAllowDrop | undefined;
  private _allowDragAndDrop: boolean = true;


  constructor(drag: boolean, drop: boolean, update: () => void, allowDrop?: IAllowDrop) {
    this._drag = drag;
    this._drop = drop;
    this._update = update;
    this._allowDrop = allowDrop;
  }

  public allowDragAndDrop = (enable: boolean) => {
    this._allowDragAndDrop = enable;
  }

  public clear = () => {
    this._stack = [];
  }

  public pop = () => {
    return this._stack.pop();
  }

  public shift = () => {
    return this._stack.shift();
  }

  public push = (card: Card) => {
    return this._stack.push(card);
  }

  public unshift = (card: Card) => {
    this._stack.unshift(card);
  }

  public top = () => {
    const length = this._stack.length;
    if (length) {
      return this._stack[length - 1]
    }
    return undefined;
  }

  public get length() {
    return this._stack.length;
  }

  public cards = () => {
    if (this._stack.length) {
      return this._stack.map((card, i) => {
        if (this._drag && this._drop) {
          return (
            <img
              id={card.name}
              key={card.name}
              draggable={true}
              onDragEnd={this.onDragEnd}
              onDragOver={this.onDragOver}
              onDragStart={this.onDragStart}
              onDrop={this.onDrop}
              src={card.path}
            />
          );
        } else if (this._drag && !this._drop) {
          return (
            <img
              id={card.name}
              key={card.name}
              draggable={true}
              onDragStart={this.onDragStart}
              src={card.path}
            />
          );
        } else if (!this._drag && this._drop) {
          return (
            <img
              id={card.name}
              key={card.name}
              onDragOver={this.onDragOver}
              onDragEnd={this.onDragEnd}
              onDrop={this.onDrop}
              src={card.path}
            />
          );
        } else {
          return (
            <img
              id={card.name}
              key={card.name}
              src={card.path}
            />
          );
        }
      });
    }

    return (<div
      key='empty'
      style={{ borderWidth: 2, borderColor: 'black', borderRadius: 3, backgroundColor: '#FBF8EF' }}
      onDragOver={this.onDragOver}
      onDrop={this.onDrop}
    />)
  }

  public onDrop = (e: React.DragEvent) => {
    const cards = gDataTransfer;
    if (cards) {
      cards.map((card) => {
        this._stack.push(card);
      });
    }
  }

  public pauseEvent(e: React.DragEvent) {
    e.stopPropagation();
    e.preventDefault();
    return false;
  }

  public onDragStart = (e: React.DragEvent) => {
    if (!this._allowDragAndDrop) {
      this.pauseEvent(e);
    }

    if (this._drag) {
      // tslint:disable-next-line:no-string-literal
      const id = e.target['id'];
      gDataTransfer = this.getCardsToDrag(id);

      if (gDataTransfer.length) {
        // tslint:disable-next-line:no-string-literal
        e.dataTransfer.setData('text/plain', id);
      }
    }
  }

  public onDragOver = (e: React.DragEvent) => {
    if (!this._allowDragAndDrop) {
      this.pauseEvent(e);
    }

    const t = gDataTransfer[0];
    if (this._drop) {
      if (this._stack.length === 0 && this._allowDrop && this._allowDrop(t, undefined)) {
        e.preventDefault();
      } else {
        if (gDataTransfer) {
          const top = this._stack[this._stack.length - 1];
          if (this._allowDrop && this._allowDrop(t, top)) {
            e.preventDefault();
          }
        }
      }
    }
  }

  public onDragEnd = (e: React.DragEvent) => {
    if (!this._allowDragAndDrop) {
      this.pauseEvent(e);
    }

    if (e.dataTransfer.dropEffect === 'move') {
      // Remove
      gDataTransfer.forEach((card) => {
        if (this._stack.length) {
          this._stack.pop();
        }
      });

      const top = this.top();
      if (top && top.face === Face.down) {
        top.flip();
      }

      // Update 
      this._update();
    }
  }

  private getCardsToDrag(id: string) {
    const cards: Card[] = [];
    let found = false;
    this._stack.forEach((card) => {
      if (!found && card.name === id && card.face === Face.up) {
        found = true;
      }
      if (found) {
        cards.push(card);
      }
    });
    return cards;
  }
}

export function isRedSuite(suite: string) {
  return suite === 'H' || suite === 'D';
}

export function allowTableauDrop(card1: Card, card2: Card | undefined) {
  if (card2 === undefined) {
    return true;
  }

  return (card1.rank - card2.rank === -1) && isRedSuite(card1.suite) !== isRedSuite(card2.suite);
}

export function allowFoundationDrop(card1: Card, card2: Card | undefined) {
  if (card2 === undefined) {
    return card1.rank === 1 ? true : false;
  }

  return (card1.rank - card2.rank === 1) && (card1.suite === card2.suite);
}
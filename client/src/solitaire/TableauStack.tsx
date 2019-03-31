import Stack, { allowTableauDrop } from './Stack'
import Stock from './Stock';

export default class TableauStack {
  private _stack: Stack;

  constructor(update: () => void) {
    this._stack = new Stack(true, true, update, allowTableauDrop)
  }

  public clear = () => {
    this._stack.clear();
  }

  public populate(stock: Stock, index: number) {
    this._stack.clear();
    for (let i = 0; i <= index; i++) {
      const card = stock.pop();
      if (card) {
        this._stack.push(card);
      }
    }

    const top = this._stack.top();
    if (top) {
      top.flip();
    }
  }

  public cards = () => {
    return this._stack.cards()
  }
}
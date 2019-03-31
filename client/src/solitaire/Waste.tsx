import Stack from './Stack';
import Stock from './Stock';

export default class Waste {

  private _waste: Stack;
  private _update: () => void;

  constructor(update: ()=>void) {
    this._waste = new Stack(true, true, update);
    this._update = update;
  }

  public populate = (stock: Stock) => {
    let oldCard = this._waste.shift();
    while(oldCard) {
      oldCard.flip();
      stock.unshift(oldCard);
      oldCard = this._waste.shift();
    }

    // this._waste.clear();

    let card = stock.pop();
    if (card) {
      card.flip();
      this._waste.push(card)
    }
    card = stock.pop()
    if (card) {
      card.flip();
      this._waste.push(card)
    }
    card = stock.pop()
    if (card) {
      card.flip();
      this._waste.push(card)
    }

    this._update();
  }

  public clear = () => {
    this._waste.clear();
  }

  public cards = () => {
    return this._waste.cards();
  }
}
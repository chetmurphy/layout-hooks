import { IGenerator } from '../importRLG';
import { Face } from '../solitaire/Card';
import Stack from './Stack';
import Stock from './Stock';

export default class Waste {

  private _waste: Stack;
  private _update: () => void;

  constructor(update: ()=>void, g: IGenerator) {
    this._waste = new Stack(true, true, update, g);
    this._update = update;
  }

  public populate = (stock: Stock) => {
    let oldCard = this._waste.shift();
    while(oldCard) {
      oldCard.face = Face.down;
      stock.unshift(oldCard);
      oldCard = this._waste.shift();
    }

    // this._waste.clear();

    let card = stock.pop();
    if (card) {
      card.face = Face.up;
      this._waste.push(card)
    }
    card = stock.pop()
    if (card) {
      card.face = Face.up;
      this._waste.push(card)
    }
    card = stock.pop()
    if (card) {
      card.face = Face.up;
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

  public dragData = (id: string): string[] | undefined => {
    const last = this._waste ? this._waste.last : undefined
    // Return undefined to cancel if the selected card is not the last one
    if (last && last.name === id) {
      return [id]
    }
    return undefined
  }

  public canDrop = (data: string[]) => {
    return false
  }

  public drop = (data: string[]) => {
    return false
  }

  public endDrop = (data: string[]) => {
    // Remove last card
    this._waste.pop()
  }
}

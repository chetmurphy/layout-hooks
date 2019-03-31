import Deck from '../algos/Deck';
import { IGenerator } from '../importRLG';
import Card, { Face, gCards } from './Card'
import Stack from './Stack';

export default class Stock {
  private _deck: Deck = new Deck();
  private _stack: Stack;

  constructor(update: () => void, g: IGenerator) {
    this._stack = new Stack(false, false, update, g);
    this._deck.reset();
    this._deck.shuffle();
  }

  public shuffle = () => {
    this._deck.reset();
    this._deck.shuffle();

    this._stack.clear();
    gCards.clear()
    this._deck.cards.map((cardName) => {
      const card = new Card(cardName, Face.down)
      this._stack.push(card);
      gCards.set(cardName, card)
    });
  }

  public pop = () => {
    return this._stack.pop();
  }

  public unshift = (card: Card) => {
    return this._stack.unshift(card);
  }

  public cards = () => {
    return this._stack.cards();
  }

  public get length () {
    return this._stack.length;
  }
}
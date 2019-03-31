export default class Deck {

  private _cards: string[] = [];

  constructor() {
    this.reset();
    this.shuffle();
  }

  public get cards(){
    return this._cards;
  }

  public reset() {
    this._cards = [];

    const suits = ['H', 'S', 'C', 'D'];
    const values = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'];

    for (const suit in suits) {
      if (suit) {
        for (const value in values) {
          if (value) {
            this._cards.push(`${values[value]}_${suits[suit]}`);
          }
        }
      }
    }
  }

  public shuffle = () => {
    const cards = this._cards;
    let i;
    let m = cards.length;

    while (m) {
      i = Math.floor(Math.random() * m--);

      [cards[m], cards[i]] = [cards[i], cards[m]];
    }

    return this;
  }
}

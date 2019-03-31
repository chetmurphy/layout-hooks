export enum Face {
  up = 1,
  down
}

export default class Card {
  private _name: string;
  private _face: Face;
  private _rank: number;
  private _suite: string;

  constructor(name: string, face: Face) {
    this._name = name;
    this._face = face;

    const first = this._name.split('_');
    let rank = Number(first[0]);
    if (isNaN(rank)) {
      if (first[0] === 'J') {
        rank = 11;
      }
      if (first[0] === 'Q') {
        rank = 12;
      }
      if (first[0] === 'K') {
        rank = 13;
      }
      if (first[0] === 'A') {
        rank = 1;
      }
    }

    this._rank = rank;
    this._suite = first[1];
  }

  public get name() {
    return this._name;
  }

  public get face() {
    return this._face;
  }

  public get rank() {
    return this._rank;
  }

  public get suite() {
    return this._suite;
  }

  public flip = () => {
    this._face = this._face === Face.up ? Face.down : Face.up;
  }

  public get path() {
    if (this._face === Face.up) {
      return require(`../assets/cards/${this._name}.jpg`)
    }
    return require(`../assets/cards/back.jpg`)
  }
}
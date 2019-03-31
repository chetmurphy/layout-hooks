export enum Face {
  up = 1,
  down
}

export const gCards: Map<string, Card> = new Map

export function cardPath(id: string) {
  return require(`../assets/cards/${id}.jpg`)
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

  public set face(face: Face) {
    this._face = face;
  }

  public get rank() {
    return this._rank;
  }

  public get suite() {
    return this._suite;
  }

  public get path() {
    if (this._face === Face.up) {
      return cardPath(this._name)
    }
    return require(`../assets/cards/back.jpg`)
  }


}
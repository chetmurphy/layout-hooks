
export interface INode {
  name: string;
  parent: string;
  children: string[];
  info: string;
}

export default class TreeMap {

  private _map: Map<string,INode> = new Map();

  constructor(values: Array<[string, INode]>) {
    this._map = new Map(values);
  }

  public lookup(name: string) {
    return this._map.get(name)
  }

  public root () {
    //
  }
}
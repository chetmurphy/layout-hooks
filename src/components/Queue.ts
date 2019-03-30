import { Block } from './Block'

export class Queue<T extends React.MutableRefObject<Block>> {
  private _data: T[] = []
  private _name: string

  constructor(name: string) {
    this._name = name
  }

  public enqueue(block: T) {
    this._data.unshift(block)
  }

  public dequeue(): T | undefined {
    const block = this._data.pop()
    return block
  }

  get first(): T | undefined {
    return this._data[0]
  }

  get last(): T | undefined {
    return this._data[this._data.length - 1]
  }

  get size(): number {
    return this._data.length
  }

  get name(): string {
    return this._name
  }
}

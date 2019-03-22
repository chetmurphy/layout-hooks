export class Stack<T> {
  private _data: T[] = []

  public enqueue(block: T) {
    this._data.push(block)
  }

  public dequeue(): T | undefined {
    return this._data.pop()
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
}

import { IGenerator } from '../generators/Generator'

/**
 * The Hook type is a function with signature (g: IGenerator) => void.
 */
export type fnHook = (g: IGenerator) => void

/**
 * The Hook class manages the collection of hooks for a generator. Each hook is called just before each render.
 * It could be used animate a collection of blocks, to visually connect blocks, or to layer notes on a page. Its
 * major benefit is to separate its behavior from other logic or components. It is also easy to turn on or off.
 *
 * Hooks are a function with the signature of `(g: IGenerator) => void`. We recommend that hooks be written as
 * an closure:
 *
 * ``ts
 *  function initHook (...): fnHook {
 *
 *    let velocity = {x: .2, y: .1}
 *
 *    return function hook (g: IGenerator) {
 *      ...
 *      const delta = {x: block.x * velocity.x, y: block.y * velocity.y}
 *      ...
 *    }
 *  }
 * ```
 */
export class Hooks {
  private _hooks: Map<string, fnHook> = new Map()

  public set(name: string, hook: fnHook) {
    this._hooks.set(name, hook)
  }

  public get(name: string) {
    return this._hooks.get(name)
  }

  public remove(name: string) {
    return this._hooks.delete(name)
  }

  public run(g: IGenerator) {
    this._hooks.forEach(hook => {
      hook(g)
    })
  }
}

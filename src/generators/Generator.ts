import { Block } from '../components/Block'
import { IDataLayout } from '../components/blockTypes'
import { Blocks } from '../components/Blocks'
import { Params } from '../components/Params'
import { EditHelper } from '../editors/EditHelper'
import { Select } from '../editors/Select'
import { Stacking } from '../components/Stacking'
import { Hooks } from '../components/Hooks'
import { ISize, IPoint } from '../types'

export interface IGeneratorFunctionArgs {
  name: string
  exParams?: Params
  editHelper?: EditHelper
}

/**
 *
 */
export type IInit = (g: IGenerator) => Blocks

export type IHook = (g: IGenerator) => void

export type Callback = (containersize: ISize) => void

export interface ICreate {
  name: string
  g: IGenerator
  dataLayout: IDataLayout
  index?: number
  count?: number
}

export type Create = (args: ICreate) => Block | undefined

/**
 * This is the interface for a low level generator. By conforming to it the
 * a custom Generator could replace the builtin Generator.
 */
export interface IGenerator {
  /**
   * Name of the generator.
   */
  name: () => string
  /**
   * Returns the [params](classes/params.html) that used with this Generator.
   */
  params: () => Params
  /**
   * Returns the [Blocks](classes/blocks.html) manager for this Generator.
   */
  blocks: () => Blocks
  /**
   * This component provides methods to manipulate the [stacking](classes/stacking.html)
   * order within a layer.
   */
  stacking: () => Stacking
  /**
   * Reset invokes the [init function](globase.html#init) in a Generator. It is called at the
   * beginning of each render. It will also call any defined [hook functions](classes/generator.html#hooks)
   * at the same time.
   */
  reset: () => void
  /**
   * Returns the named Block or undefined.
   */
  lookup: (name: string) => Block | undefined
  /**
   * This will remove all Blocks forcing the blocks to be recreated on the next
   * render.
   */
  clear: () => void
  /**
   * This will return the [Hooks](classes/hooks.html) for this generator. A Hook is a function that
   * is called is called at the beginning of each render. One use a Hook
   * to perform animation. See [pathHook](globals.html#pathHook) as a an example.
   */
  hooks: () => Hooks
  /**
   * This is function that is called in a generator to create a new Block. It is an optional
   * function, but necessary if blocks are to be created dynamically in a render.
   */
  create?: Create
  /**
   * [EditHelper](../classes/edithelper.html) is used to sync builtin edit commands with a custom Editor.
   */
  editor?: () => EditHelper | undefined
  /**
   * Tests if the containersize, viewport, and leftTop has changed. Returns false if
   * the value has not changed since the last call to containerChanged.
   * Otherwise it returns true.
   */
  containerChanged: () => boolean
  /**
   * The size of the container for this generator.
   */
  containersize: (size?: ISize) => ISize
  /**
   * The viewport for this generator.
   */
  viewport: (size?: ISize) => ISize
  /**
   * The leftTop position for this generator in the viewport.
   */
  leftTop: (point?: IPoint) => IPoint
  /**
   * Container change callbacks.
   */
  addContainerChangeListener: (callback: Callback) => void
  /**
   * deltaTime duration since last animation frame.
   */
  deltaTime: (time?: number) => number
  /**
   * animate flag. If non zero then animation is active.
   */
  animate: (v?: number) => number
}

export class Generator implements IGenerator {
  private _name: string
  private _editHelper: EditHelper | undefined
  private _params: Params
  private _blocks: Blocks
  private _stacking: Stacking
  private _select: Select
  private _init: IInit
  private _hooks: Hooks
  private _create: Create | undefined
  private _containerChangeCount: number = 0
  private _containersize: ISize
  private _viewport: ISize
  private _leftTop: IPoint
  private _containersizeCallback: Callback[] = []
  private _deltaTime: number = 0
  private _animate: number = 0

  constructor(
    name: string,
    init: IInit,
    params: Params,
    create?: Create,
    editHelper?: EditHelper
  ) {
    this._name = name
    this._init = init
    this._editHelper = editHelper
    this._create = create
    this._blocks = new Blocks([])
    this._params = params
    this._containersize = { width: 0, height: 0 }
    this._viewport = { width: 0, height: 0 }
    this._leftTop = { x: 0, y: 0 }
    this._stacking = new Stacking({ name, params, blocks: this._blocks })
    this._hooks = new Hooks()
  }

  public name = () => {
    return this._name
  }

  public editHelper = () => {
    return this._editHelper
  }

  public params = (): Params => {
    return this._params
  }

  public blocks = (): Blocks => {
    return this._blocks
  }

  public stacking = (): Stacking => {
    return this._stacking
  }

  public select = (): Select => {
    return this._select
  }

  public lookup = (name: string): Block | undefined => {
    return this._blocks.get(name)
  }

  public hooks() {
    return this._hooks
  }

  public containerChanged(): boolean {
    const changed = this._containerChangeCount
    this._containerChangeCount = 0
    return changed !== 0
  }

  public containersize(size?: ISize) {
    if (
      size &&
      (this._containersize.width !== size.width ||
        this._containersize.height !== size.height)
    ) {
      this._containerChangeCount += 1
      this._containersize = size
      this._containersizeCallback.forEach(fn => {
        fn(this._containersize)
      })
    }
    return this._containersize
  }

  public viewport(size?: ISize) {
    if (
      size &&
      (this._viewport.width !== size.width ||
        this._viewport.height !== size.height)
    ) {
      this._containerChangeCount += 1
      this._viewport = size
    }
    return this._viewport
  }

  public leftTop(point?: IPoint) {
    if (point && (this._leftTop.x !== point.x || this._leftTop.y !== point.y)) {
      this._containerChangeCount += 1
      this._leftTop = point
    }
    return this._leftTop
  }

  public deltaTime(time?: number) {
    if (time) {
      this._deltaTime = time
    }
    return this._deltaTime
  }

  public animate(v?: number) {
    if (v) {
      this._animate = v
    }
    return this._animate
  }

  public create = (args: ICreate): Block | undefined => {
    if (this._create) {
      return this._create(args)
    }
    return undefined
  }

  public reset = () => {
    this._blocks = this._init(this)
    this._hooks.run(this)
  }

  public clear = () => {
    this._blocks.map.clear()
  }

  public addContainerChangeListener(fn: Callback) {
    this._containersizeCallback.push(fn)
  }
}

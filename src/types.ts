import { IGenerator } from 'generators/Generator'
import { ParamValue } from 'components/Params'

export interface IGenericProps {
  [key: string]: any
}

/**
 * Props for Layout.
 *
 * Note that you can add a separate style property that will be merged
 * internally for the root element.
 * @noInheritDoc
 */
export interface ILayoutProps extends React.HTMLProps<HTMLElement> {
  /**
   * Unique name is required.
   */
  name: string
  /**
   * The default is ServiceOptions.none.
   */
  service?: ServiceOptions
  /**
   * The default is EditorOptions.none.
   */
  editorOptions?: EditorOptions
  /**
   * The generator is required and should be unique for each Layout. Reusing
   * generators is possible but not recommended.
   *
   * Generally you will want to use a generator function to define its value,
   * but you can also define init and create methods in a class and then use
   * those to create an instance of the generator.
   *
   * ```ts
   * class MyClass
   *
   *   constructor() {
   *     ...
   *     this._g = new Generator(
   *        'name',
   *        this.init.bind(this),
   *        this._params,
   *        this.create.bind(this)
   *      );
   *   }
   *
   *   private init = (g: IGenerator): Blocks => {
   *     ...
   *   }
   *
   *   private create = (args: ICreate): Block | undefined => {
   *     ...
   *   }
   * }
   * ```
   */
  g: IGenerator
  /**
   * Defines the size of the container for this Layout. The default size of the
   * Layout is computed internally, but if this property is set then it will be
   * used for the size of the Layout.
   *
   * One use of this property is to specify the container size for nested Layouts.
   * It is also useful for tests.
   *
   * ```ts
   *  <Layout
   *    ... >
   *    <Panel
   *      ... >
   *      {(args: IMetaDataArgs) => (
   *        <Layout
   *          ...
   *          containersize={{width: args.container.width, height: args.container.height}}
   *        >
   * ```
   *
   * Note: The computation of the container size internally requires one render
   * of the Layout where the containersize will be {width: 0, height: 0} so setting
   * this property results in a slight performance gain.
   */
  containersize?: ISize
  /**
   * Sets initial params for this Layout.
   *
   * The values are an array of [string, ParamValue]. The following example
   * appends a new value to an existing array defined in params.json:
   *
   * ```ts
   *  import * as data from '../assets/data/params.json'
   *
   *  ...
   *
   *  <Layout
   *    ...
   *    params={[
   *      ...data['rlg.intro'] as Array<[string, ParamValue]>,
   *      ['velocity', 0.05]
   *    ]}
   *  >
   * ```
   */
  params?: Array<[string, ParamValue]>
  /**
   * This is the same as the css overflow settings.
   *
   * We do not recommend that you override this setting with
   * the style property since this setting is applied dynamically.
   */
  overflowX?: OverflowOptions
  /**
   * This is the same as the css overflow settings.
   *
   * We do not recommend that you override this setting with
   * the style property since this setting is applied dynamically.
   */
  overflowY?: OverflowOptions
  /**
   * Controls the animation behavior of the Layout.
   */
  animate?: IAnimateProps

  layers?: ILayerOptions

  onUpdate?: () => void
}

/**
 * Layers specification for controlling layers. The default is to
 * ignore layer values and render all children as specified. To access the specification
 * use the layers property attached to the [generator](classes/generator.html).
 */
export interface ILayerOptions {
  /**
   * This option lets you encapsulate each layer with its own
   * [stacking context](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context).
   *
   * If you are not using stacking other than layers (which just manages the order that elements are
   * rendered), then the results are similar. Do note that UI interactions can be changed when encapsulation
   * is on so be sure to test.
   *
   * Default is to not encapsulate each layer its own stacking context. This means that
   * z-index stacking context for direct children will be global within an Layout.
   */
  encapsulate?: boolean

  /**
   * A mapper lets you merge, reorder, and/or hide layers. It simply maps one layer to another.
   * If it returns undefined then nothing will be rendered for that layer. The default is render
   * all layers as specified.
   */
  mapper?: (layer: number) => number | undefined
}

/**
 * IAnimateProps configures an animation.
 */
export interface IAnimateProps {
  /**
   * Switch to stop start animation.
   */
  active: boolean
  /**
   * Log delta frame time to the console.
   */
  logFrameRate?: boolean
  /**
   * Desired frame rate. Normal is 60 fps.
   */
  fps?: number
}

/**
 * This defines the overflow property that are passed to css.
 * The options have the same meaning as the css overflow options.
 * These options only apply to Layout.
 *
 * This property specifies whether to clip content or to add
 * scrollbars when an element's content is too big to fit in a
 * specified area.
 *
 * The default is visible.
 */
export enum OverflowOptions {
  /**
   * The overflow is not clipped. It renders outside the element's box. This is default.
   */
  visible = 0,
  /**
   * The overflow is clipped, and the rest of the content will be invisible.
   */
  hidden,
  /**
   * The overflow is clipped, but a scroll-bar is added to see the rest of the content.
   */
  scroll,
  /**
   * If overflow is clipped, a scroll-bar should be added to see the rest of the content.
   */
  auto
}

/**
 * IOrigin specifies the position within an element that location
 * uses to position the element. What this says is that if you place
 * a block at (10,10) then it is the origin that is placed at (10,10).
 *
 * IOrigin is expressed in percent of the width and height of
 * an element. An origin of (0, 0) specifies the left top
 * position of the element. An origin of (.50,.50) specifies
 * the center of the element.
 *
 * Generally origins are between 0 and 1 for each axis, but values
 * outside of the 0 to 1 range are allowed. (This will also be useful
 * when other transformations are used other than just translation.
 *
 *  ```
 * origin: (x: 0, y: 0) - left top, the default
 *     o───────┐
 *     │       │
 *     └───────┘
 *
 * origin: {X: 1, y: 1} - right bottom
 *     ┌───────┐
 *     │       │
 *     └───────o
 *
 * origin: (x: 1, y: 0) - right top
 *     ┌───────o
 *     │       │
 *     └───────┘
 *
 *  origin: (x: .50, y: .50) - center center
 *     ┌───────┐
 *     │   o   │
 *     └───────┘
 *
 *  origin: (x: -.20, y: .50) - (-.20) center, outside of block
 *     ┌───────┐
 *  o  │       │
 *     └───────┘
 *
 *```
 */
export interface IOrigin {
  x: number
  y: number
}

/**
 * Defines the units of location and size passed to data-layout or
 * in [IDataLayout](interfaces/idatalayout.html). Most computation will be done in pixels.
 *
 * Percent uses the container size as its basis.
 *
 * Viewport uses the document's viewport as it's basis.
 *
 * Preserve is similar viewport except that it uses the
 * container size rather than the viewport as its basis.
 *
 * Both Viewport and Preserve units will keep a square as a square. Percent
 * will only render a square if its basis is also square.
 */
export enum Unit {
  /**
   * Pixels (px) are relative to the viewing device. For low-dpi
   * devices, 1px is one device pixel (dot) of the display. For
   * printers and high resolution screens 1px implies multiple
   * device pixels.
   */
  pixel = 1, // px
  /**
   * Percent uses 1/100 of each axis of the container as its basis. Units for
   * horizontal axis are generally not equal to units for vertical axis.
   */
  percent, // %
  /**
   * PreserveMin uses 1/100 of the shorter axis of the container as its basis.
   */
  pmin,
  /**
   * PreserveMin uses 1/100 of the longer axis of the container as its basis.
   */
  pmax,
  /**
   * PreserveWidth uses 1/100 of the horizontal axis of the container as its basis.
   */
  pw,
  /**
   * PreserveHeight uses 1/100 of the vertical axis of the container as its basis.
   */
  ph,
  /**
   * Vmin uses 1/100 of the shorter axis of the viewport as the base unit.
   */
  vmin,
  /**
   * Vmax uses 1/100 of the shorter axis of the viewport as its basis.
   */
  vmax,
  /*
   * Vw uses 1/100 of the horizontal axis of the viewport as its basis.
   */
  vw,
  /*
   * Vh uses 1/100 of the vertical axis of the viewport as its basis.
   */
  vh,
  /**
   * Unmanaged sets the Block to fit it's content. Unmanaged can only be
   * applied to the width and height of location and must be explicitly
   * specified in location.
   * ```ts
   *  location={{left: 50, width: '100u', height:='100%'}}
   * ```
   */
  unmanaged // u
}

/**
 * unitFactor returns the multiplication factor of 100 to convert to/from percent. Otherwise it returns 1.
 * @param unit
 */
export function unitFactor(unit: Unit | undefined) {
  if (!unit) {
    return 1
  }

  if (unit === Unit.pixel || unit === Unit.unmanaged) {
    return 1
  }

  return 100
}

/**
 * PositionRef defines the location of 'drag' handle on an element's location and size.
 * Drag handles provide a space where a user may point and hold to change its location.
 */
export enum PositionRef {
  /** There is no drag handle which means that an element cannot be edited.*/
  none = 0,
  /** The drag handle is the rect of the element. */
  position,
  /** The drag handle is the top of the rect. */
  top,
  /** The drag handle is the bottom of the rect. */
  bottom,
  /** The drag handle is the left of the rect. */
  left,
  /** The drag handle is the right of the rect. */
  right,
  /** The drag handle is the left top of the rect. */
  leftTop,
  /** The drag handle is the right top of the rect. */
  rightTop,
  /** The drag handle is the left bottom of the rect. */
  leftBottom,
  /** The drag handle is the right bottom of the rect. */
  rightBottom
}

/**
 * namedPositionRef returns a printable name for a ref.
 * @param ref
 */
export function namedPositionRef(ref: PositionRef) {
  let name = 'unknown'
  switch (ref) {
    case PositionRef.position: {
      name = 'position'
      break
    }
    case PositionRef.top: {
      name = 'top'
      break
    }
    case PositionRef.bottom: {
      name = 'bottom'
      break
    }
    case PositionRef.left: {
      name = 'left'
      break
    }
    case PositionRef.right: {
      name = 'right'
      break
    }
    case PositionRef.leftTop: {
      name = 'leftTop'
      break
    }
    case PositionRef.rightTop: {
      name = 'rightTop'
      break
    }
    case PositionRef.leftBottom: {
      name = 'leftBottom'
      break
    }
    case PositionRef.rightBottom: {
      name = 'rightBottom'
      break
    }
  }
  return name
}

/**
 * Defines debug levels.
 */
export enum DebugLevels {
  /**
   * Only general information will be written to the console.
   */
  // tslint:disable-next-line:no-bitwise
  info = 'DebugLevel:info',
  /**
   * Only a warnings will be written to the console.
   */
  // tslint:disable-next-line:no-bitwise
  warning = 'DebugLevel:warning',
  /**
   * Critical errors are alway written the console. This option adds non-critical errors.
   */
  // tslint:disable-next-line:no-bitwise
  error = 'DebugLevel:error',
  /**
   * Only instrumented trace information will be written to the console.
   */
  // tslint:disable-next-line:no-bitwise
  trace = 'DebugLevel:trace',
  /**
   * Only frame timing will be written to the console.
   */
  // tslint:disable-next-line:no-bitwise
  timing = 'DebugLevel:timing',
  /**
   * Params and Blocks values will be written to the console.
   */
  // tslint:disable-next-line:no-bitwise
  data = 'DebugLevel:data',
  /**
   * Selected mouse events will be written to the console.
   */
  // tslint:disable-next-line:no-bitwise
  mouseEvents = 'DebugLevel:mouseEvents'
}

/** Enables optional services */
export enum ServiceOptions {
  /**
   * No services will be enabled. This is the default.
   */
  none = 0,
  /**
   * Enable editor
   */
  edit,
  /**
   * Enable drag and drop
   */
  dnd
}

/** Enables optional services */
export enum EditorOptions {
  /**
   * No options. This is the default.
   */
  none = 0,
  /**
   * Pin restricts editing of position and size to the containersize.
   */
  pin = 1 << 0
}

/**
 * IRect specifies the data that defines a rect in terms of its location and size.
 */
export interface IRect {
  x: number
  y: number
  width: number
  height: number
}

/**
 * rectSize returns the size of a rect.
 * @param rect
 */
export function rectSize(rect: IRect): ISize {
  return { width: rect.width, height: rect.height }
}

/**
 * rectPoint returns the location of a rect.
 * @param rect
 */
export function rectPoint(rect: IRect): IPoint {
  return { x: rect.x, y: rect.y }
}

/**
 * IAttrRect defines a rect in terms of the left top and right bottom.
 */
export interface IAttrRect {
  left: number
  top: number
  right: number
  bottom: number
}

// export function translate(r: IRect, p: IPoint): IRect {
//   return {
//     y: r.y + p.y,
//     x: r.x + p.x,
//     width: r.width,
//     height: r.height
//   };
// }

// export function scale(r: IRect, p: IPoint): IRect {
//   return {
//     y: r.y * p.y,
//     x: r.x * p.x,
//     height: r.height * p.y,
//     width: r.width * p.x
//   };
// }

// export function width(r: IRect) {
//   return r.width;
// }

// export function height(r: IRect) {
//   return r.height;
// }

/**
 * Rect defines a class of an IRect.
 */
export class Rect implements IRect {
  public y: number = 0
  public x: number = 0
  public width: number = 0
  public height: number = 0

  // private _halfWidth: number = 0;
  // private _halfHeight: number = 0;

  constructor(rect: IRect) {
    this.update(rect)
  }

  public update(rect: IRect) {
    this.setLocation({ x: rect.x, y: rect.y })
    this.setSize({ width: rect.width, height: rect.height })
  }

  public setLocation(p: IPoint) {
    this.x = p.x
    this.y = p.y
  }

  get data() {
    const r: IRect = {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    }
    return r
  }

  set location(p: IPoint) {
    this.setLocation(p)
  }

  get location(): IPoint {
    return { x: this.x, y: this.y }
  }

  get size(): ISize {
    return { width: this.width, height: this.height }
  }

  set size(s: ISize) {
    this.setSize(s)
  }

  public setSize(s: ISize) {
    this.width = s.width
    this.height = s.height
    // this._halfWidth = s.width / 2;
    // this._halfHeight = s.height / 2;
  }

  get top() {
    return this.y
  }

  get left() {
    return this.x
  }

  get bottom() {
    return this.y + this.height
  }

  get right() {
    return this.x + this.width
  }

  // get halfWidth() {
  //   return this._halfWidth;
  // }

  // get halfHeight() {
  //   return this._halfHeight;
  // }

  get leftTop(): IPoint {
    return { x: this.x, y: this.y }
  }

  get rightTop(): IPoint {
    return { x: this.x + this.width, y: this.y }
  }

  get leftBottom(): IPoint {
    return { x: this.x, y: this.y + this.height }
  }

  get rightBottom(): IPoint {
    return { x: this.x + this.width, y: this.y + this.height }
  }

  public translate(point: IPoint): IRect {
    return {
      y: this.y + point.y,
      x: this.x + point.x,
      height: this.height,
      width: this.width
    }
  }

  public add(rect: IRect): IRect {
    return {
      y: this.y + rect.y,
      x: this.x + rect.x,
      height: this.height + rect.height,
      width: this.width + rect.width
    }
  }

  intersect(r: IRect): boolean {
    return !(
      r.x > this.right ||
      r.x + r.width < this.x ||
      r.y > this.bottom ||
      r.y + r.height < this.y
    )
  }
}

/**
 * ILine defines a line from point A to point B.
 */
export interface ILine {
  start: IPoint
  end: IPoint
}

/**
 * IPoint defines a point in its element's local reference.
 */
export interface IPoint {
  x: number
  y: number
}

/**
 * ISize defines the extent of a rectangle in {width, height}.
 */
export interface ISize {
  width: number
  height: number
}

export interface IArgsPoint {
  x: number | string
  y: number | string
}

export interface IArgsSize {
  width?: number | string
  height?: number | string
}

export function isSuperset<T>(set: Set<T>, subset: Set<T>) {
  let result = true
  subset.forEach(elem => {
    if (!set.has(elem)) {
      result = false
    }
  })
  return result
}

export function union<T>(setA: Set<T>, setB: Set<T>) {
  var _union = new Set(setA)
  setB.forEach(elem => {
    _union.add(elem)
  })
  return _union
}

export function intersection<T>(setA: Set<T>, setB: Set<T>) {
  var _intersection = new Set()
  setB.forEach(elem => {
    if (setA.has(elem)) {
      _intersection.add(elem)
    }
  })
  return _intersection
}

export function symmetricDifference<T>(setA: Set<T>, setB: Set<T>) {
  var _difference = new Set(setA)
  setB.forEach(elem => {
    if (_difference.has(elem)) {
      _difference.delete(elem)
    } else {
      _difference.add(elem)
    }
  })
  return _difference
}

export function difference<T>(setA: Set<T>, setB: Set<T>) {
  var _difference = new Set(setA)
  setB.forEach(elem => {
    _difference.delete(elem)
  })
  return _difference
}

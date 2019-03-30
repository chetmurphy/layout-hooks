import * as React from 'react'

import {
  DebugLevels,
  ServiceOptions,
  IPoint,
  IRect,
  ISize,
  namedPositionRef,
  PositionRef,
  Unit,
  OverflowOptions,
  rectSize,
  IAnimateProps,
  ILayerOptions,
  EditorOptions
} from '../../../src/types'

import { IGenerator } from '../../../src/generators/Generator'
import { ParamValue } from '../../../src/components/Params'
import { Block } from '../../../src/components/Block'
import { Select } from '../../../src/editors/Select'

const raf = require('raf')

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

export function useLayoutProps(props: ILayoutProps) {
  const currentProps = React.useRef(props)

  React.useEffect(() => {
    if (!props.g) {
      throw new Error(`Layout property 'g' is invalid in ${props.name}`)
    }

    const w = Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    )
    const h = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0
    )
    props.g.viewport({ width: w, height: h })

    if (props.containersize) {
      props.g.containersize(props.containersize)
    }

    if (props.params) {
      const params = props.g.params()
      props.params.forEach((value: [string, ParamValue]) => {
        params.set(value[0], value[1])
      })
    }

    if (props.animate && props.animate.active) {
      props.g.animate(1)
      this._fpsIntervalFrame =
        1000 / (props.animate.fps ? props.animate.fps : 60)
      this._lastAnimationFrame = performance.now()
      this._rafId = raf(this.animationLoop)
    }

    if (
      (props.animate && !props.animate.active) ||
      props.animate === undefined
    ) {
      this._g.animate(0)
      if (this._rafId) {
        raf.cancel(this._rafId)
        this._rafId = 0
      }
    }

    this._edit = props.service === ServiceOptions.edit
  })

  return currentProps
}

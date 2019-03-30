import { Block } from '../../components/Block'
import { IGenerator } from '../Generator'
import { ISize, PositionRef, IPoint } from '../../types'
import { fnHook } from '../../components/Hooks'
import { createExPoint, IExPoint } from '../../geometry/point'
import { createExLine } from '../../geometry/line'
import { createPiecewise } from '../../geometry/piecewise'

import { Queue } from '../../components/Queue'
import { IBlockRect } from '../../components/blockTypes'

// Parametric spline curves - http://www.doc.ic.ac.uk/~dfg/AndysSplineTutorial/Parametrics.html

export interface IPathHookPoints {
  min: number
  max: number
  points: IExPoint[]
}

/**
 * This is an optional hook that can be used to animate a list of blocks on
 * a path.
 *
 * It will render as a an animation moving blocks along the path. The default
 * will move the block by incrementing the block's left or top positions if
 * they exist. If they do not exist then the block's right or bottom position
 * will be updated.
 *
 *
 * The following is an example of a vertical path with blocks distributed
 * on it. Each block is `spacing` distance from the previous
 * and following block.
 * ```
 * Path {x: '50%', y: 0} to (x: '50%', y: '100%')
 * ┌─────────────────x─────────────────┐
 * │                 │                 │
 * │               ┌─│─┐               │
 * │               │ │ │               │
 * │               └─│─┘               │
 * │                 │                 │
 * │               ┌─│─┐               │
 * │               │ │ │               │
 * │               └─│─┘               │
 * │                 ↓                 │
 * └───────────────────────────────────┘
 * ```
 *
 * @params name -
 *  Name of the path. It can be used to specify unique keys in Params for
 *  saving state in [[Params]] by using prefix to make the key
 *  unique. e.g., `${name}someName`.
 * @params points -
 *  Array of points indexed by layout width to define a path. The lines
 *  that make up a path may be discontinuous.
 * @params input -
 *  Specifies the initial blocks entering the hook.
 * @params update -
 *  Queue of blocks entering this hook. This can be used to chain pathHook
 *  to another pathHook. To create an infinite path connect output to update
 *  using a Queue<Block>.
 * @params output -
 *  Queue of blocks leaving this hook. This lets
 *  you chain pathHook. To create an infinite path connect output to update
 *  using a Queue<Block>.
 * @params velocity -
 *  Velocity is the speed of the animation in pixels per frame (~ 60 fps).
 * @params spacing -
 *  Spacing the distance between blocks.
 * @params fill -
 *  Optional. If set to true then the input blocks will be used to fill the
 *  path before the animation is started.
 * @params xPositionRef -
 *  Optional. Can be set to PositionRef.left (the default), or PositionRef.right.
 *  Other values are ignored with the default being use.
 * @params yPositionRef -
 *  Optional. Can be set to PositionRef.top (the default), or PositionRef.bottom.
 *  Other values are ignored with the default being use.
 * @params sprite -
 *  Optional. The sprite is used for Collision detection. If one is detected then
 *  the optional collision callback will be called.
 * @params onSpriteCollide -
 *  Optional. Called when a collision is detected.
 * @params g
 *  The generator that this hook will run on.
 */
export interface IPathHook {
  prefix: string
  points: IPathHookPoints[]
  input: (() => React.MutableRefObject<Block>[]) | undefined
  update: Queue<React.MutableRefObject<Block>>
  output: Queue<React.MutableRefObject<Block>>
  velocity: number
  spacing: number
  fill?: boolean
  xPositionRef?: PositionRef
  yPositionRef?: PositionRef
  sprite?: () => React.MutableRefObject<Block> | undefined
  onSpriteCollide?: (block: React.MutableRefObject<Block>) => void
  g: IGenerator
}

export function pathHook(args: IPathHook): fnHook {
  args.g.params().set(`${args.prefix}init`, 0)

  const Piecewise = createPiecewise(args.g)
  type Piecewise = InstanceType<typeof Piecewise>

  const ExLine = createExLine(args.g)
  type ExLine = InstanceType<typeof ExLine>

  const ExPoint = createExPoint(args.g)
  //type ExPoint = InstanceType<typeof ExPoint>

  // Define path
  let piecewise: Piecewise

  // Called for each change in containersize
  function resize(containersize: ISize) {
    const lines: ExLine[] = []
    args.points.forEach(breakpoint => {
      if (
        containersize.width >= breakpoint.min &&
        containersize.width < breakpoint.max
      ) {
        for (let i = 1; i < breakpoint.points.length; i += 2) {
          const line = new ExLine(
            new ExPoint(breakpoint.points[i - 1]),
            new ExPoint(breakpoint.points[i])
          )
          lines.push(line)
        }
      }
    })
    piecewise = new Piecewise(lines)
  }

  resize(args.g.containersize())
  args.g.addContainerChangeListener(resize)

  let active: React.MutableRefObject<Block>[] = []

  // The hook - called at the beginning of each render
  return function hook(g: IGenerator) {
    const params = g.params()
    const deltaTime = g.deltaTime()
    const animate = g.animate()
    const containersize = g.containersize()
    const init = params.get(`${args.prefix}init`)

    // Do not proceed if preconditions not met
    if (containersize.width === 0 || containersize.height === 0) {
      return
    }

    // Do not proceed if preconditions not met
    if (args.input === undefined) {
      throw new Error(`PathHook input not defined`)
    }
    const input = args.input()
    if (input === undefined || input.length === 0) {
      return
    }

    // Phase 1 - Initilization with Optional fill
    // Input - queued list of blocks waiting to be active
    // if (args.fill) then preload all blocks that will fit
    // into the Active queue. Otherwise load blocks into Active
    // as there is room.

    if (!init) {
      let input = args.input ? args.input() : []

      // Place blocks
      if (args.fill && args.spacing) {
        const needed = Math.min(
          Math.floor(piecewise.length / args.spacing),
          input.length
        )
        let offset = needed * args.spacing
        for (let i = 0; i < needed; i++) {
          const block = input.shift()
          if (block) {
            const p = piecewise.point(offset)
            const r = block.current.rect
            if (p) {
              positionBlock(r, p, block, containersize)

              block.current.hidden = false
              block.current.setData('distance', offset)
              block.current.setData('hook', args.prefix)
              active.unshift(block)
            }
          }

          offset -= args.spacing
        }

        input.forEach(block => {
          block.current.hidden = true
        })
      }

      // Load remaining input into update
      input.forEach(block => {
        args.update.enqueue(block)
      })

      params.set(`${args.prefix}init`, 1)
    }

    // Phase 2 - Animation
    // Active - queued list of blocks that are active. These are the
    // blocks that are animated.
    // As blocks are moved along the piecewise path: 1) keep Active filled
    // using input/update and 2) place exiting blocks on output

    if (animate && piecewise && deltaTime) {
      // Process list
      // 1) animate each block
      // 2) remove block if completed piecewise and not repeat
      // 3) update list

      // Temporary list for updating active
      const updateActive: React.MutableRefObject<Block>[] = []

      const first = active[0]
      if (first) {
        // Keep path full
        const d = first.current.getData('distance', 0) as number

        if (d + deltaTime * args.velocity > args.spacing) {
          // Add update
          const b = args.update.dequeue()
          if (b) {
            activate(b)
          }
        }
      } else {
        const b = args.update.dequeue()
        if (b) {
          activate(b)
        }
      }

      let block = active.shift()
      while (block) {
        increment(block, deltaTime, updateActive)
        // Get next block
        block = active.shift()
      }
      active = updateActive
    }
  }

  function positionBlock(
    r: IBlockRect,
    p: IPoint,
    block: React.MutableRefObject<Block>,
    containersize: ISize
  ) {
    if (args.xPositionRef === undefined && r.left !== undefined) {
      r.left = p.x
    } else if (args.xPositionRef === undefined && r.right !== undefined) {
      r.right = containersize.width - p.x
    } else if (args.xPositionRef === PositionRef.left && r.left !== undefined) {
      r.left = p.x
    } else if (
      args.xPositionRef === PositionRef.right &&
      r.right !== undefined
    ) {
      r.right = containersize.width - p.x
    } else {
      throw new Error(
        `PathHook cannot update left or right for block '${
          block.current.name
        }' position`
      )
    }

    if (args.yPositionRef === undefined && r.top !== undefined) {
      r.top = p.y
    } else if (args.yPositionRef === undefined && r.bottom !== undefined) {
      r.bottom = containersize.height - p!.y
    } else if (args.yPositionRef === PositionRef.top && r.top !== undefined) {
      r.top = p.y
    } else if (
      args.yPositionRef === PositionRef.bottom &&
      r.bottom !== undefined
    ) {
      r.bottom = containersize.height - p.y
    } else {
      throw new Error(
        `PathHook cannot update top or bottom for block '${
          block.current.name
        }' position`
      )
    }

    if (args.sprite && args.sprite()) {
      if (collision(args.sprite()!, block)) {
        if (args.onSpriteCollide) {
          args.onSpriteCollide(block)
        }
      }
    }
  }

  function collision(
    sprite: React.MutableRefObject<Block>,
    block: React.MutableRefObject<Block>
  ) {
    const br = block.current.rect
    // console.log(`block ${br.x} ${br.y} ${br.width} ${br.height}`)
    var l1 = br.x
    var t1 = br.y
    var r1 = br.x + br.width
    var b1 = br.y + br.height

    const sr = sprite.current.rect
    // console.log(`sprite ${sr.x} ${sr.y} ${sr.width} ${sr.height}`)
    var l2 = sr.x
    var t2 = sr.y
    var r2 = sr.x + sr.width
    var b2 = sr.y + sr.height

    if (b1 < t2 || t1 > b2 || r1 < l2 || l1 > r2) {
      // console.log('test failed')
      return false
    }

    return true
  }

  function increment(
    block: React.MutableRefObject<Block>,
    deltaTime: number,
    updateActive: React.MutableRefObject<Block>[]
  ) {
    const r = block.current.rect //blockRect
    const d = block.current.getData('distance', 0) as number
    const dv = d + deltaTime * args.velocity
    block.current.setData('distance', dv)
    block.current.setData('hook', args.prefix)
    const p = piecewise.point(dv)
    if (p) {
      // Point exists on piecewise
      positionBlock(r, p, block, args.g.containersize())
      // Keep this block
      updateActive.push(block)
    } else {
      // Put on output - block finished
      const r = block.current.rect //blockRect
      positionBlock(r, { x: 0, y: 0 }, block, args.g.containersize())
      // block.touch()
      block.current.setData('distance', 0)
      block.current.hidden = true
      args.output.enqueue(block)
      // args.output.dump('output')
    }
  }

  function activate(b: React.MutableRefObject<Block>) {
    const r = b.current.rect //blockRect
    b.current.hidden = false
    b.current.setData('distance', 0)
    b.current.setData('hook', args.prefix)
    const p = piecewise.point(0)

    if (p) {
      // Point exists on piecewise
      positionBlock(r, p, b, args.g.containersize())
      // b.touch()
      active.unshift(b)
    }
  }
}

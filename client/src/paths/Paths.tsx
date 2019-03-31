import * as React from 'react'

import {
  Block,
  Blocks,
  Generator,
  ICreate,
  IEditHelperProps,
  IGenerator,
  IMetaDataArgs,
  Layout,
  OverflowOptions,
  Panel,
  Params,
  pathHook,
  Queue,
  ServiceOptions
} from '../importRLG'

import Grid from '../components/Grid';


// import { t1 } from './tree'
// import TreeMap from './TreeMap'

interface IChartState {
  node: string
}

export default class Chart extends React.Component<
  IEditHelperProps,
  IChartState
> {
  private _g: IGenerator
  private _params: Params = new Params({ name: 'chart' })
  private _flowAB: Queue<Block> = new Queue<Block>('--> flowAB')
  private _flowBA: Queue<Block> = new Queue<Block>('<-- flowBA')

  constructor(props: IEditHelperProps) {
    super(props)

    this._g = new Generator('chart', this.init.bind(this), this._params, this.create.bind(this))

    // this._treeMap = t1
    this.state = {
      node: 'a'
    }
  }

  public componentDidMount() {
    const hooks = this._g.hooks()
    const blocks = this._g.blocks()

    const single = false
    if (single) {
      hooks.set(
        'Paths #A',
        pathHook({
          prefix: 'Paths #A',
          points: [
            {
              min: 0, max: 480, points: [
                {x: '50%', y: 0}, {x: '50%',y: '100%'},
              ],
            },
            {
              min: 480, max: 720, points: [
                {x: '30%', y: 0}, {x: '30%',y: '100%'},
                {x: '60%', y: 0}, {x: '60%',y: '100%'},
              ],
            },
            {
              min: 720, max: 1024, points: [
                {x: '25%', y: 0}, {x: '25%',y: '100%'},
                {x: '50%', y: 0}, {x: '50%',y: '100%'},
                {x: '75%', y: 0}, {x: '75%',y: '100%'},
              ],
            },
            {
              min: 1024, max: 2560, points: [
                {x: '20%', y: 0}, {x: '20%',y: '100%'},
                {x: '40%', y: 0}, {x: '40%',y: '100%'},
                {x: '60%', y: 0}, {x: '60%',y: '100%'},
                {x: '80%', y: 0}, {x: '80%',y: '100%'},
              ],
            },

          ],
          input: () => blocks.layers(3),
          update: this._flowAB,
          output: this._flowAB,
          velocity: .05,
          spacing: 200,
          g: this._g
        })
      )
    } else {
      hooks.set(
        'Paths #A',
        pathHook({
          prefix: 'Paths #A',
          points: [
            {
              min: 480, max: 2500, points: [
                {x: '20%', y: 0}, {x: '20%', y: '100%'},
                {x: '40%', y: 0}, {x: '40%', y: '100%'},
                {x: '60%', y: 0}, {x: '60%', y: '100%'},
                {x: '80%', y: 0}, {x: '80%', y: '100%'},
              ],
            },
          ],
          input: () => blocks.layers(3),
          update: this._flowBA,
          output: this._flowBA,
          velocity: .05,
          spacing: 200,
          fill: true,
          g: this._g
        })
      )

      // hooks.set(
      //   'Paths #B',
      //   pathHook({
      //     prefix: 'Paths #B',
      //     points: [
      //       {
      //         min: 480, max: 2500, points: [
      //           {x: '60%', y: 0}, {x: '60%',y: '100%'},
      //         ],
      //       },
      //     ],
      //     input: undefined,
      //     update: this._flowAB,
      //     output: this._flowBA,
      //     velocity: .05,
      //     spacing: 200,
      //     g: this._g
      //   })
      // )
    }


  }

  public render() {
    return (
      <Layout
        name="example.Paths"
        service={ServiceOptions.edit}
        g={this._g}
        animate={{ active: true }}
        layers={{encapsulate: true}}
        overflowX={OverflowOptions.hidden}
        overflowY={OverflowOptions.hidden}
      >
        {this.content()}
        <Grid
          g={this._g}
          data-layout={{
            name: 'grid',

            location: { left: 0, top: 0 },
            layer: 0
          }}
          style={{ overflow: 'hidden' }}
        />
      </Layout>
    )
  }

  public init = (g: IGenerator): Blocks => {

    const blocks = g.blocks()

    if (this._params.changed()) {
      // update Layout for each update
      blocks.map.forEach(block => {
        block.touch()
      })
    }

    return blocks
  }

  protected create(args: ICreate): Block {

    if (!args.dataLayout) {
      console.error(`TODO default position ${args.name}`);
    }

    const block = args.g.blocks().set(args.name, args.dataLayout, args.g);

    return block;
  }

  protected createElements() {
    // Display parent and children with connections

    return null
  }

  private content() {
    const jsx: JSX.Element[] = [];
    let i = 0;
    for(i = 0; i < 20; i++) {
      const name = `${i}`;
      jsx.push(
        <Panel
          key={name}
          data-layout={{
            name,
            origin: { x: .5, y: .5 },
            location: { left: 0, top: 0, width: 250, height: "100u" },
            layer: 3
          }}
        >
         {(args: IMetaDataArgs) => (
            <div>
              <span>{`hook:${args.block.getData('hook')} dist:${(args.block.getData('distance', 0) as number).toFixed(1)} #${name}`}</span>
            </div>
          )}
         
        </Panel>
      )
    } 
    return jsx
  }
}

import * as React from 'react'

import {
  Block,
  Blocks,
  Generator,
  ICreate,
  IEditHelperProps,
  IGenerator,
  // IMetaDataArgs,
  Layout,
  // Panel,
  Params,
  ParamValue,
  pathHook,
  // PositionRef,
  Queue,
  ServiceOptions,
  // updateParamLocation
} from '../importRLG'

import * as data from '../assets/data/params.json'

// import {Connect} from '../components/Connect'
import { useFatBird } from './fatBird';

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
  private _flowFlightTop: Queue<Block> = new Queue<Block>("flowFlightTop");
  // protected _treeMap: TreeMap

  constructor(props: IEditHelperProps) {
    super(props)

    this._g = new Generator('chart', this.init.bind(this), this._params, this.create.bind(this))

    const hooks = this._g.hooks()
    hooks.set(
      "flightBottom",
      pathHook({
        prefix: "flightBottom",
        points: [
          {
            min: 0,
            max: 2500,
            points: [{ x: "100%", y: "100%" }, { x: 0, y: "100%" }]
          }
        ],
        input: () => this._g.blocks().layers(2),
        update: this._flowFlightTop,
        output: this._flowFlightTop,
        velocity: 0.05,
        spacing: 200,
        fill: true,
        g:this._g
      })
    );

    // this._treeMap = t1
    this.state = {
      node: 'a'
    }
  }

  public render() {
    return (
      <Layout
        name="example.Chart"
        service={ServiceOptions.edit}
        g={this._g}
        params={[
          ...(data['rlg.intro'] as Array<[string, ParamValue]>),
          ['velocity', { x: 0.01, y: -0.05 }]
        ]}
        animate={{ active: false }}
        layers={{encapsulate: true}}
      >
        <RenderFatBird/>
        {/* <Panel
          key={this.state.node}
          data-layout={{
            name: this.state.node,
            origin: { x: .50, y: 0 }, 
            location:  { left: '50%', top: '50%', width: 150, height: 100 },
            
            transform: [{rotate: 10, origin: {x: .50, y: .50}}],
            editor: {
              edits: [
                { ref: PositionRef.position, variable: `${this.state.node}Location`, updateParam: updateParamLocation }
              ]
            },
          }}
          style={{ backgroundColor: 'hsl(200,100%,80%)' }}
        >
          {(args: IMetaDataArgs) => (
            <div>
              <span>{this.state.node}</span>
            </div>
          )}
        </Panel>

        <div
          data-layout={{
            name: 'animation3.1',

            // origin: { x: .50, y: .50 },
            location: { left: 50, bottom: 0, width: "5%", height: '30%' },
            layer: 2
          }}
          style={{ backgroundColor: 'hsl(200,100%,80%)' }}
        >
          <span>Third Animation #1</span>
        </div>

        <div
          data-layout={{
            name: 'animation3.2',

            
            location: { left: 150, top: 200, width: 140, height: 24 },
            layer: 3
          }}
        >
          <span>Third Animation #2</span>
        </div>

        <div
          data-layout={{
            name: 'animation3.3',

            // origin: { x: .50, y: .50 },
            location: { left: 200, top: 150, width: 140, height: 24 },
            layer: 3
          }}
        >
          <span>Third Animation #3</span>
        </div>

        <Connect 
          blockA={'animation3.1'} 
          blockB={'animation3.2'}
          g={this._g}
        />

      <Connect 
          blockA={'animation3.2'}
          blockB={'animation3.3'}
          g={this._g}
        />

        <Connect 
          blockA={'animation3.3'}
          blockB={'animation3.1'}
          g={this._g}
        /> */}
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

  protected renderConnection(block: Block) {
    const p = block.connectionHandles()
    if (p.length) {
      return null
    }
    return null
  }
}

// tslint:disable-next-line:no-empty-interface
interface IProps {
  //
}

// tslint:disable-next-line:variable-name
export const RenderFatBird: React.FunctionComponent<IProps> = ({  }: IProps): JSX.Element =>
{
  const child = useFatBird()
return <div>{child}</div>
}

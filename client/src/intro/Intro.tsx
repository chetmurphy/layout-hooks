import * as React from 'react'
import styled from 'styled-components'

import {
  Block,
  dynamicGenerator,
  IEditHelperProps,
  Layout,
  OverflowOptions,
  pathHook,
  Queue,
  ServiceOptions,
  Status
} from '../importRLG'

// const Title = styled.h2`
// `

// tslint:disable-next-line:variable-name
const Description = styled.div`
  word-break: normal;
  white-space: normal;
  text-align: center;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1.25rem;
`

interface IIntroState {
  update: number
}

export default class Intro extends React.Component<
  IEditHelperProps,
  IIntroState
> {
  private _g = dynamicGenerator('rlg.intro')
  private _edit: boolean = false
  private _flow: Queue<Block> = new Queue<Block>('flow')
  // private _active: Block[] = []

  constructor(props: IEditHelperProps) {
    super(props)

    this.state = { update: 0 }
  }

  public componentDidMount() {
    this.props.editHelper().load([
      {
        name: 'edit',
        command: this.setEdit,
        status: this._edit ? Status.up : Status.down
      }
    ])

    const hooks = this._g.hooks()
    const blocks = this._g.blocks()

    // hooks.set(
    //   'Paths #A',
    //   pathHook({
    //     prefix: 'Paths #A',
    //     points: [
    //       {
    //         min: 0, max: 480, points: [
    //           {x: '50%', y: 0}, {x: '50%',y: '100%'},
    //         ],
    //       },
    //       {
    //         min: 480, max: 720, points: [
    //           {x: '30%', y: 0}, {x: '30%',y: '100%'},
    //           {x: '60%', y: 0}, {x: '60%',y: '100%'},
    //         ],
    //       },
    //       {
    //         min: 720, max: 1024, points: [
    //           {x: '25%', y: 0}, {x: '25%',y: '100%'},
    //           {x: '50%', y: 0}, {x: '50%',y: '100%'},
    //           {x: '75%', y: 0}, {x: '75%',y: '100%'},
    //         ],
    //       },
    //       {
    //         min: 1024, max: 2560, points: [
    //           {x: '20%', y: 0}, {x: '20%',y: '100%'},
    //           {x: '40%', y: 0}, {x: '40%',y: '100%'},
    //           {x: '60%', y: 0}, {x: '60%',y: '100%'},
    //           {x: '80%', y: 0}, {x: '80%',y: '100%'},
    //         ],
    //       },

    //     ],
    //     input: () => blocks.layers(1),
    //     update: this._flow,
    //     output: this._flow,
    //     velocity: .05,
    //     spacing: 200,
    //     fill: true,
    //     g: this._g
    //   })
    

      hooks.set(
        'Paths #A',
        pathHook({
          prefix: 'Paths #A',
          points: [
            {
              min: 0, max: 2500, points: [
                {x: '110%', y: '110%'}, {x: '-10%',y: '-10%'},
              ],
            }
          ],
          input: () => blocks.layers(1),
          // active: this._active,
          update: this._flow,
          output: this._flow,
          velocity: .05,
          spacing: 200,
          fill: true,
          g: this._g
        })
    )
  }

  public setEdit = (status: Status) => {
    if (status === Status.down) {
      status = Status.up
      this._edit = true
    } else {
      status = Status.down
      this._edit = false
    }

    // this.grid(this._gridUnit)
    // this._g.clear();
    this.setState({ update: this.state.update + 1 })

    return status
  }

  public render() {
    return (
      <Layout
        name={'Layout.intro.example'}
        service={this._edit ? ServiceOptions.edit : ServiceOptions.none}
        animate={{ active: true }}
        g={this._g}
        overflowX={OverflowOptions.hidden}
        overflowY={OverflowOptions.hidden}
      >
        {this.content()}
      </Layout>
    )
  }

  public content = () => {
    let index = 1000
    const features: any[] = [
      <div key={`${++index}`}>Template Support.</div>,
      <div key={`${++index}`}>Dashboard</div>,
      <div key={`${++index}`}>Built with RLG</div>,
      <div key={`${++index}`}>Animation</div>,
      <div key={`${++index}`}>Typescript</div>,
      <div key={`${++index}`}>Built in Editor</div>,
      <div key={`${++index}`}>Design and Runtime</div>,
      <div key={`${++index}`}>Serialization</div>,
      <div key={`${++index}`}>Path Animation</div>,
      <div key={`${++index}`}>Responsive Desktop</div>,
      <div key={`${++index}`}>HTML and SVG</div>,
      <div key={`${++index}`}>Games</div>,
      <div key={`${++index}`}>Drag and Drop</div>,
      <div key={`${++index}`}>Ideal for SVG</div>,
      <div key={`${++index}`}>Columns</div>,
      <div key={`${++index}`}>Position and Size Editing</div>,
      <div key={`${++index}`}>Layout in React</div>,
      <div key={`${++index}`}>Diagrams</div>,
      <div key={`${++index}`}>Fine Grain Responsive</div>,
      <div key={`${++index}`}>Fit Text to Container</div>,
      <div key={`${++index}`}>Animation: You're looking at one now</div>,
      <div key={`${++index}`}>Rows Generator</div>,
      <div key={`${++index}`}>Editor</div>,
      <div key={`${++index}`}>Dynamic Generator</div>,
      <div key={`${++index}`}>Layer Support with Editing</div>,
      <div key={`${++index}`}>Bring Forward, Send to Back, ...</div>,
      <div key={`${++index}`}>Context Menu</div>,
      <div key={`${++index}`}>ToolBar</div>,
      <div key={`${++index}`}>Align Left, Top, Center, ... </div>,
      <div key={`${++index}`}>Linked Elements</div>,
      <div key={`${++index}`}>Persistance</div>,
      <div key={`${++index}`}>Custom Animation</div>,
      <div key={`${++index}`}>Physics Engine Capable</div>,
      <div key={`${++index}`}>Debug Options</div>,
      <div key={`${++index}`}>Overlays</div>
    ]
    const jsx: JSX.Element[] = []
    let i = 0
    for (i = 0; i < features.length; i++) {
      const feature = features[i]
      const name = `${i++}`
      jsx.push(
        <div
          key={name}
          data-layout={{
            name,
            origin: { x: 0, y: -.5 },
            location: { left: 0, top: 0, width: 250, height: '100u' },
            layer: 1
          }}
        >
          <Description>{feature}</Description>
        </div>
      )
    }

    return jsx
  }
}

export const introJSX = (props: IEditHelperProps): JSX.Element => {
  return <Intro {...props} />
}

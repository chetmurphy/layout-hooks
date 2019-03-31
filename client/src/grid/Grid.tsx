import * as React from 'react'

import styled from 'styled-components'

import {
  dynamicGenerator,
  IEditHelperProps,
  IMetaDataArgs,
  ISize,
  Layout,
  Panel,
  rectSize,
  ServiceOptions,
  Status,
  toXPixel,
  toYPixel,
  Unit
} from '../importRLG'

import Button from '../components/Button'
import Table from '../components/Table'

export interface IProps {
  containersize: ISize
}

const Description = styled.p`
  word-break: normal;
  white-space: normal;
  text-align: center;
`

const CalloutBottom = styled.div<IProps>`
  position: absolute;
  color: #000;
  width: ${p => p.containersize.width};
  height: ${p => p.containersize.height};
  background: #f3961c;
  border-radius: 10px;
  background: linear-gradient(top, #f9d835, #f3961c);
`

export { CalloutBottom }

export default class Grid extends React.Component<
  IEditHelperProps,
  { update: number }
> {
  private _g = dynamicGenerator('example.grid')
  private _grid: HTMLCanvasElement
  private _gridUnitSquare = { x: 0, y: 0 }
  private _gridUnit = Unit.pixel
  private _units = '1%'
  private _edit = false

  constructor(props: IEditHelperProps) {
    super(props)
    this.state = { update: 0 }
  }

  public setPixel = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.grid(Unit.pixel)
    this._g.clear()
    this._gridUnit = Unit.pixel
    this.setState({ update: this.state.update + 1 })
  }

  public setPercent = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.grid(Unit.percent)
    this._g.clear()
    this._gridUnit = Unit.percent
    this.setState({ update: this.state.update + 1 })
  }

  public setvmin = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.grid(Unit.vmin)
    this._g.clear()
    this._gridUnit = Unit.vmin
    this.setState({ update: this.state.update + 1 })
  }

  public componentDidMount() {
    this.props
      .editHelper()
      .load([
        {
          name: 'edit',
          command: this.setEdit,
          status: this._edit ? Status.up : Status.down
        }
      ])
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
        name="example.Grid"
        service={this._edit ? ServiceOptions.edit : ServiceOptions.none}
        g={this._g}
        layers={{encapsulate: false}}
      >
        <Panel
          data-layout={{
            name: 'grid',

            location: { left: 0, top: 0 },
            layer: 0
          }}
          style={{ overflow: 'hidden' }}
        >
          {(args: IMetaDataArgs) => {
            return (
              <canvas
                ref={(element: HTMLCanvasElement) => {
                  this.setGrid(args, element)
                }}
                width={args.container.width}
                height={args.container.height}
              />
            )
          }}
        </Panel>

        <Panel
          data-layout={{
            name: 'square (pixel, pixel)',
            origin: {x: -1.50, y: 0},
            location: { left: 200, top: 50, width: 200, height: 200 },
            layer: 1
          }}
          style={{ backgroundColor: 'tan' }}
        >
          {(args: IMetaDataArgs) => {
            return (
              <Table
                name={args.block.name}
                containersize={rectSize(args.container)}
                title={args.block.name}
                rowData={[
                  [`x: ${args.container.x}`, `y: ${args.container.y}`],
                  [`w: ${args.container.width}`, `h: ${args.container.height}`]
                ]}
              />
            )
          }}
        </Panel>

        <Panel
          data-layout={{
            name: 'square(percent, vmin)',

            location: { left: '30%', top: '20%', width: 150, height: 150 },
            layer: 1
          }}
          style={{ backgroundColor: 'LightSkyBlue' }}
        >
          {(args: IMetaDataArgs) => (
            <>
              <span>Square (percent, vmin) </span> <br />
              <br />
              <br />
            </>
          )}
        </Panel>

        <Panel
          data-layout={{
            name: 'square(vmin, vmin)',

            location: { left: '60vmin', top: '70vmin', width: 200, height: 200 },
            layer: 1
          }}
          style={{ backgroundColor: 'lime' }}
        >
          {(args: IMetaDataArgs) => <span>Square (vmin, vmin) </span>}
        </Panel>

        <Panel
          data-layout={{
            name: 'square(percent, percent)',

            location: { left: '50%', top: '50%', width: 200, height: 150 },
            layer: 1
          }}
          style={{ backgroundColor: 'gold' }}
        >
          {(args: IMetaDataArgs) => (
            <>
              <span>Square (percent, percent) </span> <br />
              <br />
              <br />
              <span>Click the edit button to edit. </span> <br />
            </>
          )}
        </Panel>

        <div
          data-layout={{
            name: 'callout',

            location: { left: '40%', top: '40%', width: 100, height: '80u' },
            align: {
              key: 'square(percent, percent)',
              offset: { x: 20, y: 10 },
              source: { x: 100, y: 100 },
              self: { x: 0, y: 0 }
            }
          }}
          style={{ backgroundColor: 'yellow' }}
        >
          <Description>Drag Me</Description>
        </div>

        {this.controls()}
        {this.gridLegend()}
      </Layout>
    )
  }

  protected gridLegend = () => {
    const Note = styled.span`
      font-family: Arial, Helvetica, sans-serif;
      font-size: '5px';
      position: absolute;
      white-space: nowrap;
      overflow: 'hidden';
      word-break: keep-all;
    `

    return (
      <div
        data-layout={{
          name: 'Legend',

          location: {
            left: '5vmin',
            top: '20vmin',
            width: 100,
            height: 80,
            unit: Unit.unmanaged
          },
          editor: { preventEdit: true },
          layer: 1
        }}
      >
        <Note>{`Grid unit ${this._units}`}</Note> <br />
        <Note>{`width: ${this._gridUnitSquare.x.toFixed(2)}px`}</Note> <br />
        <Note>{`height: ${this._gridUnitSquare.y.toFixed(2)}px`}</Note> <br />
      </div>
    )
  }

  protected controls = () => {
    const style = {
      fontSize: '1rem',
      background: 'white',
      color: 'gray'
    }
    const selectedStyle = {
      fontSize: '1rem',
      background: 'white',
      color: 'black',
      fontWeight: 700
    }

    return (
      <>
        <Button
          name="Pixel"
          key={'Pixel'}
          data-layout={{
            name: 'Pixel',

            location: { left: '5pmin', top: '5pmin', width: 90, height: 24 },
            editor: { preventEdit: true },
            layer: -1
          }}
          style={this._gridUnit === Unit.pixel ? selectedStyle : style}
          onClick={this.setPixel}
        />
        <Button
          name={'Percent'}
          key={'Percent'}
          data-layout={{
            name: 'Percent',

            location: { left: '5pmin', top: '10pmin', width: 90, height: 24 },
            editor: { preventEdit: true },
            layer: -1
          }}
          style={this._gridUnit === Unit.percent ? selectedStyle : style}
          onClick={this.setPercent}
        />
        <Button
          name={'vmin'}
          key={'vmin'}
          data-layout={{
            name: 'vmin',

            location: { left: '5pmin', top: '15pmin', width: 90, height: 24 },
            editor: { preventEdit: true },
            layer: -1
          }}
          style={this._gridUnit === Unit.vmin ? selectedStyle : style}
          onClick={this.setvmin}
        />
      </>
    )
  }

  protected control(selected: boolean, props: any) {
    const CtrlButton = styled(Button)`
      font-size: 1rem;
      background: white;
      color: lightgray;
    `
    const CtrlSelectedButton = styled(Button)`
      font-size: 1rem;
      background: 'white';
      color: black;
    `
    if (selected) {
      return <CtrlSelectedButton {...props} />
    } else {
      return <CtrlButton {...props} />
    }
  }

  protected grid = (unit: Unit) => {
    const containersize = this._g.containersize()
    const viewport = this._g.viewport()
    const bounds = { container: containersize, viewport }

    const w = Math.round(containersize.width)
    const h = Math.round(containersize.height)

    const lineWidth = 1

    let unitStep = { x: 1, y: 1 }

    if (this._grid) {
      const ctx = this._grid.getContext('2d')

      if (ctx) {
        this.clearCanvas(ctx, this._grid)

        // setup axis divisions
        switch (unit) {
          case Unit.pixel: {
            this._units = '10px'
            unitStep = {
              x: toXPixel(10, Unit.pixel, bounds),
              y: toYPixel(10, Unit.pixel, bounds)
            }
            break
          }
          case Unit.percent: {
            this._units = '1%'
            unitStep = {
              x: toXPixel(0.01, Unit.percent, bounds),
              y: toYPixel(0.01, Unit.percent, bounds)
            }
            break
          }
          case Unit.pmin: {
            this._units = '1%'
            unitStep = {
              x: toXPixel(0.01, Unit.pmin, bounds),
              y: toYPixel(0.01, Unit.pmin, bounds)
            }
            break
          }
          case Unit.pmax: {
            this._units = '1%'
            unitStep = {
              x: toXPixel(0.01, Unit.pmax, bounds),
              y: toYPixel(0.01, Unit.pmax, bounds)
            }
            break
          }
          case Unit.ph: {
            this._units = '1%'
            unitStep = {
              x: toXPixel(0.01, Unit.ph, bounds),
              y: toYPixel(0.01, Unit.ph, bounds)
            }
            break
          }
          case Unit.pw: {
            this._units = '1%'
            unitStep = {
              x: toXPixel(0.01, Unit.pw, bounds),
              y: toYPixel(0.01, Unit.pw, bounds)
            }
            break
          }

          case Unit.vmin: {
            this._units = '1%'
            unitStep = {
              x: toXPixel(0.01, Unit.vmin, bounds),
              y: toYPixel(0.01, Unit.vmin, bounds)
            }
            break
          }
          case Unit.vmax: {
            this._units = '1%'
            unitStep = {
              x: toXPixel(0.01, Unit.vmax, bounds),
              y: toYPixel(0.01, Unit.vmax, bounds)
            }
            break
          }
          case Unit.vh: {
            this._units = '1%'
            unitStep = {
              x: toXPixel(0.01, Unit.vh, bounds),
              y: toYPixel(0.01, Unit.vh, bounds)
            }
            break
          }
          case Unit.vw: {
            this._units = '1%'
            unitStep = {
              x: toXPixel(0.01, Unit.vw, bounds),
              y: toYPixel(0.01, Unit.vw, bounds)
            }
            break
          }
        }

        this._gridUnitSquare = unitStep

        // Horizontal lines
        let index = -1
        for (let j = 0; j < h; j += unitStep.y) {
          index += 1
          let background =
            index % 5 === 0 ? 'hsl(210,100%,75%)' : 'hsl(210,100%,90%)'
          background = index % 10 === 0 ? 'hsl(210,100%,60%)' : background
          ctx.strokeStyle = background
          ctx.lineWidth = lineWidth
          ctx.beginPath()
          ctx.moveTo(0, j)
          ctx.lineTo(w, j)
          ctx.stroke()
        }

        // Vertical lines
        index = -1
        for (let i = 0; i < w; i += unitStep.x) {
          index += 1
          let background =
            index % 5 === 0 ? 'hsl(210,100%,75%)' : 'hsl(210,100%,90%)'
          background = index % 10 === 0 ? 'hsl(210,100%,60%)' : background
          ctx.strokeStyle = background
          ctx.lineWidth = lineWidth
          ctx.beginPath()
          ctx.moveTo(i, 0)
          ctx.lineTo(i, h)
          ctx.stroke()
        }
      }
    }
  }

  private clearCanvas(
    context: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) {
    context.clearRect(0, 0, canvas.width, canvas.height)
    const w = canvas.width
    canvas.width = 1
    canvas.width = w
  }

  private setGrid = (args: IMetaDataArgs, element: HTMLCanvasElement) => {
    if (this._grid !== element && element) {
      this._grid = element
      this.grid(Unit.pixel)
      this.setState({ update: this.state.update + 1 })
    }
  }
}

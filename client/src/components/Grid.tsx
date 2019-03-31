import * as React from 'react'

import styled from 'styled-components'

import {
  IGenerator,
  IMetaDataArgs,
  ISize,
  Layout,
  Panel,
  toXPixel,
  toYPixel,
  Unit
} from '../importRLG'

import Button from '../components/Button'

export interface IGridProps extends React.HTMLProps<HTMLElement>{
  g: IGenerator
}

export interface IGridState {
  update: number
}
export default class Grid extends React.Component<IGridProps, IGridState> {
  private _grid: HTMLCanvasElement
  private _gridUnitSquare = { x: 0, y: 0 }
  private _gridUnit = Unit.percent
  private _units = '1%'

  constructor(props: IGridProps) {
    super(props)

    this.state = {update: 0}
  }

  public setPixel = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.grid(Unit.pixel)
    this._gridUnit = Unit.pixel
    this.setState({ update: this.state.update + 1 })
  }

  public setPercent = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.grid(Unit.percent)
    this._gridUnit = Unit.percent
    this.setState({ update: this.state.update + 1 })
  }

  public setVmin = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.grid(Unit.vmin)
    this._gridUnit = Unit.vmin
    this.setState({ update: this.state.update + 1 })
  }

  public render() {
    return (
      <Layout
      name="grid"
      g={this.props.g}
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
                  this.setGrid(element)
                }}
                width={args.container.width}
                height={args.container.height}
              />
            )
          }}
        </Panel>
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
          onClick={this.setVmin}
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
    const containersize = this.props.g.containersize()
    const viewport = this.props.g.params().get('viewport') as ISize

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

  private setGrid = (element: HTMLCanvasElement) => {
    if (this._grid !== element && element) {
      this._grid = element
      this.grid(Unit.percent)
      this.setState({ update: this.state.update + 1 })
    }
  }
}

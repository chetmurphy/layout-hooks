import * as React from 'react'
import styled from 'styled-components'

import cssColor from '../assets/colors'

// These paths are for the examples only. In an application you
// would get these by importing from 'react-layout-generator'
import { columnsGenerator, Layout } from '../importRLG'

// tslint:disable-next-line:variable-name
export const Button = styled.button`
  font-size: 1rem;
  background: transparent;
  border: none;
  color: ${cssColor.light};
  white-space: nowrap;
  overflow: 'hidden';
  word-break: keep-all;
`

export const SelectedButton = styled.button`
  font-size: 1rem;
  background: ${cssColor.light};
  border: none;
  color: ${cssColor.dark};
`
interface IElement {
  component: any
  name: string
}

interface IElementRef extends IElement {
  handler: (event: React.MouseEvent) => void
}

interface INavBarProps {
  elements: IElement[]
  callback: (component: any) => void
}

interface INavBarState {
  selected: string | undefined
  update: number
}

export default class NavBar extends React.Component<
  INavBarProps,
  INavBarState
> {
  private n = columnsGenerator('navbar')
  private elementRefs: IElementRef[] = []
  private _size: Map<string, number> = new Map()
  private _changed: number = 0

  constructor(props: INavBarProps) {
    super(props)

    this.props.elements.forEach((e: IElement) => {
      this.elementRefs.push({
        component: e.component,
        name: e.name,
        handler: (event: React.MouseEvent<HTMLButtonElement>) => {
          if (this.state.selected !== e.name) {
            this.setState({ selected: e.name })
            this.props.callback(e.component)
          }
        }
      })
    })

    this.state = {
      selected: undefined,
      update: 0
    }

    const item = this.elementRefs.length ? this.elementRefs[0].name : undefined
    setTimeout(() => {
      this.setState({ selected: item })
    }, 400)
  }

  public render() {
    this._changed = 0
    this.n.reset()

    return (
      <Layout name="navbar" g={this.n}>
        {this.createElements()}
      </Layout>
    )
  }

  protected setSize = (name: string, v: number) => {
    const n = this._size.get(name)
    if (n === undefined || v !== n) {
      this._size.set(name, v)
      if (!this._changed) {
        this._changed = 1
        setTimeout(() => {
          this.setState({ update: this.state.update + 1 })
        }, 3)
      }
    }
  }

  private createElements = () => {
    return this.elementRefs.map((e: IElementRef) => {
      const width = this._size.get(e.name)
      if (e.name === this.state.selected) {
        return (
          <div
            key={e.name}
            data-layout={{
              name: e.name,

              location: {
                left: 0,
                top: 0,
                width: width ? width : 100,
                height: 20
              }
            }}
          >
            <SelectedButton
              key={e.name}
              data-layout={{ name: e.name }}
              onClick={e.handler}
            >
              {e.name}
            </SelectedButton>
          </div>
        )
      } else {
        return (
          <div
            key={e.name}
            data-layout={{
              name: e.name,

              location: {
                left: 0,
                top: 0,
                width: width ? width : 100,
                height: 20
              }
            }}
          >
            <Button
              key={e.name}
              ref={c => {
                if (c) {
                  this.setSize(e.name, c.offsetWidth)
                }
              }}
              onClick={e.handler}
            >
              {e.name}
            </Button>
          </div>
        )
      }
    })
  }
}

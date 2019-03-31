import * as React from 'react'
import styled from 'styled-components'

import * as RLG from '../importRLG'

import Button from '../components/Button'

import { ServiceOptions } from '../../../src/types'
import Deck from '../algos/Deck'
// import cssColor from '../assets/colors';
// import Note from '../components/Note';

const Description = styled.p`
  font-family: Arial, Helvetica, sans-serif;
  word-break: normal;
  white-space: normal;
  user-select: none;
`

// tslint:disable-next-line:variable-name
// const Title = styled.h3`
//   font-family: Arial, Helvetica, sans-serif;
//   background: transparent;
//   color: ${cssColor.dark};
//   margin: 0;
//   position: absolute;
//   // top: 50%;
//   // left: 50%;
//   // transform: translate(-50%, -50%);
//   left: 10;
// `

const Container = styled.div`
  position: absolute;
  color: #000;
  background: #fffb02;
  border-radius: 5px;
  background: linear-gradient(top, #f9d835, #f3961c);
  padding: 0;
`
interface ICardDeckState {
  update: number
}

// tslint:disable-next-line:max-classes-per-file
export default class CardDeck extends React.Component<
  RLG.IEditHelperProps,
  ICardDeckState
> {
  private _g = RLG.dynamicGenerator('example.CardDeck')
  private _deck = new Deck()
  private _edit: boolean = true

  constructor(props: RLG.IEditHelperProps) {
    super(props)
    this.state = { update: 0 }
  }

  public componentDidMount() {
    this.props
      .editHelper()
      .load([
        {
          name: 'edit',
          command: this.setEdit,
          status: this._edit ? RLG.Status.up : RLG.Status.down
        }
      ])
  }

  public setEdit = (status: RLG.Status) => {
    if (status === RLG.Status.down) {
      status = RLG.Status.up
      this._edit = true
    } else {
      status = RLG.Status.down
      this._edit = false
    }

    // this.grid(this._gridUnit)
    // this._g.clear();
    this.setState({ update: this.state.update + 1 })

    return status
  }

  public render() {
    return (
      <RLG.Layout
        name={'example.cardDeck'}
        service={this._edit ? ServiceOptions.edit : ServiceOptions.none}
        g={this._g}
        layers={{
          encapsulate: false
        }}
      >
        {this.createElements()}

        <>
          <Button
            name="shuffle"
            key={'shuffle'}
            data-layout={{
              name: 'shuffle',
              origin: { x: 1, y: 0 },
              location: { left: '90%', top: '80%', width: 100, height: 24 },
              editor: {
                selectable: false,
                preventEdit: true
              },
              layer: 1
            }}
            onClick={this.shuffle}
          >
            Shuffle
          </Button>
        </>
        <Container
          data-layout={{
            name: 'instructions',

            origin: { x: 1, y: 0 },
            location: { left: '90%', top: '10%', width: 200, height: '350u' },
            editor: {
              selectable: false,
              preventEdit: true
            },
            layer: 1
          }}
        >
          <>
            <Description>Edit mode enabled.</Description>
            <Description>Use the mouse to drag objects.</Description>
            <Description>Use shift-click to select a card.</Description>
            <Description>Use context menu align selected cards.</Description>
          </>
        </Container>
      </RLG.Layout>
    )
  }

  private createElement = (card: string) => {
    const e = require(`../assets/cards/${card}.jpg`)

    return (
      <div
        key={card}
        data-layout={{
          name: card,

          location: { left: '5%', top: '5%', width: 120, height: 156 },
          editor: {
            edits: [{ ref: RLG.PositionRef.position }]
          }
        }}
      >
        <img width={120} height={156} src={e} />
      </div>
    )
  }

  private createElements = (): any[] => {
    const a: JSX.Element[] = []
    this._deck.cards.forEach(card => {
      a.push(this.createElement(card))
    })
    return a
  }

  private shuffle = (event: React.MouseEvent<HTMLButtonElement>) => {
    this._deck.shuffle()
    this._g.clear()
    this.setState({ update: this.state.update + 1 })
  }
}

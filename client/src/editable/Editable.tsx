import * as React from 'react'

import styled from 'styled-components'

import {
  desktopGenerator,
  IEditHelperProps,
  IGenerator,
  IMetaDataArgs,
  ISize,
  Layout,
  loadFromLocalStorage,
  OverflowOptions,
  Panel,
  Params,
  ParamValue,
  rectSize,
  saveToLocalStorage,
  ServiceOptions,
  Status
} from '../importRLG'

import EditableText from '../components/EditableText'

// tslint:disable-next-line:variable-name
export const T = styled.div`
  font-family: Arial, Helvetica, sans-serif;
  background: transparent;
  color: white;
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

// const Description = styled.p`
//   word-break: normal;
//   white-space: normal;
//   text-align: center;
// `

interface IDeskTopState {
  update: number
  containersize: ISize
}

const values: Array<[string, ParamValue]> = [
  ['fullWidthHeaders', 1],
  ['titleHeight', 200],
  ['leftSideWidth', 0],
  ['rightSideWidth', 0],
  ['headerHeight', 10],
  ['footerHeight', 0],
  ['title', { content: `Click to Edit`, fontSize: 30 }],
  ['subtitle', { content: `Click to Edit` }],
  ['content', { content: `Click to Edit` }]
]

const gEditableParams = new Params({
  name: 'editable',
  initialValues: values,
  save: saveToLocalStorage,
  load: loadFromLocalStorage
})

export default class Editable extends React.Component<
  IEditHelperProps,
  IDeskTopState
> {
  private g: IGenerator
  private _edit: boolean = true
  private _save: boolean = true

  constructor(props: IEditHelperProps) {
    super(props)

    this.state = { update: 0, containersize: { width: 0, height: 0 } }
    this.g = desktopGenerator('rlg.eTemplate.example', gEditableParams)
  }

  public componentDidMount() {
    if (this._save) {
      const edit = loadFromLocalStorage('rlg.eTemplate.example', 'edit')
      this._edit = edit === 1 ? true : false
      this.setState({ update: this.state.update + 1 })
    }

    this.props
      .editHelper()
      .load([
        { name: 'edit', command: this.setEdit, status: this.editState },
        { name: 'save', command: this.setSave, status: this.saveState }
      ])
  }

  public setEdit = (status: Status) => {
    if (status === Status.down) {
      status = Status.up
      this._edit = true
    } else {
      // save before turning edit off
      if (this._save) {
        saveToLocalStorage('rlg.eTemplate.example', 'edit', this._edit ? 1 : 0)
      }
      status = Status.down
      this._edit = false
    }

    this.setState({ update: this.state.update + 1 })

    return status
  }

  public editState = () => {
    return this._edit === true ? Status.up : Status.down
  }

  public setSave = (status: Status) => {
    // TODO
    // this._save = !this._save;
    // this.setState({ update: this.state.update + 1 })
    // saveToLocalStorage('rlg.eTemplate.example', 'save', this._save ? 1 : 0)
    return undefined
  }

  public saveState = () => {
    return this._save ? Status.up : Status.down
  }

  public render() {
    return (
      <Layout
        name={'Layout.ETemplate.example'}
        service={this._edit ? ServiceOptions.edit : ServiceOptions.none}
        overflowX={OverflowOptions.hidden}
        overflowY={OverflowOptions.hidden}
        g={this.g}
      >
        <Panel
          data-layout={{ name: 'title' }}
          style={{ backgroundColor: 'hsl(200,100%,80%)' }}
        >
          {(args: IMetaDataArgs) => (
            <EditableText
              edit={args.service === ServiceOptions.edit}
              params={args.g.params()}
              variable={'title'}
              containersize={rectSize(args.container)}
            />
          )}
        </Panel>

        <div
          data-layout={{ name: 'header' }}
          style={{ backgroundColor: 'hsl(210,100%,10%)' }}
        />

        <Panel
          data-layout={{ name: 'content' }}
          style={{ backgroundColor: 'hsl(220,100%,80%)' }}
        >
          {(args: IMetaDataArgs) => <div />}
        </Panel>

        <div
          data-layout={{
            name: 'note1',

            location: { left: '70%', top: '50%', width: 250, height: '300u' },
            editor: {
              selectable: true
            }
          }}
        >
          <p>
            Experiment to test HTML content editing and auto fitting of text.
          </p>
          <p>
            To edit the text, first active edit (in the toolbar) and then click
            on the text.
          </p>
          <p>
            Change size of title panel to change font size by dragging the top
            of the black drag bar.
          </p>
          <p>The editable text widget does not allow line breaks.</p>
          <p>Save state enabled.</p>
        </div>
      </Layout>
    )
  }
}

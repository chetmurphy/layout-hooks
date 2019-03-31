import * as React from 'react';
import styled from 'styled-components';

import {
  Block,
  Blocks,
  Generator,
  ICreate, 
  IDataLayout,
  IGenerator,
  IGenericProps,
  IMetaDataArgs,
  ISize,
  Layout,
  Panel, 
  Params, 
  PositionRef,
  updateParamLocation,
} from '../importRLG'

import cssColor from '../assets/colors';

// tslint:disable-next-line:variable-name
const Title = styled.span`
  font-family: Arial, Helvetica, sans-serif;
  background: transparent;
  color: ${cssColor.light};
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); 
`

interface ITableProps extends React.HTMLProps<HTMLDivElement> {
  name: string;
  title: string;
  containersize: ISize;
  rowData: string[][];
}

export default class Table extends React.Component<ITableProps> {
  private _g: IGenerator;
  private _params: Params;

  constructor(props: ITableProps) {
    super(props);

    this._params = new Params({
      name: 'props.name', initialValues: [
        ['titleHeight', 36],
        ['rowHeight', 24]
      ]
    });
    this._g = new Generator('chart', this.init, this._params, this.create);
  }

  public render() {

    return (
      <Layout
        name={this.props.name}
        g={this._g}
        containersize={this.props.containersize}
      >
        <Panel data-layout={{ name: 'title' }} style={{ backgroundColor: 'black' }} >
          {(args: IMetaDataArgs) => (
              <>
                <Title>{this.props.name}</Title>
                {this.createRows()}
              </>
         )}
        </Panel>
      </Layout>
    );
  }

  private createRows = () => {
    return null;
  }

  private init = (g: IGenerator): Blocks => {

    const containersize = g.containersize()
    const titleHeight = this._params.get('titleHeight') as number;
    const rowHeight = this._params.get('rowHeight') as number;
    // const footerHeight = this._params.get('footerHeight') as number;

    const blocks = g.blocks();

    if (this._params.changed()) {
      // update Layout for each update
      blocks.map.forEach((block) => {
        block.touch();
      });
    }

    if (containersize) {

      const title: IDataLayout = {
        location: { left: 0, top: 0, width: containersize.width, height: titleHeight },
        editor: {
          edits: [
            { ref: PositionRef.position, variable: 'titleHeight', updateParam: updateParamLocation }
          ]
        }
      }

      blocks.set('title', title, g);

      const row: IDataLayout = {
        location: { left: 0, top: titleHeight, width: containersize.width, height: rowHeight },
        positionChildren: this.positionRowChildren
      }

      blocks.set('row', row, g);

    }
    return blocks;
  }

  private positionRowChildren = (block: Block, g: IGenerator, index: number, props: IGenericProps) => {
    // Return a Layout relative to block starting at position at (0, 0)

    const rowHeight = this._params.get('rowHeight') as number;
    const containersize = g.containersize()
    const titleHeight = this._params.get('titleHeight') as number;

    // These children get placed vertically based on index
    const child: IDataLayout = {
      location: { left: 0, top: titleHeight + index * rowHeight, width: containersize.width, height: rowHeight }
    };

    // This block is temp and will not be stored in blocks
    return new Block('temp', child, g);
  }

  private create(args: ICreate): Block {

    if (!args.dataLayout) {
      console.error(`TODO default position ${args.name}`);
    }

    const block = args.g.blocks().set(args.name, args.dataLayout, args.g);

    return block;
  }
}
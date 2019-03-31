import * as React from 'react';

import { Block } from './components/Block';
import { IGenerator } from './generators/Generator';
import { IRect, ServiceOptions } from './types';

const deepEqual = require('deep-equal')

export interface IMetaDataArgs {
  container: IRect;
  block: React.MutableRefObject<Block>;
  service: ServiceOptions;
  g: IGenerator;
  context: Map<string, any>;
  // update: () => void;
}

// props must be optional to allow them to be injected
interface IPanelProps extends React.HTMLProps<HTMLDivElement> {
  container?: IRect;
  block?: React.MutableRefObject<Block>;
  service?: ServiceOptions;
  g?: IGenerator;
  context?: Map<string, any>;
  // update?: () => void;
}

interface IPanelState {
  rect: IRect;
}

export class Panel extends React.Component<IPanelProps, IPanelState> {
  constructor(props: IPanelProps) {
    super(props);
    this.state = {
      rect: this.props.container!
    };
  }

  public componentWillReceiveProps(props: IPanelProps) {
    if (!deepEqual(props.container,this.state.rect)) {
      if (props.container) {
        this.setState({
          rect: props.container
        });
      }
    }
  }

  public render() {
    const args: IMetaDataArgs = {
      container: this.state.rect,
      block: this.props.block!,
      service: this.props.service!,
      g: this.props.g!,
      context: this.props.context!,
      // update: this.props.update!
    }

    // React.Children.only(this.props.children);

    return (
      <div style={this.props.style}>
        {(this.props.children as (args: IMetaDataArgs) => JSX.Element)(
          args)}
      </div>
    );
  }
}
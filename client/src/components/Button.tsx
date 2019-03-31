import * as React from 'react';

interface IButtonProps extends React.HTMLProps<HTMLButtonElement>{
  name: string;
}

export default class Button extends React.Component<IButtonProps> {

  constructor(props: IButtonProps) {
    super(props);
  }

  public render() {
    return (
      <button {...this.props} style={this.props.style}>
        {this.props.name}
      </button>
    )
  }
}
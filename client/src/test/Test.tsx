import * as React from 'react';

export default class Test extends React.Component {
  public render() {
    return (
      // tslint:disable-next-line:no-string-literal
      <div style={this.props['style'] }>
        <span>Test</span>
      </div>
    ); 
  }
}




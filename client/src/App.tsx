import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import {Layout} from '../../src/Layout'
import { ServiceOptions, OverflowOptions } from '../../src/types';

class App extends Component {
  render() {
    return (
      <Layout
        name={"storybook.layout"}
        service={ServiceOptions.none}
        g={g}
        overflowX={OverflowOptions.hidden}
        overflowY={OverflowOptions.hidden}
      >
        <div
          key={'layout#1'}
          data-layout={{
            name: 'layout#1',
            location: { left: 100, bottom: 20, width: 70, height: 50 },
            hidden: true,
            layer: 2
          }}
          style={{
            backgroundColor: 'coral',
            borderStyle: 'solid',
            borderColor: 'black',
            borderWidth: 1
          }}
        >
          <span>Hello</span>
        </div>
  </Layout>
    );
  }
}

export default App;

import React from 'react'

import { storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs';

import { Layout } from '../src/Layout'
import { ServiceOptions, OverflowOptions } from '../src/types'
import { dynamicGenerator } from '../src/generators/dynamicGenerator'

const g = dynamicGenerator("storybook.animation");

const stories = storiesOf('Layout', module)

stories.addDecorator(withKnobs);

stories.add('Layout', () => (
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
), {  
  
notes: {markdown: 
  `
  `
}})

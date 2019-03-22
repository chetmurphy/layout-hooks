import React from 'react'

import { storiesOf } from '@storybook/react'
import { withKnobs, boolean } from '@storybook/addon-knobs';

const g = dynamicGenerator("storybook.animation");

const stories = storiesOf('Animation', module)

stories.addDecorator(withKnobs);

stories.add('flapping bird', () => (
  <Layout
    name={"storybook.animation"}
    service={ServiceOptions.none}
    animate={{
      active: boolean('active', true)}}
    g={g}
    overflowX={OverflowOptions.hidden}
    overflowY={OverflowOptions.hidden}
    // containersize={{width: 500, height: 500}}
  >
   {content()}
  </Layout>
), {  
notes: {markdown: 
  ` `
}})

# React Layout Generator 0.6.15-alpha.3+162

_React-layout-generator (RLG) is exploring a layout system that uses React to compute the layouts directly._

RLG is focused on layout and position and size editing of both html and svg components. Taking direct control of the layout enables precise and continuous control of responsive layouts. You're no longer limited to just css and the linear flow of elements.

A [live demo](https://neq1.io/) is available at <https://neq1.io>. Source is available at [Github](https://github.com/chetmurphy/react-layout-generator/) under the MIT license.

---

A key difference from traditional layout is that RLG specifies the layout top down. This means that the layout is passed down to React components using props rather than letting the browser determine the layout during the rendering process.

Of course, this also means that the author needs to know how the content will fit into the allocated space. We'll add notes on how we are dealing with this as we continue with the development of RLG. Note that this is not always a problem that needs solving.

Another key difference is that since RLG is only using absolute positioning all the blocks are independent of other blocks. This lets us manipulate the blocks. One use of this is to build a flexible layering system that allows rearranging, hiding, and animating layers. It also enables optional services to be added such as editing and drag and drop. The layering system also features a control layers that sets on top of the services.

---

This project was initially inspired by [react-grid-layout](https://www.npmjs.com/package/react-grid-layout).

## Install

Use either npm or yarn to install

```js
yarn add react-layout-generator
```

For typescript user, type definitions are not needed since they are included.

### Contributing

We're looking for both associates and contributors. If you have question please send an email to rlg@neq1.io.

These steps will guide you through contributing to this project:

- Fork RLG
- Clone it and install dependencies

git clone `https://github.com/YOUR-USERNAME/react-layout-generator`

After cloning go to your install directory and use `npm` or `yarn` to initialize node_modules.

RLG includes an examples sub-project so it too will need to be initialized using npm or yarn.

See the package.json for scripts supported.

Make and commit your changes. Make sure the commands start, build, and test are working.

Finally send a [GitHub Pull Request](https://github.com/chetmurphy/react-layout-generator/compare?expand=1) with a clear list of what you've done (read more [about pull requests](https://help.github.com/articles/about-pull-requests/)). Make sure all of your commits are atomic (one feature per commit).

## TODO

- Add move command within a container to drag and drop to allow rearranging draggable blocks).
- Add React PropTypes for non typescript users.
- Add grid command as option to toolBar in the Demo.
- Add arrange commands to toolBar in the Demo.
- Implement nudge with arrow keys.
- Implement current select commands.
- Add cut, copy, and paste commands.
- Add options to align columnsGenerator and rowsGenerator.
- Add Touch support in editor.

## Features

- templates via generators
- animation including custom engines
- persistance
- built-in editor with position and size editing
- fine grain responsiveness
- top down design
- drag and drop
- layers with stacking

## Applications

- Responsive page layout
- Dashboards
- Diagrams
- Games
- Animations
- Free from layout

## Usage

### Layout

Use Layout as a parent element followed by one or more elements with a [data-layout](interfaces/idatalayout.html) property.

```ts
<Layout name='layoutName' ... />
  <div data-layout={{name: 'name1', ...}} >
    elements...
  </div>
  ...
  <div data-layout={{name: 'nameN', ...}} >
    elements...
  </div>
</Layout>
```

Layout can contain instances of Layout. And as usual with React, children of Layout can be programmatically generated.

#### Note

Do not use generic React components with a data-layout property as direct children of Layout. This is because the generated style needs to applied to the outer most element in the component. Otherwise, the component will not be positioned correctly. This does not apply to styled-components.

A common choice is to wrap a react component with a div element. A disadvantage of this approach is that your content will not have access to meta data. Even so it is also possible that a generic React component will not render correctly within the space allocated (this can be mitigated by using [Panel](classes/panel.html) and/or [Unit.unmanaged](enums/unit.html#unmanaged))

You can only use react components as direct children that apply the style property in their render method like this:

```ts
  render() {
    ...
    return (
      <div style={this.props.style }>
        { this.props.children }
      </div>
    )
  }
```

### Panel

Use [Panel](classes/panel.html) as a direct child of Layout when its children need access their location, size and other information.

```ts
  <Panel data-layout={{ name: 'content' }}>
    {(args: IMetaDataArgs) => (
       ...
    )}
  </Panel>
```

The function (args: [IMetaDataArgs](interfaces/IMetaDataArgs.html)) => () makes its args available to all the jsx included. These args are updated by Layout on every render pass allowing elements to respond to changes including animation.

One way to utilize these args is to use Styled-components with a Style defined like this:

```ts
const Item = styled.li<{ containersize: ISize }>`
  max-width: ${p => p.containersize.width};
  white-space: wrap;
`
```

then just pass the args to \<Item containersize={args.containersize} \>

Panel is also useful for svg since it can pass the width and height to svg.

```ts
<svg
  width={args.containersize.width}
  height={args.containersize.height}
  viewBox="0 0 50 20"
>
  <rect
    x="20"
    y="10"
    width="10"
    height="5"
    style="stroke: #000000; fill:none;"
  />
</svg>
```

In the above snippet the viewBox defines the coordinates system used by svg elements which will now be mapped to the containersize.

If you have more than one child you will need to use a [React Fragment](https://reactjs.org/docs/fragments.html) or add a <div wrapper.

```ts
<Panel data-layout={{ name: 'content' }}>
  {(args: IMetaDataArgs) => (
    <> // React fragment shortcut ... // multiple children</>
  )}
</Panel>
```

### Responsive Layout

### Desktop Layout

RLG provides a number of features to help make layouts responsive.

On approach is to define all the elements in a generator as a function of the containersize.

An example of a responsive generator is defined by the [desktopGenerator](globals.html#desktopgenerator). This generator defines a classical desktop layout consisting of a title, left side panel, header, right side panel, content, and footer. It has a built-in editor to adjust the layout. All the parts are configurable in size and optional. It also can be configured to use full header and footer if desired. It can used like this:

```ts
<Layout
  name={'example'}
  g={desktopGenerator(...)}
>
  <div data-layout={{ name: 'title' }} >
    <span>Title</span>
  </div>

  <div data-layout={{ name: 'leftSide' }} >
    <span>Left side content</span>
  </div>

  <div data-layout={{ name: 'header' }} >
      <span>Header content</span>
  </div>

  <div data-layout={{ name: 'content' }}>
    <span>Page content</span>
  </div>

   <div data-layout={{ name: 'rightSide' }} >
    <span>Right side content</span>
  </div>

   <div data-layout={{ name: 'footer' }} >
    <span>Footer content</span>
  </div>
</Layout>
```

### Layers

RLG has its own implementation of layers. You can merge, reorder, and hide layers. Layers are arranged in numerical order starting with 0. You can also specify negative values for Layers. These are used as control layers that set on top any services activated.

Note: Layers are NOT related to z-index even though they can achieve similar effects. Layers allows application level grouping of components that are arranged from back to front. Z-index (zIndex) can be used within a layer to arrange elements in the layer's stacking context if [encapsulation](interfaces/ilayeroptions.html) is on in layers.

Layers can be used for animations, to hide or show overlays, to visually filter layers (using a semitransparent layer), and in combination with services such as drag and drop, and editing.

To specify the layer of a block and all its content add the layer property to its data-layout.

```ts
<div
  key={name}
  data-layout={{
    name,
    ...
    layer: 2
  }}
>
```

To manage the layers add an optional [layers](interfaces/ilayeroptions.html) property in Layout. It consists of a flag encapsulate and a mapper function that takes the layer specified in a block and maps it to the layers that will be rendered. The default mapper just maps the layers in numerical order. Here is an example of mapper function that hides layer 3.

```ts
<Layout
  name='name'
  ...
  layers={{
    encapsulation: false,
    mapper: (layer: number) => {
      if (layer === 3) {
        // hide layer 3
        return undefined
      }
      return layer
    }
  }}
  ...
```

To animate a layer you just collect all the blocks that will participate in the layer animation in a [generator#generator). Other animations can be running on other layers or even on the same layer (see [rollHook](globals.html#rollHook).

Layers are numbered from 0 to N. You can also specify negative number for layer. All negative layers will be grouped into a control layer that sets on top of all other layers including the service layer. If you do not put controls in the control layer they will not work if a service layer is activated.

### Placement

RLG is all about computing position and size of blocks using the 'natural' coordinate of a block which is the left top corner of a block. However that is not alway how we would like to think about the position of a block. What if we want to right align blocks, center blocks, or distribute blocks in a regular pattern? To support this we introduce the concept of placement. Placement is an adjustment that is applied after the position is computed. Placement uses a decimal (think percent) from the left top of the block.

To set the placement for a block just add an [origin](interfaces/iorigin.html) property to data-layout.

For example, to center a block at its position we need to shift the left top to the left and to the top by 50% of the width and height of the block. So placement becomes a vector {x: .5, y: .5}. We can also think of this as the origin of the position.

To right align blocks set the placement to {x: 1, y: 0} and then set the x values of all the blocks to the same value. Variation include any value for y. Set y to 0 to use the (right, top) corner of the block as the origin. Set y to 1 to use the (right, bottom) corner of the block as the origin.

Values of placement can be negative and include values greater than 1.

Placement can be combined with parametric equations for distribution to present complex layouts. Parametric equations can be used to arrange blocks along a line, around a circle, rectangle, or along a path.

### Drag and Drop

Drag and drop allows you to drag items from one container to another container within a Layout. To activate drag and drop, add the ServiceOptions.dnd to the service property of Layout:

```ts
      <Layout
        name='name'
        service={ServiceOptions.dnd}
        ...
      >
        <Draggable name={'...'} g={this._g} >
          { content to drag }
        </Draggable>

        ...

        <DragDrop // source and/or destination
          name={'...'}}
          key={'...'}
          data-layout={{
            name: '...',
            ...
            layer: 1
          }}
          dragData={this.dragData}  // dragData(id: string) => string[]
          dragImage={this.dragImage} // Optional dragImage(ids: string[]) => JSX
          canDrop={this.canDrop} // canDrop(data: string[]) => boolean
          drop={this.drop} //  drop(data: string[]) => void
          endDrop={this.endDrop} // dragEnd(ids: string[]) => void
          dragEnter={this.dragEnter}  // Optional dragEnter() => void
          dragLeave={this.dragLeave}  // Optional dragLeave() => void
          g={this._g}
        >
          { content to drag }
        </Draggable>

```

Then wrap your draggable elements and components using Draggable

1. Container Source:

```ts
  Handler                Required

  dragData                [no]
  dragImage               [no]
  dragEnd                 [yes]
```

Draggable:

```ts
  Handler                Required

  drag                    [no]
  draggable               [yes]
  dragImage               [yes]
```

Droppable:

```ts
  Handler                Required

  droppable               [yes]
  canDrop                 [yes]
  drop                    [yes]
  dragEnter               [no]
  dragLeave               [no]
```

#### dragData(id: string) => string[]

Fired once when the user starts dragging a component.

Used on draggable components and on the source container. Optional: default is the block id. This function takes the block id and returns an array of ids or undefined. Undefined will stop the drag.

Uses include: preventing a drag, returning a different block, or a list of blocks.

#### dragImage(ids: string[]) => JSX

Fired once when the user starts dragging a component.

This function is called on the draggable element and on its container.

Optional: default is the draggable component content.

#### dragEnd(ids: string[]) => void

Fired once when the user is ending a drag.

This function is called on the source container when a drag has been completed. It must remove the blocks from this container.

#### implementation

The implementation follows this logic:

1. mouse down

   a. test if a Draggable component is found

2. drag start

   a. [optional] get DragDrop container

   b. [optional] calls container.dragStart(id: string) => ids: string[]

   c. default is Draggable id

3. get drop image

   a. [optional] get DragDrop container

   b. [optional] calls container.dragImage(ids: string[]) => JSX

   c. default is Draggable content

4. drag

   a. look for DragDrop containers

   b. call container.canDrop(ids: string[]) => boolean on each

   c. [optional] calls container.dragEnter(ids: string[]) => void

   d. [optional] alls container.dragLeave(ids: string[]) => void

5. release mouse

   a. calls container.drop(ids: string[]) => void

   b. calls container.endDrop(ids: string[]) => void

### Generator

_See columnsGenerator, desktopGenerator, and dynamicGenerator for examples._

A generator is just a function that returns an instance of Generator. A generator function must define its parameter storage, contain an init function and an optional create function. Here is a minimal Empty generator:

```javascript
function emptyGenerator(name: string) {
  // The following code is only executed once
  const params = new Params([])

  // init will be called by the Generator as needed
  // It defines the static named parts of the generator
  // and computes any needed layouts.
  function init(g: IGenerator): Layouts {
    const layouts = g.layouts()

    // Define static parts of the layout

    // Update layouts as needed

    return layouts
  }

  return new Generator(name, init, params)
}
```

emptyGenerator will not generate any elements even if it has children that contains data-layout elements.

To make it a useful dynamic generator we add a create function to the generator. That's how the [dynamicGenerator](globals.html/dynamicgenerator) is defined. It lets you define a layout manually and offers the most flexibility, but only limited responsiveness using just the properties of the [position](interfaces/idatalayout.html) interface.

```jsx
function dynamicGenerator(name: string): IGenerator {
  const _params = new Params([])

  function init(g: IGenerator): Layouts {
    const params = g.params()
    const layouts = g.layouts()

    if (params.changed() || g.containerChanged()) {
      // update Layout for each update
      layouts.map.forEach(layout => {
        layout.touch(true)
      })
    }
    return layouts
  }

  function create(args: ICreate): Layout {
    return args.g.layouts().set(layout.name, args.dataLayout, args.g)
  }

  return new Generator(name, init, _params, create)
}
```

#### Animations

Generators can also be used for animations if they compute the layout blocks as a function of time.
To activate animation behavior in Layout just pass the optional [animate](interfaces/ianimateprops.html) property and use a generator that is animation aware.

#### Notes

Note that generators do not have to be packaged as a function. They can be implemented as part of a class. Just define the methods init and create. Then pass the bound methods to a new instance of Generator.

### Editor

#### Edit commands (in examples)

** This implementation is a work in progress. Not all commands are currently wired for all pages. A production editor will need many more function. This is just a proof of concept editor. **

The toolbar on the left provides common commands. There is also a context menu which has commands for undo, redo, align, and layer commands.

Before you can edit any of the pages you need to first make sure that the editor is on. This is the topmost command in the toolbar. Just click to toggle on and off. Note that if the data is not persisted then turning the editor off will reset the Layout to it previous state.

#### Keyboard controls

- Constrain dragging to horizontal or vertical. Hold down the ctrl key while dragging.

## FAQ

### Why not build a system based on React refs

That could work for specific cases but there is more to a layout system than just manipulating the underlying html elements. You need a way to serialize, edit, and present a layout with content. The hard part of a non-linear layout system is the placement of the elements. In a linear system each element just comes after another element. In a non-linear system the author has to decide on each placement. It's the same problem faced by graphic editors. Trying to design a complex React app using only linear flow programming tools involves time consuming steps including a lot of trial and error to get the layout correct.

RLG does use refs internally but only to get information. Placement of elements is done using React properties in a top down flow.

### Why is the page flashing

This can occur when any element extends beyond the borders. Finding those elements changing their size and or location will fix the problem. Another choice is the add overflowX and overflowY hidden property to the appropriate Layout.

### How can I right align blocks

One way is to set a block [origin](interfaces/iorigin.html) of {x: 100, y: 0} with the the same x location in all the blocks you wish to have right aligned. A second way is to use the align property. A third way is to use the editor with the align right command. Then persist the Params.

First way:

```ts
data-layout={{
  name: 'block 1',
  origin: {x: 1, y: 0},
  location: { left: '90%', top: '10%', width: 200, height: '350u' }
}}

data-layout={{
  name: 'block 2',
  origin: {x: 1, top: 0},
  location: { left: '90%', top: '10%', width: 200, height: 350 }
}}

```

Second way:

```ts
data-layout={{
  name: 'block 1',
  location: { left: '90%', top: '10%', width: 200, height: '350u' }
}}

data-layout={{
  name: 'block 2',
  align: {
    key: 'block 1',
    offset: { x: 0, y: 10 },
    source: { x: 100, y: 100 },
    self: { x: 100, y: 0 }
  }
  location: { left: '90%', top: '10%', width: 200, height: '350u' }
}}
```

Block 2 will be linked to Block 1 and be 10 units below Block 1 and right aligned.

```ts
 ┌────────┐
 │ 1      │
 └────────o Offset: {X: 100, y: 100}
          │
    ┌─────┐ Offset: {x: 100, y: 0}
    │ 2   │
    └─────┘
```

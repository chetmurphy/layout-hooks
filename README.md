# Layout Hooks 0.1.0

*layout-hooks is exploring a layout system that uses React to compute the layouts directly.*

This project is a rewrite of react-layout-generators using React Hooks. It is not yet functional but a work in progress. You can use storybook to evaluate. The demo is currently for react-layout-generators to show where this project is going.

layout-hooks is an experimental framework for building, editing, and running sites that compute the layout dynamically using generators. It does not directly rely on css for the layout. Generators are used to compute and update the layout and since the generators are just javascript they can generate whatever you can imagine and translate into code. All positioning is based on the css absolute position. layout-hooks only needs to know the window size. From there all other positions are computed.

layout-hooks is general purpose, supports both html and svg*, and allows precise and continuous control for responsive layouts. Major features include template support, animation support including custom engines, persistance support, built-in property-controlled editor with position and size editing, fine grain responsiveness, top down design, drag and drop, and layers support.

As an example consider the drag and drop implementation in layout-hooks. It is high level built with layout-hooks blocks. Its runtime behavior follows the philosophy of React. A block specifies the position of a component in a layout and it is the block that is dragged. Its location and size are known. There is little need to query or manipulate html.

layout-hooks can do more than layout. It can be used to visually connect components that know their relationships. It can edit and animate blocks. An example of using HTML with svg connecting components is shown in the demo.

Like other components, layout-hooks can be used through-out an app or only for one component. It's only significant dependency is React 16 itself since layout-hooks is built on top of React.

\* For SVG to be more than an icon generator or canvas in React it needs to know position and size along with relationships. layout-hooks makes this easy. For example to use svg to generate a line connecting two react components requires access to the layout details of both components. It also needs to assume that it and the two components layout will not change. This can be done in React but small changes in layout can easily break the assumption. In layout-hooks you just link the two components.

## Examples

See [Live examples](https://neq1.io). Be sure to turn on the info-circle for details.

## Install

Clone or fork the project to evaluate. To run locally follow these steps: 1) cd to the \<directory\> where you installed layout-hooks, 2) run npm install or yarn, 3) run storybook. Jest tests are also included.

## Features

* Top down design of pages
* Edit and runtime support
* Persistence
* Template support
* Animation support
* HTML and SVG
* Fine grain responsiveness
* Layers with support for grouping, reordering, hiding, and animation
* Drag and drop

## Applications

* Responsive page layout
* Dashboards
* Organization charts
* Diagrams
* Games
* Animations
* Free form layout

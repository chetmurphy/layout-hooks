# React: A Missing Piece

React is almost a magical tool for building web pages. It lets you manipulate a hidden shadow dom that sets above the dom and for many purposes the programmer does not have to touch the underlying dom. This is particularly true for those applications that can rely on the document flow model that underlies HTML. However for applications that utilize dynamic or extensive graphics the shadow dom does not add direct support. Instead React provides an escape hatch to access the underlying dom called the ref. The question for this article is can we replace the ref?

Let's start by proposing a simple dynamic component. It consists of two visually connected components that can be animated separately yet still have the connection correctly displayed. For example, one element could be moving clockwise and the other one moving counter clockwise at a different velocity. Conceptually this sounds simple to do. We just need get the position and size of each component, update the component using a model engine, then render, and repeat at 60 frames per second.

Because of the need to animate the three components we will first need a manager component that will be responsible for rendering the frames. It will also need pass the engine update props to each of its children.


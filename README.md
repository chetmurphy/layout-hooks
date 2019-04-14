# Layout Hooks 0.1.0

*layout-hooks is exploring a layout system that uses React to compute the layouts directly using React hooks.*

This project is a rewrite of [react-layout-generators](https://github.com/chetmurphy/react-layout-generator) using React Hooks. It is not yet functional but a work in progress.

*Restarting --- ignore the following*

The first question I faced was how can I convert a complex class based component to use Hooks? Is it all or nothing? The approach outlined below looks promising. It should allow one class at a time to be converted and then integrated at least at the syntax level (there will likely be behavior difference that will need to be addressed).

I also expect that refactoring options will become clear by doing this conversion so it will likely not be a one for one conversion.

## Using Functional Component Class Hook Factories

At first this seemed impossible. Hooks need to be run inside of a React functional component and cannot be used in class (React or otherwise). However, what if we returned a class interface from our custom hook? Here is my first attempt that seems to work:

```ts
  export function Block(containersize: ISize, data: IDataLayout): IBlockDispatch {
    // use custom useBounds hook
    const bounds = useBounds(containersize)

    // convert data.location to an internal blockRect 
    const inputBlockRect = React.useMemo(() => {
      return convertExRect(data.location)
    }, [data])

    // create an interface for blockRect {left: '50%, ...}
    const [blockRect, setBlockRect] = React.useReducer(
      BlockRectReducer,
      inputBlockRect
    )

    // create a result data structure (the position and size of a rendered element)
    const [rect, setRect] = React.useState<IRect>(layout(blockRect, bounds))

    // now create a class using closures
    class Block implements IBlockDispatch {
      get rect() {
        return rect
      }

      set rect(r: IRect) {
        setRect(r)
      }
    }

    return new Block
  }
```

Now when you call Block(...) it will return a class instance bound to variables from React and custom hooks. The instance is independent of other instance and it can be used like other classes.

Note 1. The bound class cannot directly access any hooks. It can however access variables returned by hooks such as rect and setRect.

Note 2. Typescript will complain about returning an anonymous class unless the return value of the function is typed. Thus the IBlockDispatch interface.

To test, clone this repository, run 'yarn' and then run 'yarn test'. Currently only the Block class in src/components is in the process of being converted as a POC.

## Handling symbiotic relationships between variables using hooks

One of the interesting features of the Block class is that it allows users to set a block's position and size using two different data structures that can be mapped from one to the other.

The first structure, called a blockRect, is a [css](https://www.w3.org/TR/css-position-3/#size-and-position-details)
 like specification of the position and size of a block using combinations of the variables {left, top, right, bottom, width, hight}. For example {width:'10', height: 10 } will define a position of {x: 0, y: 0, width: 10, height: 10} and {bottom: 10, top: 10} will define a position of {x: 0, y:10, width: 100, height: 80} if the block's parent size is {width: 100, height: 100}.

The second structure, called a rect, is of the form {x, y, width, height}.

This allow a user to position the block using either structure. For example, dragging a block with a mouse could use the rect interface while positioning for a layout could use the blockRect.

To make this work the two structures need to be kept in sync. So how can we do this using hooks? One solution is to use the useEffect hook with internals guarded. This results in a definition of Block that looks like this:

```ts
export function Block(containersize: ISize, data: IDataLayout): IBlockDispatch {
  const bounds = useBounds(containersize)

  const inputBlockRect = React.useMemo(() => {
    return convertExRect(data.location)
  }, [data])

  const [blockRect, setBlockRect] = React.useReducer(
    BlockRectReducer,
    inputBlockRect
  )

  // Initial state must be consistent with data.location for correct updates
  const [rect, setRect] = React.useState<IRect>(layout(blockRect, bounds))

  const [changeBlockRect, setChangeBlockRect] = React.useState(0)
  const [changeRect, setChangeRect] = React.useState(0)

  // Update if needed
  React.useEffect(() => {
    if (changeBlockRect) {
      const r = layout(blockRect, bounds)
      if (!deepEqual(r, rect)) {
        setRect(r)
      }
      setChangeBlockRect(0)
    }

    if (changeRect) {
      const br = inverseLayout(rect, blockRect, bounds)
      if (!deepEqual(br, blockRect)) {
        setBlockRect({ type: 'setAll', value: 0, all: br })
      }
      setChangeRect(0)
    }
  }, [bounds, rect, blockRect])
```

To activate the useEffect hook we define the setter in the bound class like this:

```ts
 set value(v: IBlockRect) {
      setBlockRect({ type: 'setAll', value: 0, all: blockRect })
      setChangeBlockRect(1)
    }
```

Even tests setting both structures like the following work (I have not done performance testing yet):

```ts
    act(() => {block.result.current.rect = {x: 1, y: 1, width: 100, height: 100}})
    act(() => {block.result.current.blockRect.left = 10})
    act(() => {block.result.current.blockRect.left = 20})
    act(() => {block.result.current.rect = {x: 5, y: 1, width: 100, height: 100}})

    // Last one wins
    expect(block.result.current.rect.x).toEqual(5)
    expect(block.result.current.blockRect.left).toEqual(5)
```

Be aware that a setter returned from useState or useReducer are async and do not update immediately. This approach also has the advantage that updates to either structure are batched in the useEffect hook.

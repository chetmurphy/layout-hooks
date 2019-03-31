# How to Convert React Class based Components to Hooks using Closures

We all done it to one degree on other. We have multiple components that has evolved over time and they have got complicated. You started with a simple component that just rendered your component. Now you have added event handlers, utilities methods, and what ever. It's now an everything including the kitten sink thrown in and its not obvious how to make it more manageable and maintainable. Could React's new Hooks help and if so where do I start?

Hooks look promising because you can group pieces together, but you don't want to start with a complete rewrite. Ideality you would like to take an incremental approach. That's where closure can come in handy.

Let's start with the event handlers. The first step is collect all the event handlers in your component and place them in a separate file then convert each to a function, but then you will be left with unresolved calls to your class members. So to solve that wrap your event handlers with a function that provides the missing methods. Then the event handlers are bound to their parent variables and functions. 

```ts
function handleEvents(props, state, setState) {
  function onClick(event: React.MouseEvent) {
    setState({...state, state.count + 1})
  }

  return {
    onClick,
    ...
  }
}
```

At this point you just have a normal function. Let's add some window events as a hook.

```ts
function handleEvents(props, state, setState) {

  function useWindowSize() {
    const [size, setSize] = React.useState({
      width: window.innerWidth,
      height: window.innerHeight
    })

    React.useEffect(() => {
      const handleResize = () => {
        setSize({ width: window.innerWidth, height: window.innerHeight })
      }

      window.addEventListener('resize', handleResize)
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }, [])

    return size
  }

  function onClick(event: React.MouseEvent) {
    setState({...state, state.count + 1})
  }

  return {
    onClick,
    useWindowSize
    ...
  }
}
```
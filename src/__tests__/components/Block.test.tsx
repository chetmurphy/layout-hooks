// import * as React from 'react'
import { renderHook, cleanup, act } from 'react-hooks-testing-library'

import {dynamicGenerator} from '../../generators/dynamicGenerator'
import {BlockFactory} from '../../components/Block'
// import {useBounds} from '../../components/useBounds'


const g = dynamicGenerator('dynamicGenerator')
g.containersize({width: 100, height: 100})
g.viewport({width: 1000, height: 500})

// function useWindowSize() {
//   const [size, setSize] = React.useState({
//     width: window.innerWidth,
//     height: window.innerHeight
//   })

//   React.useEffect(() => {
//     const handleResize = () => {
//       setSize({ width: window.innerWidth, height: window.innerHeight })
//     }

//     window.addEventListener('resize', handleResize)
//     return () => {
//       window.removeEventListener('resize', handleResize)
//     }
//   }, [])

//   return size
// }

describe('custom hook tests', () => {
  afterEach(cleanup)

  // test('should return window.innerHeight', () => {
  //   const size = renderHook(() => useWindowSize())
    
  //   expect(size.result.current.height).toEqual(768)
  // })

  // test('should return bounds', () => {
  //   const bounds = renderHook(() => useBounds({width: 0, height: 0} ))
    
  //   expect(bounds.result.current).toBeTruthy()
  //   expect(bounds.result.current.container).toBeTruthy()
  //   expect(bounds.result.current.viewport).toBeTruthy()
  // })


  test('should create Block', () => {
    
    const block = renderHook(() => BlockFactory({name: 't', location: {left: 0, top: 0, width: 100, height: 100}}, g))

    expect(block.result.current.current).toBeTruthy()
    expect(block.result.current.current.rect).toEqual({x: 0, y: 0, width: 100, height: 100})
  })

  test('Block #1', () => {
    
    const block = renderHook(() => BlockFactory({name: 't', location: {left: 0, top: 0, width: 100, height: 100}}, g))

    expect(block.result.current.current).toBeTruthy()
   
    expect(block.result.current.current.rect).toEqual({x: 0, y: 0, width: 100, height: 100})
  })

  test('Block #2', () => {
    
    const {result} = renderHook(() => 
    BlockFactory({name: 't', location: {left: 0, top: 0, width: 100, height: 100}}, g))

    expect(result.current).toBeTruthy()

    act(() => {result.current.current.rect = {x: 1, y: 1, width: 100, height: 100}})

    // rerender({location: {left:1, top: 1, width: 100, height: 100}})
   
    // expect(block.result.current.rect).toEqual({x: 1, y: 1, width: 100, height: 100})
    expect(result.current.current.rect.x).toEqual(1)
  })

  test('Block #3', () => {
    
    const block = renderHook(() => BlockFactory({name: 't', location: {left: 0, top: 0, width: 100, height: 100}}, g))

    expect(block.result.current).toBeTruthy()

    act(() => {block.result.current.current.rect = {x: 10, y: 1, width: 100, height: 100}})
   
    expect(block.result.current.current.rect.x).toEqual(10)
  })

  test('Block #4', () => {
    
    const block = renderHook(() => BlockFactory({name: 't', location: {left: 0, top: 0, width: 100, height:  100}}, g))

    expect(block.result.current).toBeTruthy()

    act(() => {block.result.current.current.rect = {x: 1, y: 1, width: 100, height: 100}})

    expect(block.result.current.current.rect.width).toEqual(100)
  })

  test('Block multiple blocks', () => {
    
    const block = renderHook(() => BlockFactory({name: 't', location: {left: 0, top: 0, width: 100, height: 100}}, g))

    expect(block.result.current).toBeTruthy()

    act(() => {block.result.current.current.rect = {x: 1, y: 1, width: 100, height: 100}})
    act(() => {block.result.current.current.rect = {x: 5, y: 1, width: 100, height: 100}})
   
    // expect(block.result.current.rect).toEqual({x: 1, y: 1, width: 100, height: 100})
    expect(block.result.current.current.rect.x).toEqual(5)

    const block2 = renderHook(() => BlockFactory({name: 't', location: {left: 0, top: 0, width: 100, height: 100}}, g))

    expect(block2.result.current).toBeTruthy()

    act(() => {block2.result.current.current.rect = {x: 1, y: 1, width: 100, height: 100}})
  })

  test('Block multiple instances', () => {
    
    const block = renderHook(() => BlockFactory({name: 't', location: {left: 0, top: 0, width: 100, height: 100}}, g))

    expect(block.result.current).toBeTruthy()

    act(() => {block.result.current.current.rect = {x: 1, y: 1, width: 100, height: 100}})
    act(() => {block.result.current.current.rect = {x: 5, y: 1, width: 100, height: 100}})
   
    // expect(block.result.current.rect).toEqual({x: 1, y: 1, width: 100, height: 100})
    expect(block.result.current.current.rect.x).toEqual(5)

    const block2 = renderHook(() => BlockFactory({name: 't2', location: {left: 0, top: 0, width: 100, height: 100}}, g))

    expect(block2.result.current).toBeTruthy()

    act(() => {block2.result.current.current.rect = {x: 1, y: 1, width: 100, height: 100}})

    act(() => {block.result.current.current.rect = {x: 6, y: 1, width: 100, height: 100}})

    expect(block.result.current.current.rect.x).toEqual(6)
    expect(block2.result.current.current.rect.x).toEqual(1)

  })
})
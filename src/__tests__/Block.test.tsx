import * as React from 'react'
import { renderHook, cleanup, act } from 'react-hooks-testing-library'

// import {IGenerator, Generator} from '../generators/Generator'
import {Block} from '../components/Block'
import {useBounds} from '../components/useBounds'
// import { IDataLayout } from '../components/blockTypes';
// import { Params } from '../components/Params';
// import { Blocks } from '../components/Blocks';
// import {Blocks} from '../components/Blocks'
// import {Params} from '../components/Params'

declare global {
  interface Window { Date: any; }
}
 
// require('jsdom-global')();
window.Date = Date;

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

// function init(g: IGenerator): Blocks {
      
//   const blocks = g.blocks();
//   return blocks;
// }
// const params = new Params({name: 'xxx'});
// const g = new Generator('xxx', init, params)

describe('custom hook tests', () => {
  afterEach(cleanup)

  test('should return window.innerHeight', () => {
    const size = renderHook(() => useWindowSize())
    
    expect(size.result.current.height).toEqual(768)
  })

  test('should return bounds', () => {
    const bounds = renderHook(() => useBounds({width: 0, height: 0} ))
    
    expect(bounds.result.current).toBeTruthy()
    expect(bounds.result.current.container).toBeTruthy()
    expect(bounds.result.current.viewport).toBeTruthy()
  })


  test('should create Block', () => {
    
    const block = renderHook(() => Block({width: 100, height: 100}, {location: {left: 0, top: 0, width: 100, height: 100}}))

    expect(block.result.current).toBeTruthy()
    expect(block.result.current.rect).toEqual({x: 0, y: 0, width: 100, height: 100})
  })

  test('Block #1', () => {
    
    const block = renderHook(() => Block({width: 100, height: 100}, {location: {left: 0, top: 0, width: 100, height: 100}}))

    expect(block.result.current).toBeTruthy()

    act(() => {block.result.current.blockRect.left = 10})
   
    expect(block.result.current.rect).toEqual({x: 10, y: 0, width: 100, height: 100})
    expect(block.result.current.blockRect.left).toEqual(10)
  })

  test('Block #2', () => {
    
    const block = renderHook(() => Block({width: 100, height: 100}, {location: {left: 0, top: 0, width: 100, height: 100}}))

    expect(block.result.current).toBeTruthy()

    act(() => {block.result.current.rect = {x: 1, y: 1, width: 100, height: 100}})
   
    // expect(block.result.current.rect).toEqual({x: 1, y: 1, width: 100, height: 100})
    expect(block.result.current.rect.x).toEqual(1)
    expect(block.result.current.blockRect.left).toEqual(1)
  })

  test('Block #3', () => {
    
    const block = renderHook(() => Block({width: 100, height: 100}, {location: {left: 0, top: 0, width: 100, height: 100}}))

    expect(block.result.current).toBeTruthy()

    act(() => {block.result.current.rect = {x: 1, y: 1, width: 100, height: 100}})
    act(() => {block.result.current.blockRect.left = 10})
   
    // expect(block.result.current.rect).toEqual({x: 1, y: 1, width: 100, height: 100})
    expect(block.result.current.rect.x).toEqual(10)
    expect(block.result.current.blockRect.left).toEqual(10)
  })

  test('Block #4', () => {
    
    const block = renderHook(() => Block({width: 100, height: 100}, {location: {left: 0, top: 0, width: 100, height: 100}}))

    expect(block.result.current).toBeTruthy()

    act(() => {block.result.current.rect = {x: 1, y: 1, width: 100, height: 100}})
    act(() => {block.result.current.blockRect.left = 10})
    act(() => {block.result.current.blockRect.left = 20})
    act(() => {block.result.current.rect = {x: 5, y: 1, width: 100, height: 100}})
   
    // expect(block.result.current.rect).toEqual({x: 1, y: 1, width: 100, height: 100})
    expect(block.result.current.rect.x).toEqual(5)
    expect(block.result.current.blockRect.left).toEqual(5)
  })

  test('Block multiple blocks', () => {
    
    const block = renderHook(() => Block({width: 100, height: 100}, {location: {left: 0, top: 0, width: 100, height: 100}}))

    expect(block.result.current).toBeTruthy()

    act(() => {block.result.current.rect = {x: 1, y: 1, width: 100, height: 100}})
    act(() => {block.result.current.blockRect.left = 10})
    act(() => {block.result.current.blockRect.left = 20})
    act(() => {block.result.current.rect = {x: 5, y: 1, width: 100, height: 100}})
   
    // expect(block.result.current.rect).toEqual({x: 1, y: 1, width: 100, height: 100})
    expect(block.result.current.rect.x).toEqual(5)
    expect(block.result.current.blockRect.left).toEqual(5)

    const block2 = renderHook(() => Block({width: 100, height: 100}, {location: {left: 0, top: 0, width: 100, height: 100}}))

    expect(block2.result.current).toBeTruthy()

    act(() => {block2.result.current.rect = {x: 1, y: 1, width: 100, height: 100}})

    act(() => {block2.result.current.blockRect.left = 1})
  })

  test('Block multiple instances', () => {
    
    const block = renderHook(() => Block({width: 100, height: 100}, {location: {left: 0, top: 0, width: 100, height: 100}}))

    expect(block.result.current).toBeTruthy()

    act(() => {block.result.current.rect = {x: 1, y: 1, width: 100, height: 100}})
    act(() => {block.result.current.blockRect.left = 10})
    act(() => {block.result.current.blockRect.left = 20})
    act(() => {block.result.current.rect = {x: 5, y: 1, width: 100, height: 100}})
   
    // expect(block.result.current.rect).toEqual({x: 1, y: 1, width: 100, height: 100})
    expect(block.result.current.rect.x).toEqual(5)
    expect(block.result.current.blockRect.left).toEqual(5)

    const block2 = renderHook(() => Block({width: 100, height: 100}, {location: {left: 0, top: 0, width: 100, height: 100}}))

    expect(block2.result.current).toBeTruthy()

    act(() => {block2.result.current.rect = {x: 1, y: 1, width: 100, height: 100}})

    act(() => {block2.result.current.blockRect.left = 1})

    act(() => {block.result.current.rect = {x: 5, y: 1, width: 100, height: 100}})
  })
})
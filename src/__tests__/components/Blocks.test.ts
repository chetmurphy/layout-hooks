import { BlockFactory } from '../../components/Block'
import { Blocks } from '../../components/Blocks'
import { Params } from '../../components/Params'
import { Generator, ICreate, IGenerator } from '../../generators/Generator'
import { renderHook } from 'react-hooks-testing-library';

const params = new Params({
  name: 'layoutTest',
  initialValues: []
})

function init(g: IGenerator) {
  return g.blocks()
}

function create(args: ICreate) {
  let block

  const blocks = args.g.blocks()

  if (blocks) {
    block = blocks.set(args.dataLayout, g)
  }

  return block
}

const g: IGenerator = new Generator('test', init, params, create)

it('Layouts index returns the correct key value #1', () => {
  const p = {
    name: 't',
    location: { left: 0, top: 10, width: 100, height: 10 }
  }
  const {result} = renderHook(() => BlockFactory(p, g)) 
  const l = new Blocks([['t', result.current]])
  expect(l.find(0)).toBe(result.current)
})

it('Layouts index returns the correct key value #2', () => {
  const p = {
    name: 't',
    location: { left: 0, top: 10, width: 100, height: 10 }
  }

  const p2 = {
    name: 't2',
    location: { left: 0, top: 10, width: 100, height: 10 }
  }

  const {result} = renderHook(() => new Blocks([])) 

  renderHook(() => result.current.set(p, g)) 
  const result3 = renderHook(() => result.current.set(p2, g)) 

  expect(result.current.find(1)).toBe(result3.result.current)
})

it('Layouts index returns the correct key value #3', () => {
  const p = {
    name: 't',
    location: { left: 0, top: 10, width: 100, height: 10 }
  }

  const p2 = {
    name: 't2',
    location: { left: 0, top: 10, width: 100, height: 10 }
  }

  const {result} = renderHook(() => new Blocks([])) 

  renderHook(() => result.current.set(p, g)) 
  const result3 = renderHook(() => result.current.set(p2, g)) 

  expect(result.current.get('t2')).toBe(result3.result.current)
})



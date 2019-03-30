import { Block, BlockFactory } from '../../components/Block'
import { Blocks } from '../../components/Blocks'
import { Params } from '../../components/Params'
import { Generator, ICreate, IGenerator } from '../../generators/Generator'

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
  const t: React.MutableRefObject<Block> = BlockFactory(p, g)
  const l = new Blocks([['a', t]])
  expect(l.find(0)).toBe(t)
})

it('Layouts index returns the correct key value #2', () => {
  const p = {
    name: 't',
    location: { left: 0, top: 10, width: 100, height: 10 }
  }

  const l = new Blocks([])
  l.set(p, g)
  const t2 = l.set(p, g)

  expect(l.find(1)).toBe(t2)
})

it('Layouts index returns the correct key value #3', () => {
  const p = {
    name: 't',
    location: { left: 0, top: 10, width: 100, height: 10 }
  }

  const l = new Blocks([])

  l.set(p, g)
  const t2: React.MutableRefObject<Block> = l.set(p, g)

  expect(l.find(1)).toBe(t2)
})

it('Layouts index returns the correct key value #4', () => {
  const p = {
    name: 't',
    location: { left: 0, top: 10, width: 100, height: 10 }
  }

  const l = new Blocks([])
  l.set(p, g)
  const t2 = l.set(p, g)
  l.set(p, g)

  expect(l.find(1)).toBe(t2)
})

it('Layouts index updates the block #1', () => {
  const p = {
    name: 't',
    location: { left: 0, top: 10, width: 100, height: 10 }
  }

  const l = new Blocks([])
  l.set(p, g)

  const p2 = {
    name: 't',
    location: { left: 110, top: 110, width: 100, height: 10 }
  }

  l.set(p2, g)

  const updatedBlock = l.get('t1')
  const blockRect = updatedBlock ? updatedBlock.current.blockRect : undefined

  expect(blockRect && blockRect.left).toBe(110)
})

it('Layouts layers returns the valid layers #1', () => {
  const p1 = {
    name: 't1',
    location: { left: 0, top: 10, width: 100, height: 10 }
  }
  const p2 = {
    name: 't2',
    location: { left: 0, top: 10, width: 100, height: 10 }
  }
  const p3 = {
    name: 't3',
    location: { left: 0, top: 10, width: 100, height: 10 }
  }

  const l = new Blocks([])
  l.set(p1, g)
  l.set(p2, g)
  l.set(p3, g)

  const blocks = l.layers(0)
  expect(blocks && blocks.length).toBe(3)
})

it('Layouts layers returns the valid layers #2', () => {
  const p1 = {
    name: 't1',
    location: { left: 0, top: 10, width: 100, height: 10 },
    layer: 1
  }
  const p2 = {
    name: 't2',
    location: { left: 0, top: 10, width: 100, height: 10 },
    layer: 1
  }
  const p3 = {
    name: 't3',
    location: { left: 0, top: 10, width: 100, height: 10 },
    layer: 1
  }

  const l = new Blocks([])
  l.set(p1, g)
  l.set(p2, g)
  l.set(p3, g)

  const blocks1 = l.layers(0)
  expect(blocks1 && blocks1.length).toBe(0)

  const blocks2 = l.layers(1)
  expect(blocks2 && blocks2.length).toBe(3)

  const blocks3 = l.layers(2)
  expect(blocks3 && blocks3.length).toBe(0)
})

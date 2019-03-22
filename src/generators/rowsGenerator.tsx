import { Block } from '../components/Block';
import { Blocks } from '../components/Blocks';
import { Params, ParamValue } from '../components/Params';
import { Generator, ICreate, IGenerator, IGeneratorFunctionArgs } from '../generators/Generator';
import { IAttrRect, ISize, rectSize } from '../types';

export function rowsGenerator(args: IGeneratorFunctionArgs) {

  const values: Array<[string, ParamValue]> = [
    ['align', 0], // -1: top, 0: center, 1: bottom
    ['spread', 0], // 0: keep height, 1: distributes over height
    ['itemSize', { width: 24, height: 24 }],
    ['itemMargin', { top: 2, bottom: 2, right: 0, left: 0 }]
  ]

  const _params = args.exParams ? args.exParams.restore(name, values) : new Params({
    name: 'rowsGenerator', initialValues: values
  });

  function init(g: IGenerator): Blocks {
    const params = g.params();
    const blocks = g.blocks();

    if (params.changed() || g.containerChanged()) {
      distributeRows(blocks, g);
    }
    return blocks;
  }

  /**
   * Distribute rows
   */
  function distributeRows(blocks: Blocks, g: IGenerator) {

    const containersize = g.containersize()
    // const size = params.get('itemSize') as ISize;
    const margin = g.params().get('itemMargin') as IAttrRect;

    // update
    let currentHeight = margin.top;
    blocks.map.forEach((block) => {
      const rect = block.rect;
      const leftOffset = (containersize.width / 2 - (rect.width + margin.left + margin.right) / 2);
      block.update({ x: leftOffset, y: currentHeight, ...rectSize(rect)});
      currentHeight += rect.height + margin.top + margin.bottom;
    });
  }

  function create(args: ICreate): Block {

    const params = args.g.params();
    const containersize = args.g.containersize()
    const size = params.get('itemSize') as ISize;

    const blocks = args.g.blocks();

    let p = args.dataLayout;

    if (p && !p.location) {
      p.location = { left: 0, top: 0, ...size }
    }

    const margin = params.get('itemMargin') as IAttrRect;
    let topOffset = margin.top;
    if (blocks.map.size) {
      const block = blocks.find(blocks.map.size - 1);
      const r = block.rect;
      topOffset = r.y + r.height + margin.bottom + margin.top;
    }
    const leftOffset = (containersize.width / 2) - (size.width + margin.left + margin.right) / 2;
    p.location = { left: leftOffset, top: topOffset, ...size }

    return blocks.set(args.name, p, args.g);
  }

  return new Generator(name, init, _params, create, args.editHelper);
}
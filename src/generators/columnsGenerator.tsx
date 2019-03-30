import { Block } from '../components/Block';
import { Blocks } from '../components/Blocks';
import { Params, ParamValue } from '../components/Params';
import { Generator, ICreate, IGenerator } from '../generators/Generator';
import { ISize } from '../types';

export function columnsGenerator(name: string, exParams?: Params) {

  const defaultItemWidth = 100;

  const values: Array<[string, ParamValue]> = [
    ['align', 0], // -1: left, 0: center, 1: right
    ['spread', 0], // 0: keep width, 1: fills width
    ['itemSize', { width: defaultItemWidth, height: 0 }]
  ]

  const _params = exParams ? exParams.restore(name, values) : new Params({
    name: 'columnsGenerator', initialValues: values
  });

  function init(g: IGenerator): Blocks {
    return new Blocks([]);
  }
 
  /**
   * Align items in center
   */
  function centerColumns(blocks: Blocks, g: IGenerator) {

    const containersize = g.containersize()
    // const margin = params.get('itemMargin') as IAttrRect;

    // compute width of all columns
    let totalWidth = 0
    blocks.map.forEach((block) => {
      totalWidth += block.current.rect.width;
    });

    // compute beginning offset
    const offset0 = (containersize.width / 2 - totalWidth / 2);

    // update
    let currentWidth = 0;
    blocks.map.forEach((block) => {
      const rect = block.current.rect;
      block.current.rect = { x: offset0 + currentWidth, y: 0, width: rect.width, height: containersize.height };
      currentWidth += rect.width;
    });
  }

  function create(args: ICreate): React.MutableRefObject<Block> {
    const params = args.g.params();
    const containersize = args.g.containersize()
    const itemSize = params.get('itemSize') as ISize;

    const blocks = args.g.blocks();

    let p = args.dataLayout;

    if (!p) {
      p = {
        name: args.name,
        location: { left: 0, top: 0,  width: itemSize.width, height: containersize.height }
      }
    }

    const l = blocks.set(p, args.g);

    const align = params.get('align') as number;


    // if ((args.index + 1) === args.count) {

    if (align === 0) {
      centerColumns(blocks, args.g);
    }
    // }

    return l;
  }

  return new Generator(name, init, _params, create);
}
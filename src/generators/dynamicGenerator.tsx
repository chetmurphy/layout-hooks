import { Block } from '../components/Block';
import { Blocks } from '../components/Blocks';
import { Params, ParamValue } from '../components/Params';
import { Generator, ICreate, IGenerator } from './Generator';

export function dynamicGenerator(
  name: string,
  exParams?: Params
): IGenerator {
  const values: Array<[string, ParamValue]> = [
  ];

  const _params = exParams ? exParams.restore(name, values) : new Params({
    name: 'dynamicGenerator', initialValues: values
  });

  function init(g: IGenerator): Blocks {
    const blocks = g.blocks();

    return blocks;
  }

  function create(args: ICreate): React.MutableRefObject<Block> {
    return args.g.blocks().set(args.dataLayout, args.g);
  }

  return new Generator(name, init, _params, create);
}

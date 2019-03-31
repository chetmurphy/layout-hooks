import { 
  Block,
  Blocks,
  Generator,
  ICreate,
  IDataLayout, 
  IGenerator, 
  IGeneratorFunctionArgs,
  IGenericProps, 
  IPoint,
  ISize, 
  Params,
  ParamValue,
} from '../importRLG'

export default function solitaireGenerator(gArgs: IGeneratorFunctionArgs) {

  const values: Array<[string, ParamValue]> = [
    ['gameMargin', 20],
    ['cardSizeRatio', 1.3],
    ['cardSpacingRatio', { x: .18, y: .17 }],
    ['cardMarginRatio', { x: .18, y: .1 }]
  ];

  const _params = gArgs.exParams ? gArgs.exParams.restore(name, values) : new Params({ name, initialValues: values });

  function init(g: IGenerator): Blocks {

    const params = g.params();

    const containersize = g.containersize()
    const gameMargin = params.get('gameMargin') as number;
    const cardSizeRatio = params.get('cardSizeRatio') as number;
    const cardSpacingRatio = params.get('cardSpacingRatio') as IPoint;

    const columns = containersize.width < 800 ? 7 : 8;
    const maxCards = 13;

    // 1) compute interval
    const interval = ((containersize.width - 2 * gameMargin) / columns)

    // 1) compute cardWidthSize
    const cardWidth = interval - gameMargin;
    const cardWidthSize = {
      width: cardWidth,
      height: cardWidth * cardSizeRatio
    }

    // 2) compute cardHeightSize
    const cardHeight = (containersize.height - 2 * gameMargin) / (2 + maxCards * cardSpacingRatio.y)
    const cardHeightSize = {
      width: cardHeight / cardSizeRatio,
      height: cardHeight
    }

    // 3) set cardSize to minimum of cardWidthSize and cardHeightSize
    const cardSize = cardWidthSize.width < cardHeightSize.width ? cardWidthSize : cardHeightSize;

    // Save cardSize for functions use
    params.set('cardSize', cardSize);
    params.set('computedCardSpacing', { x: cardSpacingRatio.x * cardSize.width, y: cardSpacingRatio.y * cardSize.height })

    const blocks = g.blocks() // new Blocks([]);

    // Make layout responsive
    // Adjust number of columns if smaller containersize
    const foundationStart = containersize.width < 800 ? 1 : 0;
    const tableauStart = containersize.width < 800 ? 1 : 0

    // Stock
    const stock: IDataLayout = {
      location: { left: gameMargin + (interval - cardSize.width) / 2, top: gameMargin, ...cardSize},
      positionChildren: positionStockChildren
    }

    blocks.set('stock', stock, g);

    // Waste
    const waste: IDataLayout = {
      location: { 
        left: stock.location.left as number + interval, 
        top: gameMargin, 
        width: cardSize.width + 3 * cardSize.width * cardSpacingRatio.x, 
        height: cardSize.height 
      },
      positionChildren: positionWasteChildren
    }

    blocks.set('waste', waste, g);

    // Foundation
    for (let i = 4 - foundationStart; i < 8 - foundationStart; i++) {
      const offset = i * interval;
      const p: IDataLayout = {
        location: { left: stock.location.left as number + offset, top: gameMargin, ...cardSize},
        positionChildren: positionFoundationChildren
      }

      blocks.set(`foundation${i - 3 + foundationStart}`, p, g);
    }

    // Tableau
    for (let i = 1 - tableauStart; i < 8 - tableauStart; i++) {
      const offset = i * interval;
      const p: IDataLayout = {
        location: { 
          left: stock.location.left as number + offset, 
          top: cardSize.height + 2 * gameMargin,
          width: cardSize.width, 
          height: cardSize.height + maxCards * cardSpacingRatio.y * cardSize.height 
        },
        positionChildren: positionTableauChildren
      }

      blocks.set(`tableau${i + tableauStart}`, p, g);
    }

    // Return new instance of Layouts
    return blocks;
  }

  function create(cArgs: ICreate): Block {

    const block = cArgs.g.blocks().set(cArgs.name, cArgs.dataLayout, cArgs.g);

    return block;
  }

  function positionStockChildren(block: Block, g: Generator, index: number, props: IGenericProps) {
    // Return a Layout relative to block starting at position at (0, 0)

    const cardSize = g.params().get('cardSize') as ISize;

    // These children get placed on top of each other
    const child: IDataLayout = {
      location: { left: 0, top: 0, ...cardSize}
    };

    if (props && props.id) {
      return g.blocks().set(props.id, child, g)
    }

    // This block is temp and will not be stored in blocks
    return new Block('temp', child, g);
  }

  function positionFoundationChildren(block: Block, g: IGenerator, index: number, props: IGenericProps) {
    // Return a Layout relative to block starting at position at (0, 0)

    const cardSize = g.params().get('cardSize') as ISize;

    // These children get placed on top of each other

    const child: IDataLayout = {
      location: { left: 0, top: 0, ... cardSize}
    };

    if (props && props['data-dnd'] && props.id) {
      return g.blocks().set(props.id, child, g)
    }

    // This block is temp and will not be stored in blocks
    return new Block('temp', child, g);
  }

  function positionTableauChildren(block: Block, g: IGenerator, index: number, props: IGenericProps) {
    // Return a Layout relative to block starting at position at (0, 0)

    const cardSize = g.params().get('cardSize') as ISize;
    const computedCardSpacing = g.params().get('computedCardSpacing') as IPoint;

    // These children get placed vertically based on index
    const child: IDataLayout = {
      location: { left: 0, top: index * computedCardSpacing.y , ...cardSize}
    };

    if (props && props.id) {
      return g.blocks().set(props.id, child, g)
    }

    // This block is temp and will not be stored in blocks
    return new Block('temp', child, g);
  }

  function positionWasteChildren(block: Block, g: Generator, index: number, props: IGenericProps) {
    // Return a Layout relative to block starting at position at (0, 0)

    const cardSize = g.params().get('cardSize') as ISize;
    const computedCardSpacing = g.params().get('computedCardSpacing') as IPoint;

    // These children get placed horizontally based on index
    const child: IDataLayout = {
      location: { left: index * computedCardSpacing.x, top: 0, width: cardSize.width, height: cardSize.height}
    };

    if (props && props.id) {
      return g.blocks().set(props.id, child, g)
    }

    // This block is temp and will not be stored in blocks
    return new Block('temp', child, g);
  }

  return new Generator(name, init, _params, create, gArgs.editHelper);
}



import {
  Block,
  Blocks,
  Generator,
  IDataLayout,
  IExRect,
  IGenerator,
  ISize,
  Params,
  PositionRef,
  updateParamHeight,
  updateParamWidth
} from '../importRLG'


export default function RLGDesktop(name: string, parent?: IGenerator) {

  const _titleHeight = 50;
  const _leftSideWidth = 200;
  const _rightSideWidth = 0;
  const _headerHeight = 24;
  const _footerHeight = 24;

  const _params = new Params({
    name: 'dashboard', initialValues: [
      ['viewport', { width: 0, height: 0 }],
      ['titleHeight', _titleHeight],
      ['leftSideWidth', _leftSideWidth],
      ['rightSideWidth', _rightSideWidth],
      ['headerHeight', _headerHeight],
      ['footerHeight', _footerHeight]
    ]
  })

  function init(g: IGenerator) {
    const params = g.params();
    const viewport = params.get('viewport') as ISize;
    const fullWidthHeaders = params.get('fullWidthHeaders') as number;
    const titleHeight = params.get('titleHeight') as number;
    let leftSideWidth = params.get('leftSideWidth') as number;
    let rightSideWidth = params.get('rightSideWidth') as number;
    const headerHeight = params.get('headerHeight') as number;
    const footerHeight = params.get('footerHeight') as number;

    if (viewport.width < 600) {
      leftSideWidth = 0;
      rightSideWidth = 0;
    }

    const title = (): Block => {
      let location: IExRect;
      location = {
        left: 0,
        top: 0,
        width: viewport.width,
        height: titleHeight
      }

      const p: IDataLayout = {
        editor: {
          edits: [
            { ref: PositionRef.bottom, variable: 'titleHeight', updateParam: updateParamHeight }
          ]
        },
        location
      }

      return new Block('title', p, g);
    };

    const leftSide = (): Block => {
      let location: IExRect;
      if (fullWidthHeaders) {
        location = {
          left: 0,
          top: titleHeight + headerHeight,
          width: leftSideWidth,
          height: viewport.height - titleHeight - footerHeight - headerHeight
        }
      } else {
        location = {
          left: 0,
          top: 0, 
          width: leftSideWidth,
          height: viewport.height - titleHeight
        }
      }

      const p: IDataLayout = {
        editor: {
          edits: [
            { ref: PositionRef.right, variable: 'leftSideWidth', updateParam: updateParamWidth }
          ]
        }
        ,
        location
      }

      return new Block('leftSide', p, g);
    };

    const rightSide = (): Block => {
      let location: IExRect;

      if (fullWidthHeaders) {
        location = {
          left: viewport.width - rightSideWidth,
          top: titleHeight + headerHeight,
          width: rightSideWidth,
          height: viewport.height - titleHeight - footerHeight - headerHeight
        }
      } else {
        location = {
          left: viewport.width - rightSideWidth,
          top: 0,
          width: rightSideWidth,
          height: viewport.height - titleHeight
        }
      }

      const p = {
        edit: [
          { ref: PositionRef.left, variable: 'rightSideWidth', updateParam: updateParamWidth }
        ],
        location
      }

      return new Block('rightSide', p, g);
    };

    const header = (): Block => {
      let location: IExRect

      if (fullWidthHeaders) {
        location = {
          left: 0,
          top: titleHeight,
          width: viewport.width,
          height: headerHeight
        }
      } else {
        location = {
          left: leftSideWidth,
          top: titleHeight,
          width: viewport.width - leftSideWidth - rightSideWidth,
          height: headerHeight
        }
      }

      const p = {
        edit: [
          { ref: PositionRef.bottom, variable: 'headerHeight', updateParam: updateParamHeight }
        ],
        location
      }

      return new Block('header', p, g);
    };

    const content = (): Block => {
      let location: IExRect;
      if (fullWidthHeaders) {
        location = {
          left: leftSideWidth,
          top: titleHeight + headerHeight,
          width: viewport.width - rightSideWidth - leftSideWidth,
          height: viewport.height - titleHeight - headerHeight - footerHeight
        }
      } else {
        location = {
          left: leftSideWidth,
          top: headerHeight,
          width: viewport.width - rightSideWidth - leftSideWidth,
          height: viewport.height - titleHeight - footerHeight - headerHeight
        }
      }
      const p = {
        location
      }

      return new Block('content', p, g);
    };

    const footer = (): Block => {
      let location: IExRect
      if (fullWidthHeaders) {
        location = {
          left: 0,
          top: viewport.height - footerHeight,
          width: viewport.width,
          height: footerHeight
        }
      } else {
        location = {
          left: leftSideWidth,
          top: viewport.height - footerHeight,
          width: viewport.width - leftSideWidth - rightSideWidth,
          height: footerHeight
        }
      }

      const p = {
        edit: [
          { ref: PositionRef.top, variable: 'footerHeight', updateParam: updateParamHeight }
        ],
        location
      }

      return new Block('footer', p, g);
    };

    // Return new instance of Layouts
    return new Blocks([
      [title.name, title()],
      [leftSide.name, leftSide()],
      [rightSide.name, rightSide()],
      [header.name, header()],
      [content.name, content()],
      [footer.name, footer()]
    ])
  }

  return new Generator(name, init, _params);
}

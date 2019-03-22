import { Block } from '../components/Block'
import { IDataLayout, IExRect } from '../components/blockTypes'
import { Params, ParamValue } from '../components/Params'
import { updateParamHeight, updateParamWidth } from '../editors/update'
import { Generator, ICreate, IGenerator } from '../generators/Generator'
import { PositionRef } from '../types'

export function desktopGenerator(name: string, exParams?: Params) {
  const _fullWidthHeaders = 0
  const _titleHeight = 50
  const _leftSideWidth = 200
  const _rightSideWidth = 0
  const _headerHeight = 24
  const _footerHeight = 24

  const values: Array<[string, ParamValue]> = [
    ['fullWidthHeaders', _fullWidthHeaders],
    ['titleHeight', _titleHeight],
    ['leftSideWidth', _leftSideWidth],
    ['rightSideWidth', _rightSideWidth],
    ['headerHeight', _headerHeight],
    ['footerHeight', _footerHeight]
  ]

  const _params = exParams
    ? exParams.restore(name, values)
    : new Params({
        name: 'desktopGenerator',
        initialValues: values
      })

  function init(g: IGenerator) {
    const params = g.params()
    const blocks = g.blocks()
    const containersize = g.containersize()
    const fullWidthHeaders = params.get('fullWidthHeaders') as number
    const titleHeight = params.get('titleHeight') as number
    let leftSideWidth = params.get('leftSideWidth') as number
    let rightSideWidth = params.get('rightSideWidth') as number
    const headerHeight = params.get('headerHeight') as number
    const footerHeight = params.get('footerHeight') as number

    if (containersize.width < 600) {
      leftSideWidth = 0
      rightSideWidth = 0
    }

    let location: IExRect
    let p: IDataLayout

    // Define parts
    title()
    leftSide()
    rightSide()
    header()
    content()
    footer()

    return blocks

    function footer() {
      // if (fullWidthHeaders) {
      //   location = {
      //     left: 0,
      //     top: containersize.height - footerHeight,
      //     width: containersize.width,
      //     height: footerHeight
      //   }
      // } else {
        location = {
          left: leftSideWidth,
          top: containersize.height - footerHeight,
          width: containersize.width - leftSideWidth - rightSideWidth,
          height: footerHeight
        }
      // }
      p = {
        editor: {
          edits: [
            {
              ref: PositionRef.top,
              variable: 'footerHeight',
              updateParam: updateParamHeight
            }
          ]
        },
        location: location
      }
      blocks.set('footer', p, g)
    }

    function content() {
      location = {
        left: leftSideWidth,
        top: titleHeight + headerHeight,
        width: containersize.width - rightSideWidth - leftSideWidth,
        height: containersize.height - titleHeight - headerHeight - footerHeight
      }

      p = {
        location
      }
      blocks.set('content', p, g)
    }

    function header() {
      if (fullWidthHeaders) {
        location = {
          left: 0,
          top: titleHeight,
          width: containersize.width,
          height: headerHeight
        }
      } else {
        location = {
          left: leftSideWidth,
          top: titleHeight,
          width: containersize.width - leftSideWidth - rightSideWidth,
          height: headerHeight
        }
      }
      p = {
        editor: {
          edits: [
            {
              ref: PositionRef.bottom,
              variable: 'headerHeight',
              updateParam: updateParamHeight
            }
          ]
        },
        location
      }
      blocks.set('header', p, g)
    }

    // function contentHeader() {
    //   location = {
    //     left: leftSideWidth,
    //     top: titleHeight + headerHeight
    //   };
    //   size = {
    //     width: containersize.width - leftSideWidth - rightSideWidth,
    //     height: contentHeaderHeight
    //   };

    //   p = {
    //     units: {
    //       location: Unit.pixel,
    //       size: Unit.pixel
    //     },
    //     editor: {
    //       edits: [
    //         { ref: PositionRef.bottom, variable: 'contentHeaderHeight', updateParam: updateParamHeight }
    //       ]
    //     },
    //     location,
    //     size
    //   };
    //   blocks.set('contentHeader', p, g);
    // }

    function rightSide() {
      if (fullWidthHeaders) {
        location = {
          left: containersize.width - rightSideWidth,
          top: titleHeight + headerHeight,
          width: rightSideWidth,
          height:
            containersize.height - titleHeight - footerHeight - headerHeight
        }
      } else {
        location = {
          left: containersize.width - rightSideWidth,
          top: 0,
          width: rightSideWidth,
          height: containersize.height - titleHeight
        }
      }
      p = {
        editor: {
          edits: [
            {
              ref: PositionRef.left,
              variable: 'rightSideWidth',
              updateParam: updateParamWidth
            }
          ]
        },
        location
      }
      blocks.set('rightSide', p, g)
    }

    function leftSide() {
      if (fullWidthHeaders) {
        location = {
          left: 0,
          top: titleHeight + headerHeight,
          width: leftSideWidth,
          height:
            containersize.height - titleHeight /* - footerHeight */ - headerHeight
        }
      } else {
        location = {
          left: 0,
          top: 0,
          width: leftSideWidth,
          height: containersize.height - titleHeight
        }
      }
      p = {
        editor: {
          edits: [
            {
              ref: PositionRef.right,
              variable: 'leftSideWidth',
              updateParam: updateParamWidth
            }
          ]
        },
        location
      }
      blocks.set('leftSide', p, g)
    }

    function title() {
      location = {
        left: 0,
        top: 0,
        width: containersize.width,
        height: titleHeight
      }
      p = {
        editor: {
          edits: [
            {
              ref: PositionRef.bottom,
              variable: 'titleHeight',
              updateParam: updateParamHeight
            }
          ]
        },
        location
      }
      blocks.set('title', p, g)
    }
  }

  function create(args: ICreate): Block {

    return args.g.blocks().set(args.name, args.dataLayout, args.g)
  }

  return new Generator(name, init, _params, create)
}

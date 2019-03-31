/***
 * The following direct imports allow seemless debugging of 
 * react-layout-generator in typescript.
 * 
 * Comment this section out to use the nmp library locally
 * This is a manual process because js does not allow macros
 */

 
export { Layout } from '../../src/Layout'
export { Panel, IMetaDataArgs } from '../../src/Panel'
export { Draggable } from '../../src/Draggable'
export { DragDrop } from '../../src/DragDrop'

export {IExRect} from '../../src/components/blockTypes'

export {
  Unit,
  ServiceOptions,
  ISize,
  IPoint,
  IOrigin,
  OverflowOptions,
  IRect,
  PositionRef,
  IGenericProps,
  rectPoint,
  rectSize
} from '../../src/types'
export { toXPixel, toYPixel } from '../../src/components/blockUtils'
export { IDataLayout } from '../../src/components/blockTypes'
export { EditHelper, IEditTool, IEditHelperProps, Status } from '../../src/editors/EditHelper'
export { columnsGenerator } from '../../src/generators/columnsGenerator'
export { desktopGenerator } from '../../src/generators/desktopGenerator'
export { dynamicGenerator } from '../../src/generators/dynamicGenerator'
export {
  Generator,
  ICreate,
  IGenerator,
  IGeneratorFunctionArgs
} from '../../src/generators/Generator'
export { rowsGenerator } from '../../src/generators/rowsGenerator'
export { pathHook } from '../../src/generators/animations/pathHook'

export { saveToLocalStorage, loadFromLocalStorage } from '../../src/generators/utils'

export {IExPoint} from '../../src/geometry/point'
export { Queue } from '../../src/components/Queue'
export { Stack } from '../../src/components/Stack'

export { connectPoint} from '../../src/components/blockUtils'

export { lineIntersection, lineRectIntersection } from '../../src/utils'

export {
  updateParamLocation,
  updateParamHeight,
  updateParamOffset,
  updateParamWidth
} from '../../src/editors/update'

export { Block } from '../../src/components/Block'
export { Blocks } from '../../src/components/Blocks'
export { IEditableTextData, Params, ParamValue } from '../../src/components/Params'

/***
 * The following npm local imports allow testing of the npm library
 * 
 * Comment this section out to use direct imports for debugging
 * This is a manual process because js does not allow macros
 */
// export {
//   Block,
//   Blocks,
//   desktopGenerator,
//   dynamicGenerator,
//   EditHelper,
//   ServiceOptions,
//   Generator,
//   ICreate,
//   IEditTool,
//   IEditHelperProps,
//   IGenerator,
//   IPoint,
//   IDataLayout,
//   IMetaDataArgs,
//   ISize,
//   IRect,
//   loadFromLocalStorage,
//   Params,
//   ParamValue, 
//   PositionRef,
//   rectSize,
//   Layout,
//   Panel,
//   rowsGenerator,
//   saveToLocalStorage,  
//   Status, 
//   Unit,
//   updateParamLocation
// } from 'react-layout-generator'
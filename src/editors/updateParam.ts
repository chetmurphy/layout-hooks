import { Block } from '../components/Block'
import { IEdit } from '../components/blockTypes'
import { ParamValue } from '../components/Params'
import { IRect } from '../types'

/**
 * internal use only
 * @ignore
 */
export interface INamedValue {
  name: string
  value: ParamValue
}

/**
 * internal use only
 * @ignore
 */
export type UpdateParam = (
  updated: IRect,
  edit: IEdit,
  block: React.MutableRefObject<Block>
) => INamedValue

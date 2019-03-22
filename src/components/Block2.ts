import * as React from 'react'

import { IDataLayout, IExRect, IBlockRect } from './blockTypes'
import { useBounds } from './useBounds'
import { convertExRect, layout, inverseLayout } from './blockUtils'
import { IRect, ISize } from '../types'

interface IBlockPosition {
  input: IExRect
  blockRect: IBlockRect
  rect: IRect
}

const blockPositionInitialState: IExRect = {
  left: undefined,
  right: undefined,
  top: undefined,
  bottom: undefined,
  width: undefined,
  height: undefined
}

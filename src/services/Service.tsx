import { IRect, IPoint } from '../types';
import { IGenerator } from '../generators/Generator';


/**
 * internal use only
 * @ignore
 */
export interface IUndo {
  editor: IService;
}

/**
 * internal use only
 * @ignore
 */
export interface IService {
  push: () => IUndo;
  redo: () => void;
  undo: () => void;
}

/**
 * internal use only
 * @ignore
 */
export interface IServiceProps extends React.HTMLProps<HTMLDivElement> {
  key: string;
  boundary: IRect;
  leftTop: IPoint;
  onUpdate: (reset?: boolean) => void;
  g: IGenerator;
}

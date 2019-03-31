import * as React from 'react';

import { Block } from '../components/Block';
import { IMenuItem } from '../components/blockTypes';
import { IGenerator } from '../generators/Generator';
import { IRect } from '../types';
import { clone } from '../utils';
import {EditHelper, ICommand, Status} from './EditHelper';

/**
 * internal use only
 * @ignore
 */
export interface ISelectProps {
  name: string;
  boundary: IRect;
  selectCallback: (instance: Select) => void;
  onUpdate: (reset?: boolean) => void;
  g: IGenerator;
}

/**
 * internal use only
 * @ignore
 */
export interface ISelectState {
  contextMenu: boolean; 
}

/**
 * internal use only
 * @ignore
 */
interface ISavedPosition {
  name: string;
  value: IRect;
}

/**
 * internal use only
 * @ignore
 */
type IUndoRedo = ISavedPosition[];

/**
 * internal use only
 * @ignore
 */
class Command implements ICommand {
  
  public name: string;
  public command: (status: Status) => Status | undefined;
  public status: (() => Status) | Status | undefined; 

  private _menuItem: IMenuItem;

  constructor(menuItem: IMenuItem) {
    this._menuItem = menuItem;
    this.name = menuItem.name;
    this.command = this.wrappedCommand;
    this.status = this.wrappedStatus;
  }

  private wrappedStatus = () => {
    if (!this._menuItem.disabled) {
      return Status.down;
    }
    if (this._menuItem.checked) {
      return Status.up;
    }
    return Status.disabled;
  }

  private wrappedCommand = (status: Status) => {

    if (this._menuItem.command) {
      this._menuItem.command();
    }

    return this.wrappedStatus();
  }
}

/**
 * internal use only
 * @ignore
 */
// tslint:disable-next-line:max-classes-per-file
export class Select extends React.Component<ISelectProps, ISelectState> {

  private _editHelper: EditHelper | undefined;
  private _selected: Map<string,  React.MutableRefObject<Block>> = new Map([]);
  private _undo: IUndoRedo[] = [];
  private _redo: IUndoRedo[] = [];

  constructor(props: ISelectProps) {
    super(props);
    // set instance
    this.props.selectCallback(this);

    this._editHelper = this.props.g.editor &&  this.props.g.editor();

    this.state = { contextMenu: false };
  }

  public componentDidMount() {
    if (this._editHelper) {
      const commands: ICommand[] = [];
      const menus = this.commands;
      menus.forEach((item: IMenuItem) => {
        const cmd = new Command(item);
        commands.push(cmd);
      });
      this._editHelper.load(commands);
    }
  }

  public componentWillUnmount() {
    
  }

  public get commands() {

    const disabled = this._selected.size > 1 ? false : true;
    const disabled2 = this._selected.size > 0 ? false : true;

    const menuCommands: IMenuItem[] = [
      { name: 'undo', disabled: this._undo.length ? false : true, command: this.undo },
      { name: 'redo', disabled: this._redo.length ? false : true, command: this.redo },
      { name: '' },
      { name: 'align left', disabled, command: this.alignLeft },
      { name: 'align center', disabled, command: this.alignCenter },
      { name: 'align right', disabled, command: this.alignRight },
      { name: '' },
      { name: 'align top', disabled, command: this.alignTop },
      { name: 'align middle', disabled, command: this.alignMiddle },
      { name: 'align bottom', disabled, command: this.alignBottom },
      { name: '' },
      { name: 'bring forward',  disabled: disabled2, command: this.bringForward },
      { name: 'send backward',  disabled: disabled2, command: this.sendBackward },
      { name: 'bring front',  disabled: disabled2, command: this.bringFront },
      { name: 'send back',  disabled: disabled2, command: this.sendBack },
    ];

    return menuCommands;
  }

  public selected = (name: string) => {
    return this._selected.get(name) !== undefined;
  }

  public select = (name: string) => {
    const block = this.props.g.blocks().get(name);
    if (block) {
      this._selected.set(name, block)
      return block
    }
    return undefined
  }

  public undo = () => {
    if (this._undo.length) {
      const data = this._undo.pop() as IUndoRedo;

      if (data) {


        // restore data
        const oldData = this.restore(data);

        this._redo.push(oldData);
      }
    }
  }

  public redo = () => {
    if (this._redo.length) {
      const data = this._redo.pop();

      if (data) {
        // restore data
        const oldData = this.restore(data);

        this._undo.push(oldData);
      }
    }
  }

  public restore = (data: IUndoRedo) => {
    this._selected.clear();
    const blocks = this.props.g.blocks();
    const oldData: IUndoRedo = []; 
    data.forEach((saved: ISavedPosition) => {
      const block = blocks.get(saved.name);
      if (block) {
        oldData.push({name: saved.name, value: clone(block.current.rect)});
        const r = saved.value;
        block.current.update({ x: r.x, y: r.y, width: r.width, height: r.height });
        this._selected.set(block.current.name, block);
      }
    });
    this.props.onUpdate();
    return oldData;
  }

  public add(block: React.MutableRefObject<Block>) {
    this._selected.set(block.current.name, block);
  }

  public remove(block: React.MutableRefObject<Block>) {
    this._selected.delete(block.current.name);
  }

  public clear() {
    this._selected.clear();
    if (this._editHelper) {
      this._editHelper.clear();
    }
    this.props.onUpdate();
  }

  public pushRectState = () => {
    const data: IUndoRedo = []
    this._selected.forEach((block: React.MutableRefObject<Block>) => {
      // save a clone of block.rect
      data.push({ name: block.current.name, value: clone(block.current.rect) });
    })
    this._undo.push(data);
  }

  public alignCenter = () => {
    let center: number;

    this.pushRectState();

    this._selected.forEach((block: React.MutableRefObject<Block>) => {
      const r = block.current.rect;
      if (center === undefined) {
        center = r.x + .5 * r.width;
      } else {
        block.current.update({ x: center - r.width / 2, y: r.y, width: r.width, height: r.height })
      }
    });
    if (this._selected.size) {
      this.props.onUpdate();
    }
  }

  public alignMiddle = () => {
    let middle: number;

    this.pushRectState();

    this._selected.forEach((block: React.MutableRefObject<Block>) => {
      const r = block.current.rect;
      if (middle === undefined) {
        middle = r.y + .5 * r.height;
      } else {
        block.current.update({ x: r.x, y: middle - r.height / 2, width: r.width, height: r.height })
      }
    });
    if (this._selected.size) {
      this.props.onUpdate();
    }
  }

  public alignTop = () => {
    let top: number;

    this.pushRectState();

    this._selected.forEach((block: React.MutableRefObject<Block>) => {
      const r = block.current.rect;
      if (top === undefined) {
        top = r.y;
      }
      block.current.update({ x: r.x, y: top, width: r.width, height: r.height })
    });
    if (this._selected.size) {
      this.props.onUpdate();
    }
  }

  public alignLeft = () => {
    let left: number;

    this.pushRectState();

    this._selected.forEach((block: React.MutableRefObject<Block>) => {
      const r = block.current.rect;
      if (left === undefined) {
        left = r.x;
      }
      block.current.update({ x: left, y: r.y, width: r.width, height: r.height })
    });
    if (this._selected.size) {
      this.props.onUpdate();
    }
  }

  public alignBottom = () => {
    let bottom: number;

    this.pushRectState();

    this._selected.forEach((block: React.MutableRefObject<Block>) => {
      const r = block.current.rect;
      if (bottom === undefined) {
        bottom = r.y + r.height;
      }
      block.current.update({ x: r.x, y: bottom - r.height, width: r.width, height: r.height })
    });
    if (this._selected.size) {
      this.props.onUpdate();
    }
  }

  public alignRight = () => {
    let right: number;

    this.pushRectState();

    this._selected.forEach((block: React.MutableRefObject<Block>) => {
      const r = block.current.rect;
      if (right === undefined) {
        right = r.x + r.width;
      }
      block.current.update({ x: right - r.width, y: r.y, width: r.width, height: r.height })
    });
    if (this._selected.size) {
      this.props.onUpdate();
    }
  }

  public bringForward = () => {
    const stacking = this.props.g.stacking();

    this._selected.forEach((block: React.MutableRefObject<Block>) => {
      stacking.bringForward(block)
    });
    if (this._selected.size) {
      this.props.onUpdate();
    }
  }

  public sendBackward = () => {
    const stacking = this.props.g.stacking();

    this._selected.forEach((block: React.MutableRefObject<Block>) => {
      stacking.sendBackward(block)
    });
    if (this._selected.size) {
      this.props.onUpdate();
    }
  }

  public bringFront = () => {
    const stacking = this.props.g.stacking();

    stacking.bringFront(this.selectedBlocks())
    if (this._selected.size) {
      this.props.onUpdate();
    }
    if (this._selected.size) {
      this.props.onUpdate();
    }
  }

  public sendBack = () => {
    const stacking = this.props.g.stacking();
    stacking.sendBack(this.selectedBlocks())
    if (this._selected.size) {
      this.props.onUpdate();
    }
  }

  public render() {
    return (
      <div
        key={'select'}
        id={'select'}
        style={{
          background: 'transparent',
          position: 'absolute',
          width: this.props.boundary.width,
          height: this.props.boundary.height
        }}
      />
    );

  }

  private selectedBlocks() {
    const b: React.MutableRefObject<Block>[] = []
    this._selected.forEach((value) => {
      b.push(value)
    })
    return b;
  }

  // public minMax() {
  //   let min = Number.MAX_SAFE_INTEGER
  //   let max = Number.MIN_SAFE_INTEGER

  //   this.props.g.blocks().map.forEach((block: React.MutableRefObject<Block>) => {
  //     if (block.layer < min) {
  //       min = block.layer
  //     }
  //     if (block.layer > max) {
  //       max = block.layer
  //     }
  //   })

  //   return {min, max}
  // }
}
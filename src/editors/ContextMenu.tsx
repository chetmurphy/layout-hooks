import * as React from 'react';

import { IMenuItem } from '../components/blockTypes';
import { IPoint, ISize } from '../types';
import '../assets/styles.css'

/**
 * internal use only
 * @ignore
 */
interface IContextMenuProps {
  commands: IMenuItem[] | undefined;
  location: IPoint;
  bounds: ISize;
  hideMenu: () => void;
  zIndex: number;
}

/**
 * internal use only
 * @ignore
 */
export class ContextMenu extends React.Component<IContextMenuProps> {

  private _root: React.RefObject<HTMLDivElement>;
  // private elementRefs: IElementRef[] = [];

  constructor(props: IContextMenuProps) {
    super(props);

    this._root = React.createRef();
  }

  public componentDidMount() {
    document.addEventListener('click', this._onHtmlClick);

    this._init();
  };

  public componentWillUnmount() {
    document.removeEventListener('click', this._onHtmlClick);
  }

  public render() {
    return (
      <div className={'dropdown'} style={{ zIndex: this.props.zIndex + 10 }}>
        <div ref={this._root} className='dropdown-content'>
          {this.createChildren()}
        </div>
      </div>
    );
  }

  private createChildren() {
    const jsx: JSX.Element[] = [];
    if (this.props.commands) {
      this.props.commands.forEach((c: IMenuItem, i: number) => {

        if (c.name === '') {
          jsx.push(
            <hr key={`sep${i}`} className='separator' />
          )
        } else {
          if (c.disabled) {
           
              jsx.push(
                <div key={c.name} className='disabled'>{c.checked ? '√' + c.name : ' ' + c.name}</div>
              )
            
          } else {
            // onMouseDown needed to stopPropagation so that onClick works
            // otherwise onParentMouseDown gets called which results
            // in no onClick event on menu items
            jsx.push(
              <a
                key={c.name}
                href='#'
                onMouseDown={this._onMouseDown}
                onClick={this._onClick(c.command)}
              >
                {c.checked ? '√' + c.name : ' ' + c.name}
              </a>
            )
          }
        }
      })
    }

    return jsx;
  }

  private _onMouseDown = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();
  }

  private _onClick = (command?: () => void) => {
    return (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (command) {
        command();
      };

    }
  }

  private _init = () => {

    const clickX = this.props.location.x;
    const clickY = this.props.location.y;

    if (this._root.current) {
      const rootW = this._root.current.offsetWidth;
      const rootH = this._root.current.offsetHeight;

      const right = (this.props.bounds.width - clickX) > rootW;
      const left = !right;
      const top = (this.props.bounds.height - clickY) > rootH;
      const bottom = !top;

      if (right) {
        this._root.current.style.left = `${clickX + 5}px`;
      }

      if (left) {
        this._root.current.style.left = `${clickX - rootW - 5}px`;
      }

      if (top) {
        this._root.current.style.top = `${clickY + 5}px`;
      }

      if (bottom) {
        this._root.current.style.top = `${clickY - rootH - 5}px`;
      }
    }
  };

  private _onHtmlClick = (event: MouseEvent) => {

    let wasOutside = false;
    if (event && event.target) {
      wasOutside = !(event.target === this._root.current);
    }

    if (wasOutside) {
      this.props.hideMenu();
    }
  };
}


import * as React from 'react';

import styled from 'styled-components';

import {
  IEditableTextData,
  IOrigin,
  ISize,
  Params
} from '../importRLG'

interface IProps {
  containersize: ISize;
  origin: IOrigin;
  fontSize: number;
}

export const Editable = styled.div<IProps>`
  font-family: Arial, Helvetica, sans-serif;
  font-size: ${(p) => p.fontSize.toString()}px;
  position: absolute;
  white-space: nowrap;
  overflow: 'hidden';
  word-break: keep-all;
`

export const NotEditable = styled.div<IProps>`
  display: inline-block;
  font-family: Arial, Helvetica, sans-serif;
  font-size: ${(p) => p.fontSize.toString()};
  position: absolute;
  user-select: none;
`

interface IEditableTextProps extends React.Props<HTMLDivElement> {
  params: Params;
  edit: boolean;
  variable: string;
  containersize: ISize;
}

interface IEditableTextState {
  update: number;
}

// The follow implementation is based on
// https://stackoverflow.com/questions/22677931/react-js-onchange-event-for-contenteditable#answer-27255103
// tslint:disable-next-line:max-classes-per-file
export default class EditableText extends React.Component<IEditableTextProps, IEditableTextState> {
  private _root: HTMLDivElement; // Ref to the editable div
  private _mutationObserver: MutationObserver; // Modifications observer
  private _innerTextBuffer: string; // Stores the last value
  private _data: IEditableTextData;

  constructor(props: IEditableTextProps) {
    super(props);
    this._data = this.props.params.get(this.props.variable) as IEditableTextData;
    this.state = { update: 0 };
  }

  public onContextMenu = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
  }

  public componentDidMount() {
    if (this.props.edit) {
      this._root.contentEditable = 'true';
      this._mutationObserver = new MutationObserver(this.onContentChange);
      this._mutationObserver.observe(this._root, {
        childList: true, // To check for new lines
        subtree: true, // To check for nested elements
        characterData: true // To check for text modifications
      });
    }
  }

  public render() {
    const len = this._data.content.length;
    const width = this.props.containersize.width;
    const height = this.props.containersize.height;

    const fontSize = this.calculateFontSize(this._data.fontSize, width, height, len);
    if (this.props.edit) {
      return (
        <Editable
          ref={this.onRootRef}
          containersize={this.props.containersize}
          origin={{ x: 0, y: 0 }}
          fontSize={fontSize}
          onMouseDown={this.onMouseDown}
          onKeyDown={this.onKeyDown}
        >
          {this._data.content}
        </Editable>
      );
    } else {
      return (
        <NotEditable
          ref={this.onRootRef}
          containersize={this.props.containersize}
          origin={{ x: 0, y: 0 }}
          fontSize={fontSize}
          onMouseDown={this.onMouseDown}
        >
          {this._data.content}
        </NotEditable>
      );
    }
  }

  private onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    // capture the mouse
    event.stopPropagation();
  }

  private onKeyDown = (e: React.KeyboardEvent) => {
    if (e && e.key === 'Enter') {
      e.stopPropagation()
      e.preventDefault()
    }
  }

  private onContentChange: MutationCallback = (mutations: MutationRecord[]) => {
    mutations.forEach(() => {
      // Get the text from the editable div
      // (Use innerHTML to get the HTML)
      const { innerText } = this._root;

      // Content changed will be triggered several times for one key stroke
      if (!this._innerTextBuffer || this._innerTextBuffer !== innerText) {
        // Update the font size
        this._data.fontSize = this.calculateFontSize(
          this._data.fontSize,
          this.props.containersize.width,
          this.props.containersize.height,
          innerText.length
        );
        // Update css
        this._root.style.fontSize = this._data.fontSize.toString();

        // Save content
        this.props.params.set(this.props.variable, {
          content: innerText,
          fontSize: this._data.fontSize,
          alpha: this._data.alpha
        });
        this._data.content = innerText;
        this._innerTextBuffer = innerText;
      }
    });
  }

  private onRootRef = (elt: HTMLDivElement) => {
    this._root = elt;
    this.setState({ update: this.state.update + 1 });
  }

  private calculateFontSize(fontSize: number | undefined, width: number, height: number, len: number) {
    /**
     * We want to scale the font size to fit the available
     * container size. This is a function of the text length,
     * and the container size. 
     * We need to solve the equations
     *  textWidth = textLength * averageFontWidth * fontSize
     *  textHeight = fontSize
     * 
     * subject to 
     *  textWidth < percentage of containerWidth
     *  textHeight < percentage of containerHeight
     * 
     * Initial average char width is alpha * fontSize
     * textWidth = alpha * fontSize * textLength
     * Average char width ranges from .3 to .5 of fontSize
     */

    if (fontSize === undefined) {
      fontSize = .95 * height;
    }

    if (this._data.alpha === undefined) {
      this._data.alpha = len * (.5 * fontSize!) / fontSize!;
    }

    if (this._root) {
      this._data.alpha = (this._root.offsetWidth / len) / fontSize;
    }

    const tw = () => {
      return len * this._data.alpha! * fontSize!;
    }

    const th = () => {
      return .95 * fontSize!;
    }

    let textWidth = tw();
    let textHeight = th();
    while (textWidth < width && textHeight < height) {
      fontSize += 1;
      textWidth = tw();
      textHeight = th();
    }

    while (textWidth >= width || textHeight >= height) {
      fontSize -= 1;
      textWidth = tw();
      textHeight = th();
    }

    this._data.fontSize = fontSize;
    return fontSize;
  }
}


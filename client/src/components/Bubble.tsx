

import styled from 'styled-components';

import { 
  IOrigin,
  ISize
} from '../importRLG'

interface IProps {
  containersize: ISize;
  origin: IOrigin;
}

export const Bubble = styled.div<IProps>`
  position: absolute;
  padding: 15px;
  /* margin: 1em 0 3em;  */
  color: #000;
  background: #f3961c;
  border-radius: 10px;
  background: linear-gradient(top, #f9d835, #f3961c);

  /* creates triangle */
  &:after {
    content: "";
    display: block; /* reduce the damage in FF3.0 */
    position: absolute;
    bottom: -19.9px;
    left: 70px;
    width: 0;
    border-width: 20px 20px 0;
    border-style: solid;
    border-color: #f3961c transparent;
  }
`
import * as React from 'react';
import { default as styled } from 'styled-components';

interface IMenuDividerProps {
  name: string;
  className?: string;
}

const MenuDivider = ({ name, className }: IMenuDividerProps) => (
  <li className={className}>
    <p>{name}</p>
  </li>
);

export default styled(MenuDivider)`
  background: #1b1b1b;

  p {
    color: #777;
    margin: 0;
    margin-left: 25px;
    padding: 0;
    font-size: 12px;
  }
`;

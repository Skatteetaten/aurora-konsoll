import * as React from 'react';
import './menu-divider.css';

interface IMenuDividerProps {
  name: string;
}

const MenuDivider = ({ name }: IMenuDividerProps) => (
  <li className="menu-divider">
    <p>{name}</p>
  </li>
);

export default MenuDivider;

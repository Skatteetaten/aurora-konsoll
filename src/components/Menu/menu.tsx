import * as React from 'react';
import './menu.css';

interface IMenuProps {
  children: React.ReactNode;
}

const Menu = ({ children }: IMenuProps) => (
  <nav className="main-menu">
    <ul>{children}</ul>
  </nav>
);

export default Menu;

import { NavLink } from 'react-router-dom';
import './menu-nav-link.css';

import Icon from 'aurora-frontend-react-komponenter/Icon';
import * as React from 'react';

const createIcon = (iconName: string, size: number) => (
  <div className="menu-nav-link-icon">
    <Icon iconName={iconName} style={{ fontSize: `${size}px` }} />
  </div>
);

interface IMenuNavLinkProps {
  name: string;
  iconName?: string;
  onClick?: (event: React.MouseEvent<HTMLLIElement>) => void;
  to: string;
  size?: number;
  className?: string;
}

const MenuNavLink = ({
  name,
  iconName,
  to,
  onClick,
  size = 24,
  className = ''
}: IMenuNavLinkProps) => (
  <li className={'menu-nav-link ' + className} onClick={onClick}>
    <NavLink exact={true} to={to} activeClassName="menu-nav-link-active">
      {iconName && createIcon(iconName, size)}
      {name}
    </NavLink>
  </li>
);

export default MenuNavLink;

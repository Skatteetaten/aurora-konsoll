import Icon from 'aurora-frontend-react-komponenter/Icon';
import * as React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

interface IMenuNavLinkProps {
  name: string;
  showName?: boolean;
  iconName?: string;
  onClick?: (event: React.MouseEvent<HTMLLIElement>) => void;
  to: string;
  className?: string;
  size?: number;
}

const MenuNavLink = ({
  name,
  iconName,
  to,
  onClick,
  className,
  size = 24,
  showName = true
}: IMenuNavLinkProps) => (
  <li className={className} onClick={onClick}>
    <NavLink
      to={to}
      activeStyle={{
        background: '#f9ede2'
      }}
    >
      {iconName && (
        <Icon iconName={iconName} style={{ fontSize: `${size}px` }} />
      )}
      {showName && name}
    </NavLink>
  </li>
);

export default styled(MenuNavLink)`
  box-sizing: border-box;

  a {
    display: flex;
    color: #000000f2;
    text-decoration: none;
    padding: 15px 20px;
  }

  i {
    margin-right: 10px;
  }

  a:hover i {
    color: #1362ae;
  }

  a.active i {
    color: #1362ae;
  }
`;

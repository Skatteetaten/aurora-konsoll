import * as React from 'react';
import { Icon } from '@skatteetaten/frontend-components';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

export interface IMenuNavLinkData {
  name: string;
  showName?: boolean;
  iconName?: string;
  to: string;
}

interface IMenuNavLinkProps extends IMenuNavLinkData {
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLLIElement>) => void;
}

const MenuNavLink = ({
  name,
  iconName,
  to,
  onClick,
  className,
  showName = true,
}: IMenuNavLinkProps) => (
  <li className={className} onClick={onClick}>
    <NavLink
      to={to}
      activeStyle={{
        background: '#f9ede2',
      }}
    >
      {iconName && <Icon iconName={iconName} style={{ fontSize: `24px` }} />}
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

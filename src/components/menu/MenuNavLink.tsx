import Icon from 'aurora-frontend-react-komponenter/Icon';
import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { default as styled } from 'styled-components';

interface IMenuNavLinkProps {
  name: string;
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
  size = 24
}: IMenuNavLinkProps) => (
  <li className={className} onClick={onClick}>
    <NavLink
      exact={true}
      to={to}
      activeStyle={{
        background: '#f9ede2'
      }}
    >
      {iconName && (
        <IconWrapper>
          <Icon iconName={iconName} style={{ fontSize: `${size}px` }} />
        </IconWrapper>
      )}
      {name}
    </NavLink>
  </li>
);

const IconWrapper = styled.div`
  float: left;
  margin-right: 10px;

  a.active & {
    color: #1362ae;
  }
`;

export default styled(MenuNavLink)`
  box-sizing: border-box;

  a {
    display: block;
    color: #000000f2;
    text-decoration: none;
    padding: 15px 20px;
  }

  a:hover > div {
    color: #1362ae;
  }
`;

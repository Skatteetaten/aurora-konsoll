import * as React from 'react';
import { default as styled } from 'styled-components';

import MenuDivider from './menu/MenuDivider';
import MenuNavLink from './menu/MenuNavLink';

interface IMenuProps {
  className?: string;
  children: React.ReactNode;
}

const Menu = ({ children, className }: IMenuProps) => (
  <nav className={className}>
    <ul>{children}</ul>
  </nav>
);

export { MenuDivider, MenuNavLink };

export default styled(Menu)`
  ul {
    padding: 0;
    margin: 0;
    line-height: 24px;
    border-right: 1px solid #bbb;
    border-bottom: 1px solid #bbb;
    border-radius: 0 0 5px 0;
    height: 980px;
  }

  li {
    list-style-type: none;
    border-bottom: 1px solid #bbb;
  }
`;

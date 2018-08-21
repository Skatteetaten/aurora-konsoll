import * as React from 'react';
import styled from 'styled-components';

import MenuNavLink from './MenuNavLink';

interface IMenuProps {
  className?: string;
  children: React.ReactNode;
}

const Menu = ({ children, className }: IMenuProps) => (
  <nav className={className}>
    <ul>{children}</ul>
  </nav>
);

export { MenuNavLink };

export default styled(Menu)`
  ul {
    padding: 0;
    margin: 0;
    line-height: 24px;
    border-right: 1px solid #bbb;
    height: 100%;
  }

  li {
    list-style-type: none;
    border-bottom: 1px solid #bbb;
  }
`;

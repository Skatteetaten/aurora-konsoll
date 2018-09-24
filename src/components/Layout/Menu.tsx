import * as React from 'react';
import styled from 'styled-components';

interface IMenuProps {
  className?: string;
  children: React.ReactNode;
}

const Menu = ({ children, className }: IMenuProps) => (
  <nav className={className}>
    <ul>{children}</ul>
  </nav>
);

export default styled(Menu)`
  ul {
    position: relative;
    display: flex;
    flex-direction: column;
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

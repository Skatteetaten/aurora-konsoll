import * as React from 'react';
import styled from 'styled-components';

import Icon from '@skatteetaten/frontend-components/Icon';

interface IMenuCollapseButtonProps {
  className?: string;
  isExpanded: boolean;
  onClick?: (event: React.MouseEvent<HTMLLIElement>) => void;
}

const MenuCollapseButton = ({
  isExpanded,
  onClick,
  className
}: IMenuCollapseButtonProps) => (
  <li className={className} onClick={onClick}>
    <Icon
      iconName={isExpanded ? 'NavigateBefore' : 'NavigateNext'}
      style={{ fontSize: `24px` }}
    />
  </li>
);

export default styled(MenuCollapseButton)`
  ul & {
    border-bottom: none;
  }

  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  cursor: pointer;
  display: flex;
  border-top: 1px solid #bbb;
  padding: 15px 20px;

  i {
    margin-right: 10px;
  }

  &:hover i {
    color: #1362ae;
  }
`;

import * as React from 'react';
import styled from 'styled-components';

import palette from 'aurora-frontend-react-komponenter/utils/palette';

interface IDropdownMenuProps {
  className?: string;
  renderTitle: JSX.Element;
  renderContent: JSX.Element[];
}

const DropdownMenu = ({
  className,
  renderTitle,
  renderContent
}: IDropdownMenuProps) => {
  return (
    <div className={className}>
      <div className="dropdown-menu">
        <div className="dropdown-title">{renderTitle}</div>
        <div className="dropdown-menu-content">{renderContent}</div>
      </div>
    </div>
  );
};

export default styled(DropdownMenu)`
  .dropdown-title {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: default;
    padding: 5px;
  }

  .dropdown-menu {
    position: relative;
  }

  .dropdown-menu-content {
    cursor: pointer;
    display: none;
    position: absolute;
    width: 100%;
    background-color: ${palette.skeColor.neutralGrey};
    box-shadow: 0px 3px 3px 0px ${palette.skeColor.lightGrey};
    z-index: 15;
  }

  .dropdown-menu-content a {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
  }

  .dropdown-menu-content a:hover {
    background-color: ${palette.skeColor.whiteGrey};
  }

  .dropdown-menu:hover .dropdown-menu-content {
    display: block;
  }

  .dropdown-menu:hover .dropdown-title {
    background-color: ${palette.skeColor.whiteGrey};
    box-shadow: 0px 0px 3px 0px ${palette.skeColor.lightGrey};
  }
`;

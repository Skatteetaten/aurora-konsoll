import * as React from 'react';

import Dropdown, {
  IDropdownOption
} from 'aurora-frontend-react-komponenter/Dropdown';

import { toDropdownOptions } from 'utils/aurora-frontend';

import styled from 'styled-components';
import Header from './Header';
import Menu from './Menu';
import MenuCollapseButton from './MenuCollapseButton';
import MenuNavLink, { IMenuNavLinkData } from './MenuNavLink';

interface ILayoutProps {
  affiliation?: string;
  affiliations: string[];
  className?: string;
  handleMenuExpand: () => void;
  isMenuExpanded: boolean;
  user: string;
  showAffiliationSelector: boolean;
  children: React.ReactNode;
  onAffiliationChange: (affiliation: string) => void;
}

const Layout = ({
  affiliation,
  affiliations,
  className,
  isMenuExpanded,
  handleMenuExpand,
  user,
  showAffiliationSelector,
  children,
  onAffiliationChange
}: ILayoutProps) => {
  const onAffiliationChanged = (item: IDropdownOption) =>
    onAffiliationChange(item.text);

  const menuLinks: IMenuNavLinkData[] = [
    {
      iconName: 'Menu',
      name: 'Applikasjoner',
      to: `/a/${affiliation || '_'}/deployments`
    },
    {
      iconName: 'Code',
      name: 'Netdebug',
      to: '/netdebug'
    }
  ].map(item => ({
    ...item,
    showName: isMenuExpanded
  }));

  const layoutClassNames =
    className + (isMenuExpanded ? ' menu-expanded ' : ' menu-collapsed');

  return (
    <div className={layoutClassNames}>
      <Header title="Aurora Konsoll" user={user} className="g-header">
        {showAffiliationSelector && (
          <Dropdown
            placeHolder="Velg tilhørighet"
            options={toDropdownOptions(affiliations)}
            onChanged={onAffiliationChanged}
            selectedKey={affiliation}
          />
        )}
      </Header>
      <Menu className="g-menu">
        {menuLinks.map(props => (
          <MenuNavLink key={props.name} {...props} />
        ))}
        <MenuCollapseButton
          isExpanded={isMenuExpanded}
          onClick={handleMenuExpand}
        />
      </Menu>
      <div className="g-content">{children}</div>
    </div>
  );
};

export default styled(Layout)`
  height: 100%;
  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-columns: ${props => (props.isMenuExpanded ? '250px' : '70px')} 1fr;
  grid-template-areas:
    'header header'
    'menu content';

  .g-header {
    grid-area: header;
  }
  .g-menu {
    grid-area: menu;
  }
  .g-content {
    grid-area: content;
    overflow: hidden;
  }

  .ms-Dropdown-container {
    max-width: 250px;
  }
`;

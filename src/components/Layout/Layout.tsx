import * as React from 'react';
import styled from 'styled-components';

import Dropdown, {
  IDropdownOption
} from 'aurora-frontend-react-komponenter/Dropdown';
import SkeBasis from 'aurora-frontend-react-komponenter/SkeBasis';

import { toDropdownOptions } from 'utils/aurora-frontend';

import Header from './Header';
import Menu from './Menu';
import MenuCollapseButton from './MenuCollapseButton';
import MenuNavLink from './MenuNavLink';

interface ILayoutProps {
  affiliation?: string;
  affiliations: string[];
  handleMenuExpand: () => void;
  isExpanded: boolean;
  user: string;
  showAffiliationSelector: boolean;
  children: React.ReactNode;
  onAffiliationChange: (affiliation: string) => void;
}

const Layout = ({
  affiliation,
  affiliations,
  isExpanded,
  handleMenuExpand,
  user,
  showAffiliationSelector,
  children,
  onAffiliationChange
}: ILayoutProps) => {
  const onAffiliationChanged = (item: IDropdownOption) =>
    onAffiliationChange(item.text);

  return (
    <StyledSkeBasis menuExpanded={isExpanded}>
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
        <MenuNavLink
          showName={isExpanded}
          name="Applikasjoner"
          to={`/a/${affiliation || '_'}/deployments`}
          iconName="Menu"
        />
        <MenuNavLink
          showName={isExpanded}
          name="Netdebug"
          to="/netdebug"
          iconName="Code"
        />
        {/* <MenuNavLink name="Database" to="/db" iconName="Cloud" />
        <MenuNavLink name="Konfigurasjon" to="/conf" iconName="Code" />
        <MenuNavLink name="WebSEAL" to="/web" iconName="Bookmark" /> */}
        <MenuCollapseButton
          isExpanded={isExpanded}
          onClick={handleMenuExpand}
        />
      </Menu>
      <div className="g-content">{children}</div>
    </StyledSkeBasis>
  );
};

const StyledSkeBasis = styled<{ menuExpanded: boolean }>(SkeBasis)`
  height: 100%;
  display: grid;
  grid-template-columns: ${props => (props.menuExpanded ? '250px' : '70px')} 1fr;
  grid-template-rows: auto 1fr;
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
    max-height: 100%;
    overflow: auto;
  }

  .ms-Dropdown-container {
    max-width: 250px;
  }
`;

export default Layout;

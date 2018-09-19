import * as React from 'react';

import Dropdown, {
  IDropdownOption
} from 'aurora-frontend-react-komponenter/Dropdown';
import SkeBasis from 'aurora-frontend-react-komponenter/SkeBasis';

import { toDropdownOptions } from 'utils/aurora-frontend';

import styled from 'styled-components';
import Header from './Header';
import Menu, { MenuNavLink } from './Menu';

interface ILayoutProps {
  affiliation?: string;
  affiliations: string[];
  user: string;
  showAffiliationSelector: boolean;
  children: React.ReactNode;
  onAffiliationChange: (affiliation: string) => void;
}

const Layout = ({
  affiliation,
  affiliations,
  user,
  showAffiliationSelector,
  children,
  onAffiliationChange
}: ILayoutProps) => {
  const onAffiliationChanged = (item: IDropdownOption) =>
    onAffiliationChange(item.text);

  return (
    <StyledSkeBasis>
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
          name="Applikasjoner"
          to={`/a/${affiliation || '_'}/deployments`}
          iconName="Menu"
        />
        <MenuNavLink name="Netdebug" to="/netdebug" iconName="Code" />
        {/* <MenuNavLink name="Database" to="/db" iconName="Cloud" />
        <MenuNavLink name="Konfigurasjon" to="/conf" iconName="Code" />
        <MenuNavLink name="WebSEAL" to="/web" iconName="Bookmark" /> */}
      </Menu>
      <div className="g-content">{children}</div>
    </StyledSkeBasis>
  );
};

const StyledSkeBasis = styled(SkeBasis)`
  height: 100%;
  display: grid;
  grid-template-columns: 250px 1fr;
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

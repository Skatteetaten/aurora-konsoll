import Dropdown, {
  IDropdownOption
} from 'aurora-frontend-react-komponenter/Dropdown';
import SkeBasis from 'aurora-frontend-react-komponenter/SkeBasis';
import * as React from 'react';
import styled from 'styled-components';

import { toDropdownOptions } from 'utils/aurora-frontend';

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
    <SkeBasis>
      <StyledHeader title="Aurora Konsoll" user={user}>
        {showAffiliationSelector && (
          <Dropdown
            placeHolder="Velg tilhørighet"
            options={toDropdownOptions(affiliations)}
            onChanged={onAffiliationChanged}
            selectedKey={affiliation}
          />
        )}
      </StyledHeader>
      <StyledMenu>
        <MenuNavLink
          name="Applikasjoner"
          to={`/a/${affiliation || '_'}/deployments`}
          iconName="Menu"
        />
        <MenuNavLink name="Netdebug" to="/netdebug" iconName="Code" />
        {/* <MenuNavLink name="Database" to="/db" iconName="Cloud" />
        <MenuNavLink name="Konfigurasjon" to="/conf" iconName="Code" />
        <MenuNavLink name="WebSEAL" to="/web" iconName="Bookmark" /> */}
      </StyledMenu>
      <LayoutContent>{children}</LayoutContent>
    </SkeBasis>
  );
};

const HEADER_HEIGHT = '92px';
const MENU_WIDTH = '265px';

const LayoutContent = styled.div`
  position: absolute;
  top: ${HEADER_HEIGHT};
  left: ${MENU_WIDTH};
  right: 0;
  bottom: 0;
  margin-left: 15px;
  overflow: auto;
`;

const StyledMenu = styled(Menu)`
  position: absolute;
  top: ${HEADER_HEIGHT};
  left: 0px;
  bottom: 0;
  width: ${MENU_WIDTH};
`;

const StyledHeader = styled(Header)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: ${HEADER_HEIGHT};
`;

export default Layout;

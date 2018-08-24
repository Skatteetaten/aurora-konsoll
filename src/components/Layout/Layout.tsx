import SkeBasis from 'aurora-frontend-react-komponenter/SkeBasis';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import styled from 'styled-components';

import { toDropdownOptions } from 'utils/aurora-frontend';

import Header from './Header';
import Menu, { MenuNavLink } from './Menu';

interface ILayoutProps {
  affiliations: string[];
  user: string;
  children: React.ReactNode;
}

const Layout = ({
  affiliations,
  user,
  children,
  match,
  location,
  history
}: RouteComponentProps<{ affiliation?: string }> & ILayoutProps) => {
  const updatePath = (a: string) => {
    history.push({
      pathname: `/${a}/deployments`
    });
  };

  const { affiliation } = match.params;
  // tslint:disable-next-line:no-console
  console.log(location);

  return (
    <SkeBasis>
      <StyledHeader
        title="Aurora Konsoll"
        user={user}
        selectedAffiliation={affiliation}
        affiliations={toDropdownOptions(affiliations)}
        handleChangeAffiliation={updatePath}
      />
      <StyledMenu>
        <MenuNavLink
          name="Applikasjoner"
          to={`/${affiliation ? `/${affiliation}` : ''}/deployments`}
          iconName="Menu"
        />
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

export default withRouter(Layout);

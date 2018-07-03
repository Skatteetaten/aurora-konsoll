import Grid from 'aurora-frontend-react-komponenter/Grid';
import SkeBasis from 'aurora-frontend-react-komponenter/SkeBasis';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { default as styled } from 'styled-components';

import Header from 'components/Header';
import Menu, { MenuNavLink } from 'components/Menu';
import { toDropdownOptions } from 'utils/aurora-frontend';

import Col from './layout/Col';
import Row from './layout/Row';

interface ILayoutProps {
  affiliation: string;
  affiliations: string[];
  user: string;
  children: React.ReactNode;
  handleChangeAffiliation: (affiliation: string) => void;
}

const Layout = ({
  affiliation,
  affiliations,
  user,
  children,
  location,
  history,
  handleChangeAffiliation
}: RouteComponentProps<{}> & ILayoutProps) => {
  const updatePath = (a: string) => {
    handleChangeAffiliation(a);
    history.push({
      pathname: `/app/${a}`
    });
  };
  return (
    <SkeBasis>
      <Grid>
        <Row>
          <Col lg={12}>
            <Header
              title="Aurora Konsoll"
              user={user}
              affiliations={toDropdownOptions(affiliations)}
              handleChangeAffiliation={updatePath}
            />
          </Col>
        </Row>
        <Row>
          <Col lg={2}>
            <Menu>
              <MenuNavLink
                name="Applikasjoner"
                to={`/app${affiliation !== '' ? '/' + affiliation : ''}`}
                iconName="Menu"
              />
              <MenuNavLink name="Database" to="/db" iconName="Cloud" />
              <MenuNavLink name="Konfigurasjon" to="/conf" iconName="Code" />
              <MenuNavLink name="WebSEAL" to="/web" iconName="Bookmark" />
            </Menu>
          </Col>
          <OverflowCol lg={10}>
            <LayoutContent>{children}</LayoutContent>
          </OverflowCol>
        </Row>
      </Grid>
    </SkeBasis>
  );
};

const OverflowCol = styled(Col)`
  overflow: auto;
`;

const LayoutContent = styled.div`
  margin: 0 15px;
`;

export default withRouter(Layout);

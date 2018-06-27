import { IDropdownOption } from 'aurora-frontend-react-komponenter/Dropdown';
import Grid from 'aurora-frontend-react-komponenter/Grid';
import SkeBasis from 'aurora-frontend-react-komponenter/SkeBasis';
import * as React from 'react';
import { default as styled } from 'styled-components';

import Header from 'components/Header';
import Menu, { MenuNavLink } from 'components/Menu';

import Col from './layout/Col';
import Row from './layout/Row';

interface ILayoutProps {
  user: string;
  affiliations?: IDropdownOption[];
  children: React.ReactNode;
  handleChangeAffiliation: (affiliation: string) => void;
}

const Layout = ({
  user,
  children,
  handleChangeAffiliation,
  affiliations = []
}: ILayoutProps) => (
  <SkeBasis>
    <Grid>
      <Row>
        <Col lg={12}>
          <Header
            title="Aurora Konsoll"
            user={user}
            affiliations={affiliations}
            handleChangeAffiliation={handleChangeAffiliation}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={2}>
          <Menu>
            <MenuNavLink name="Applikasjoner" to="/" iconName="Menu" />
            <MenuNavLink name="Database" to="/db" iconName="Cloud" />
            <MenuNavLink name="Konfigurasjon" to="/conf" iconName="Code" />
            <MenuNavLink name="WebSEAL" to="/web" iconName="Bookmark" />
          </Menu>
        </Col>
        <Col lg={10}>
          <LayoutContent>{children}</LayoutContent>
        </Col>
      </Row>
    </Grid>
  </SkeBasis>
);

const LayoutContent = styled.div`
  display: flex;
  margin: 0 15px;
`;

export function toDropdownOptions(affiliations: string[]): IDropdownOption[] {
  return affiliations
    .map(name => name.toLowerCase())
    .filter((value, index, self) => self.indexOf(value) === index)
    .sort()
    .reduce(
      (acc: IDropdownOption[], name) => [
        ...acc,
        {
          key: name,
          text: name
        }
      ],
      []
    );
}

export default Layout;

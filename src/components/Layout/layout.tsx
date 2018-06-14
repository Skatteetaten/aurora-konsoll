import FooterContent from 'aurora-frontend-react-komponenter/FooterContent';
import Grid from 'aurora-frontend-react-komponenter/Grid';
import SkeBasis from 'aurora-frontend-react-komponenter/SkeBasis';
import * as React from 'react';
import { Header } from '../Header';
import { Menu, MenuNavLink } from '../Menu';
import './layout.css';

export class Layout extends React.Component {
  public render() {
    return (
      <SkeBasis>
        <Header title="Aurora Konsoll" />
        <div className="layout-content">
          <div className="layout-menu">
            <Menu>
              <MenuNavLink name="Applikasjoner" to="/" iconName="Person" />
              <MenuNavLink name="Database" to="/db" iconName="Cloud" />
              <MenuNavLink name="Konfigurasjon" to="/conf" iconName="Code" />
              <MenuNavLink name="WebSEAL" to="/web" iconName="Bookmark" />
            </Menu>
          </div>
          {this.props.children}
        </div>
        <FooterContent>
          <Grid>
            <Grid.Row>
              <Grid.Col sm={12} lg={12} xl={3}>
                <FooterContent.Logo />
              </Grid.Col>
              <Grid.Col sm={12} lg={12} xl={3}>
                Annet innhold
              </Grid.Col>
            </Grid.Row>
          </Grid>
        </FooterContent>
      </SkeBasis>
    );
  }
}

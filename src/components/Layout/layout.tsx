import Grid from 'aurora-frontend-react-komponenter/Grid';
import SkeBasis from 'aurora-frontend-react-komponenter/SkeBasis';
import * as React from 'react';
import { Header, IDropdownOption } from '../Header';
import { Menu, MenuNavLink } from '../Menu';
import './layout.css';

const Row = ({ children }: { children: React.ReactNode }) => (
  <Grid.Row rowSpacing="0px">{children}</Grid.Row>
);

const Col = ({
  children,
  ...props
}: {
  children: React.ReactNode;
  [key: string]: any;
}) => (
  <Grid.Col noSpacing={true} {...props}>
    {children}
  </Grid.Col>
);

interface ILayoutProps {
  user: string;
  affiliations?: IDropdownOption[];
  handleChangeAffiliation: (affiliation: string) => void;
}

export class Layout extends React.Component<ILayoutProps> {
  public defaultProps = {
    affiliations: []
  };

  public render() {
    return (
      <SkeBasis>
        <Grid>
          <Row>
            <Col lg={12}>
              <Header
                title="Aurora Konsoll"
                user={this.props.user}
                affiliations={this.props.affiliations}
                handleChangeAffiliation={this.props.handleChangeAffiliation}
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
              <div className="layout-content">{this.props.children}</div>
            </Col>
          </Row>
        </Grid>
      </SkeBasis>
    );
  }
}

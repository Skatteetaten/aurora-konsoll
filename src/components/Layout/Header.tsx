import Grid from 'aurora-frontend-react-komponenter/Grid';
import Icon from 'aurora-frontend-react-komponenter/Icon';
import Image from 'aurora-frontend-react-komponenter/Image';
import * as Logo from 'aurora-frontend-react-komponenter/TopBanner/assets/ske-logo.svg';
import palette from 'aurora-frontend-react-komponenter/utils/palette';
import * as React from 'react';

import { Link } from 'react-router-dom';
import styled from 'styled-components';
import './Header.css';

interface IHeaderProps {
  title: string;
  user: string;
  className?: string;
  children?: React.ReactNode;
}

const Header = ({ title, user, className, children }: IHeaderProps) => {
  return (
    <div className={`main-header ${className || ''}`}>
      <Grid>
        <Grid.Row className="main-header-grid">
          <div className="main-header-row">
            <Grid.Col lg={3} xl={2} noSpacing={true}>
              <HomeLink to="/">
                <div className="main-header-logo-wrapper">
                  <div>
                    <Image src={Logo} className="main-header-logo" />
                  </div>
                  <h2 className="main-header-title">{title}</h2>
                </div>
              </HomeLink>
            </Grid.Col>
            <Grid.Col lg={3} xl={2} noSpacing={true}>
              {children}
            </Grid.Col>
            <Grid.Col lg={6} xl={4} xlPush={4} noSpacing={true}>
              <div className="main-header-user-wrapper">
                <p style={{ margin: 0, fontSize: '20px' }}>{user}</p>
                <Icon iconName="Person" className="main-header-user-icon" />
              </div>
            </Grid.Col>
          </div>
        </Grid.Row>
      </Grid>
    </div>
  );
};

const HomeLink = styled(Link)`
  color: ${palette.skeColor.black};
  text-decoration: none;
`;

export default Header;

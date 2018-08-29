import * as React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import Grid from 'aurora-frontend-react-komponenter/Grid';
import Icon from 'aurora-frontend-react-komponenter/Icon';
import Image from 'aurora-frontend-react-komponenter/Image';
import Separator from 'aurora-frontend-react-komponenter/TopBanner/assets/separator.png';
import Logo from 'aurora-frontend-react-komponenter/TopBanner/assets/ske-logo.svg';
import palette from 'aurora-frontend-react-komponenter/utils/palette';

interface IHeaderProps {
  title: string;
  user: string;
  className?: string;
  children?: React.ReactNode;
}

const Header = ({ title, user, className, children }: IHeaderProps) => {
  return (
    <div className={className}>
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

export default styled(Header)`
  &::after {
    display: block;
    content: '';
    width: 100%;
    height: 12px;
    background-color: rgb(255, 255, 255);
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
    background-image: url(${Separator});
  }

  .main-header-grid {
    margin: 15px 0;
  }

  .main-header-row {
    display: flex;
    align-items: center;
  }

  .main-header-logo-wrapper {
    margin-left: 15px;
    display: flex;
    align-items: center;
  }

  .main-header-title {
    margin: 0;
    margin-left: 15px;
    font-size: 20px;
  }

  .main-header-logo img {
    height: 50px;
  }

  .main-header-user-wrapper {
    align-items: center;
    display: flex;
    margin-right: 15px;
    float: right;
  }

  .main-header-user-icon {
    color: #1362ae;
    font-size: 32px;
    margin-left: 10px;
  }
`;

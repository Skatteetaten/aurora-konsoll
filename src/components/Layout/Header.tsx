import * as React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import Icon from 'aurora-frontend-react-komponenter/Icon';
import Image from 'aurora-frontend-react-komponenter/Image';
import separatorImg from 'aurora-frontend-react-komponenter/TopBanner/assets/separator.png';
import Logo from 'aurora-frontend-react-komponenter/TopBanner/assets/ske-logo.svg';
import palette from 'aurora-frontend-react-komponenter/utils/palette';

interface IHeaderProps {
  title: string;
  user: string;
  className?: string;
  children?: React.ReactNode;
}

const logOut = () => {
  window.localStorage.clear();
  window.location.reload();
};

const Header = ({ title, user, className, children }: IHeaderProps) => {
  return (
    <div className={className}>
      <div className="g-header-layout">
        <HomeLink to="/" className="g-header-logo">
          <div className="header-logo-wrapper">
            <div>
              <Image src={Logo} className="header-logo" />
            </div>
            <h2 className="header-title">{title}</h2>
          </div>
        </HomeLink>
        <div className="g-header-content">{children}</div>
        <div className="g-header-user">
          <div className="dropdown-menu">
            <div className="dropdown-element">
              <p>{user}</p>
              <Icon iconName="Person" className="user-icon" />
            </div>
            <div className="dropdown-menu-content">
              <a onClick={logOut}>Logg ut </a>
            </div>
          </div>
        </div>
      </div>
      <Separator />
    </div>
  );
};

const HomeLink = styled(Link)`
  color: ${palette.skeColor.black};
  text-decoration: none;
`;

const Separator = styled.div`
  &::after {
    display: block;
    content: '';
    width: 100%;
    height: 12px;
    background-color: rgb(255, 255, 255);
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
    background-image: url(${separatorImg});
  }
`;

export default styled(Header)`
  display: flex;
  flex-direction: column;

  .g-header-layout {
    display: grid;
    align-items: center;
    grid-template-columns: 250px 1fr;
    grid-template-rows: auto 1fr;
    grid-template-areas: 'logo contents user';
    padding: 10px 0;
  }

  .g-header-logo {
    grid-area: logo;
  }

  .header-logo-wrapper {
    margin-left: 15px;
    display: flex;
    align-items: center;
  }

  .header-logo img {
    height: 50px;
  }

  .header-title {
    margin: 0;
    margin-left: 15px;
    font-size: 20px;
  }

  .g-header-contents {
    grid-area: contents;
  }

  .g-header-user {
    grid-area: user;
    display: flex;
    align-items: center;
    margin-right: 15px;

    p {
      margin: 0;
      font-size: 20px;
    }

    .user-icon {
      color: #1362ae;
      font-size: 32px;
      margin-left: 10px;
    }

    .dropdown-element {
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: default;
      padding: 5px;
    }

    .dropdown-menu {
      position: relative;
    }

    .dropdown-menu-content {
      cursor: pointer;
      display: none;
      position: absolute;
      width: 100%;
      background-color: ${palette.skeColor.neutralGrey};
      box-shadow: 0px 3px 3px 0px ${palette.skeColor.lightGrey};
      z-index: 15;
    }

    .dropdown-menu-content a {
      color: black;
      padding: 12px 16px;
      text-decoration: none;
      display: block;
    }

    .dropdown-menu-content a:hover {
      background-color: ${palette.skeColor.whiteGrey};
    }

    .dropdown-menu:hover .dropdown-menu-content {
      display: block;
    }

    .dropdown-menu:hover .dropdown-element {
      background-color: ${palette.skeColor.whiteGrey};
      box-shadow: 0px 0px 3px 0px ${palette.skeColor.lightGrey};
    }
  }
`;

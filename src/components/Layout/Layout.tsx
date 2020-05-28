import * as React from 'react';

import { connect } from 'react-redux';

import Dropdown from '@skatteetaten/frontend-components/Dropdown';

import { toDropdownOptions } from 'utils/aurora-frontend';

import { IUserAndAffiliations } from 'models/ApplicationDeployment';
import { RootState } from 'store/types';
import styled from 'styled-components';
import Header from './Header';
import Menu from './Menu';
import MenuCollapseButton from './MenuCollapseButton';
import MenuNavLink, { IMenuNavLinkData } from './MenuNavLink';
import { IDropdownOption } from 'office-ui-fabric-react/lib-commonjs';

interface ILayoutProps {
  affiliation?: string;
  className?: string;
  handleMenuExpand: () => void;
  isMenuExpanded: boolean;
  showAffiliationSelector: boolean;
  children: React.ReactNode;
  onAffiliationChange: (affiliation: string) => void;
  displayDatabaseView: boolean;
  displaySkapViews: boolean;
  currentUser?: IUserAndAffiliations;
}

const defaultUser: IUserAndAffiliations = {
  affiliations: [],
  id: '',
  user: ''
};

const Layout = ({
  affiliation,
  className,
  isMenuExpanded,
  handleMenuExpand,
  showAffiliationSelector,
  children,
  onAffiliationChange,
  displayDatabaseView,
  displaySkapViews,
  currentUser = defaultUser
}: ILayoutProps) => {
  const onAffiliationChanged = (
    e: React.FormEvent<HTMLDivElement>,
    item?: IDropdownOption,
    index?: number
  ) => {
    if (index && index > 0 && item) {
      onAffiliationChange(item.text);
    }
  };

  const databaseMenuLink: IMenuNavLinkData = {
    iconName: 'Save',
    name: 'Database',
    to: `/a/${affiliation || '_'}/db`
  };

  const skapMenuLinks: IMenuNavLinkData[] = [
    {
      iconName: 'LockOutline',
      name: 'Webseal',
      to: `/a/${affiliation || '_'}/webseal`
    },
    {
      iconName: 'Lock',
      name: 'Sertifikater',
      to: '/certificates'
    }
  ];

  const menuLinks: IMenuNavLinkData[] = [
    {
      iconName: 'Menu',
      name: 'Applikasjoner',
      to: `/a/${affiliation || '_'}/deployments`
    },
    {
      iconName: 'Code',
      name: 'Netdebug',
      to: '/netdebug'
    },
    {
      iconName: 'Code',
      name: 'Storyteller',
      to: '/storyteller'
    }
  ];

  if (displayDatabaseView) {
    menuLinks.push(databaseMenuLink);
  }

  if (displaySkapViews) {
    menuLinks.push(...skapMenuLinks);
  }

  menuLinks.map(item => ({
    ...item,
    showName: isMenuExpanded
  }));

  const layoutClassNames =
    className + (isMenuExpanded ? ' menu-expanded ' : ' menu-collapsed');

  return (
    <div className={layoutClassNames}>
      <Header
        title="Aurora Konsoll"
        className="g-header"
        currentUser={currentUser}
      >
        {showAffiliationSelector && (
          <Dropdown
            placeholder="Velg tilhørighet"
            options={toDropdownOptions(currentUser.affiliations)}
            onChange={onAffiliationChanged}
            selectedKey={affiliation}
          />
        )}
      </Header>
      <Menu className="g-menu">
        {menuLinks.map(props => (
          <MenuNavLink key={props.name} showName={isMenuExpanded} {...props} />
        ))}
        <MenuCollapseButton
          isExpanded={isMenuExpanded}
          onClick={handleMenuExpand}
        />
      </Menu>
      <div className="g-content">{children}</div>
    </div>
  );
};

const StyledLayout = styled(Layout)`
  height: 100%;
  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-columns: ${props => (props.isMenuExpanded ? '250px' : '70px')} 1fr;
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
    overflow: hidden;
  }

  .ms-Dropdown-container {
    max-width: 250px;
  }
`;

const mapStateToProps = (state: RootState) => ({
  currentUser: state.startup.currentUser
});

const LayoutConnected = connect(mapStateToProps, null)(StyledLayout);

export default LayoutConnected;

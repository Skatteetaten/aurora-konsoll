import * as React from 'react';

import { connect } from 'react-redux';

import { Dropdown } from '@skatteetaten/frontend-components/Dropdown';

import { toDropdownOptions } from 'web/utils/aurora-frontend';

import { IUserAndAffiliations } from 'web/models/ApplicationDeployment';
import { RootState } from 'web/store/types';
import styled from 'styled-components';
import Header from './Header';
import Menu from './Menu';
import MenuCollapseButton from './MenuCollapseButton';
import MenuNavLink, { IMenuNavLinkData } from './MenuNavLink';
import { IDropdownOption } from '@fluentui/react';

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
  displayDnsView: boolean;
  displayStorageGridView: boolean;
  displayStorytellerView: boolean;
  currentUser?: IUserAndAffiliations;
}

const defaultUser: IUserAndAffiliations = {
  affiliations: [],
  id: '',
  user: '',
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
  displayDnsView,
  displayStorageGridView,
  displayStorytellerView,
  currentUser = defaultUser,
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
    to: `/a/${affiliation || '_'}/db`,
  };

  const skapMenuLinks: IMenuNavLinkData[] = [
    {
      iconName: 'LockOutline',
      name: 'Webseal',
      to: `/a/${affiliation || '_'}/webseal`,
    },
    {
      iconName: 'Lock',
      name: 'Sertifikater',
      to: '/certificates',
    },
  ];
  const dnsMenuLink: IMenuNavLinkData = {
    iconName: 'Earth',
    name: 'DNS',
    to: `/a/${affiliation || '_'}/dns`,
  };

  const storageGridMenuLink: IMenuNavLinkData = {
    iconName: 'File',
    name: 'StorageGrid',
    to: `/a/${affiliation || '_'}/storageGrid`,
  };

  const menuLinks: IMenuNavLinkData[] = [
    {
      iconName: 'Menu',
      name: 'Applikasjoner',
      to: `/a/${affiliation || '_'}/deployments`,
    },
    {
      iconName: 'Code',
      name: 'Netdebug',
      to: '/netdebug',
    },
  ];

  const storytellerLink: IMenuNavLinkData = {
    iconName: 'Code',
    name: 'Storyteller',
    to: `/storyteller`,
  };

  if (displayDatabaseView) {
    menuLinks.push(databaseMenuLink);
  }

  if (displayStorageGridView) {
    menuLinks.push(storageGridMenuLink);
  }

  if (displaySkapViews) {
    menuLinks.push(...skapMenuLinks);
  }

  if (displayDnsView) {
    menuLinks.push(dnsMenuLink);
  }

  if (displayStorytellerView) {
    menuLinks.push(storytellerLink);
  }

  menuLinks.map((item) => ({
    ...item,
    showName: isMenuExpanded,
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
        {menuLinks.map((props) => (
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
  grid-template-columns: ${(props) => (props.isMenuExpanded ? '250px' : '70px')} 1fr;
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
  currentUser: state.startup.currentUser,
});

const LayoutConnected = connect(mapStateToProps, null)(StyledLayout);

export default LayoutConnected;

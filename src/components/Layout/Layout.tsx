import * as React from 'react';

import Dropdown, {
  IDropdownOption
} from 'aurora-frontend-react-komponenter/Dropdown';

import { toDropdownOptions } from 'utils/aurora-frontend';

import Header from './Header';
import Menu from './Menu';
import MenuCollapseButton from './MenuCollapseButton';
import MenuNavLink, { IMenuNavLinkData } from './MenuNavLink';

interface ILayoutProps {
  affiliation?: string;
  affiliations: string[];
  handleMenuExpand: () => void;
  isExpanded: boolean;
  user: string;
  showAffiliationSelector: boolean;
  children: React.ReactNode;
  onAffiliationChange: (affiliation: string) => void;
}

const Layout = ({
  affiliation,
  affiliations,
  isExpanded,
  handleMenuExpand,
  user,
  showAffiliationSelector,
  children,
  onAffiliationChange
}: ILayoutProps) => {
  const onAffiliationChanged = (item: IDropdownOption) =>
    onAffiliationChange(item.text);

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
    }
  ].map(item => ({
    ...item,
    showName: isExpanded
  }));

  return (
    <>
      <Header title="Aurora Konsoll" user={user} className="g-header">
        {showAffiliationSelector && (
          <Dropdown
            placeHolder="Velg tilhørighet"
            options={toDropdownOptions(affiliations)}
            onChanged={onAffiliationChanged}
            selectedKey={affiliation}
          />
        )}
      </Header>
      <Menu className="g-menu">
        {menuLinks.map(props => (
          <MenuNavLink key={props.name} {...props} />
        ))}
        <MenuCollapseButton
          isExpanded={isExpanded}
          onClick={handleMenuExpand}
        />
      </Menu>
      <div className="g-content">{children}</div>
    </>
  );
};

export default Layout;

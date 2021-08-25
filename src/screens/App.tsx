import React, { useState } from 'react';
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
  useRouteMatch,
} from 'react-router-dom';
import styled from 'styled-components';

import { SkeBasis } from '@skatteetaten/frontend-components';

import { TokenStore } from 'services/TokenStore';

import LayoutConnected from 'components/Layout/Layout';
import { CertificateConnected } from './CertificateView/CertificateConnected';

import { ErrorBoundaryConnected } from 'screens/ErrorHandler/ErrorBoundaryConnected';
import { AffiliationViewValidatorConnected } from './AffiliationViews/AffiliationViewValidatorConnected';
import { NetdebugConnected } from './NetdebugView/NetdebugConnected';

import { SecretTokenNavigation } from './SecretToken';
import AcceptToken from './AcceptToken';
import { StorytellerView } from './StorytellerView/StorytellerView';

interface IAppProps {
  tokenStore: TokenStore;
  displayDatabaseView: boolean;
  displaySkapViews: boolean;
  displayDnsView: boolean;
}

export const App: React.FC<IAppProps> = ({
  displayDatabaseView,
  displaySkapViews,
  displayDnsView,
  tokenStore,
}) => {
  const [affiliation, setAffiliation] = useState<string | undefined>(undefined);
  const [isMenuExpanded, setMenuExpanded] = useState(true);

  const history = useHistory();
  const location = useLocation();
  const match = useRouteMatch<{ affiliation: string; screen: string }>();

  if (!match) {
    return null;
  }

  const onAffiliationChangeFromSelector = (newAffiliation: string) => {
    let newPath = '';
    if (location.pathname.startsWith('/a/')) {
      newPath = location.pathname.replace(
        /\/a\/(\b\w*[-]?\w*\b)\/(\w*)(\/.*)?/,
        `/a/${newAffiliation}/$2`
      );
    }
    history.push(newPath);
  };

  const onSelectedAffiliationValidated = (affiliation: string) => {
    setAffiliation(affiliation);
  };

  const onTokenUpdated = () => {
    window.location.replace('/');
  };

  const isAuthenticated = tokenStore.isTokenValid();

  return (
    <StyledSkeBasis>
      <ErrorBoundaryConnected>
        <LayoutConnected
          isMenuExpanded={isMenuExpanded}
          handleMenuExpand={() => setMenuExpanded(!isMenuExpanded)}
          affiliation={affiliation}
          showAffiliationSelector={location.pathname.startsWith('/a/')}
          onAffiliationChange={onAffiliationChangeFromSelector}
          displayDatabaseView={displayDatabaseView}
          displaySkapViews={displaySkapViews}
          displayDnsView={displayDnsView}
        >
          <Route path="/secret" component={SecretTokenNavigation} />
          <Route path="/accept-token">
            <AcceptToken
              onTokenUpdated={onTokenUpdated}
              tokenStore={tokenStore}
            />
          </Route>
          {isAuthenticated && (
            <Switch>
              <Redirect
                exact={true}
                from="/"
                to={`/a/${affiliation || '_'}/deployments`}
              />
              <Route path="/a/:affiliation">
                <AffiliationViewValidatorConnected
                  affiliation={affiliation}
                  onAffiliationValidated={onSelectedAffiliationValidated}
                />
              </Route>
              <Route
                exact={true}
                path="/netdebug"
                component={NetdebugConnected}
              />
              <Route
                exact={true}
                path="/certificates"
                component={CertificateConnected}
              />
              <Route
                exact={false}
                path="/storyteller"
                component={StorytellerView}
              />
            </Switch>
          )}
        </LayoutConnected>
      </ErrorBoundaryConnected>
    </StyledSkeBasis>
  );
};

const StyledSkeBasis = styled(SkeBasis)`
  height: 100%;
`;

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

import { SkeBasis } from '@skatteetaten/frontend-components/SkeBasis';

import { TokenStore } from 'web/services/TokenStore';

import LayoutConnected from 'web/components/Layout/Layout';
import { CertificateConnected } from './CertificateView/CertificateConnected';

import { ErrorBoundaryConnected } from 'web/screens/ErrorHandler/ErrorBoundaryConnected';
import { AffiliationViewValidatorConnected } from './AffiliationViews/AffiliationViewValidatorConnected';
import { NetdebugConnected } from './NetdebugView/NetdebugConnected';

import { SecretTokenNavigation } from './SecretToken';
import AcceptToken from './AcceptToken';
import { StorytellerView } from './StorytellerView/StorytellerView';

interface IAppProps {
  tokenStore: TokenStore;
  openshiftCluster?: string;
  displayDatabaseView: boolean;
  displaySkapViews: boolean;
  displayDnsView: boolean;
  displayStorageGridView: boolean;
  storageGridInformationUrl?: string;
  displayStorytellerView: boolean;
}

export const App: React.FC<IAppProps> = ({
  displayDatabaseView,
  displaySkapViews,
  displayDnsView,
  displayStorageGridView,
  storageGridInformationUrl,
  displayStorytellerView,
  tokenStore,
  openshiftCluster,
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
          displayStorageGridView={displayStorageGridView}
          displayStorytellerView={displayStorytellerView}
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
                  storageGridInformationUrl={storageGridInformationUrl}
                  onAffiliationValidated={onSelectedAffiliationValidated}
                  openshiftCluster={openshiftCluster}
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

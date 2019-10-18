import React, { useState } from 'react';
import {
  Redirect,
  Route,
  RouteComponentProps,
  Switch,
  withRouter,
  useHistory,
  useLocation,
  useRouteMatch
} from 'react-router-dom';
import styled from 'styled-components';

import SkeBasis from 'aurora-frontend-react-komponenter/SkeBasis';

import { ITokenStore } from 'services/TokenStore';
import AcceptTokenRoute from './AcceptTokenView/AcceptTokenRoute';

import LayoutConnected from 'components/Layout/Layout';
import { CertificateConnected } from './CertificateView/CertificateConnected';

import { ErrorBoundaryConnected } from 'screens/ErrorHandler/ErrorBoundaryConnected';
import { AffiliationViewValidatorConnected } from './AffiliationViews/AffiliationViewValidatorConnected';
import { NetdebugConnected } from './NetdebugView/NetdebugConnected';

import { SecretTokenRoute } from './SecretTokenView/SecretTokenRoute';

interface IAppProps {
  tokenStore: ITokenStore;
  displayDatabaseView: boolean;
  displaySkapViews: boolean;
}

export const App: React.FC<IAppProps> = ({
  displayDatabaseView,
  displaySkapViews,
  tokenStore
}) => {
  const [affiliation, setAffiliation] = useState<string | undefined>(undefined);
  const [isMenuExpanded, setMenuExpanded] = useState(true);

  const history = useHistory();
  const location = useLocation();
  const match = useRouteMatch<{ affiliation: string; screen: string }>();

  if (!match) {
    // TODO: FIX
    return null;
  }

  const handleMenuExpand = () => {
    setMenuExpanded(!isMenuExpanded);
  };

  // TODO: add screen to link
  const onAffiliationChangeFromSelector = (newAffiliation: string) => {
    let newPath = '';
    if (location.pathname.startsWith('/a/')) {
      newPath = location.pathname.replace(
        `/a/${affiliation}`,
        `/a/${newAffiliation}`
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
    <StyledSkeBasis menuExpanded={isMenuExpanded}>
      <ErrorBoundaryConnected>
        <LayoutConnected
          isMenuExpanded={isMenuExpanded}
          handleMenuExpand={handleMenuExpand}
          affiliation={affiliation}
          showAffiliationSelector={location.pathname.startsWith('/a/')}
          onAffiliationChange={onAffiliationChangeFromSelector}
          displayDatabaseView={displayDatabaseView}
          displaySkapViews={displaySkapViews}
        >
          <SecretTokenRoute />
          <AcceptTokenRoute onTokenUpdated={onTokenUpdated} />
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

import * as React from 'react';
import {
  Redirect,
  Route,
  RouteComponentProps,
  Switch,
  withRouter
} from 'react-router-dom';
import styled from 'styled-components';

import Konami from 'react-konami-code';

import SkeBasis from 'aurora-frontend-react-komponenter/SkeBasis';

import { IAuroraApiComponentProps } from 'components/AuroraApi';
import { ITokenStore } from 'services/TokenStore';
import AcceptTokenRoute from './AcceptTokenView/AcceptTokenRoute';

import { withAuroraApi } from 'components/AuroraApi';
import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';
import LayoutConnected from 'components/Layout/Layout';
import { errorStateManager } from 'models/StateManager/ErrorStateManager';
import AffiliationViewValidatorConnected, {
  AffiliationRouteProps
} from './AffiliationViews/AffiliationViewValidator';
import { CertificateConnected } from './CertificateView/CertificateConnected';
import GoboUsageView from './GoboUsageView';
import { NetdebugWithApi } from './NetdebugView/Netdebug';

export enum MenuType {
  DEPLOYMENTS,
  DATABASE,
  WEBSEAL
}

interface IAppProps extends IAuroraApiComponentProps, RouteComponentProps<{}> {
  tokenStore: ITokenStore;
  displayDatabaseView: boolean;
  displaySkapViews: boolean;
}

interface IAppState {
  affiliation?: string;
  isMenuExpanded: boolean;
}

class App extends React.Component<IAppProps, IAppState> {
  public state: IAppState = {
    affiliation: undefined,
    isMenuExpanded: true
  };

  public handleMenuExpand = () => {
    this.setState(state => ({
      isMenuExpanded: !state.isMenuExpanded
    }));
  };

  public onAffiliationChangeFromSelector = (affiliation: string) => {
    const {
      location,
      history,
      displayDatabaseView,
      displaySkapViews
    } = this.props;
    let newPath = '';

    if (location.pathname.startsWith('/a/')) {
      newPath = location.pathname.replace(
        /\/a\/(\b\w*[-]?\w*\b)\/(\w*)(\/.*)?/,
        `/a/${affiliation}/$2`
      );
    } else if (location.pathname.startsWith('/db/') && displayDatabaseView) {
      newPath = location.pathname.replace(
        /\/db\/(\b\w*[-]?\w*\b)\/(\w*)(\/.*)?/,
        `/db/${affiliation}/$2`
      );
    } else if (location.pathname.startsWith('/w/') && displaySkapViews) {
      newPath = location.pathname.replace(
        /\/w\/(\b\w*[-]?\w*\b)\/(\w*)(\/.*)?/,
        `/w/${affiliation}/$2`
      );
    }
    history.push(newPath);
  };

  public onSelectedAffiliationValidated = (affiliation: string) => {
    this.setState({
      affiliation
    });
  };

  public render() {
    const isAuthenticated = this.props.tokenStore.isTokenValid();

    const { affiliation, isMenuExpanded } = this.state;
    const { location, displayDatabaseView, displaySkapViews } = this.props;

    const renderAffiliationViewValidatorDeployments = (
      routeProps: AffiliationRouteProps
    ) => renderAffiliationViewValidator(routeProps, MenuType.DEPLOYMENTS);

    const renderAffiliationViewValidatorDatabase = (
      routeProps: AffiliationRouteProps
    ) => renderAffiliationViewValidator(routeProps, MenuType.DATABASE);

    const renderAffiliationViewValidatorWebseal = (
      routeProps: AffiliationRouteProps
    ) => renderAffiliationViewValidator(routeProps, MenuType.WEBSEAL);

    const renderAffiliationViewValidator = (
      routeProps: AffiliationRouteProps,
      type: MenuType
    ) => (
      <AffiliationViewValidatorConnected
        {...routeProps}
        type={type}
        affiliation={affiliation}
        onAffiliationValidated={this.onSelectedAffiliationValidated}
      />
    );

    return (
      <StyledSkeBasis menuExpanded={isMenuExpanded}>
        <Konami timeout={10000}>
          <GoboUsageView clients={this.props.clients} />
        </Konami>
        <ErrorBoundary errorSM={errorStateManager}>
          <LayoutConnected
            isMenuExpanded={isMenuExpanded}
            handleMenuExpand={this.handleMenuExpand}
            affiliation={affiliation}
            showAffiliationSelector={
              location.pathname.startsWith('/a/') ||
              location.pathname.startsWith('/db/') ||
              location.pathname.startsWith('/w/')
            }
            onAffiliationChange={this.onAffiliationChangeFromSelector}
            displayDatabaseView={displayDatabaseView}
            displaySkapViews={displaySkapViews}
          >
            <AcceptTokenRoute onTokenUpdated={this.onTokenUpdated} />
            {isAuthenticated && (
              <Switch>
                <Redirect
                  exact={true}
                  from="/"
                  to={`/a/${affiliation || '_'}/deployments`}
                />
                <Route
                  path="/a/:affiliation"
                  render={renderAffiliationViewValidatorDeployments}
                />
                <Route
                  exact={true}
                  path="/netdebug"
                  component={NetdebugWithApi}
                />
                <Route
                  exact={true}
                  path="/certificates"
                  component={CertificateConnected}
                />
                {displayDatabaseView && (
                  <Route
                    path="/db/:affiliation"
                    render={renderAffiliationViewValidatorDatabase}
                  />
                )}
                <Route
                  exact={true}
                  path="/w/:affiliation/webseal"
                  render={renderAffiliationViewValidatorWebseal}
                />
              </Switch>
            )}
          </LayoutConnected>
        </ErrorBoundary>
      </StyledSkeBasis>
    );
  }

  public onTokenUpdated = () => {
    window.location.replace('/');
  };
}

export default withRouter(withAuroraApi(App));

const StyledSkeBasis = styled(SkeBasis)`
  height: 100%;
`;

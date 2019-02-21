import * as React from 'react';
import {
  Redirect,
  Route,
  RouteComponentProps,
  Switch,
  withRouter
} from 'react-router-dom';
import styled from 'styled-components';

import SkeBasis from 'aurora-frontend-react-komponenter/SkeBasis';

import { IAuroraApiComponentProps } from 'components/AuroraApi';
import Layout from 'components/Layout';
import { ITokenStore } from 'services/TokenStore';
import AcceptTokenRoute from './AcceptTokenView/AcceptTokenRoute';

import { withAuroraApi } from 'components/AuroraApi';
import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';
import { errorStateManager } from 'models/StateManager/ErrorStateManager';
import AffiliationViewValidator, {
  AffiliationRouteProps
} from './AffiliationViews/AffiliationViewValidator';
import { NetdebugWithApi } from './NetdebugView/Netdebug';

export enum MenuType {
  DEPLOYMENTS,
  DATABASE
}

interface IAppProps extends IAuroraApiComponentProps, RouteComponentProps<{}> {
  tokenStore: ITokenStore;
  displayDatabaseView: boolean;
}

interface IAppState {
  affiliation?: string;
  affiliations: string[];
  isMenuExpanded: boolean;
  user: string;
}

class App extends React.Component<IAppProps, IAppState> {
  public state: IAppState = {
    affiliation: undefined,
    affiliations: [],
    isMenuExpanded: true,
    user: ''
  };

  public handleMenuExpand = () => {
    this.setState(state => ({
      isMenuExpanded: !state.isMenuExpanded
    }));
  };

  public onAffiliationChangeFromSelector = (affiliation: string) => {
    const { location, history, displayDatabaseView } = this.props;
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
    }
    history.push(newPath);
  };

  public onSelectedAffiliationValidated = (affiliation: string) => {
    this.setState({
      affiliation
    });
  };

  public async componentDidMount() {
    const {
      affiliations,
      user
    } = await this.props.clients.applicationDeploymentClient.findUserAndAffiliations();

    this.setState(() => ({
      affiliations,
      user
    }));
  }

  public render() {
    const isAuthenticated = this.props.tokenStore.isTokenValid();
    const { affiliation, affiliations, isMenuExpanded, user } = this.state;
    const { location, displayDatabaseView } = this.props;

    const renderAffiliationViewValidatorDeployments = (
      routeProps: AffiliationRouteProps
    ) => renderAffiliationViewValidator(routeProps, MenuType.DEPLOYMENTS);

    const renderAffiliationViewValidatorDatabase = (
      routeProps: AffiliationRouteProps
    ) => renderAffiliationViewValidator(routeProps, MenuType.DATABASE);

    const renderAffiliationViewValidator = (
      routeProps: AffiliationRouteProps,
      type: MenuType
    ) => (
      <AffiliationViewValidator
        {...routeProps}
        user={user}
        type={type}
        affiliation={affiliation}
        affiliations={affiliations}
        onAffiliationValidated={this.onSelectedAffiliationValidated}
      />
    );

    return (
      <StyledSkeBasis menuExpanded={isMenuExpanded}>
        <ErrorBoundary errorSM={errorStateManager}>
          <Layout
            user={user}
            isMenuExpanded={isMenuExpanded}
            handleMenuExpand={this.handleMenuExpand}
            affiliation={affiliation}
            affiliations={affiliations}
            showAffiliationSelector={
              location.pathname.startsWith('/a/') ||
              location.pathname.startsWith('/db/')
            }
            onAffiliationChange={this.onAffiliationChangeFromSelector}
            displayDatabaseView={displayDatabaseView}
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
                {displayDatabaseView && (
                  <Route
                    path="/db/:affiliation"
                    render={renderAffiliationViewValidatorDatabase}
                  />
                )}
              </Switch>
            )}
          </Layout>
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

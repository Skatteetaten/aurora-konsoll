import * as React from 'react';
import {
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
import { errorSM } from 'models/StateManager/ErrorStateManager';
import AffiliationViewRouteHandler, {
  AffiliationRouteProps
} from './AffiliationViews/AffiliationViewRouteHandler';
import { NetdebugWithApi } from './NetdebugView/Netdebug';

interface IAppProps extends IAuroraApiComponentProps, RouteComponentProps<{}> {
  tokenStore: ITokenStore;
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
    const { location, history } = this.props;
    const newPath = location.pathname.replace(
      /\/a\/(\b\w*[-]?\w*\b)\/(\w*)(\/.*)?/,
      `/a/${affiliation}/$2`
    );
    history.push(newPath);
  };

  public onSelectedAffiliationValidated = (affiliation: string) => {
    this.setState({
      affiliation
    });
  };

  public addDummyError = () => {
    errorSM.addError(new Error('Client failed '));
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
    const { location } = this.props;

    const renderAffiliationViewRouteHandler = (
      routeProps: AffiliationRouteProps
    ) => (
      <AffiliationViewRouteHandler
        {...routeProps}
        affiliation={affiliation}
        affiliations={affiliations}
        onAffiliationValidated={this.onSelectedAffiliationValidated}
      />
    );

    return (
      <StyledSkeBasis menuExpanded={isMenuExpanded}>
        <ErrorBoundary errorSM={errorSM}>
          <Layout
            user={user}
            isExpanded={isMenuExpanded}
            handleMenuExpand={this.handleMenuExpand}
            affiliation={affiliation}
            affiliations={affiliations}
            showAffiliationSelector={location.pathname.startsWith('/a/')}
            onAffiliationChange={this.onAffiliationChangeFromSelector}
          >
            <button onClick={this.addDummyError}>add error</button>
            <AcceptTokenRoute onTokenUpdated={this.onTokenUpdated} />
            {isAuthenticated && (
              <Switch>
                <Route
                  path="/a/:affiliation"
                  render={renderAffiliationViewRouteHandler}
                />
                <Route
                  exact={true}
                  path="/netdebug"
                  component={NetdebugWithApi}
                />
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

const StyledSkeBasis = styled<{ menuExpanded: boolean }>(SkeBasis)`
  height: 100%;
  display: grid;
  grid-template-columns: ${props => (props.menuExpanded ? '250px' : '70px')} 1fr;
  grid-template-rows: auto 1fr;
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
    max-height: 100%;
    overflow: auto;
  }

  .ms-Dropdown-container {
    max-width: 250px;
  }
`;

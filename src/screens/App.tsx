import * as React from 'react';
import {
  Route,
  RouteComponentProps,
  Switch,
  withRouter
} from 'react-router-dom';

import { IAuroraApiComponentProps } from 'components/AuroraApi';
import Layout from 'components/Layout';
import { ITokenStore } from 'services/TokenStore';
import AcceptTokenRoute from './AcceptTokenView/AcceptTokenRoute';

import { withAuroraApi } from 'components/AuroraApi';
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
      <Layout
        user={user}
        handleMenuExpand={this.handleMenuExpand}
        isExpanded={isMenuExpanded}
        affiliation={affiliation}
        affiliations={affiliations}
        showAffiliationSelector={location.pathname.startsWith('/a/')}
        onAffiliationChange={this.onAffiliationChangeFromSelector}
      >
        <AcceptTokenRoute onTokenUpdated={this.onTokenUpdated} />
        {isAuthenticated && (
          <Switch>
            <Route
              path="/a/:affiliation"
              render={renderAffiliationViewRouteHandler}
            />
            <Route exact={true} path="/netdebug" component={NetdebugWithApi} />
          </Switch>
        )}
      </Layout>
    );
  }

  public onTokenUpdated = () => {
    window.location.replace('/');
  };
}

export default withRouter(withAuroraApi(App));

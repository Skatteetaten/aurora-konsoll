import * as React from 'react';
import { Route, RouteComponentProps, withRouter } from 'react-router-dom';

import { IAuroraApiComponentProps } from 'components/AuroraApi';
import Layout from 'components/Layout';
import { ITokenStore } from 'services/TokenStore';
import AcceptTokenRoute from './AcceptTokenView/AcceptTokenRoute';

import { withAuroraApi } from 'components/AuroraApi';
import AffiliationViewRouteHandler, {
  AffiliationRouteProps
} from './AffiliationViews/AffiliationViewRouteHandler';
import Home from './HomeView/Home';
import Netdebug from './NetdebugView/Netdebug';

interface IRoutesProps
  extends IAuroraApiComponentProps,
    RouteComponentProps<{}> {
  tokenStore: ITokenStore;
}

interface IRoutesState {
  affiliation?: string;
  affiliations: string[];
  user: string;
}

class App extends React.Component<IRoutesProps, IRoutesState> {
  public state: IRoutesState = {
    affiliation: undefined,
    affiliations: [],
    user: ''
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
    } = await this.props.clients.apiClient.findUserAndAffiliations();

    this.setState(() => ({
      affiliations,
      user
    }));
  }

  public render() {
    const isAuthenticated = this.props.tokenStore.isTokenValid();
    const { affiliation, affiliations, user } = this.state;
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
        affiliation={affiliation}
        affiliations={affiliations}
        showAffiliationSelector={location.pathname.startsWith('/a/')}
        onAffiliationChange={this.onAffiliationChangeFromSelector}
      >
        <AcceptTokenRoute onTokenUpdated={this.onTokenUpdated} />
        {isAuthenticated && (
          <>
            <Route exact={true} path="/" component={Home} />
            <Route
              path="/a/:affiliation"
              render={renderAffiliationViewRouteHandler}
            />
            <Route exact={true} path="/netdebug" component={Netdebug} />
          </>
        )}
      </Layout>
    );
  }

  public onTokenUpdated = () => {
    window.location.replace('/');
  };
}

export default withRouter(withAuroraApi(App));

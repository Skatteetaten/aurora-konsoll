import * as React from 'react';
import { BrowserRouter, Route, RouteComponentProps } from 'react-router-dom';

import { IAuroraApiComponentProps } from 'components/AuroraApi';
import Layout from 'components/Layout';
import AcceptToken from 'screens/AcceptToken';
import { ITokenStore } from 'services/TokenStore';

import withAuroraApi from 'components/auroraApi/withAuroraApi';
import Home from './Home';
import ApplicationsRoute from './routes/ApplicationsRoute';

interface IRoutesProps extends IAuroraApiComponentProps {
  tokenStore: ITokenStore;
}

interface IRoutesState {
  affiliation?: string;
  affiliations: string[];
  user: string;
}

class Routes extends React.Component<IRoutesProps, IRoutesState> {
  public state: IRoutesState = {
    affiliation: undefined,
    affiliations: [],
    user: ''
  };

  public selectAffiliation = (affiliation: string) => {
    this.setState(state => ({
      affiliation
    }));
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
    const acceptToken = (props: RouteComponentProps<{}>) => (
      <AcceptToken {...props} onTokenUpdated={this.onTokenUpdated} />
    );
    const isAuthenticated = this.props.tokenStore.isTokenValid();

    const { affiliation, affiliations, user } = this.state;

    return (
      <BrowserRouter>
        <Layout
          affiliation={affiliation || ''}
          user={user}
          affiliations={affiliations}
          handleChangeAffiliation={this.selectAffiliation}
        >
          <Route exact={true} path="/accept-token" render={acceptToken} />
          {isAuthenticated && (
            <>
              <Route exact={true} path="/" component={Home} />
              <ApplicationsRoute affiliation={affiliation} />
            </>
          )}
        </Layout>
      </BrowserRouter>
    );
  }

  public onTokenUpdated = () => {
    window.location.replace('/');
  };
}

export default withAuroraApi(Routes);

import * as React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import { IAuroraApiComponentProps } from 'components/AuroraApi';
import Layout from 'components/Layout';
import { ITokenStore } from 'services/TokenStore';
import AcceptTokenRoute from './AcceptTokenView/AcceptTokenRoute';

import { withAuroraApi } from 'components/AuroraApi';
import ApplicationViewWithApi from './AffiliationViews/ApplicationViewWithApi';
import Home from './HomeView/Home';

interface IRoutesProps extends IAuroraApiComponentProps {
  tokenStore: ITokenStore;
}

interface IRoutesState {
  affiliations: string[];
  user: string;
}

class App extends React.Component<IRoutesProps, IRoutesState> {
  public state: IRoutesState = {
    affiliations: [],
    user: ''
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

    const { affiliations, user } = this.state;

    return (
      <BrowserRouter>
        <Layout user={user} affiliations={affiliations}>
          <AcceptTokenRoute onTokenUpdated={this.onTokenUpdated} />
          {isAuthenticated && (
            <>
              <Route exact={true} path="/" component={Home} />
              <Route path="/:affiliation" component={ApplicationViewWithApi} />
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

export default withAuroraApi(App);

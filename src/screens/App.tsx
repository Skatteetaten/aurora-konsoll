import * as React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import { IAuroraApiComponentProps } from 'components/AuroraApi';
import Layout from 'components/Layout';
import { ITokenStore } from 'services/TokenStore';
import AcceptTokenRoute from './AcceptTokenView/AcceptTokenRoute';

import { withAuroraApi } from 'components/AuroraApi';
import ApplicationViewWithApiRoute from './ApplicationView/ApplicationViewWithApiRoute';
import Home from './HomeView/Home';

interface IRoutesProps extends IAuroraApiComponentProps {
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
    const isAuthenticated = this.props.tokenStore.isTokenValid();

    const { affiliation, affiliations, user } = this.state;

    return (
      <BrowserRouter>
        <Layout
          selectedAffiliation={affiliation || ''}
          user={user}
          affiliations={affiliations}
          handleChangeAffiliation={this.selectAffiliation}
        >
          <AcceptTokenRoute onTokenUpdated={this.onTokenUpdated} />
          {isAuthenticated && (
            <>
              <Route exact={true} path="/" component={Home} />
              <ApplicationViewWithApiRoute affiliation={affiliation} />
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

import * as React from 'react';
import { BrowserRouter, Route, RouteComponentProps } from 'react-router-dom';

import { AuroraApi, IApiClients } from 'components/AuroraApi';
import Layout from 'components/Layout';
import AcceptToken from 'modules/AcceptToken';
import Applications from 'screens/Applications';
import { ITokenStore } from 'services/TokenStore';

interface IRoutesProps {
  tokenStore: ITokenStore;
}

interface IRoutesState {
  affiliation?: string;
}

export default class Routes extends React.Component<
  IRoutesProps,
  IRoutesState
> {
  public state = {
    affiliation: undefined
  };

  public selectAffiliation = (affiliation: string) => {
    this.setState(state => ({
      affiliation
    }));
  };

  public renderApplications = () => {
    return <Applications affiliation={this.state.affiliation} />;
  };

  public render() {
    const acceptToken = (props: RouteComponentProps<{}>) => (
      <AcceptToken {...props} onTokenUpdated={this.onTokenUpdated} />
    );
    const isAuthenticated = this.props.tokenStore.isTokenValid();

    function fetchUserAffiliations({ apiClient }: IApiClients) {
      return apiClient.findUserAndAffiliations();
    }

    return (
      <BrowserRouter>
        <AuroraApi fetch={fetchUserAffiliations}>
          {(data = { user: '', affiliations: [] }) => (
            <Layout
              user={data.user}
              affiliations={data.affiliations}
              handleChangeAffiliation={this.selectAffiliation}
            >
              <Route exact={true} path="/accept-token" render={acceptToken} />
              {isAuthenticated && (
                <div style={{ flex: '1' }}>
                  <Route
                    exact={true}
                    path="/"
                    render={this.renderApplications}
                  />
                  <Route
                    exact={true}
                    path="/db"
                    render={this.renderApplications}
                  />
                </div>
              )}
            </Layout>
          )}
        </AuroraApi>
      </BrowserRouter>
    );
  }

  public onTokenUpdated = () => {
    window.location.replace('/');
  };
}

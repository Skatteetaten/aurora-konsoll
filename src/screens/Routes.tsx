import * as React from 'react';
import { BrowserRouter, Route, RouteComponentProps } from 'react-router-dom';

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

    return (
      <BrowserRouter>
        <Layout handleChangeAffiliation={this.selectAffiliation}>
          <Route exact={true} path="/accept-token" render={acceptToken} />
          {isAuthenticated && (
            <div>
              <Route exact={true} path="/" render={this.renderApplications} />
              <Route exact={true} path="/db" render={this.renderApplications} />
            </div>
          )}
        </Layout>
      </BrowserRouter>
    );
  }

  public onTokenUpdated = () => {
    window.location.replace('/');
  };
}

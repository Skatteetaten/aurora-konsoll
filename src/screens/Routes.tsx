import * as React from 'react';
import { BrowserRouter, Route, RouteComponentProps } from 'react-router-dom';

import { AuroraApi } from 'components/AuroraApi';
import Layout, { toDropdownOptions } from 'components/Layout';
import AcceptToken from 'modules/AcceptToken';
import Applications from 'screens/Applications';
import {
  IAuroraApiClient,
  IUserAffiliationResult
} from 'services/AuroraApiClient';
import { TokenStore } from 'services/TokenStore';

interface IRoutesProps {
  tokenStore: TokenStore;
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
    return <Applications />;
  };

  public render() {
    const acceptToken = (props: RouteComponentProps<{}>) => (
      <AcceptToken {...props} onTokenUpdated={this.onTokenUpdated} />
    );
    const isAuthenticated = this.props.tokenStore.isTokenValid();
    const findAllAffiliations = (client: IAuroraApiClient) =>
      client.findUserAndAffiliations();
    return (
      <BrowserRouter>
        <AuroraApi fetch={findAllAffiliations}>
          {({ user, affiliations }: IUserAffiliationResult) => (
            <Layout
              user={user}
              handleChangeAffiliation={this.selectAffiliation}
              affiliations={toDropdownOptions(affiliations)}
            >
              <Route exact={true} path="/accept-token" render={acceptToken} />
              {isAuthenticated && (
                <div>
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

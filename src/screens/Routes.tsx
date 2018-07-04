import * as React from 'react';
import { BrowserRouter, Route, RouteComponentProps } from 'react-router-dom';

import { AuroraApi, IApiClients } from 'components/AuroraApi';
import Layout from 'components/Layout';
import AcceptToken from 'modules/AcceptToken';
import Applications from 'screens/Applications';
import { ITokenStore } from 'services/TokenStore';
import Home from './Home';

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
  public state: IRoutesState = {
    affiliation: undefined
  };

  public selectAffiliation = (affiliation: string) => {
    this.setState(state => ({
      affiliation
    }));
  };

  public renderApplications = (
    props: RouteComponentProps<{ affiliation: string }>
  ) => {
    const { affiliation } = this.state;

    if (!affiliation) {
      return <p>Please select affiliation</p>;
    }

    const fetchApplications = ({ apiClient }: IApiClients) =>
      apiClient.findAllApplicationsForAffiliations([affiliation]);

    return (
      <AuroraApi fetch={fetchApplications}>
        {(applications = [], loading) => {
          return (
            <Applications
              {...props}
              affiliation={affiliation}
              loading={loading}
              applications={applications}
            />
          );
        }}
      </AuroraApi>
    );
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
              affiliation={this.state.affiliation || ''}
              user={data.user}
              affiliations={data.affiliations}
              handleChangeAffiliation={this.selectAffiliation}
            >
              <Route exact={true} path="/accept-token" render={acceptToken} />
              {isAuthenticated && (
                <>
                  <Route exact={true} path="/" component={Home} />
                  <Route path="/app" render={this.renderApplications} />
                </>
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

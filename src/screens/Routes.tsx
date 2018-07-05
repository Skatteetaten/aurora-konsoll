import * as React from 'react';
import { BrowserRouter, Route, RouteComponentProps } from 'react-router-dom';

import {
  AuroraApi,
  IApiClients,
  IAuroraApiComponentProps
} from 'components/AuroraApi';
import Layout from 'components/Layout';
import AcceptToken from 'modules/AcceptToken';
import Applications from 'screens/Applications';
import { ITokenStore } from 'services/TokenStore';

import withAuroraApi from 'components/auroraApi/withAuroraApi';
import Home from './Home';

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

    const { affiliations, user } = this.state;

    return (
      <BrowserRouter>
        <Layout
          affiliation={this.state.affiliation || ''}
          user={user}
          affiliations={affiliations}
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
      </BrowserRouter>
    );
  }

  public onTokenUpdated = () => {
    window.location.replace('/');
  };
}

export default withAuroraApi(Routes);

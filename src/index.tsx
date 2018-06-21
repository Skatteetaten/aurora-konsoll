/* tslint:disable:no-console */

import { default as ApolloClient } from 'apollo-boost';
import { default as gql } from 'graphql-tag';
import * as qs from 'qs';
import * as React from 'react';
import { ApolloProvider, Query, QueryResult } from 'react-apollo';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Route, RouteComponentProps } from 'react-router-dom';

import { IDropdownOption } from 'components/Header';
import { Layout } from 'components/Layout';
import AcceptToken from 'modules/AcceptToken';
import Applications from 'screens/Applications';
import registerServiceWorker from 'services/registerServiceWorker';
import { tokenStore, TokenStore } from 'services/TokenStore';

import { fetchConfiguration, IConfiguration } from './config';
import './index.css';

class Application extends React.Component<
  {
    tokenStore: TokenStore;
  },
  {
    affiliation?: string;
  }
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
        <Query query={USER_AFFILIATIONS_QUERY}>
          {({ data }: QueryResult<IUserAffiliationsQuery>) => {
            let user = '';
            if (data && data.currentUser) {
              user = data.currentUser.name;
            }
            return (
              <Layout
                user={user}
                affiliations={toDropdownOptions(data)}
                handleChangeAffiliation={this.selectAffiliation}
              >
                <Route exact={true} path="/accept-token" render={acceptToken} />
                {isAuthenticated && (
                  <Route
                    exact={true}
                    path="/"
                    render={this.renderApplications}
                  />
                )}
              </Layout>
            );
          }}
        </Query>
      </BrowserRouter>
    );
  }

  public onTokenUpdated = () => {
    window.location.replace('/');
  };
}

function toDropdownOptions(data?: IUserAffiliationsQuery): IDropdownOption[] {
  if (!data || !data.affiliations) {
    return [];
  }

  return data.affiliations.edges
    .map(edge => edge.node.name.toLowerCase())
    .filter((value, index, self) => self.indexOf(value) === index)
    .sort()
    .reduce(
      (acc: IDropdownOption[], name) => [
        ...acc,
        {
          key: name,
          text: name
        }
      ],
      []
    );
}

const USER_AFFILIATIONS_QUERY = gql`
  {
    currentUser {
      name
    }
    affiliations {
      edges {
        node {
          name
        }
      }
    }
  }
`;

interface IUserAffiliationsQuery {
  currentUser: {
    name: string;
  };
  affiliations: {
    edges: Array<{
      node: {
        name: string;
      };
    }>;
  };
}

async function init() {
  const configOrError = await fetchConfiguration();
  if ((configOrError as Error).message) {
    console.log((configOrError as Error).message);
    return;
  }
  const config = configOrError as IConfiguration;

  if (!tokenStore.isTokenValid()) {
    redirectToLoginPage(config.AUTHORIZATION_URI, config.CLIENT_ID);
  }

  const client = new ApolloClient({
    request: async operations => {
      const token = tokenStore.getToken();
      operations.setContext({
        headers: {
          Authorization: token ? `Bearer ${token}` : ''
        }
      });
    },
    uri: config.GRAPHQL_URL
  });

  ReactDOM.render(
    <ApolloProvider client={client}>
      <Application tokenStore={tokenStore} />
    </ApolloProvider>,
    document.getElementById('root') as HTMLElement
  );
  registerServiceWorker();
}

function redirectToLoginPage(authorizationUri: string, clientId: string) {
  const authorizationUrl =
    authorizationUri +
    '?' +
    qs.stringify(
      Object.assign({
        client_id: clientId,
        redirect_uri: window.location.origin + '/accept-token',
        response_type: 'token',
        scope: '',
        state: ''
      })
    );
  window.location.replace(authorizationUrl);
}

init();

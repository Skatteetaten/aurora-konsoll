/* tslint:disable:no-console */

import { default as ApolloClient } from 'apollo-boost';
import { default as gql } from 'graphql-tag';
import * as qs from 'qs';
import * as React from 'react';
import { ApolloProvider } from 'react-apollo';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Route, RouteComponentProps } from 'react-router-dom';
import App from './App';
import { Layout } from './components/Layout';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import TokenStore from './TokenStore';

interface IConfiguration {
  AUTHORIZATION_URI: string;
  CLIENT_ID: string;
  GRAPHQL_URL: string;
}

async function fetchConfiguration(): Promise<IConfiguration | Error> {
  try {
    const data = await fetch('/api/config');
    return await data.json();
  } catch (error) {
    (window as any).e = error;
    return error;
  }
}

const tokenStore = new TokenStore();

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

const AcceptToken = ({
  location,
  onTokenUpdated
}: RouteComponentProps<{}> & { onTokenUpdated: () => void }) => {
  interface IAuthQueryString {
    expires_in: string;
    access_token: string;
  }

  const authQueryString = qs.parse(
    location.hash.substring(1)
  ) as IAuthQueryString;

  const token = authQueryString.access_token;
  const expiresInSeconds = Number(authQueryString.expires_in);
  tokenStore.updateToken(token, expiresInSeconds);

  onTokenUpdated();
  return <div />;
};

class Application extends React.Component<{
  tokenStore: TokenStore;
}> {
  public render() {
    const acceptToken = (props: RouteComponentProps<{}>) => (
      <AcceptToken {...props} onTokenUpdated={this.onTokenUpdated} />
    );
    const isAuthenticated = this.props.tokenStore.isTokenValid();
    return (
      <BrowserRouter>
        <Layout>
          <Route exact={true} path="/accept-token" render={acceptToken} />
          {isAuthenticated && <Route exact={true} path="/" component={App} />}
        </Layout>
      </BrowserRouter>
    );
  }

  public onTokenUpdated = () => {
    window.location.replace('/');
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

  interface IAffiliations {
    affiliations: {
      edges: Array<{
        node: {
          name: string;
        };
      }>;
    };
  }

  client
    .query<IAffiliations>({
      query: gql`
        {
          affiliations {
            edges {
              node {
                name
              }
            }
          }
        }
      `
    })
    .then(result => {
      const { affiliations } = result.data;
      console.log(
        affiliations.edges.reduce((acc, edge) => [...acc, edge.node.name], [])
      );
    });

  ReactDOM.render(
    <ApolloProvider client={client}>
      <Application tokenStore={tokenStore} />
    </ApolloProvider>,
    document.getElementById('root') as HTMLElement
  );
  registerServiceWorker();
}

init();

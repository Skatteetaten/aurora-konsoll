/* tslint:disable:no-console */

import { default as ApolloClient } from 'apollo-boost';
import * as qs from 'qs';
import * as React from 'react';
import { ApolloProvider } from 'react-apollo';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Route, RouteComponentProps } from 'react-router-dom';

import { Layout } from 'components/Layout';
import AcceptToken from 'modules/AcceptToken';
import Applications from 'screens/Applications';
import registerServiceWorker from 'services/registerServiceWorker';
import { tokenStore, TokenStore } from 'services/TokenStore';

import { fetchConfiguration, IConfiguration } from './config';
import './index.css';

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
          {isAuthenticated && (
            <Route exact={true} path="/" component={Applications} />
          )}
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

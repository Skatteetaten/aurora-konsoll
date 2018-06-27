import * as qs from 'qs';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { AuroraApiProvider } from 'components/AuroraApi';
import Routes from 'screens/Routes';
import AuroraApiClient from 'services/AuroraApiClient';
import { tokenStore } from 'services/TokenStore';
import { fetchConfiguration, IConfiguration } from 'utils/config';
import registerServiceWorker from 'utils/registerServiceWorker';

import './index.css';

async function init() {
  const configOrError = await fetchConfiguration();
  if ((configOrError as Error).message) {
    throw new Error((configOrError as Error).message);
  }
  const config = configOrError as IConfiguration;

  if (!tokenStore.isTokenValid()) {
    redirectToLoginPage(config.AUTHORIZATION_URI, config.CLIENT_ID);
  }

  const client = new AuroraApiClient(config.GRAPHQL_URL);

  ReactDOM.render(
    <AuroraApiProvider client={client}>
      <Routes tokenStore={tokenStore} />
    </AuroraApiProvider>,
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

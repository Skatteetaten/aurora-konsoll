import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { Provider } from 'react-redux';

import { IApiClients } from 'models/AuroraApi';
import { tokenStore } from 'services/TokenStore';
import { fetchConfiguration, IConfiguration } from 'utils/config';

import { App } from 'screens/App';
import {
  ApplicationDeploymentClient,
  CertificateClient,
  DatabaseClient,
  ImageRepositoryClient,
  NetdebugClient,
  UserSettingsClient,
  WebsealClient,
  DnsClient,
} from 'services/auroraApiClients';
import GoboClient from 'services/GoboClient';
import createStoreWithApi from 'store';
import { requestCurrentUser } from 'store/state/startup/action.creators';
import './index.css';

async function init() {
  const configOrError = await fetchConfiguration();
  if ((configOrError as Error).message) {
    throw new Error((configOrError as Error).message);
  }
  const config = configOrError as IConfiguration;

  if (!tokenStore.isTokenValid() && window.location.pathname !== '/secret') {
    redirectToLoginPage(config.AUTHORIZATION_URI, config.CLIENT_ID);
  }

  const urlParams = new URLSearchParams(window.location.hash.replace('#', '?'));
  const token = urlParams.get('access_token')
    ? urlParams.get('access_token')
    : tokenStore.getToken();
  const expiresInSeconds = Number(urlParams.get('expires_in'));
  if (urlParams.get('access_token')) {
    tokenStore.updateToken(token as string, expiresInSeconds);
  }

  const goboClient = new GoboClient({
    url: '/api/graphql',
    headers: {
      Authorization: token ? token : '',
      KlientID: config.APPLICATION_NAME,
    },
  });

  const clients: IApiClients = {
    applicationDeploymentClient: new ApplicationDeploymentClient(goboClient),
    imageRepositoryClient: new ImageRepositoryClient(goboClient),
    netdebugClient: new NetdebugClient(goboClient),
    userSettingsClient: new UserSettingsClient(goboClient),
    databaseClient: new DatabaseClient(goboClient),
    websealClient: new WebsealClient(goboClient),
    certificateClient: new CertificateClient(goboClient),
    dnsClient: new DnsClient(goboClient),
  };

  const store = createStoreWithApi(clients);
  store.dispatch(requestCurrentUser());

  ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <App
          tokenStore={tokenStore}
          displayDatabaseView={config.DBH_ENABLED}
          displayDnsView={config.GAVEL_ENABLED}
          displaySkapViews={config.SKAP_ENABLED}
        />
      </BrowserRouter>
    </Provider>,
    document.getElementById('root') as HTMLElement
  );
}

function redirectToLoginPage(authorizationUri: string, clientId: string) {
  const params = new URLSearchParams();
  params.append('client_id', clientId);
  params.append('redirect_uri', window.location.origin + '/secret');
  params.append('response_type', 'token');
  params.append('scope', '');
  params.append('state', '');
  const authorizationUrl = authorizationUri + '?' + params.toString();
  window.location.replace(authorizationUrl);
}

init();

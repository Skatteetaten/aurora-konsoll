import * as qs from 'qs';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { Provider } from 'react-redux';

import { AuroraApiProvider, IApiClients } from 'components/AuroraApi';
import { tokenStore } from 'services/TokenStore';
import { fetchConfiguration, IConfiguration } from 'utils/config';

import App from 'screens/App';
import {
  ApplicationDeploymentClient,
  CertificateClient,
  DatabaseClient,
  GoboUsageClient,
  ImageRepositoryClient,
  NetdebugClient,
  UserSettingsClient,
  WebsealClient
} from 'services/auroraApiClients';
import GoboClient from 'services/GoboClient';
import { StartupConnected } from 'Startup';
import createStoreWithApi from 'store';
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

  const token = tokenStore.getToken();
  const goboClient = new GoboClient({
    url: '/api/graphql',
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      KlientID: config.APPLICATION_NAME
    }
  });

  const clients: IApiClients = {
    applicationDeploymentClient: new ApplicationDeploymentClient(goboClient),
    imageRepositoryClient: new ImageRepositoryClient(goboClient),
    netdebugClient: new NetdebugClient(goboClient),
    userSettingsClient: new UserSettingsClient(goboClient),
    databaseClient: new DatabaseClient(goboClient),
    websealClient: new WebsealClient(goboClient),
    goboUsageClient: new GoboUsageClient(goboClient),
    certificateClient: new CertificateClient(goboClient)
  };

  ReactDOM.render(
    <Provider store={createStoreWithApi(clients)}>
      <StartupConnected>
        <AuroraApiProvider clients={clients}>
          <BrowserRouter>
            <App
              tokenStore={tokenStore}
              displayDatabaseView={config.DBH_ENABLED}
              displaySkapViews={config.SKAP_ENABLED}
            />
          </BrowserRouter>
        </AuroraApiProvider>
      </StartupConnected>
    </Provider>,
    document.getElementById('root') as HTMLElement
  );
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

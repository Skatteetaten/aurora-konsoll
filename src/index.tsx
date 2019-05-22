import * as qs from 'qs';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { Provider } from 'react-redux';
import createStoreWithClients from './store';

import { AuroraApiProvider, IApiClients } from 'components/AuroraApi';
import { tokenStore } from 'services/TokenStore';
import { fetchConfiguration, IConfiguration } from 'utils/config';

import { errorStateManager } from 'models/StateManager/ErrorStateManager';
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

  interface IAuthQueryString {
    expires_in: string;
    access_token: string;
  }

  const authQueryString = qs.parse(
    window.location.hash.substring(1)
  ) as IAuthQueryString;

  const token = authQueryString.access_token ? authQueryString.access_token : tokenStore.getToken();
  const expiresInSeconds = Number(authQueryString.expires_in);
  if (authQueryString.access_token !== null && authQueryString.access_token !== undefined) {
    tokenStore.updateToken(authQueryString.access_token, expiresInSeconds);
  }
  
  const goboClient = new GoboClient({
    errorHandler: errorStateManager,
    url: '/api/graphql',
    headers: {
      Authorization: token ? token : '',
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
    <Provider store={createStoreWithClients(clients)}>
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

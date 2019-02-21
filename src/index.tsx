import * as qs from 'qs';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { Provider } from 'react-redux';
import createStoreWithClients from './store';

import { AuroraApiProvider, IApiClients } from 'components/AuroraApi';
import App from 'screens/App';
import { tokenStore } from 'services/TokenStore';
import {
  fetchConfiguration,
  IConfiguration,
  isDbhUrlDefined
} from 'utils/config';

import { errorStateManager } from 'models/StateManager/ErrorStateManager';
import {
  ApplicationDeploymentClient,
  DatabaseClient,
  ImageRepositoryClient,
  NetdebugClient,
  UserSettingsClient
} from 'services/auroraApiClients';
import GoboClient from 'services/GoboClient';
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
  const dbhConfigOrError = await isDbhUrlDefined();

  if ((dbhConfigOrError as Error).message) {
    throw new Error((dbhConfigOrError as Error).message);
  }
  const displayDatabaseView = dbhConfigOrError as boolean;

  const token = tokenStore.getToken();
  const goboClient = new GoboClient({
    errorHandler: errorStateManager,
    url: '/api/graphql',
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  });

  const clients: IApiClients = {
    applicationDeploymentClient: new ApplicationDeploymentClient(goboClient),
    imageRepositoryClient: new ImageRepositoryClient(goboClient),
    netdebugClient: new NetdebugClient(goboClient),
    userSettingsClient: new UserSettingsClient(goboClient),
    databaseClient: new DatabaseClient(goboClient)
  };

  ReactDOM.render(
    <Provider store={createStoreWithClients(clients)}>
      <AuroraApiProvider clients={clients}>
        <BrowserRouter>
          <App
            tokenStore={tokenStore}
            displayDatabaseView={displayDatabaseView}
          />
        </BrowserRouter>
      </AuroraApiProvider>
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

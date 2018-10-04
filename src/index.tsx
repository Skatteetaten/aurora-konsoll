import * as qs from 'qs';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { AuroraApiProvider, IApiClients } from 'components/AuroraApi';
import App from 'screens/App';
import { tokenStore } from 'services/TokenStore';
import { fetchConfiguration, IConfiguration } from 'utils/config';

import { errorStateManager } from 'models/StateManager/ErrorStateManager';
import {
  ApplicationDeploymentClient,
  ImageRepositoryClient,
  NetdebugClient
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

  const token = tokenStore.getToken();
  const goboClient = new GoboClient({
    errorHandler: errorStateManager,
    url: config.GRAPHQL_URL,
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  });

  const clients: IApiClients = {
    applicationDeploymentClient: new ApplicationDeploymentClient(goboClient),
    imageRepositoryClient: new ImageRepositoryClient(goboClient),
    netdebugClient: new NetdebugClient(goboClient)
  };

  ReactDOM.render(
    <AuroraApiProvider clients={clients}>
      <BrowserRouter>
        <App tokenStore={tokenStore} />
      </BrowserRouter>
    </AuroraApiProvider>,
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

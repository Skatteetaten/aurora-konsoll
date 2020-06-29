import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { Provider } from 'react-redux';

import { IApiClients } from 'models/AuroraApi';
import { IConfiguration } from 'utils/config';

import { App } from 'screens/App';
import {
  ApplicationDeploymentClient,
  CertificateClient,
  DatabaseClient,
  ImageRepositoryClient,
  NetdebugClient,
  UserSettingsClient,
  WebsealClient,
} from 'services/auroraApiClients';
import GoboClient from 'services/GoboClient';
import createStoreWithApi from 'store';
import { requestCurrentUser } from 'store/state/startup/action.creators';
import './index.css';
import { TokenStore } from 'services/TokenStore';

const Root = (props: any) => {
  const tokenStore: TokenStore = props.tokenStore;
  const configOrError = props.konsollConfig;
  if ((configOrError as Error).message) {
    throw new Error((configOrError as Error).message);
  }
  const config = configOrError as IConfiguration;
  const token = tokenStore.getToken();
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
  };

  const store = createStoreWithApi(clients);
  store.dispatch(requestCurrentUser());

  return (
    <Provider store={store}>
      <BrowserRouter>
        <App
          tokenStore={tokenStore}
          displayDatabaseView={config.DBH_ENABLED}
          displaySkapViews={config.SKAP_ENABLED}
        />
      </BrowserRouter>
    </Provider>
  );
};

export default Root;

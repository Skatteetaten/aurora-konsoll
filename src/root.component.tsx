import React, { FC } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { Provider } from 'react-redux';

import { IApiClients } from 'web/models/AuroraApi';
import { IConfiguration, isConfiguration } from 'web/utils/config';

import { App } from 'web/screens/App';
import {
  ApplicationDeploymentClient,
  CertificateClient,
  DatabaseClient,
  DnsClient,
  ImageRepositoryClient,
  NetdebugClient,
  UserSettingsClient,
  WebsealClient,
} from 'web/services/auroraApiClients';
import GoboClient from 'web/services/GoboClient';
import createStoreWithApi from 'web/store';
import { requestCurrentUser } from 'web/store/state/startup/action.creators';
import './index.css';
import { TokenStore } from 'web/services/TokenStore';

type Props = {
  tokenStore: TokenStore;
  konsollConfig: IConfiguration | Error;
};

const Root: FC<Props> = (props) => {
  const tokenStore: TokenStore = props.tokenStore;
  const configOrError = props.konsollConfig;

  if (!isConfiguration(configOrError)) {
    throw new Error(configOrError.message);
  }

  const config = configOrError;
  const token = tokenStore.getToken();
  const goboClient = new GoboClient({
    url: '/api/graphql',
    headers: {
      Authorization: token ?? '',
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

  return (
    <Provider store={store}>
      <BrowserRouter>
        <App
          tokenStore={tokenStore}
          displayDatabaseView={config.DBH_ENABLED}
          displayDnsView={config.GAVEL_ENABLED}
          displaySkapViews={config.SKAP_ENABLED}
          displayStorytellerView={config.STORYTELLER_ENABLED}
        />
      </BrowserRouter>
    </Provider>
  );
};

export default Root;

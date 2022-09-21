import React, { FC, useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { Provider } from 'react-redux';

import { IApiClients } from 'web/models/AuroraApi';
import {
  fetchConfiguration,
  IConfiguration,
  isConfiguration,
} from 'web/utils/config';

import { App } from 'web/screens/App';
import {
  ApplicationDeploymentClient,
  CertificateClient,
  DatabaseClient,
  DnsClient,
  ImageRepositoryClient,
  NetdebugClient,
  StorageGridClient,
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
};

const Root: FC<Props> = ({ tokenStore }) => {
  const [config, setConfig] = useState<IConfiguration>();

  useEffect(() => {
    (async () => {
      const configOrError = await fetchConfiguration();
      if (!isConfiguration(configOrError)) {
        throw new Error('Could not fetch configuration');
      }

      setConfig(configOrError);
    })();
  }, []);

  // TODO: Error handling
  if (!config) {
    return <div />;
  }

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
    storageGridClient: new StorageGridClient(goboClient),
  };

  const store = createStoreWithApi(clients);
  store.dispatch(requestCurrentUser());

  return (
    <Provider store={store}>
      <BrowserRouter>
        <App
          tokenStore={tokenStore}
          displayDatabaseView={config.DBH_ENABLED}
          displayDnsView={config.DNS_ENABLED}
          displaySkapViews={config.SKAP_ENABLED}
          displayStorageGridView={config.STORAGEGRID_ENABLED}
          storageGridInformationUrl={config.STORAGEGRID_INFORMATION_URL}
          openshiftCluster={config.OPENSHIFT_CLUSTER}
          displayStorytellerView={config.STORYTELLER_ENABLED}
        />
      </BrowserRouter>
    </Provider>
  );
};

export default Root;

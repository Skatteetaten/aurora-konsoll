/**
 * This file is just for local development with react-scripts. For Single-SPA
 * development, see: README.md
 */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { tokenStore } from 'web/services/TokenStore';
import { fetchConfiguration, isConfiguration } from 'web/utils/config';
import Root from './root.component';

async function init() {
  const urlParams = new URLSearchParams(window.location.hash.replace('#', '?'));
  const accessToken = urlParams.get('access_token');
  const expiresInSeconds = Number(urlParams.get('expires_in'));

  if (accessToken) {
    tokenStore.updateToken(accessToken as string, expiresInSeconds);
  }

  const configOrError = await fetchConfiguration();
  if (!isConfiguration(configOrError)) {
    throw new Error('Could not fetch configuration');
  }

  ReactDOM.render(
    <Root konsollConfig={configOrError} tokenStore={tokenStore} />,
    document.getElementById('root') as HTMLElement
  );
}

init();

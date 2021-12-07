import * as React from 'react';
import { TokenStore } from 'web/services/TokenStore';

export interface IAcceptTokenProps {
  tokenStore: TokenStore;
  onTokenUpdated: () => void;
}

const AcceptToken = ({ tokenStore, onTokenUpdated }: IAcceptTokenProps) => {
  const urlParams = new URLSearchParams(window.location.hash.replace('#', '?'));
  const token = urlParams.get('access_token') as string;
  const expiresInSeconds = Number(urlParams.get('expires_in'));
  tokenStore.updateToken(token, expiresInSeconds);

  onTokenUpdated();
  return <div />;
};

export default AcceptToken;

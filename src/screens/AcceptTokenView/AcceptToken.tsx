import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { tokenStore } from 'services/TokenStore';

export interface IAcceptTokenProps {
  onTokenUpdated: () => void;
}

const AcceptToken = ({
  location,
  onTokenUpdated
}: IAcceptTokenProps & RouteComponentProps<{}>) => {
  const urlParams = new URLSearchParams(window.location.hash.replace("#","?"));  
  const token = urlParams.get('access_token') as string;
  const expiresInSeconds = Number(urlParams.get('expires_in'));
  tokenStore.updateToken(token, expiresInSeconds);

  onTokenUpdated();
  return <div />;
};

export default AcceptToken;

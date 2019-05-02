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
  interface IAuthQueryString {
    expires_in: string;
    access_token: string;
  }

  const params = new URLSearchParams(location.hash.substring(1));
  const expiresIn = params.get("expires_in");
  const accessToken = params.get("access_token");

  const authQueryString: IAuthQueryString = {
    expires_in: expiresIn ? expiresIn : '',
    access_token: accessToken ? accessToken : ''
  };

  const token = authQueryString.access_token;
  const expiresInSeconds = Number(authQueryString.expires_in);
  tokenStore.updateToken(token, expiresInSeconds);

  onTokenUpdated();
  return <div />;
};

export default AcceptToken;

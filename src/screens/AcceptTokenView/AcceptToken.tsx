import * as qs from 'qs';
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

  const authQueryString = qs.parse(
    location.hash.substring(1)
  ) as IAuthQueryString;

  const token = authQueryString.access_token;
  const expiresInSeconds = Number(authQueryString.expires_in);
  tokenStore.updateToken(token, expiresInSeconds);

  onTokenUpdated();
  return <div />;
};

export default AcceptToken;
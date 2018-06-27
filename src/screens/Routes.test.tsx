import { AuroraApiProvider } from 'components/AuroraApi';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Routes from 'screens/Routes';
import {
  IAuroraApiClient,
  IUserAffiliationResult
} from 'services/AuroraApiClient';
import { ITokenStore } from 'services/TokenStore';

function toResult<P>(data: P): Promise<P> {
  return new Promise((): P => data);
}

const client: IAuroraApiClient = {
  findUserAndAffiliations: (): Promise<IUserAffiliationResult> =>
    toResult({
      affiliations: ['test'],
      user: 'Batman'
    })
};

const tokenStore: ITokenStore = {
  getToken: () => '',
  isTokenValid: () => true,
  updateToken: () => {
    return;
  }
};

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <AuroraApiProvider client={client}>
      <Routes tokenStore={tokenStore} />
    </AuroraApiProvider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});

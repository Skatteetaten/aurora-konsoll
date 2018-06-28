import { AuroraApiProvider } from 'components/AuroraApi';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Routes from 'screens/Routes';
import {
  IApplicationResult,
  IAuroraApiClient,
  IUserAffiliationResult
} from 'services/AuroraApiClient';
import { ITokenStore } from 'services/TokenStore';

function toResult<P>(data: P): Promise<P> {
  return new Promise((): P => data);
}

const apiClient: IAuroraApiClient = {
  findAllApplicationsForAffiliations: (): Promise<IApplicationResult[]> =>
    toResult([]),
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

const clients = {
  apiClient
};

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <AuroraApiProvider clients={clients}>
      <Routes tokenStore={tokenStore} />
    </AuroraApiProvider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});

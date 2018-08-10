import { AuroraApiProvider } from 'components/AuroraApi';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  IApplication,
  IAuroraApiClient,
  IUserAffiliationResult
} from 'services/AuroraApiClient/types';
// import { ITokenStore } from 'services/TokenStore';
// import App from './App';

async function toResult<P>(data: P) {
  return data;
}

const apiClient: IAuroraApiClient = {
  findAllApplicationsForAffiliations: (): Promise<IApplication[]> =>
    toResult([]),
  findTags: () =>
    toResult({
      fetchMore: async () => undefined,
      result: undefined
    }),
  findUserAndAffiliations: (): Promise<IUserAffiliationResult> =>
    toResult({
      affiliations: ['test'],
      user: 'Batman'
    })
};

// const tokenStore: ITokenStore = {
//   getToken: () => '',
//   isTokenValid: () => true,
//   updateToken: () => {
//     return;
//   }
// };

const clients = {
  apiClient
};

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <AuroraApiProvider clients={clients}>
      <p>test</p>
    </AuroraApiProvider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});

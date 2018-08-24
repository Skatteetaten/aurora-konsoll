import { AuroraApiProvider } from 'components/AuroraApi';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  IApplicationDeployment,
  ITagsPaged,
  IUserAndAffiliations
} from 'services/AuroraApiClient/types';
import { IAuroraApiClient } from 'services/AuroraApiClient/types';

async function toResult<P>(data: P) {
  return data;
}

const apiClient: IAuroraApiClient = {
  findAllApplicationDeployments: (): Promise<IApplicationDeployment[]> =>
    toResult([]),
  findTagsPaged: (repository: string, cursor?: string): Promise<ITagsPaged> =>
    toResult({
      endCursor: '',
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: '',
      tags: []
    }),
  findUserAndAffiliations: (): Promise<IUserAndAffiliations> =>
    toResult({
      affiliations: ['test'],
      user: 'Batman'
    })
};

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

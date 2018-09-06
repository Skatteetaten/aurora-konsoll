import { AuroraApiProvider } from 'components/AuroraApi';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { TagsPagedGroup } from 'services/AuroraApiClient/imageRepository/TagsPageGroup';
import {
  IApplicationDeployment,
  ITagsPaged,
  IUserAndAffiliations
} from 'services/AuroraApiClient/types';
import { IAuroraApiClient } from 'services/AuroraApiClient/types';

const apiClient: IAuroraApiClient = {
  findAllApplicationDeployments: async (): Promise<
    IApplicationDeployment[]
  > => [],
  findGroupedTagsPaged: async (): Promise<TagsPagedGroup> =>
    new Promise<TagsPagedGroup>(() => {
      return;
    }),
  findTagsPaged: async (): Promise<ITagsPaged> =>
    new Promise<ITagsPaged>(() => {
      return;
    }),
  findUserAndAffiliations: async (): Promise<IUserAndAffiliations> => ({
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

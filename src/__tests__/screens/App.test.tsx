import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { AuroraApiProvider, IApiClients } from 'components/AuroraApi';
import { TagsPagedGroup } from 'models/TagsPagedGroup';
import {
  IApplicationDeployment,
  IApplicationDeploymentClient,
  IImageRepositoryClient,
  INetdebugClient,
  INetdebugResult,
  ITagsPaged,
  IUserAndAffiliations
} from 'services/auroraApiClients';

const applicationDeploymentClient: IApplicationDeploymentClient = {
  findAllApplicationDeployments: async (): Promise<
    IApplicationDeployment[]
  > => [],
  findUserAndAffiliations: async (): Promise<IUserAndAffiliations> => ({
    affiliations: ['test'],
    user: 'Batman'
  })
};

const imageRepositoryClient: IImageRepositoryClient = {
  findGroupedTagsPaged: async (): Promise<TagsPagedGroup> =>
    ({} as TagsPagedGroup),
  findTagsPaged: async (): Promise<ITagsPaged> => ({} as ITagsPaged)
};

const netdebugClient: INetdebugClient = {
  findNetdebugStatus: async (): Promise<INetdebugResult> =>
    ({} as INetdebugResult)
};

const clients: IApiClients = {
  applicationDeploymentClient,
  imageRepositoryClient,
  netdebugClient
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

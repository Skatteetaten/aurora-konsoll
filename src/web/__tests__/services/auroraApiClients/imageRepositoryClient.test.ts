import { ImageRepositoryClient } from 'web/services/auroraApiClients/imageRepositoryClient/client';
import { goboClientMock, GraphQLSeverMock } from 'web/utils/GraphQLMock';

import * as getVersions from './__responses__/imageRepositoryClient/getVersions.json';

const serverMock = new GraphQLSeverMock();
const clientMock = goboClientMock(serverMock.graphQLUrl);
const imageRepositoryClient = new ImageRepositoryClient(clientMock);

afterAll((done) => {
  serverMock.close(done);
});

describe('findVersions', () => {
  it('should fetch tags from GraphQL server and normalize data', async () => {
    serverMock.putResponse('getVersions', getVersions);

    const result = await imageRepositoryClient.findVersions('test');
    expect(result).toMatchSnapshot();
  });

  it('should throw an error when no repositories are found', async () => {
    serverMock.putResponse('getVersions', { data: { imageRepositories: [] } });

    try {
      await imageRepositoryClient.findVersions('mock-repo');
    } catch (error) {
      expect((error as Error).message).toEqual(
        'Could not find tags for repository mock-repo'
      );
    }
  });
});

import { ImageRepositoryClient } from 'web/services/auroraApiClients/imageRepositoryClient/client';
import { goboClientMock, GraphQLSeverMock } from 'web/utils/GraphQLMock';

import * as getTags from './__responses__/imageRepositoryClient/getTags.json';

const serverMock = new GraphQLSeverMock();
const clientMock = goboClientMock(serverMock.graphQLUrl);
const imageRepositoryClient = new ImageRepositoryClient(clientMock);

afterAll((done) => {
  serverMock.close(done);
});

describe('findTags', () => {
  it('should fetch tags from GraphQL server and normalize data', async () => {
    serverMock.putResponse('getTags', getTags);

    const result = await imageRepositoryClient.findTags('test');
    expect(result).toMatchSnapshot();
  });

  it('should throw an error when no repositories are found', async () => {
    serverMock.putResponse('getTags', { data: { imageRepositories: [] } });

    try {
      await imageRepositoryClient.findTags('mock-repo');
    } catch (error) {
      expect((error as Error).message).toEqual(
        'Could not find tags for repository mock-repo'
      );
    }
  });
});

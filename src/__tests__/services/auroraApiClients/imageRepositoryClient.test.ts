import { ImageRepositoryClient } from 'services/auroraApiClients/imageRepositoryClient/client';
import { goboClientMock, GraphQLSeverMock } from 'utils/GraphQLMock';

import * as getTags from './__responses__/imageRepositoryClient/getTags.json';

const serverMock = new GraphQLSeverMock();
const clientMock = goboClientMock(serverMock.graphQLUrl);
const imageRepositoryClient = new ImageRepositoryClient(clientMock);

afterAll(() => {
  serverMock.close();
});

describe('findTagsPaged', () => {
  it('should fetch tags from GraphQL server and normalize data', async () => {
    serverMock.putResponse('getTags', getTags);

    const result = await imageRepositoryClient.findTagsPaged('test', 'MAJOR');
    expect(result).toMatchSnapshot();
  });

  it('should throw an error when no repositories are found', async () => {
    serverMock.putResponse('getTags', { data: { imageRepositories: [] } });

    try {
      await imageRepositoryClient.findTagsPaged('mock-repo', 'MAJOR');
    } catch (error) {
      expect((error as Error).message).toEqual(
        'Could not find tags for repository mock-repo'
      );
    }
  });
});

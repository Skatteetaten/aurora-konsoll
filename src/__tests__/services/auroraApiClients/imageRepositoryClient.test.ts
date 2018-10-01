import { ImageRepositoryClient } from 'services/auroraApiClients/imageRepositoryClient/client';
import { graphqlClientMock, GraphQLSeverMock } from 'utils/GraphQLMock';

import * as getTags from './__responses__/imageRepositoryClient/getTags.json';

const mockServer = new GraphQLSeverMock();
const mockClient = graphqlClientMock(mockServer.graphQLUrl);
const imageRepositoryClient = new ImageRepositoryClient(mockClient);

afterAll(() => {
  mockServer.close();
});

describe('findTagsPaged', () => {
  it('should fetch tags from GraphQL server and normalize data', async () => {
    mockServer.putResponse('getTags', getTags);

    const result = await imageRepositoryClient.findTagsPaged('test', 'MAJOR');
    expect(result).toMatchSnapshot();
  });

  it('should throw an error when no repositories are found', async () => {
    mockServer.putResponse('getTags', { data: { imageRepositories: [] } });

    try {
      await imageRepositoryClient.findTagsPaged('mock-repo', 'MAJOR');
    } catch (error) {
      expect((error as Error).message).toEqual(
        'Could not find tags for repository mock-repo'
      );
    }
  });
});

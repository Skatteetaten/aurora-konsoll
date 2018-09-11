import { graphqlClientMock, GraphQLSeverMock } from 'utils/GraphQLMock';

import { ImageRepositoryClient } from 'services/auroraApiClients/imageRepositoryClient/client';
import * as getTags from './responses/imageRepositoryClient/getTags.json';

const mockServer = new GraphQLSeverMock();
const mockClient = graphqlClientMock(mockServer.graphQLUrl);
const imageRepositoryClient = new ImageRepositoryClient(mockClient);

afterAll(() => {
  mockServer.close();
});

describe('findTagsPaged', () => {
  it('should fetch tags from GraphQL server and normalize data', async () => {
    mockServer.putResponse('getTags', getTags);

    const result = await imageRepositoryClient.findTagsPaged('test');

    expect(result).toEqual({
      endCursor: 'MQ==',
      hasNextPage: false,
      tags: [
        {
          lastModified: '2018-09-07T07:12:30.345885623Z',
          name: '2'
        },
        {
          lastModified: '2018-01-25T09:39:51.280498289Z',
          name: '1'
        }
      ]
    });
  });

  it('should throw an error when no repositories are found', async () => {
    mockServer.putResponse('getTags', { data: { imageRepositories: [] } });

    try {
      await imageRepositoryClient.findTagsPaged('mock-repo');
    } catch (error) {
      expect((error as Error).message).toEqual(
        'Could not find tags for repository mock-repo'
      );
    }
  });
});

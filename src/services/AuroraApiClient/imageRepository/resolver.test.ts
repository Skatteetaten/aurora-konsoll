import { graphqlClientMock, GraphQLSeverMock } from 'utils/GraphQLMock';
import { findTagsPaged } from './resolver';

import * as getTags from './responses/getTags.json';

const mockServer = new GraphQLSeverMock();
const mockClient = graphqlClientMock(mockServer.graphQLUrl);

afterAll(() => {
  mockServer.close();
});

it('should fetch tags from GraphQL server and normalize data', async () => {
  mockServer.putResponse('getTags', getTags);

  const result = await findTagsPaged(mockClient, 'test');

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

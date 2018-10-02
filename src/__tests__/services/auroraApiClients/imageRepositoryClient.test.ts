import { ImageRepositoryClient } from 'services/auroraApiClients/imageRepositoryClient/client';
import { graphqlClientMock, GraphQLSeverMock } from 'utils/GraphQLMock';

import ErrorStateManager from 'models/StateManager/ErrorStateManager';
import GoboClient from 'services/GoboClient';
import * as getTags from './__responses__/imageRepositoryClient/getTags.json';

const errorSM = new ErrorStateManager(
  {
    allErrors: new Map(),
    errorQueue: []
  },
  () => {
    return;
  }
);

const mockServer = new GraphQLSeverMock();
const mockClient = graphqlClientMock(mockServer.graphQLUrl);
const goboClient = new GoboClient(mockClient, errorSM);
const imageRepositoryClient = new ImageRepositoryClient(goboClient);

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

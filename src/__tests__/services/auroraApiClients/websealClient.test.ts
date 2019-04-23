import ErrorStateManager from 'models/StateManager/ErrorStateManager';
import { WebsealClient } from 'services/auroraApiClients/websealClient/client';
import { goboClientMock, GraphQLSeverMock } from 'utils/GraphQLMock';

import * as getWebsealStates from './__responses__/websealClient/getWebsealStates.json';

const errorStateManager = new ErrorStateManager(
  {
    allErrors: new Map(),
    errorQueue: []
  },
  () => {
    // Validate errors
    return;
  }
);

const serverMock = new GraphQLSeverMock();
const clientMock = goboClientMock(serverMock.graphQLUrl, errorStateManager);
const websealClient = new WebsealClient(clientMock);

afterAll(() => {
  serverMock.close();
});

describe('getWebsealStates', () => {
  it('should fetch webseal states for paas from GraphQl server', async () => {
    serverMock.putResponse('getWebsealStates', getWebsealStates);

    const result = await websealClient.getWebsealStates('paas');
    expect(result).toMatchSnapshot();
  });

  it('should return empty list given null from GraphQl server', async () => {
    serverMock.putResponse('getWebsealStates', null);

    const result = await websealClient.getWebsealStates('paas');
    expect(result).toMatchSnapshot();
  });
});

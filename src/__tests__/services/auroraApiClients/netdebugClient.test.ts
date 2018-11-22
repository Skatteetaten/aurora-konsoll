import ErrorStateManager from 'models/StateManager/ErrorStateManager';
import { NetdebugClient } from 'services/auroraApiClients/netdebugClient/client';
import { goboClientMock, GraphQLSeverMock } from 'utils/GraphQLMock';

import * as getNetdebugStatus from './__responses__/netdebugClient/getNetdebugStatus.json';

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
const netdebugClient = new NetdebugClient(clientMock);

afterAll(() => {
  serverMock.close();
});

describe('getNetdebugStatus', () => {
  it('should fetch netdebug status from GraphQL server and normalize data', async () => {
    serverMock.putResponse('getNetdebugStatus', getNetdebugStatus);

    const result = await netdebugClient.findNetdebugStatus('http://localhost', '8080');
    expect(result).toMatchSnapshot();
  });
});

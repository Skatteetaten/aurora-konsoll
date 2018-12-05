import ErrorStateManager from 'models/StateManager/ErrorStateManager';
import { NetdebugClient } from 'services/auroraApiClients/netdebugClient/client';
import { goboClientMock, GraphQLSeverMock } from 'utils/GraphQLMock';

import * as getNetdebugStatusWhenScanIsNull from './__responses__/netdebugClient/getNetdebugStatusWhenScanIsNull.json';

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
  it('should handle netdebug result when response is only null', async () => {
    serverMock.putResponse('getNetdebugStatus', null);

    const result = await netdebugClient.findNetdebugStatus(
      'http://localhost',
      '3000'
    );
    expect(result).toMatchSnapshot();
  });

  it('should handle netdebug result when scan is null', async () => {
    serverMock.putResponse(
      'getNetdebugStatus',
      getNetdebugStatusWhenScanIsNull
    );

    const result = await netdebugClient.findNetdebugStatus(
      'http://localhost',
      '4000'
    );
    expect(result).toMatchSnapshot();
  });
});

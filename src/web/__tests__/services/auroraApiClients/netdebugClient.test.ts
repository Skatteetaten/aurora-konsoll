import { NetdebugClient } from 'web/services/auroraApiClients/netdebugClient/client';
import { goboClientMock, GraphQLSeverMock } from 'web/utils/GraphQLMock';

import * as getNetdebugStatus from './__responses__/netdebugClient/getNetdebugStatus.json';
import * as getNetdebugStatusWhenScanIsNull from './__responses__/netdebugClient/getNetdebugStatusWhenScanIsNull.json';

const serverMock = new GraphQLSeverMock();
const clientMock = goboClientMock(serverMock.graphQLUrl);
const netdebugClient = new NetdebugClient(clientMock);

afterAll((done) => {
  serverMock.close(done);
});

describe('getNetdebugStatus', () => {
  it('should fetch netdebug status from GraphQL server and normalize data', async () => {
    serverMock.putResponse('getNetdebugStatus', getNetdebugStatus);

    const result = await netdebugClient.findNetdebugStatus(
      'http://localhost',
      '8080'
    );
    expect(result).toMatchSnapshot();
  });

  it('should handle netdebug result when response is only null', async () => {
    serverMock.putResponse('getNetdebugStatus', null);

    try {
      netdebugClient.findNetdebugStatus('http://localhost', '3000');
    } catch (e) {
      expect(e).toBeTruthy();
    }
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

import { WebsealClient } from 'web/services/auroraApiClients/websealClient/client';
import { goboClientMock, GraphQLSeverMock } from 'web/utils/GraphQLMock';

import * as getWebsealStates from './__responses__/websealClient/getWebsealStates.json';

const serverMock = new GraphQLSeverMock();
const clientMock = goboClientMock(serverMock.graphQLUrl);
const websealClient = new WebsealClient(clientMock);

afterAll((done) => {
  serverMock.close(done);
});

describe('getWebsealStates', () => {
  it('should fetch webseal states for paas from GraphQl server', async () => {
    serverMock.putResponse('getWebsealStates', getWebsealStates);

    const result = await websealClient.getWebsealStates('paas');
    expect(result).toMatchSnapshot();
  });

  it('should throw error given null from GraphQl server', async () => {
    serverMock.putResponse('getWebsealStates', null);

    try {
      await websealClient.getWebsealStates('paas');
    } catch (e) {
      expect(e).toMatchSnapshot();
    }
  });
});

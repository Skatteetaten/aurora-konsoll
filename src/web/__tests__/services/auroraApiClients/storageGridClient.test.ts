import { StorageGridClient } from 'web/services/auroraApiClients/storageGridClient/client';
import { goboClientMock, GraphQLSeverMock } from 'web/utils/GraphQLMock';

import * as getTenant from './__responses__/storageGridClient/getTenant.json';
import * as getAreas from './__responses__/storageGridClient/getAreas.json';

const serverMock = new GraphQLSeverMock();
const clientMock = goboClientMock(serverMock.graphQLUrl);
const storageGridClient = new StorageGridClient(clientMock);

afterAll((done) => {
  serverMock.close(done);
});

describe('getTenant', () => {
  it('should fetch tenant', async () => {
    serverMock.putResponse('getTenant', getTenant);

    const result = await storageGridClient.getTenant('paas');
    expect(result).toMatchSnapshot();
  });
});

describe('getAreas', () => {
  it('should fetch areas', async () => {
    serverMock.putResponse('getAreas', getAreas);

    const result = await storageGridClient.getAreas('paas');
    expect(result).toMatchSnapshot();
  });
});

import { DnsClient } from 'web/services/auroraApiClients/dnsClient/client';
import { goboClientMock, GraphQLSeverMock } from 'web/utils/GraphQLMock';

import * as fetchCnames from './__responses__/dnsClient/fetchCnames.json';

const serverMock = new GraphQLSeverMock();
const clientMock = goboClientMock(serverMock.graphQLUrl);
const dnsClient = new DnsClient(clientMock);

afterAll((done) => {
  serverMock.close(done);
});

describe('fetchCnames', () => {
  it('should fetch cnames from GraphQL server', async () => {
    serverMock.putResponse('getCnames', fetchCnames);

    const result = await dnsClient.fetchCnames('paas');
    expect(result).toMatchSnapshot();
  });
});

import { DatabaseClient } from 'web/services/auroraApiClients/databaseClient/client';
import { goboClientMock, GraphQLSeverMock } from 'web/utils/GraphQLMock';

import * as getDatabaseSchemas from './__responses__/databaseClient/getDatabaseSchemas.json';

const serverMock = new GraphQLSeverMock();
const clientMock = goboClientMock(serverMock.graphQLUrl);
const databaseClient = new DatabaseClient(clientMock);

afterAll((done) => {
  serverMock.close(done);
});

describe('getDatabaseSchemas', () => {
  it('should fetch database schemas from GraphQL server', async () => {
    serverMock.putResponse('getDatabaseSchemas', getDatabaseSchemas);

    const result = await databaseClient.getSchemas(['paas'], 10);
    expect(result).toMatchSnapshot();
  });
});

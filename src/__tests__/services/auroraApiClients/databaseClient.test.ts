import { DatabaseClient } from 'services/auroraApiClients/databaseClient/client';
import { goboClientMock, GraphQLSeverMock } from 'utils/GraphQLMock';

import * as getDatabaseSchemas from './__responses__/databaseClient/getDatabaseSchemas.json';

const serverMock = new GraphQLSeverMock();
const clientMock = goboClientMock(serverMock.graphQLUrl);
const databaseClient = new DatabaseClient(clientMock);

afterAll(() => {
  serverMock.close();
});

describe('getDatabaseSchemas', () => {
  it('should fetch database schemas from GraphQL server', async () => {
    serverMock.putResponse('getDatabaseSchemas', getDatabaseSchemas);

    const result = await databaseClient.getSchemas(['paas']);
    // expect(errorStateManager.errorCount).toEqual(0);
    expect(result).toMatchSnapshot();
  });
});

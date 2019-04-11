import ErrorStateManager from 'models/StateManager/ErrorStateManager';
import { CertificateClient } from 'services/auroraApiClients';
import { goboClientMock, GraphQLSeverMock } from 'utils/GraphQLMock';

import * as getCertificates from './__responses__/certificateClient/getCertificates.json';

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
const certificateClient = new CertificateClient(clientMock);

afterAll(() => {
  serverMock.close();
});

describe('getCertificates', () => {
  it('should fetch certificates from GraphQL server', async () => {
    serverMock.putResponse('getCertificates', getCertificates);

    const result = await certificateClient.getCertificates();
    expect(errorStateManager.errorCount).toEqual(0);
    expect(result).toMatchSnapshot();
  });
});

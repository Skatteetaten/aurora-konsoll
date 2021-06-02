import { CertificateClient } from 'services/auroraApiClients';
import { goboClientMock, GraphQLSeverMock } from 'utils/GraphQLMock';

import * as getCertificates from './__responses__/certificateClient/getCertificates.json';

const serverMock = new GraphQLSeverMock();
const clientMock = goboClientMock(serverMock.graphQLUrl);
const certificateClient = new CertificateClient(clientMock);

afterAll((done) => {
  console.time('ferdig');
  serverMock.close(() => {
    done();
    console.timeEnd('ferdig');
  });
});

describe('getCertificates', () => {
  it('should fetch certificates from GraphQL server', async () => {
    serverMock.putResponse('getCertificates', getCertificates);

    const result = await certificateClient.getCertificates();
    expect(result).toMatchSnapshot();
  });
});

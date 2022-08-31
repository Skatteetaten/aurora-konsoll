import { ApplicationDeploymentClient } from 'web/services/auroraApiClients/applicationDeploymentClient/client';
import { goboClientMock, GraphQLSeverMock } from 'web/utils/GraphQLMock';

import * as getApplicationDeployments from './__responses__/applicationDeploymentClient/getApplicationDeployments.json';
import * as getUserAndAffiliations from './__responses__/applicationDeploymentClient/getUserAndAffiliations.json';

const serverMock = new GraphQLSeverMock();
const clientMock = goboClientMock(serverMock.graphQLUrl);
const applicationDeploymentClient = new ApplicationDeploymentClient(clientMock);

afterAll((done) => {
  serverMock.close(done);
});

describe('findUserAndAffiliations', () => {
  it('should fetch user and affiliations from GraphQL server and normalize data', async () => {
    serverMock.putResponse('getUserAndAffiliations', getUserAndAffiliations);

    const result = await applicationDeploymentClient.findUserAndAffiliations();
    expect(result).toMatchSnapshot();
  });
});

describe('findAllApplicationDeployments', () => {
  it('should fetch user and affiliations from GraphQL server and normalize data', async () => {
    serverMock.putResponse(
      'getApplicationDeployments',
      getApplicationDeployments
    );

    const result =
      await applicationDeploymentClient.findAllApplicationDeployments([
        'aurora',
      ]);
    expect(result).toMatchSnapshot();
  });
});

describe('deploy', () => {
  it('should deploy application to GraphQL server', async () => {
    serverMock.putResponse('deploy', {
      data: {
        deploy: {
          applicationDeployments: [{ applicationDeploymentId: '123' }],
          success: true,
        },
      },
    });

    const result = await applicationDeploymentClient.deploy({
      applicationDeployment: [{ application: 'app', environment: 'env' }],
      auroraConfigName: 'demo',
      auroraConfigReference: 'master',
    });
    expect(result).toBeTruthy();
    expect(result).toMatchSnapshot();
  });
});

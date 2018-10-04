import ErrorStateManager from 'models/StateManager/ErrorStateManager';
import { ApplicationDeploymentClient } from 'services/auroraApiClients/applicationDeploymentClient/client';
import { goboClientMock, GraphQLSeverMock } from 'utils/GraphQLMock';

import * as getApplicationDeployments from './__responses__/applicationDeploymentClient/getApplicationDeployments.json';
import * as getUserAndAffiliations from './__responses__/applicationDeploymentClient/getUserAndAffiliations.json';

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
const applicationDeploymentClient = new ApplicationDeploymentClient(clientMock);

afterAll(() => {
  serverMock.close();
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

    const result = await applicationDeploymentClient.findAllApplicationDeployments(
      ['aurora']
    );
    expect(result).toMatchSnapshot();
  });
});

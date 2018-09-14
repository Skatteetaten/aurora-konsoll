import { ApplicationDeploymentClient } from 'services/auroraApiClients/applicationDeploymentClient/client';
import { graphqlClientMock, GraphQLSeverMock } from 'utils/GraphQLMock';

import * as getApplicationDeployments from './__responses__/applicationDeploymentClient/getApplicationDeployments.json';
import * as getUserAndAffiliations from './__responses__/applicationDeploymentClient/getUserAndAffiliations.json';

const serverMock = new GraphQLSeverMock();
const clientMock = graphqlClientMock(serverMock.graphQLUrl);
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

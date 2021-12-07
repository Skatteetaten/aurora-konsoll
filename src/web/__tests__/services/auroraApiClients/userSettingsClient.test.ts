import { UserSettingsClient } from 'web/services/auroraApiClients/userSettingsClient/client';
import { goboClientMock, GraphQLSeverMock } from 'web/utils/GraphQLMock';

import * as getUserSettings from './__responses__/userSettingsClient/getUserSettings.json';

const serverMock = new GraphQLSeverMock();
const clientMock = goboClientMock(serverMock.graphQLUrl);
const userSettingsClient = new UserSettingsClient(clientMock);

afterAll((done) => {
  serverMock.close(done);
});

describe('getUserSettings', () => {
  it('should fetch user settings from GraphQL server and normalize data', async () => {
    serverMock.putResponse(
      'getUserSettingsForAllAffiliations',
      getUserSettings
    );

    const result = await userSettingsClient.getUserSettings();
    expect(result).toMatchSnapshot();
  });
});

describe('updateUserSettings', () => {
  it('should update user settings to GraphQL server', async () => {
    serverMock.putResponse('updateUserSettings', {
      data: { updateUserSettings: true },
    });

    const result = await userSettingsClient.updateUserSettings({
      applicationDeploymentFilters: [
        {
          name: 'my-filter',
          affiliation: 'aurora',
          default: true,
          applications: ['app'],
          environments: ['env'],
        },
      ],
    });
    expect(result).toBeTruthy();
    expect(result).toMatchSnapshot();
  });
});

import ErrorStateManager from 'models/StateManager/ErrorStateManager';
import { UserSettingsClient } from 'services/auroraApiClients/userSettingsClient/client';
import { goboClientMock, GraphQLSeverMock } from 'utils/GraphQLMock';

import * as getUserSettings from './__responses__/userSettingsClient/getUserSettings.json';

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
const userSettingsClient = new UserSettingsClient(clientMock);

afterAll(() => {
  serverMock.close();
});

describe('getUserSettings', () => {
  it('should fetch user settings from GraphQL server and normalize data', async () => {
    serverMock.putResponse('getUserSettingsForAllAffiliations', getUserSettings);

    const result = await userSettingsClient.getUserSettings();
    expect(result).toMatchSnapshot();
  });
});

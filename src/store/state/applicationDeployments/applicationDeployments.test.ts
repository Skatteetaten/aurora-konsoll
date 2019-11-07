import { GraphQLSeverMock } from 'utils/GraphQLMock';
import { createTestStore } from 'utils/redux/test-utils';
import { applicationDeploymentFactory } from 'testData/testDataBuilders';

import { actions } from './actions';
import {
  fetchApplicationDeployments,
  refreshAllDeploymentsForAffiliation
} from './action.creators';
import {
  IApplicationDeploymentData,
  IApplicationsConnectionData
} from 'services/auroraApiClients/applicationDeploymentClient/query';

const server = new GraphQLSeverMock();

const {
  nextAction,
  dispatch,
  clearActionsAndResetState,
  skipActions,
  getActionQueue
} = createTestStore(server);

function createApplicationConnectionData(
  deployments: IApplicationDeploymentData[]
): { data: IApplicationsConnectionData } {
  return {
    data: {
      applications: {
        edges: [
          {
            node: {
              name: 'mokey',
              applicationDeployments: deployments
            }
          }
        ]
      }
    }
  };
}

beforeAll(() => {
  server.putResponse(
    'getApplicationDeployments',
    createApplicationConnectionData(
      applicationDeploymentFactory.buildList(1, {
        time: '2019-11-06T12:54:00.707621Z'
      })
    )
  );

  server.putResponse('refreshApplicationDeployments', {
    data: {
      refreshApplicationDeployments: true
    }
  });
});

afterAll(() => {
  server.close();
});

afterEach(() => {
  clearActionsAndResetState();
});

describe('applicationDeployments', () => {
  it('should fetch applications', async () => {
    await dispatch(fetchApplicationDeployments(['aurora']));

    nextAction(
      actions.fetchApplicationDeployments.request,
      ({ applications }) => {
        expect(applications).toMatchSnapshot();
      }
    );

    nextAction(
      actions.fetchApplicationDeployments.success,
      ({ applications }) => {
        expect(applications).toMatchSnapshot();
      }
    );
  });

  it('should refresh and then fetch applications', async () => {
    // Adding application deployments to state
    await dispatch(fetchApplicationDeployments(['aurora']));
    skipActions(getActionQueue().length);

    // Simulate response after refresh, updated cache time.
    server.putResponse(
      'getApplicationDeployments',
      createApplicationConnectionData(
        applicationDeploymentFactory.buildList(1, {
          time: '2019-11-06T12:56:00.707621Z'
        })
      )
    );

    await dispatch(refreshAllDeploymentsForAffiliation('aurora'));

    nextAction(
      actions.refreshAllDeploymentsForAffiliation,
      ({ applications }) => {
        expect(applications).toMatchSnapshot();
        expect(applications.applicationsConnection.getCacheTime()).toBe(
          '2019-11-06T12:54:00.707621Z'
        );
      }
    );

    nextAction(
      actions.fetchApplicationDeployments.success,
      ({ applications }) => {
        expect(applications).toMatchSnapshot();
        expect(applications.applicationsConnection.getCacheTime()).toBe(
          '2019-11-06T12:56:00.707621Z'
        );
      }
    );
  });
});

import { GraphQLSeverMock } from 'utils/GraphQLMock';
import { createTestStore } from 'utils/redux/test-utils';
import { applicationDeploymentFactory } from 'testData/testDataBuilders';

import { actions } from './actions';
import {
  fetchApplicationDeployments,
  refreshAllDeploymentsForAffiliation,
  deleteAndRefreshApplications,
} from './action.creators';
import {
  IApplicationDeploymentData,
  IApplicationsConnectionData,
} from 'services/auroraApiClients/applicationDeploymentClient/query';

const server = new GraphQLSeverMock();

const {
  nextAction,
  dispatch,
  clearActionsAndResetState,
  skipActions,
  getActionQueue,
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
              applicationDeployments: deployments,
            },
          },
        ],
      },
    },
  };
}

beforeAll(() => {
  server.putResponse(
    'getApplicationDeployments',
    createApplicationConnectionData(
      applicationDeploymentFactory.buildList(1, {
        time: '2019-11-06T12:54:00.707621Z',
      })
    )
  );

  server.putResponse('refreshApplicationDeployments', {
    data: {
      refreshApplicationDeployments: true,
    },
  });

  server.putResponse('deleteApplicationDeployment', {
    data: {
      deleteApplicationDeployment: true,
    },
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

    expect(getActionQueue()).toHaveLength(0);
  });

  it('should refresh and then fetch applications', async () => {
    // Adding application deployments to state
    await dispatch(fetchApplicationDeployments(['aurora']));
    skipActions(getActionQueue().length);

    // Simulate response after refresh with updated cache time.
    server.putResponse(
      'getApplicationDeployments',
      createApplicationConnectionData(
        applicationDeploymentFactory.buildList(1, {
          time: '2019-11-06T12:56:00.707621Z',
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

    expect(getActionQueue()).toHaveLength(0);
  });

  it('should delete application deployment and then fetch applications', async () => {
    // Adding application deployments to state
    await dispatch(fetchApplicationDeployments(['aurora']));
    skipActions(getActionQueue().length);

    // Simulate response after delete with no applications
    server.putResponse(
      'getApplicationDeployments',
      createApplicationConnectionData([])
    );

    await dispatch(
      deleteAndRefreshApplications('aurora', 'aurora-dev', 'mokey')
    );

    nextAction(
      actions.deleteApplicationDeploymentRequest,
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

    expect(getActionQueue()).toHaveLength(0);
  });
});

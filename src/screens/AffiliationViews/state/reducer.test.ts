import each from 'jest-each';
import {
  affiliationViewStateFactory,
  userSettingsFactory,
  deploymentDetailsFactory,
  deploymentFactory
} from 'testData/testDataBuilders';
import {
  refreshAffiliationsRequest,
  refreshApplicationDeploymentRequest,
  userSettingsResponse,
  refreshApplicationDeploymentResponse,
  updateUserSettingsRequest,
  applicationDeploymentDetailsResponse,
  findAllApplicationDeploymentsResponse,
  fetchDetailsRequest,
  deleteApplicationDeploymentResponse
} from './actions';
import { affiliationViewReducer } from './reducer';

describe('AffiliationView reducer', () => {
  each([
    [
      {
        name: 'refreshAffiliationsRequest',
        item: affiliationViewStateFactory.build()
      },
      {
        name: 'isRefreshingAffiliations',
        item: refreshAffiliationsRequest(true)
      },
      affiliationViewStateFactory.build({
        isRefreshingAffiliations: true
      })
    ],
    [
      {
        name: 'refreshApplicationDeploymentRequest',
        item: affiliationViewStateFactory.build()
      },
      {
        name: 'isRefreshingApplicationDeployment',
        item: refreshApplicationDeploymentRequest(true)
      },
      affiliationViewStateFactory.build({
        isRefreshingApplicationDeployment: true
      })
    ],
    [
      {
        name: 'fetchDetailsRequest',
        item: affiliationViewStateFactory.build()
      },
      {
        name: 'isFetchingDetails',
        item: fetchDetailsRequest(true)
      },
      affiliationViewStateFactory.build({
        isFetchingDetails: true
      })
    ],
    [
      {
        name: 'userSettingsResponse',
        item: affiliationViewStateFactory.build()
      },
      {
        name: 'userSettings',
        item: userSettingsResponse(userSettingsFactory.build())
      },
      affiliationViewStateFactory.build({
        userSettings: userSettingsFactory.build()
      })
    ],
    [
      {
        name: 'updateUserSettingsRequest',
        item: affiliationViewStateFactory.build()
      },
      {
        name: 'isUpdatingUserSettings',
        item: updateUserSettingsRequest(true)
      },
      affiliationViewStateFactory.build({
        isUpdatingUserSettings: true
      })
    ],
    [
      {
        name: 'refreshApplicationDeploymentResponse',
        item: affiliationViewStateFactory.build()
      },
      {
        name: 'isRefreshingApplicationDeployment',
        item: refreshApplicationDeploymentResponse(true)
      },
      affiliationViewStateFactory.build({
        isRefreshingApplicationDeployment: true
      })
    ],
    [
      {
        name: 'applicationDeploymentDetailsResponse',
        item: affiliationViewStateFactory.build()
      },
      {
        name: 'applicationDeploymentDetails',
        item: applicationDeploymentDetailsResponse(
          deploymentDetailsFactory.build()
        )
      },
      affiliationViewStateFactory.build({
        applicationDeploymentDetails: deploymentDetailsFactory.build()
      })
    ],
    [
      {
        name: 'findAllApplicationDeploymentsResponse',
        item: affiliationViewStateFactory.build()
      },
      {
        name: 'allApplicationDeploymentsResult',
        item: findAllApplicationDeploymentsResponse([deploymentFactory.build()])
      },
      affiliationViewStateFactory.build({
        allApplicationDeploymentsResult: [deploymentFactory.build()]
      })
    ],
    [
      {
        name: 'deleteApplicationDeploymentResponse',
        item: affiliationViewStateFactory.build()
      },
      {
        name: 'isApplicationDeploymentDeleted',
        item: deleteApplicationDeploymentResponse(true)
      },
      affiliationViewStateFactory.build({
        isApplicationDeploymentDeleted: true
      })
    ]
  ]).describe.only('', (a, b, expected) => {
    test.only(`given defaultState and action ${a.name} with given value should change ${b.name} to given value`, () => {
      expect(affiliationViewReducer(a.item, b.item)).toEqual(expected);
    });
  });
});

import each from 'jest-each';
import {
  affiliationViewStateFactory,
  userSettingsFactory,
  deploymentDetailsFactory,
  tagsPagedFactory,
  tagsPagedGroupFactory,
  deploymentFactory
} from 'testData/testDataBuilders';
import {
  refreshAffiliationsRequest,
  refreshApplicationDeploymentRequest,
  userSettingsResponse,
  refreshApplicationDeploymentResponse,
  redeployWithVersionResponse,
  updateUserSettingsRequest,
  applicationDeploymentDetailsResponse,
  redeployWithCurrentVersionResponse,
  findTagsPagedResponse,
  findGroupedTagsPagedResponse,
  findAllApplicationDeploymentsResponse
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
        name: 'isRefreshApplicationDeployment',
        item: refreshApplicationDeploymentRequest(true)
      },
      affiliationViewStateFactory.build({
        isRefreshApplicationDeployment: true
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
        name: 'redeployWithVersionResponse',
        item: affiliationViewStateFactory.build()
      },
      {
        name: 'redeployWithVersionResult',
        item: redeployWithVersionResponse(true)
      },
      affiliationViewStateFactory.build({
        redeployWithVersionResult: true
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
        name: 'redeployWithCurrentVersionResponse',
        item: affiliationViewStateFactory.build()
      },
      {
        name: 'redeployWithCurrentVersionResult',
        item: redeployWithCurrentVersionResponse(true)
      },
      affiliationViewStateFactory.build({
        redeployWithCurrentVersionResult: true
      })
    ],
    [
      {
        name: 'findTagsPagedResponse',
        item: affiliationViewStateFactory.build()
      },
      {
        name: 'findTagsPagedResult',
        item: findTagsPagedResponse(tagsPagedFactory.build())
      },
      affiliationViewStateFactory.build({
        findTagsPagedResult: tagsPagedFactory.build()
      })
    ],
    [
      {
        name: 'findGroupedTagsPagedResponse',
        item: affiliationViewStateFactory.build()
      },
      {
        name: 'findGroupedTagsPagedResult',
        item: findGroupedTagsPagedResponse(tagsPagedGroupFactory.build())
      },
      affiliationViewStateFactory.build({
        findGroupedTagsPagedResult: tagsPagedGroupFactory.build()
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
    ]
  ]).describe.only('', (a, b, expected) => {
    test.only(`given defaultState and action ${
      a.name
    } with given value should change ${b.name} to given value`, () => {
      expect(affiliationViewReducer(a.item, b.item)).toEqual(expected);
    });
  });
});

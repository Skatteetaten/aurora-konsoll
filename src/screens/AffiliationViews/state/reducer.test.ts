import each from 'jest-each';
import {
  affiliationViewsStateFactory,
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
import { affiliationViewsReducer } from './reducer';

describe('AffiliationViews reducer', () => {
  each([
    [
      {
        name: 'refreshAffiliationsRequest',
        item: affiliationViewsStateFactory.build()
      },
      {
        name: 'isRefreshingAffiliations',
        item: refreshAffiliationsRequest(true)
      },
      affiliationViewsStateFactory.build({
        isRefreshingAffiliations: true
      })
    ],
    [
      {
        name: 'refreshApplicationDeploymentRequest',
        item: affiliationViewsStateFactory.build()
      },
      {
        name: 'isRefreshApplicationDeployment',
        item: refreshApplicationDeploymentRequest(true)
      },
      affiliationViewsStateFactory.build({
        isRefreshApplicationDeployment: true
      })
    ],
    [
      {
        name: 'userSettingsResponse',
        item: affiliationViewsStateFactory.build()
      },
      {
        name: 'userSettings',
        item: userSettingsResponse(userSettingsFactory.build())
      },
      affiliationViewsStateFactory.build({
        userSettings: userSettingsFactory.build()
      })
    ],
    [
      {
        name: 'updateUserSettingsRequest',
        item: affiliationViewsStateFactory.build()
      },
      {
        name: 'isUpdatingUserSettings',
        item: updateUserSettingsRequest(true)
      },
      affiliationViewsStateFactory.build({
        isUpdatingUserSettings: true
      })
    ],
    [
      {
        name: 'refreshApplicationDeploymentResponse',
        item: affiliationViewsStateFactory.build()
      },
      {
        name: 'isRefreshingApplicationDeployment',
        item: refreshApplicationDeploymentResponse(true)
      },
      affiliationViewsStateFactory.build({
        isRefreshingApplicationDeployment: true
      })
    ],
    [
      {
        name: 'redeployWithVersionResponse',
        item: affiliationViewsStateFactory.build()
      },
      {
        name: 'redeployWithVersionResult',
        item: redeployWithVersionResponse(true)
      },
      affiliationViewsStateFactory.build({
        redeployWithVersionResult: true
      })
    ],
    [
      {
        name: 'applicationDeploymentDetailsResponse',
        item: affiliationViewsStateFactory.build()
      },
      {
        name: 'applicationDeploymentDetails',
        item: applicationDeploymentDetailsResponse(
          deploymentDetailsFactory.build()
        )
      },
      affiliationViewsStateFactory.build({
        applicationDeploymentDetails: deploymentDetailsFactory.build()
      })
    ],
    [
      {
        name: 'redeployWithCurrentVersionResponse',
        item: affiliationViewsStateFactory.build()
      },
      {
        name: 'redeployWithCurrentVersionResult',
        item: redeployWithCurrentVersionResponse(true)
      },
      affiliationViewsStateFactory.build({
        redeployWithCurrentVersionResult: true
      })
    ],
    [
      {
        name: 'findTagsPagedResponse',
        item: affiliationViewsStateFactory.build()
      },
      {
        name: 'findTagsPagedResult',
        item: findTagsPagedResponse(tagsPagedFactory.build())
      },
      affiliationViewsStateFactory.build({
        findTagsPagedResult: tagsPagedFactory.build()
      })
    ],
    [
      {
        name: 'findGroupedTagsPagedResponse',
        item: affiliationViewsStateFactory.build()
      },
      {
        name: 'findGroupedTagsPagedResult',
        item: findGroupedTagsPagedResponse(tagsPagedGroupFactory.build())
      },
      affiliationViewsStateFactory.build({
        findGroupedTagsPagedResult: tagsPagedGroupFactory.build()
      })
    ],
    [
      {
        name: 'findAllApplicationDeploymentsResponse',
        item: affiliationViewsStateFactory.build()
      },
      {
        name: 'allApplicationDeploymentsResult',
        item: findAllApplicationDeploymentsResponse([deploymentFactory.build()])
      },
      affiliationViewsStateFactory.build({
        allApplicationDeploymentsResult: [deploymentFactory.build()]
      })
    ]
  ]).describe.only('', (a, b, expected) => {
    test.only(`given defaultState and action ${
      a.name
    } with given value should change ${b.name} to given value`, () => {
      expect(affiliationViewsReducer(a.item, b.item)).toEqual(expected);
    });
  });
});

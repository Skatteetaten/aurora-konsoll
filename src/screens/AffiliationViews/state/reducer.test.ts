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
  updateUserSettingsRequest,
  applicationDeploymentDetailsResponse,
  findTagsPagedResponse,
  findGroupedTagsPagedResponse,
  findAllApplicationDeploymentsResponse,
  redeployRequest,
  fetchTagsRequest,
  fetchDetailsRequest,
  fetchGroupedTagsRequest
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
        name: 'redeployRequest',
        item: affiliationViewStateFactory.build()
      },
      {
        name: 'isRedeploying',
        item: redeployRequest(true)
      },
      affiliationViewStateFactory.build({
        isRedeploying: true
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
        name: 'fetchTagsRequest',
        item: affiliationViewStateFactory.build()
      },
      {
        name: 'isFetchingTags',
        item: fetchTagsRequest(true)
      },
      affiliationViewStateFactory.build({
        isFetchingTags: true
      })
    ],
    [
      {
        name: 'fetchTagsRequest',
        item: affiliationViewStateFactory.build()
      },
      {
        name: 'isFetchingGroupedTags',
        item: fetchGroupedTagsRequest(true)
      },
      affiliationViewStateFactory.build({
        isFetchingGroupedTags: true
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

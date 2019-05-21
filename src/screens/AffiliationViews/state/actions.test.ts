import {
  refreshAffiliationsRequest,
  refreshApplicationDeploymentRequest,
  userSettingsResponse,
  updateUserSettingsRequest,
  refreshApplicationDeploymentResponse,
  redeployWithVersionResponse,
  redeployWithCurrentVersionResponse,
  applicationDeploymentDetailsResponse,
  findTagsPagedResponse,
  findGroupedTagsPagedResponse,
  findAllApplicationDeploymentsResponse,
  findAllApplicationDeploymentsRequest
} from './actions';
import {
  deploymentFactory,
  userSettingsFactory,
  deploymentDetailsFactory,
  tagsPagedGroupFactory,
  tagsPagedFactory
} from 'testData/testDataBuilders';

describe('affiliation views actions', () => {
  it('should return type of action refreshAffiliationsRequest and payload', () => {
    expect(refreshAffiliationsRequest(true)).toEqual({
      payload: true,
      type: 'affiliationView/REFRESH_AFFILIATIONS_REQUEST'
    });
  });

  it('should return type of action findAllApplicationDeploymentsResponse and payload', () => {
    expect(
      findAllApplicationDeploymentsResponse([deploymentFactory.build()])
    ).toEqual({
      payload: [deploymentFactory.build()],
      type: 'affiliationView/FIND_ALL_APPLICATION_DEPLOYMENTS_RESPONSE'
    });
  });

  it('should return type of action findAllApplicationDeploymentsRequest and payload', () => {
    expect(findAllApplicationDeploymentsRequest(true)).toEqual({
      payload: true,
      type: 'affiliationView/FIND_ALL_APPLICATION_DEPLOYMENTS_REQUEST'
    });
  });

  it('should return type of action refreshApplicationDeploymentRequest and payload', () => {
    expect(refreshApplicationDeploymentRequest(true)).toEqual({
      payload: true,
      type: 'affiliationView/REFRESH_APPLICATION_DEPLOYMENT_REQUEST'
    });
  });

  it('should return type of action userSettingsResponse and payload', () => {
    expect(userSettingsResponse(userSettingsFactory.build())).toEqual({
      payload: userSettingsFactory.build(),
      type: 'affiliationView/USER_SETTINGS_RESPONSE'
    });
  });

  it('should return type of action updateUserSettingsRequest and payload', () => {
    expect(updateUserSettingsRequest(true)).toEqual({
      payload: true,
      type: 'affiliationView/UPDATE_USER_SETTINGS_REQUEST'
    });
  });

  it('should return type of action refreshApplicationDeploymentResponse and payload', () => {
    expect(refreshApplicationDeploymentResponse(true)).toEqual({
      payload: true,
      type: 'affiliationView/REFRESH_APPLICATION_DEPLOYMENT_RESPONSE'
    });
  });

  it('should return type of action redeployWithVersionResponse and payload', () => {
    expect(redeployWithVersionResponse(true)).toEqual({
      payload: true,
      type: 'affiliationView/REDEPLOY_WITH_VERSION_RESPONSE'
    });
  });

  it('should return type of action redeployWithCurrentVersionResponse and payload', () => {
    expect(redeployWithCurrentVersionResponse(true)).toEqual({
      payload: true,
      type: 'affiliationView/REDEPLOY_WITH_CURRENT_VERSION_RESPONSE'
    });
  });

  it('should return type of action applicationDeploymentDetailsResponse and payload', () => {
    expect(
      applicationDeploymentDetailsResponse(deploymentDetailsFactory.build())
    ).toEqual({
      payload: deploymentDetailsFactory.build(),
      type: 'affiliationView/APPLICATION_DEPLOYMENT_DETAILS'
    });
  });

  it('should return type of action findTagsPagedResponse and payload', () => {
    expect(findTagsPagedResponse(tagsPagedFactory.build())).toEqual({
      payload: tagsPagedFactory.build(),
      type: 'affiliationView/FIND_TAGS_PAGED_RESPONSE'
    });
  });

  it('should return type of action findGroupedTagsPagedResponse and payload', () => {
    expect(findGroupedTagsPagedResponse(tagsPagedGroupFactory.build())).toEqual(
      {
        payload: tagsPagedGroupFactory.build(),
        type: 'affiliationView/FIND_GROUPED_TAGS_PAGED_RESPONSE'
      }
    );
  });
});
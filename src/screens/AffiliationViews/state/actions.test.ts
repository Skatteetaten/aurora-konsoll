import {
  refreshAffiliationsRequest,
  refreshApplicationDeploymentRequest,
  refreshApplicationDeploymentResponse,
  applicationDeploymentDetailsResponse,
  findAllApplicationDeploymentsResponse,
  findAllApplicationDeploymentsRequest,
  fetchDetailsRequest,
  deleteApplicationDeploymentResponse
} from './actions';
import {
  deploymentFactory,
  userSettingsFactory,
  deploymentDetailsFactory
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

  it('should return type of action fetchRequest and payload', () => {
    expect(fetchDetailsRequest(true)).toEqual({
      payload: true,
      type: 'affiliationView/FETCH_DETAILS_REQUEST'
    });
  });

  it('should return type of action refreshApplicationDeploymentResponse and payload', () => {
    expect(refreshApplicationDeploymentResponse(true)).toEqual({
      payload: true,
      type: 'affiliationView/REFRESH_APPLICATION_DEPLOYMENT_RESPONSE'
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

  it('should return type of action deleteApplicationDeploymentResponse and payload', () => {
    expect(deleteApplicationDeploymentResponse(true)).toEqual({
      payload: true,
      type: 'affiliationView/DELETE_APPLICATION_DEPLOYMENT_RESPONSE'
    });
  });
});

import {
  IApplicationDeployment,
  IApplicationDeploymentDetails
} from 'models/ApplicationDeployment';
import {
  normalizeRawDeploymentSpec,
  IDeploymentSpec
} from 'models/DeploymentSpec';
import {
  addErrors,
  addCurrentErrors
} from 'screens/ErrorHandler/state/actions';
import { createAction } from 'redux-ts-utils';
import { StateThunk } from 'store/types';
import { IPodResource } from 'models/Pod';
import { stringContainsHtml } from 'utils/string';

const affiliationViewAction = (action: string) => `affiliationView/${action}`;

export const refreshAffiliationsRequest = createAction<boolean>(
  affiliationViewAction('REFRESH_AFFILIATIONS_REQUEST')
);

export const findAllApplicationDeploymentsResponse = createAction<
  IApplicationDeployment[]
>(affiliationViewAction('FIND_ALL_APPLICATION_DEPLOYMENTS_RESPONSE'));

export const findAllApplicationDeploymentsRequest = createAction<boolean>(
  affiliationViewAction('FIND_ALL_APPLICATION_DEPLOYMENTS_REQUEST')
);

export const refreshApplicationDeploymentRequest = createAction<boolean>(
  affiliationViewAction('REFRESH_APPLICATION_DEPLOYMENT_REQUEST')
);

export const refreshApplicationDeploymentResponse = createAction<boolean>(
  affiliationViewAction('REFRESH_APPLICATION_DEPLOYMENT_RESPONSE')
);

export const applicationDeploymentDetailsResponse = createAction<
  IApplicationDeploymentDetails
>(affiliationViewAction('APPLICATION_DEPLOYMENT_DETAILS'));

export const fetchDetailsRequest = createAction<boolean>(
  affiliationViewAction('FETCH_DETAILS_REQUEST')
);

export const deleteApplicationDeploymentResponse = createAction<boolean>(
  affiliationViewAction('DELETE_APPLICATION_DEPLOYMENT_RESPONSE')
);

export const refreshAffiliations = (
  affiliations: string[]
): StateThunk => async (dispatch, getState, { clients }) => {
  dispatch(refreshAffiliationsRequest(true));
  const result = await clients.applicationDeploymentClient.refreshAffiliations(
    affiliations
  );
  dispatch(addCurrentErrors(result));
  dispatch(refreshAffiliationsRequest(false));
};

export const findAllApplicationDeployments = (
  affiliations: string[]
): StateThunk => async (dispatch, getState, { clients }) => {
  dispatch(findAllApplicationDeploymentsRequest(true));
  const result = await clients.applicationDeploymentClient.findAllApplicationDeployments(
    affiliations
  );
  dispatch(addCurrentErrors(result));
  if (
    result &&
    result.data.applications &&
    result.data.applications.edges.length > 0
  ) {
    const r = result.data.applications.edges.reduce(
      (acc: IApplicationDeployment[], { node }) => {
        const { applicationDeployments } = node;
        const deployments = applicationDeployments.map(app => ({
          affiliation: app.affiliation.name,
          environment: app.environment,
          id: app.id,
          name: app.name,
          namespace: app.namespace.name,
          permission: app.namespace.permission,
          imageRepository: app.imageRepository,
          status: {
            code: app.status.code,
            reasons: app.status.reasons,
            reports: app.status.reports
          },
          message: app.message,
          time: app.time,
          version: {
            releaseTo: app.version.releaseTo,
            auroraVersion: app.version.auroraVersion,
            deployTag: {
              lastModified: '',
              name: app.version.deployTag.name,
              type: app.version.deployTag.type
            }
          }
        }));
        return [...acc, ...deployments];
      },
      []
    );
    dispatch(findAllApplicationDeploymentsResponse(r));
  } else {
    dispatch(findAllApplicationDeploymentsResponse([]));
  }
  dispatch(findAllApplicationDeploymentsRequest(false));
};

export const refreshApplicationDeployment = (
  applicationDeploymentId: string,
  affiliation: string
): StateThunk => async (dispatch, getState, { clients }) => {
  dispatch(refreshApplicationDeploymentRequest(true));
  const result = await clients.applicationDeploymentClient.refreshApplicationDeployment(
    applicationDeploymentId
  );
  dispatch(addCurrentErrors(result));

  if (result && result.data) {
    dispatch(refreshApplicationDeploymentResponse(true));
    dispatch(findAllApplicationDeployments([affiliation]));
    dispatch(findApplicationDeploymentDetails(applicationDeploymentId, true));
  } else {
    dispatch(refreshApplicationDeploymentResponse(false));
  }
  dispatch(refreshApplicationDeploymentRequest(false));
};

export const findApplicationDeploymentDetails = (
  id: string,
  withoutLoading?: boolean
): StateThunk => async (dispatch, getState, { clients }) => {
  if (!!!withoutLoading) {
    dispatch(fetchDetailsRequest(true));
  }
  const result = await clients.applicationDeploymentClient.findApplicationDeploymentDetails(
    id
  );
  dispatch(addCurrentErrors(result));

  if (result && result.data && result.data.applicationDeploymentDetails) {
    const {
      deploymentSpecs,
      podResources,
      buildTime,
      gitInfo,
      serviceLinks,
      updatedBy
    } = result.data.applicationDeploymentDetails;

    let deploymentSpec;
    if (deploymentSpecs.current) {
      const spec = JSON.parse(deploymentSpecs.current.jsonRepresentation);
      deploymentSpec = Object.keys(spec).reduce(
        normalizeRawDeploymentSpec(spec),
        {} as IDeploymentSpec
      );
    }

    const addManagementInterfaceError = (prop: string) => {
      dispatch(
        addErrors([
          new Error(
            `${prop} endepunktet inneholder HTML, som er ugyldig data. Feilen kan være forårsaket av feil oppsett av Management Interface`
          )
        ])
      );
    };

    podResources.forEach((it: IPodResource) => {
      const managementResponses = it.managementResponses;
      if (managementResponses) {
        if (
          managementResponses.health &&
          stringContainsHtml(managementResponses.health.textResponse)
        ) {
          addManagementInterfaceError('health');
          managementResponses.health = undefined;
        }

        if (
          managementResponses.env &&
          stringContainsHtml(managementResponses.env.textResponse)
        ) {
          addManagementInterfaceError('env');
          managementResponses.env = undefined;
        }
      }
    });

    dispatch(
      applicationDeploymentDetailsResponse({
        updatedBy,
        buildTime,
        gitInfo,
        pods: podResources,
        deploymentSpec,
        serviceLinks
      })
    );
  } else {
    dispatch(
      applicationDeploymentDetailsResponse({
        pods: [],
        serviceLinks: []
      })
    );
  }
  dispatch(fetchDetailsRequest(false));
};

export const deleteApplicationDeployment = (
  namespace: string,
  name: string
): StateThunk => async (dispatch, getState, { clients }) => {
  const result = await clients.applicationDeploymentClient.deleteApplicationDeployment(
    namespace,
    name
  );
  dispatch(addCurrentErrors(result));

  if (result && result.data && result.data.deleteApplicationDeployment) {
    dispatch(deleteApplicationDeploymentResponse(true));
  } else {
    dispatch(deleteApplicationDeploymentResponse(false));
  }
};

export default {
  refreshAffiliationsRequest,
  findAllApplicationDeploymentsResponse,
  findAllApplicationDeploymentsRequest,
  refreshApplicationDeploymentRequest,
  refreshApplicationDeploymentResponse,
  applicationDeploymentDetailsResponse,
  deleteApplicationDeploymentResponse
};

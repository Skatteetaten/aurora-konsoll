import { ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { IAuroraApiComponentProps } from 'components/AuroraApi';

import {
  IApplicationDeployment,
  IApplicationDeploymentDetails
} from 'models/ApplicationDeployment';
import { normalizeRawDeploymentSpec } from 'models/DeploymentSpec';
import { addError } from 'models/StateManager/state/actions';
import { IUserSettings } from 'models/UserSettings';
import { createAction } from 'redux-ts-utils';
import { findDeployTagForTemplate } from 'services/auroraApiClients';
import { RootAction, RootState } from 'store/types';

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

export type Thunk = ActionCreator<
  ThunkAction<void, RootState, IAuroraApiComponentProps, RootAction>
>;

export const refreshAffiliations: Thunk = (affiliations: string[]) => async (
  dispatch,
  getState,
  { clients }
) => {
  dispatch(refreshAffiliationsRequest(true));
  const result = await clients.applicationDeploymentClient.refreshAffiliations(
    affiliations
  );
  if (result && result.errors) {
    result.errors.forEach(e => {
      const err = new Error(`${e.message} ${e.extensions}`);
      dispatch(addError(err));
    });
  }
  dispatch(refreshAffiliationsRequest(false));
};

export const findAllApplicationDeployments: Thunk = (
  affiliations: string[]
) => async (dispatch, getState, { clients }) => {
  dispatch(findAllApplicationDeploymentsRequest(true));
  const result = await clients.applicationDeploymentClient.findAllApplicationDeployments(
    affiliations
  );
  if (result && result.errors) {
    result.errors.forEach(e => {
      const err = new Error(`${e.message} ${e.extensions}`);
      dispatch(addError(err));
    });
  }
  if (!result) {
    dispatch(findAllApplicationDeploymentsResponse([]));
  } else {
    const r = result.data.applications.edges.reduce((acc, { node }) => {
      const { applicationDeployments, imageRepository } = node;
      const deployments = applicationDeployments.map(app => ({
        affiliation: app.affiliation.name,
        environment: app.environment,
        id: app.id,
        name: app.name,
        permission: app.namespace.permission,
        repository: imageRepository ? imageRepository.repository : '',
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
            name: findDeployTagForTemplate(
              node.name,
              app.version.deployTag.name
            ),
            type: app.version.deployTag.type
          }
        }
      }));
      return [...acc, ...deployments];
    }, []);
    dispatch(findAllApplicationDeploymentsResponse(r));
  }
  dispatch(findAllApplicationDeploymentsRequest(false));
};

export const getUserSettings: Thunk = () => async (
  dispatch,
  getState,
  { clients }
): Promise<IUserSettings> => {
  const result = await clients.userSettingsClient.getUserSettings();

  if (result && result.errors) {
    result.errors.forEach(e => {
      const err = new Error(`${e.message} ${e.extensions}`);
      dispatch(addError(err));
    });
  }
  if (result && result.data) {
    return result.data.userSettings;
  } else {
    return { applicationDeploymentFilters: [] };
  }
};

export const updateUserSettings: Thunk = (
  userSettings: IUserSettings
) => async (dispatch, getState, { clients }): Promise<boolean> => {
  const result = await clients.userSettingsClient.updateUserSettings(
    userSettings
  );

  if (result && result.errors) {
    result.errors.forEach(e => {
      const err = new Error(`${e.message} ${e.extensions}`);
      dispatch(addError(err));
    });
  }
  if (result && result.data) {
    return result.data.updateUserSettings;
  } else {
    return false;
  }
};

export const findApplicationDeploymentDetails: Thunk = (id: string) => async (
  dispatch,
  getState,
  { clients }
): Promise<IApplicationDeploymentDetails> => {
  const result = await clients.applicationDeploymentClient.findApplicationDeploymentDetails(
    id
  );

  if (result && result.errors) {
    result.errors.forEach(e => {
      const err = new Error(`${e.message} ${e.extensions}`);
      dispatch(addError(err));
    });
  }

  if (result && result.data && result.data.applicationDeploymentDetails) {
    const {
      deploymentSpecs,
      podResources,
      buildTime,
      gitInfo,
      serviceLinks
    } = result.data.applicationDeploymentDetails;

    let deploymentSpec;
    if (deploymentSpecs.current) {
      const spec = JSON.parse(deploymentSpecs.current.jsonRepresentation);
      deploymentSpec = Object.keys(spec).reduce(
        normalizeRawDeploymentSpec(spec),
        {}
      );
    }

    return {
      buildTime,
      gitInfo,
      pods: podResources,
      deploymentSpec,
      serviceLinks
    };
  } else {
    return {
      pods: [],
      serviceLinks: []
    };
  }
};

export default {
  refreshAffiliationsRequest,
  findAllApplicationDeploymentsResponse
};

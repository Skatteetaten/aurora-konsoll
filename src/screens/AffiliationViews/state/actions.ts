import { ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { IAuroraApiComponentProps } from 'components/AuroraApi';

import {
  IApplicationDeployment,
  IApplicationDeploymentDetails
} from 'models/ApplicationDeployment';
import { normalizeRawDeploymentSpec } from 'models/DeploymentSpec';
import { addErrors } from 'models/StateManager/state/actions';
import { defaultTagsPagedGroup, ITagsPagedGroup, ITagsPaged } from 'models/Tag';
import { IUserSettings } from 'models/UserSettings';
import { createAction } from 'redux-ts-utils';
import {
  findDeployTagForTemplate,
  toTagsPaged
} from 'services/auroraApiClients';
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

export const refreshApplicationDeploymentRequest = createAction<boolean>(
  affiliationViewAction('REFRESH_APPLICATION_DEPLOYMENT_REQUEST')
);

export const userSettingsResponse = createAction<IUserSettings>(
  affiliationViewAction('USER_SETTINGS_RESPONSE')
);

export const updateUserSettingsRequest = createAction<boolean>(
  affiliationViewAction('UPDATE_USER_SETTINGS_REQUEST')
);

export const refreshApplicationDeploymentResponse = createAction<boolean>(
  affiliationViewAction('REFRESH_APPLICATION_DEPLOYMENT_RESPONSE')
);

export const redeployWithVersionResponse = createAction<boolean>(
  affiliationViewAction('REDEPLOY_WITH_VERSION_RESPONSE')
);

export const redeployWithCurrentVersionResponse = createAction<boolean>(
  affiliationViewAction('REDEPLOY_WITH_CURRENT_VERSION_RESPONSE')
);

export const applicationDeploymentDetailsResponse = createAction<
  IApplicationDeploymentDetails
>(affiliationViewAction('APPLICATION_DEPLOYMENT_DETAILS'));

export const findTagsPagedResponse = createAction<ITagsPaged>(
  affiliationViewAction('FIND_TAGS_PAGED_RESPONSE')
);

export const findGroupedTagsPagedResponse = createAction<ITagsPagedGroup>(
  affiliationViewAction('FIND_GROUPED_TAGS_PAGED_RESPONSE')
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
    dispatch(addErrors(result.errors, result.name));
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
    dispatch(addErrors(result.errors, result.name));
  }
  if (!result) {
    dispatch(findAllApplicationDeploymentsResponse([]));
  } else {
    const r = result.data.applications.edges.reduce(
      (acc: IApplicationDeployment[], { node }) => {
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
      },
      []
    );
    dispatch(findAllApplicationDeploymentsResponse(r));
  }
  dispatch(findAllApplicationDeploymentsRequest(false));
};

export const getUserSettings: Thunk = () => async (
  dispatch,
  getState,
  { clients }
) => {
  const result = await clients.userSettingsClient.getUserSettings();

  if (result && result.errors) {
    dispatch(addErrors(result.errors, result.name));
  }
  if (result && result.data) {
    dispatch(userSettingsResponse(result.data.userSettings));
  } else {
    dispatch(userSettingsResponse({ applicationDeploymentFilters: [] }));
  }
};

export const updateUserSettings: Thunk = (
  userSettings: IUserSettings
) => async (dispatch, getState, { clients }) => {
  const result = await clients.userSettingsClient.updateUserSettings(
    userSettings
  );

  if (result && result.errors) {
    dispatch(addErrors(result.errors, result.name));
  }
  if (result && result.data) {
    dispatch(userSettingsResponse(userSettings));
    dispatch(updateUserSettingsRequest(result.data.updateUserSettings));
  } else {
    dispatch(addErrors([new Error('Feil ved sletting av filter')]));
    dispatch(updateUserSettingsRequest(false));
  }
};

export const refreshApplicationDeployment: Thunk = (
  applicationDeploymentId: string
) => async (dispatch, getState, { clients }) => {
  const result = await clients.applicationDeploymentClient.refreshApplicationDeployment(
    applicationDeploymentId
  );

  if (result && result.errors) {
    dispatch(addErrors(result.errors, result.name));
  }

  if (result && result.data) {
    dispatch(refreshApplicationDeploymentResponse(true));
  } else {
    dispatch(refreshApplicationDeploymentResponse(false));
  }
};

export const redeployWithVersion: Thunk = (
  applicationDeploymentId: string,
  version: string
) => async (dispatch, getState, { clients }) => {
  const result = await clients.applicationDeploymentClient.redeployWithVersion(
    applicationDeploymentId,
    version
  );

  if (result && result.errors) {
    dispatch(addErrors(result.errors, result.name));
  }

  if (result && result.data) {
    dispatch(redeployWithVersionResponse(true));
  } else {
    dispatch(redeployWithVersionResponse(false));
  }
};

export const redeployWithCurrentVersion: Thunk = (
  applicationDeploymentId: string
) => async (dispatch, getState, { clients }) => {
  const result = await clients.applicationDeploymentClient.redeployWithCurrentVersion(
    applicationDeploymentId
  );

  if (result && result.errors) {
    dispatch(addErrors(result.errors, result.name));
  }

  if (result && result.data) {
    dispatch(
      redeployWithCurrentVersionResponse(result.data.redeployWithCurrentVersion)
    );
  } else {
    dispatch(redeployWithCurrentVersionResponse(false));
  }
};

export const findTagsPaged: Thunk = (
  repository: string,
  type: string,
  first?: number,
  cursor?: string
) => async (dispatch, getState, { clients }) => {
  const result = await clients.imageRepositoryClient.findTagsPaged(
    repository,
    type,
    first,
    cursor
  );

  if (result && result.errors) {
    dispatch(addErrors(result.errors, result.name));
  }

  if (!result) {
    dispatch(findTagsPagedResponse(defaultTagsPagedGroup()[type]));
  } else {
    const { imageRepositories } = result.data;

    if (!(imageRepositories && imageRepositories.length > 0)) {
      dispatch(findTagsPagedResponse(defaultTagsPagedGroup()[type]));
    }
    if (result && result.data) {
      dispatch(findTagsPagedResponse(toTagsPaged(imageRepositories[0].tags)));
    }
  }
};

export const findGroupedTagsPaged: Thunk = (repository: string) => async (
  dispatch,
  getState,
  { clients }
) => {
  const result = await clients.imageRepositoryClient.findGroupedTagsPaged(
    repository
  );

  if (result && result.errors) {
    dispatch(addErrors(result.errors, result.name));
  }

  if (!result) {
    dispatch(findGroupedTagsPagedResponse(defaultTagsPagedGroup()));
  } else {
    const { imageRepositories } = result.data;

    if (!(imageRepositories && imageRepositories.length > 0)) {
      dispatch(findGroupedTagsPagedResponse(defaultTagsPagedGroup()));
    }

    const [mainRepo] = imageRepositories;

    const normalizedTags: ITagsPagedGroup = {
      auroraSnapshotVersion: toTagsPaged(mainRepo.auroraSnapshotVersion),
      auroraVersion: toTagsPaged(mainRepo.auroraVersion),
      bugfix: toTagsPaged(mainRepo.bugfix),
      commitHash: toTagsPaged(mainRepo.commitHash),
      latest: toTagsPaged(mainRepo.latest),
      major: toTagsPaged(mainRepo.major),
      minor: toTagsPaged(mainRepo.minor),
      snapshot: toTagsPaged(mainRepo.snapshot)
    };

    dispatch(findGroupedTagsPagedResponse(normalizedTags));
  }
};

export const findApplicationDeploymentDetails: Thunk = (id: string) => async (
  dispatch,
  getState,
  { clients }
) => {
  const result = await clients.applicationDeploymentClient.findApplicationDeploymentDetails(
    id
  );

  if (result && result.errors) {
    dispatch(addErrors(result.errors, result.name));
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
    dispatch(
      applicationDeploymentDetailsResponse({
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
};

export default {
  refreshAffiliationsRequest,
  findAllApplicationDeploymentsResponse,
  findAllApplicationDeploymentsRequest,
  refreshApplicationDeploymentRequest,
  userSettingsResponse,
  updateUserSettingsRequest,
  refreshApplicationDeploymentResponse,
  redeployWithVersionResponse,
  applicationDeploymentDetailsResponse,
  findTagsPagedResponse,
  findGroupedTagsPagedResponse
};

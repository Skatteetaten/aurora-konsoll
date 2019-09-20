import {
  IApplicationDeployment,
  IApplicationDeploymentDetails
} from 'models/ApplicationDeployment';
import { normalizeRawDeploymentSpec, IDeploymentSpec } from 'models/DeploymentSpec';
import {
  addErrors,
  addCurrentErrors
} from 'screens/ErrorHandler/state/actions';
import {
  defaultTagsPagedGroup,
  ITagsPagedGroup,
  ITagsPaged,
  ITag
} from 'models/Tag';
import { IUserSettings } from 'models/UserSettings';
import { createAction } from 'redux-ts-utils';
import { Thunk } from 'store/types';
import {
  IImageTagsConnection,
  ITagsQuery
} from 'services/auroraApiClients/imageRepositoryClient/query';
import { ImageTagType } from 'models/ImageTagType';
import { IGoboResult } from 'services/GoboClient';

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

export const redeployRequest = createAction<boolean>(
  affiliationViewAction('REDEPLOY_REQUEST')
);

export const applicationDeploymentDetailsResponse = createAction<
  IApplicationDeploymentDetails
>(affiliationViewAction('APPLICATION_DEPLOYMENT_DETAILS'));

export const fetchDetailsRequest = createAction<boolean>(
  affiliationViewAction('FETCH_DETAILS_REQUEST')
);

export const findTagsPagedResponse = createAction<ITagsPaged>(
  affiliationViewAction('FIND_TAGS_PAGED_RESPONSE')
);

export const findGroupedTagsPagedResponse = createAction<ITagsPagedGroup>(
  affiliationViewAction('FIND_GROUPED_TAGS_PAGED_RESPONSE')
);

export const fetchTagsRequest = createAction<boolean>(
  affiliationViewAction('FETCH_TAGS_REQUEST')
);

export const fetchGroupedTagsRequest = createAction<boolean>(
  affiliationViewAction('FETCH_GROUPED_TAGS_REQUEST')
);

export const refreshAffiliations: Thunk = (affiliations: string[]) => async (
  dispatch,
  getState,
  { clients }
) => {
  dispatch(refreshAffiliationsRequest(true));
  const result = await clients.applicationDeploymentClient.refreshAffiliations(
    affiliations
  );
  dispatch(addCurrentErrors(result));
  dispatch(refreshAffiliationsRequest(false));
};

export const findAllApplicationDeployments: Thunk = (
  affiliations: string[]
) => async (dispatch, getState, { clients }) => {
  dispatch(findAllApplicationDeploymentsRequest(true));
  const result = await clients.applicationDeploymentClient.findAllApplicationDeployments(
    affiliations
  );
  dispatch(addCurrentErrors(result));
  if (!result) {
    dispatch(findAllApplicationDeploymentsResponse([]));
  } else {
    const r = result.data.applications.edges.reduce(
      (acc: IApplicationDeployment[], { node }) => {
        const { applicationDeployments } = node;
        const deployments = applicationDeployments.map(app => ({
          affiliation: app.affiliation.name,
          environment: app.environment,
          id: app.id,
          name: app.name,
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

  dispatch(addCurrentErrors(result));
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
  dispatch(addCurrentErrors(result));

  if (result && result.data) {
    dispatch(userSettingsResponse(userSettings));
    dispatch(updateUserSettingsRequest(result.data.updateUserSettings));
  } else {
    dispatch(addErrors([new Error('Feil ved sletting av filter')]));
    dispatch(updateUserSettingsRequest(false));
  }
};

export const refreshApplicationDeployment: Thunk = (
  applicationDeploymentId: string,
  affiliation: string
) => async (dispatch, getState, { clients }) => {
  dispatch(refreshApplicationDeploymentRequest(true));
  const result = await clients.applicationDeploymentClient.refreshApplicationDeployment(
    applicationDeploymentId
  );
  dispatch(addCurrentErrors(result));

  if (result && result.data) {
    dispatch(refreshApplicationDeploymentResponse(true));
    dispatch(findAllApplicationDeployments(affiliation));
    dispatch(findApplicationDeploymentDetails(applicationDeploymentId, true));
  } else {
    dispatch(refreshApplicationDeploymentResponse(false));
  }
  dispatch(refreshApplicationDeploymentRequest(false));
};

export const redeployWithVersion: Thunk = (
  applicationDeploymentId: string,
  version: string,
  affiliation: string,
  id: string,
  setInitialTagTypeTrue: () => void
) => async (dispatch, getState, { clients }) => {
  dispatch(redeployRequest(true));
  const result = await clients.applicationDeploymentClient.redeployWithVersion(
    applicationDeploymentId,
    version
  );
  dispatch(addCurrentErrors(result));

  if (result && result.data) {
    dispatch(refreshApplicationDeployment(id, affiliation));
    setInitialTagTypeTrue();
  }
  dispatch(redeployRequest(false));
};

export const redeployWithCurrentVersion: Thunk = (
  applicationDeploymentId: string,
  affiliation: string,
  id: string
) => async (dispatch, getState, { clients }) => {
  dispatch(redeployRequest(true));
  const result = await clients.applicationDeploymentClient.redeployWithCurrentVersion(
    applicationDeploymentId
  );
  dispatch(addCurrentErrors(result));

  if (result && result.data) {
    dispatch(refreshApplicationDeployment(id, affiliation));
  }
  dispatch(redeployRequest(false));
};

function filterNewTagsWithCurrentTags(
  newestTags: IGoboResult<ITagsQuery> | undefined,
  current: ITagsPaged
): ITagsPaged {
  if (
    !(
      newestTags &&
      newestTags.data &&
      newestTags.data.imageRepositories &&
      newestTags.data.imageRepositories.length > 0
    )
  ) {
    return defaultTagsPaged;
  }

  const imageTagsConnection = newestTags.data.imageRepositories[0].tags;
  return {
    ...toTagsPaged(imageTagsConnection),
    tags: toTagsPaged(imageTagsConnection).tags.filter(
      item1 => !current.tags.some(item2 => item2.name === item1.name)
    )
  };
}

export const findNewTagsPaged: Thunk = (
  repository: string,
  type: ImageTagType,
  updateTagsPaged: (
    type: ImageTagType,
    next?: ITagsPaged,
    newTags?: ITagsPaged
  ) => void,
  current: ITagsPaged
) => async (dispatch, getState, { clients }) => {
  dispatch(fetchTagsRequest(true));

  const newestTags = await clients.imageRepositoryClient.findTagsPaged(
    repository,
    type,
    5
  );

  dispatch(addCurrentErrors(newestTags));

  if (
    !(
      newestTags &&
      newestTags.data &&
      newestTags.data.imageRepositories &&
      newestTags.data.imageRepositories.length > 0
    )
  ) {
    dispatch(findTagsPagedResponse(defaultTagsPagedGroup()[type]));
  } else {
    const { imageRepositories } = newestTags.data;
    const filteredTags = filterNewTagsWithCurrentTags(newestTags, current);

    if (filteredTags.tags.length > 0) {
      updateTagsPaged(type, undefined, filteredTags);
    }
    dispatch(findTagsPagedResponse(toTagsPaged(imageRepositories[0].tags)));
  }
  dispatch(fetchTagsRequest(false));
};

export const findTagsPaged: Thunk = (
  repository: string,
  type: ImageTagType,
  updateTagsPaged: (
    type: ImageTagType,
    next?: ITagsPaged,
    newTags?: ITagsPaged
  ) => void,
  first: number,
  current: ITagsPaged
) => async (dispatch, getState, { clients }) => {
  dispatch(fetchTagsRequest(true));

  const tagsAfterCursor = await clients.imageRepositoryClient.findTagsPaged(
    repository,
    type,
    first,
    current.endCursor
  );

  findNewTagsPaged(repository, type, current);

  dispatch(addCurrentErrors(tagsAfterCursor));

  if (
    !(
      tagsAfterCursor &&
      tagsAfterCursor.data &&
      tagsAfterCursor.data.imageRepositories &&
      tagsAfterCursor.data.imageRepositories.length > 0
    )
  ) {
    dispatch(findTagsPagedResponse(defaultTagsPagedGroup()[type]));
  } else {
    const { imageRepositories } = tagsAfterCursor.data;
    updateTagsPaged(type, toTagsPaged(imageRepositories[0].tags));
    dispatch(findTagsPagedResponse(toTagsPaged(imageRepositories[0].tags)));
  }
  dispatch(fetchTagsRequest(false));
};

export const findGroupedTagsPaged: Thunk = (
  repository: string,
  setTagsPagedGroup: (tagsPagedGroup: ITagsPagedGroup) => void
) => async (dispatch, getState, { clients }) => {
  dispatch(fetchGroupedTagsRequest(true));
  const result = await clients.imageRepositoryClient.findGroupedTagsPaged(
    repository
  );
  dispatch(addCurrentErrors(result));

  if (
    !result ||
    !(result.data.imageRepositories && result.data.imageRepositories.length > 0)
  ) {
    dispatch(findGroupedTagsPagedResponse(defaultTagsPagedGroup()));
  } else {
    const { imageRepositories } = result.data;

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

    setTagsPagedGroup(normalizedTags);
    dispatch(findGroupedTagsPagedResponse(normalizedTags));
  }
  dispatch(fetchGroupedTagsRequest(false));
};

export const findApplicationDeploymentDetails: Thunk = (
  id: string,
  withoutLoading?: boolean
) => async (dispatch, getState, { clients }) => {
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
      serviceLinks
    } = result.data.applicationDeploymentDetails;

    let deploymentSpec;
    if (deploymentSpecs.current) {
      const spec = JSON.parse(deploymentSpecs.current.jsonRepresentation);
      deploymentSpec = Object.keys(spec).reduce(
        normalizeRawDeploymentSpec(spec),
        {} as IDeploymentSpec
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
  dispatch(fetchDetailsRequest(false));
};

const defaultTagsPaged: ITagsPaged = {
  endCursor: '',
  hasNextPage: false,
  tags: [],
  totalCount: 0
};

export const toTagsPaged = (
  imageTagsConnection: IImageTagsConnection
): ITagsPaged => {
  const { edges, pageInfo, totalCount } = imageTagsConnection;
  return {
    totalCount,
    endCursor: pageInfo.endCursor,
    hasNextPage: pageInfo.hasNextPage,
    tags: edges.reduce((arr: ITag[], edge) => {
      if (edge.node.image) {
        arr.push({
          lastModified: edge.node.image.buildTime,
          name: edge.node.name,
          type: edge.node.type
        });
      }
      return arr;
    }, [])
  };
};

// ! Temp fix for template deployments with default version
// TODO: FIX
export function findDeployTagForTemplate(
  applicationName: string,
  deployTag: string
) {
  const templates = {
    'aurora-activemq-1.0.0': '2',
    'aurora-redis-1.0.0': '3.2.3',
    'aurora-wiremock-1.0.0': '1.3.0',
    redis: '3.2.3',
    wiremock: '1.3.0'
  };

  if (deployTag) {
    return deployTag;
  }

  return templates[applicationName] || deployTag;
}

export default {
  refreshAffiliationsRequest,
  findAllApplicationDeploymentsResponse,
  findAllApplicationDeploymentsRequest,
  refreshApplicationDeploymentRequest,
  userSettingsResponse,
  updateUserSettingsRequest,
  refreshApplicationDeploymentResponse,
  applicationDeploymentDetailsResponse,
  findTagsPagedResponse,
  findGroupedTagsPagedResponse,
  redeployRequest
};

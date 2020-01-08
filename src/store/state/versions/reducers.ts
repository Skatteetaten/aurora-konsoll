import { reduceReducers, handleAction } from 'redux-ts-utils';

import { ImageTagType } from 'models/ImageTagType';
import { ImageTagsConnection } from 'models/immer/ImageTagsConnection';

import { actions } from './actions';
import {
  IImageTagsConnection,
  ITagsQuery,
  IImageTag
} from 'services/auroraApiClients/imageRepositoryClient/query';

export const defaultImageTagsConnection: IImageTagsConnection = {
  edges: [],
  pageInfo: {
    endCursor: '',
    hasNextPage: true
  },
  totalCount: 0
};

const {
  AURORA_SNAPSHOT_VERSION,
  AURORA_VERSION,
  BUGFIX,
  COMMIT_HASH,
  LATEST,
  MAJOR,
  MINOR,
  SNAPSHOT,
  SEARCH
} = ImageTagType;

export interface IVersionsState {
  types: Record<ImageTagType, ImageTagsConnection>;
  isFetching: boolean;
  configuredVersionTag?: IImageTag;
}

const createImageTagsConnection = (type: ImageTagType): ImageTagsConnection =>
  new ImageTagsConnection(type, defaultImageTagsConnection);

const initialState: IVersionsState = {
  isFetching: false,
  types: {
    [AURORA_SNAPSHOT_VERSION]: createImageTagsConnection(
      AURORA_SNAPSHOT_VERSION
    ),
    [AURORA_VERSION]: createImageTagsConnection(AURORA_VERSION),
    [BUGFIX]: createImageTagsConnection(BUGFIX),
    [COMMIT_HASH]: createImageTagsConnection(COMMIT_HASH),
    [LATEST]: createImageTagsConnection(LATEST),
    [MAJOR]: createImageTagsConnection(MAJOR),
    [MINOR]: createImageTagsConnection(MINOR),
    [SNAPSHOT]: createImageTagsConnection(SNAPSHOT),
    [SEARCH]: createImageTagsConnection(SEARCH)
  }
};

export const versionsReducer = reduceReducers<IVersionsState>(
  [
    handleAction(actions.fetchInitVersions.request, state => {
      state.isFetching = true;
    }),
    handleAction(actions.fetchInitVersions.success, (state, { payload }) => {
      state.isFetching = false;
      Object.keys(payload).forEach(key => {
        const type = key as ImageTagType;
        const response = payload[type];
        const current = state.types[type] as ImageTagsConnection;

        if (response.data) {
          updateImageTagsConnection(response.data, current, true);
        }
      });
    }),

    handleAction(actions.fetchInitVersions.failure, state => {
      state.isFetching = false;
    }),

    handleAction(actions.fetchVersionsForType.request, state => {
      state.isFetching = true;
    }),

    handleAction(actions.fetchVersionsForType.success, (state, { payload }) => {
      state.isFetching = false;

      const { response, paged, type } = payload;
      const current = state.types[type] as ImageTagsConnection;

      if (response.data) {
        updateImageTagsConnection(response.data, current, paged);
      }
    }),
    handleAction(actions.fetchVersionsForType.failure, state => {
      state.isFetching = false;
    }),

    handleAction(actions.resetState, (state, result) => {
      state.isFetching = initialState.isFetching;
      state.types = initialState.types;
      state.configuredVersionTag = undefined;
    }),

    handleAction(actions.resetStateForType, (state, { payload }) => {
      state.types[payload] = createImageTagsConnection(payload);
    }),

    handleAction(actions.fetchVersion.success, (state, { payload }) => {
      if ((payload.data?.imageRepositories?.length ?? 0) > 0) {
        state.configuredVersionTag = payload.data?.imageRepositories[0].tag[0];
      }
    })
  ],
  initialState
);

function updateImageTagsConnection(
  data: ITagsQuery,
  current: ImageTagsConnection,
  paged: boolean
) {
  const { imageRepositories } = data;
  if (imageRepositories.length > 0) {
    const repo = imageRepositories[0].tags;
    current.setTotalCount(repo.totalCount);
    current.addVersions(repo.edges);
    if (paged) {
      current.setPageInfo(repo.pageInfo);
    }
  }
}

import { createReducer } from '@reduxjs/toolkit';

import { ImageTagType } from 'web/models/ImageTagType';
import { ImageTagsConnection } from 'web/models/immer/ImageTagsConnection';

import { actions } from './actions';
import {
  IImageTagsConnection,
  ITagsQuery,
  IImageTag,
} from 'web/services/auroraApiClients/imageRepositoryClient/query';

export const defaultImageTagsConnection: IImageTagsConnection = {
  edges: [],
  pageInfo: {
    endCursor: '',
    hasNextPage: true,
  },
  totalCount: 0,
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
  SEARCH,
} = ImageTagType;

export interface IVersionsState {
  types: Record<ImageTagType, ImageTagsConnection>;
  isFetching: boolean;
  isFetchingConfiguredVersionTag: boolean;
  configuredVersionTag?: IImageTag;
}

const createImageTagsConnection = (type: ImageTagType): ImageTagsConnection =>
  new ImageTagsConnection(type, defaultImageTagsConnection);

const initialState: IVersionsState = {
  isFetching: false,
  isFetchingConfiguredVersionTag: false,
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
    [SEARCH]: createImageTagsConnection(SEARCH),
  },
};

export const versionsReducer = createReducer(initialState, (builder) => {
  builder.addCase(actions.fetchInitVersions.request, (state) => {
    state.isFetching = true;
  });
  builder.addCase(actions.fetchInitVersions.success, (state, { payload }) => {
    state.isFetching = false;
    Object.keys(payload).forEach((key) => {
      const type = key as ImageTagType;
      const response = payload[type];
      const current = state.types[type] as ImageTagsConnection;

      if (response.data) {
        updateImageTagsConnection(response.data, current, true);
      }
    });
  });
  builder.addCase(actions.fetchInitVersions.failure, (state) => {
    state.isFetching = false;
  });

  builder.addCase(actions.fetchVersionsForType.request, (state) => {
    state.isFetching = true;
  });

  builder.addCase(
    actions.fetchVersionsForType.success,
    (state, { payload }) => {
      state.isFetching = false;

      const { response, paged, type } = payload;
      const current = state.types[type] as ImageTagsConnection;

      if (response.data) {
        updateImageTagsConnection(response.data, current, paged);
      }
    }
  );
  builder.addCase(actions.fetchVersionsForType.failure, (state) => {
    state.isFetching = false;
  });

  builder.addCase(actions.resetState, (state, result) => {
    state.isFetching = initialState.isFetching;
    state.types = initialState.types;
    state.configuredVersionTag = undefined;
  });

  builder.addCase(actions.resetStateForType, (state, { payload }) => {
    state.types[payload] = createImageTagsConnection(payload);
  });

  builder.addCase(actions.fetchVersion.request, (state) => {
    state.isFetchingConfiguredVersionTag = true;
  });

  builder.addCase(actions.fetchVersion.success, (state, { payload }) => {
    state.isFetchingConfiguredVersionTag = false;
    if ((payload.data?.imageRepositories?.length ?? 0) > 0) {
      state.configuredVersionTag = payload.data?.imageRepositories[0].tag[0];
    }
  });

  builder.addCase(actions.fetchVersion.failure, (state) => {
    state.isFetchingConfiguredVersionTag = false;
  });
});

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

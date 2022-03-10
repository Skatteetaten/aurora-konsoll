import { createReducer } from '@reduxjs/toolkit';

import { ImageTagsConnection } from 'web/models/immer/ImageTagsConnection';

import { actions } from './actions';
import {
  IImageTagsConnection,
  IImageTag,
} from 'web/services/auroraApiClients/imageRepositoryClient/query';

export const defaultImageTagsConnection: IImageTagsConnection = {
  edges: [],
  totalCount: 0
};

export interface IVersionsState {
  isFetching: boolean;
  isFetchingConfiguredVersionTag: boolean;
  imageTags: ImageTagsConnection;
  configuredVersionTag?: IImageTag;
}

const initialState: IVersionsState = {
  isFetching: false,
  isFetchingConfiguredVersionTag: false,
  imageTags: new ImageTagsConnection(defaultImageTagsConnection)
};

export const versionsReducer = createReducer(initialState, (builder) => {

  builder.addCase(actions.fetchVersions.request, (state) => {state.isFetching = true;});

  builder.addCase(
    actions.fetchVersions.success,
    (state, { payload }) => {
      state.isFetching = false;
      if (payload.data && payload.data.imageRepositories.length > 0) {
        state.imageTags = new ImageTagsConnection(payload.data.imageRepositories[0].tags);
      }
    }
  );

  builder.addCase(actions.fetchVersions.failure, (state) => {
    state.isFetching = false;
  });

  builder.addCase(actions.resetState, (state, result) => {
    state.isFetching = initialState.isFetching;
    state.configuredVersionTag = undefined;
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

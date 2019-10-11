import { reduceReducers, handleAction } from 'redux-ts-utils';

import { ImageTagType } from 'models/ImageTagType';
import { ImageTagsConnection } from 'models/immer/ImageTagsConnection';

import { actions } from './actions';
import { defaultImageTagsConnection } from './action.creators';

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
  readonly types: Record<ImageTagType, ImageTagsConnection>;
  readonly isFetching: Record<ImageTagType, boolean>;
}

const createImageTagsConnection = (): ImageTagsConnection =>
  new ImageTagsConnection(defaultImageTagsConnection);

const initialState: IVersionsState = {
  isFetching: {
    [AURORA_SNAPSHOT_VERSION]: false,
    [AURORA_VERSION]: false,
    [BUGFIX]: false,
    [COMMIT_HASH]: false,
    [LATEST]: false,
    [MAJOR]: false,
    [MINOR]: false,
    [SNAPSHOT]: false,
    [SEARCH]: false
  },
  types: {
    [AURORA_SNAPSHOT_VERSION]: createImageTagsConnection(),
    [AURORA_VERSION]: createImageTagsConnection(),
    [BUGFIX]: createImageTagsConnection(),
    [COMMIT_HASH]: createImageTagsConnection(),
    [LATEST]: createImageTagsConnection(),
    [MAJOR]: createImageTagsConnection(),
    [MINOR]: createImageTagsConnection(),
    [SNAPSHOT]: createImageTagsConnection(),
    [SEARCH]: createImageTagsConnection()
  }
};

export const versionsReducer = reduceReducers<IVersionsState>(
  [
    handleAction(actions.fetchVersionsForType, (state, { payload }) => {
      const { data, paged, type } = payload;
      const current = state.types[type];

      current.setTotalCount(data.totalCount);
      current.addVersions(data.edges);

      if (paged) {
        current.setPageInfo(data.pageInfo);
      }
    }),

    handleAction(actions.isFetching, (state, { payload }) => {
      const { isFetching, type } = payload;
      state.isFetching[type] = isFetching;
    }),

    handleAction(actions.reset, (state, result) => {
      state.isFetching = initialState.isFetching;
      state.types = initialState.types;
    }),

    handleAction(actions.clearStateForType, (state, { payload }) => {
      state.types[payload] = createImageTagsConnection();
    })
  ],
  initialState
);

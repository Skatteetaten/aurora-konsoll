import { uniqBy } from 'lodash';
import { reduceReducers, handleAction } from 'redux-ts-utils';
import { ImageTagType } from 'models/ImageTagType';
import { ImageTagsConnection } from 'models/ImageTagConnection';
import {
  IImageTagsConnection,
  IImageTagEdge
} from 'services/auroraApiClients/imageRepositoryClient/query';

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
  readonly isLoading: boolean;
  readonly types: Record<ImageTagType, ImageTagsConnection>;
}

const createImageTagsConnection = (): ImageTagsConnection =>
  new ImageTagsConnection(defaultImageTagsConnection);

const initialState: IVersionsState = {
  isLoading: false,
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

function distinctEdges(
  current: IImageTagEdge[],
  next: IImageTagEdge[]
): IImageTagEdge[] {
  const edges = [...current, ...next];
  const nodes = edges.map(edge => edge.node);
  return uniqBy(nodes, 'name').map(node => ({ node }));
}

export const versionsReducer = reduceReducers<IVersionsState>(
  [
    handleAction(actions.fetchVersionsForType, (state, { payload }) => {
      const { data, paged, type } = payload;
      const current = state.types[type];

      const imageTagsData: IImageTagsConnection = {
        ...data,
        pageInfo: paged ? data.pageInfo : current.pageInfo,
        edges: distinctEdges(current.edges, data.edges)
      };

      state.types[type] = new ImageTagsConnection(imageTagsData);
    }),

    handleAction(actions.isLoading, (state, { payload }) => {
      state.isLoading = payload;
    }),

    handleAction(actions.reset, (state, result) => {
      state.isLoading = initialState.isLoading;
      state.types = initialState.types;
    })
  ],
  initialState
);

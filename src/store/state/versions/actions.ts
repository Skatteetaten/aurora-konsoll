import { createAction } from 'redux-ts-utils';
import { ImageTagType } from 'models/ImageTagType';
import { IImageTagsConnection } from 'services/auroraApiClients/imageRepositoryClient/query';
import { ActionType } from 'typesafe-actions';

const action = (action: string) => `versions/${action}`;

const isLoading = createAction<boolean>(action('LOADING'));

const fetchVersionsForType = createAction<{
  data: IImageTagsConnection;
  type: ImageTagType;
  paged: boolean;
}>(action('FETCH_VERSIONS_FOR_TYPE'));

const reset = createAction<void>(action('RESET'));

const clearStateForType = createAction<ImageTagType>(action('CLEAR_TYPE'));

export const actions = {
  isLoading,
  fetchVersionsForType,
  reset,
  clearStateForType
};

export type VersionsAction = ActionType<typeof actions>;

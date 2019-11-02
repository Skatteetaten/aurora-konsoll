import { createAction } from 'redux-ts-utils';
import { ImageTagType } from 'models/ImageTagType';
import { ITagsQuery } from 'services/auroraApiClients/imageRepositoryClient/query';
import { ActionType } from 'typesafe-actions';
import { createAsyncActions } from 'utils/redux/action-utils';
import { IDataAndErrors } from 'services/GoboClient';

const action = (action: string) => `versions/${action}`;

const fetchInitVersions = createAsyncActions<
  Record<ImageTagType, IDataAndErrors<ITagsQuery>>
>(action('FETCH_INIT_VERSIONS'));

const fetchVersionsForType = createAsyncActions<{
  response: IDataAndErrors<ITagsQuery>;
  type: ImageTagType;
  paged: boolean;
}>(action('FETCH_VERSIONS_FOR_TYPE'));

const resetState = createAction<void>(action('RESET'));

const resetStateForType = createAction<ImageTagType>(action('CLEAR_TYPE'));

export const actions = {
  fetchInitVersions,
  fetchVersionsForType,
  resetState,
  resetStateForType
};

export type VersionsAction = ActionType<typeof actions>;

import { createAction } from '@reduxjs/toolkit';
import { ImageTagType } from 'web/models/ImageTagType';
import {
  ITagsQuery,
  ITagQuery,
} from 'web/services/auroraApiClients/imageRepositoryClient/query';
import { ActionType } from 'typesafe-actions';
import { createAsyncActions } from 'web/utils/redux/action-utils';
import { IDataAndErrors } from 'web/services/GoboClient';

const action = (action: string) => `versions/${action}`;

const fetchInitVersions = createAsyncActions<
  Record<ImageTagType, IDataAndErrors<ITagsQuery>>
>(action('FETCH_INIT_VERSIONS'));

const fetchVersionsForType = createAsyncActions<{
  response: IDataAndErrors<ITagsQuery>;
  type: ImageTagType;
  paged: boolean;
}>(action('FETCH_VERSIONS_FOR_TYPE'));

const fetchVersion = createAsyncActions<IDataAndErrors<ITagQuery>>(
  action('FETCH_VERSION')
);

const resetState = createAction<void>(action('RESET'));

const resetStateForType = createAction<ImageTagType>(action('CLEAR_TYPE'));

export const actions = {
  fetchInitVersions,
  fetchVersionsForType,
  resetState,
  resetStateForType,
  fetchVersion,
};

export type VersionsAction = ActionType<typeof actions>;

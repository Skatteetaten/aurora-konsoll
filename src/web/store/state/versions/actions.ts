import { createAction } from '@reduxjs/toolkit';
import {
  ITagsQuery,
  ITagQuery,
} from 'web/services/auroraApiClients/imageRepositoryClient/query';
import { ActionType } from 'typesafe-actions';
import { createAsyncActions } from 'web/utils/redux/action-utils';
import { IDataAndErrors } from 'web/services/GoboClient';

const action = (action: string) => `versions/${action}`;

const fetchVersions = createAsyncActions<IDataAndErrors<ITagsQuery>>(action('FETCH_VERSIONS'));

const fetchVersion = createAsyncActions<IDataAndErrors<ITagQuery>>(
  action('FETCH_VERSION')
);

const resetState = createAction<void>(action('RESET'));

export const actions = {
  fetchVersions,
  resetState,
  fetchVersion
};

export type VersionsAction = ActionType<typeof actions>;

import { ActionType } from 'typesafe-actions';

import { IDataAndErrors } from 'web/services/GoboClient';
import { createAsyncActions } from 'web/utils/redux/action-utils';
import { AreasAndTenant } from 'web/services/auroraApiClients';
import {
  ObjectAreas,
  StorageGridQuery,
} from 'web/services/auroraApiClients/storageGridClient/query';

const action = (action: string) => `storageGrid/${action}`;

const fetchAreasAndTenant = createAsyncActions<IDataAndErrors<AreasAndTenant>>(
  action('FETCH_STORAGEGRID_AREAS_AND_TENANT')
);

const fetchAreas = createAsyncActions<
  IDataAndErrors<StorageGridQuery<ObjectAreas>>
>(action('FETCH_STORAGEGRID_AREAS'));

export const actions = {
  fetchAreasAndTenant,
  fetchAreas,
};

export type StorageGridAction = ActionType<typeof actions>;

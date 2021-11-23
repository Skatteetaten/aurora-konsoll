import { ActionType } from 'typesafe-actions';

import { IDataAndErrors } from 'web/services/GoboClient';
import { createAsyncActions } from 'web/utils//redux/action-utils';
import { CnameInfosQuery } from 'web/services/auroraApiClients/dnsClient/query';

const action = (action: string) => `dns/${action}`;

const fetchCnameInfosRequest = createAsyncActions<
  IDataAndErrors<CnameInfosQuery>
>(action('FETCH_CNAME_INFOS'));

export const actions = {
  fetchCnameInfosRequest,
};

export type DnsAction = ActionType<typeof actions>;

import { ActionType } from 'typesafe-actions';

import { IDataAndErrors } from 'services/GoboClient';
import { createAsyncActions } from 'utils/redux/action-utils';
import { CnameInfosQuery } from 'services/auroraApiClients/dnsClient/query';

const action = (action: string) => `dns/${action}`;

const fetchCnameInfosRequest = createAsyncActions<
  IDataAndErrors<CnameInfosQuery>
>(action('FETCH_CNAME_INFOS'));

export const actions = {
  fetchCnameInfosRequest,
};

export type DnsAction = ActionType<typeof actions>;

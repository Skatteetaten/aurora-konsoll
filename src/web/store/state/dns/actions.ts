import { ActionType } from 'typesafe-actions';

import { IDataAndErrors } from 'web/services/GoboClient';
import { createAsyncActions } from 'web/utils/redux/action-utils';
import { CnameQuery } from 'web/services/auroraApiClients/dnsClient/query';

const action = (action: string) => `dns/${action}`;

const fetchCnameRequest = createAsyncActions<IDataAndErrors<CnameQuery>>(
  action('FETCH_CNAME')
);

export const actions = {
  fetchCnameRequest,
};

export type DnsAction = ActionType<typeof actions>;

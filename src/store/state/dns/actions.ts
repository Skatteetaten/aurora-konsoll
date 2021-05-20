import { ActionType } from 'typesafe-actions';

import { IDataAndErrors } from 'services/GoboClient';
import { createAsyncActions } from 'utils/redux/action-utils';
import { IDnsQuery } from 'services/auroraApiClients/dnsClient/client';

const action = (action: string) => `dns/${action}`;

const fetchDnsEntries = createAsyncActions<IDataAndErrors<IDnsQuery>>(
  action('FETCH_DNS_ENTRIES')
);

export const actions = {
  fetchDnsEntries,
};

export type DnsAction = ActionType<typeof actions>;

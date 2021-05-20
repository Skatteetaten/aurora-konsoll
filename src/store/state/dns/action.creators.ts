import { doAsyncActions } from 'utils/redux/action-utils';
import { actions } from '../dns/actions';

export function fetchDnsEntriesRedux(affiliation: string) {
  return doAsyncActions(actions.fetchDnsEntries, (clients) => {
    return clients.dnsClient.fetchDnsEntries(affiliation);
  });
}

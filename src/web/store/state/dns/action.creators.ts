import { doAsyncActions } from 'web/utils/redux/action-utils';
import { actions } from '../dns/actions';

export function fetchCname(affiliation: string) {
  return doAsyncActions(actions.fetchCnameRequest, (clients) => {
    return clients.dnsClient.fetchCname(affiliation);
  });
}

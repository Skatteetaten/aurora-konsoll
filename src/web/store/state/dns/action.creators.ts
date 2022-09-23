import { doAsyncActions } from 'web/utils/redux/action-utils';
import { actions } from '../dns/actions';

export function fetchCnames(affiliation: string) {
  return doAsyncActions(actions.fetchCnameRequest, (clients) => {
    return clients.dnsClient.fetchCnames(affiliation);
  });
}

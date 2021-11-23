import { doAsyncActions } from 'web/utils/redux/action-utils';
import { actions } from '../dns/actions';

export function fetchCnameInfos(affiliation: string) {
  return doAsyncActions(actions.fetchCnameInfosRequest, (clients) => {
    return clients.dnsClient.fetchCnameInfos(affiliation);
  });
}

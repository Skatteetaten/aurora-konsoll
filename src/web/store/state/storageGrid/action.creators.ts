import { doAsyncActions } from 'web/utils/redux/action-utils';
import { actions } from './actions';

export function getAreasAndTenant(affiliation: string) {
  return doAsyncActions(actions.fetchAreasAndTenant, (clients) => {
    return clients.storageGridClient.getAreasAndTenant(affiliation);
  });
}

export function getAreas(affiliation: string) {
  return doAsyncActions(actions.fetchAreas, (clients) => {
    return clients.storageGridClient.refreshAndGetAreas(affiliation);
  });
}

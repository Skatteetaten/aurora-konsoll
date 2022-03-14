import { AsyncAction } from 'web/store/types';

import { actions } from './actions';
import { doAsyncActions } from 'web/utils/redux/action-utils';

export function fetchVersions(repository: string) {
  return doAsyncActions(actions.fetchVersions, (clients) =>
    clients.imageRepositoryClient.fetchVersions(repository)
  );
}

export function fetchVersion(repository: string, tagName: string) {
  return doAsyncActions(actions.fetchVersion, (clients) =>
    clients.imageRepositoryClient.fetchTag(repository, tagName)
  );
}

export function resetState(): AsyncAction {
  return (dispatch) => dispatch(actions.resetState());
}

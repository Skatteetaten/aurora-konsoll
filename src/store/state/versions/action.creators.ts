import { AsyncAction } from 'store/types';
import { ImageTagType } from 'models/ImageTagType';

import { actions } from './actions';
import { doAsyncActions } from 'utils/redux/action-utils';

export function fetchInitVersions(repository: string) {
  return doAsyncActions(actions.fetchInitVersions, clients => {
    return clients.imageRepositoryClient.fetchInitVersions(repository);
  });
}

export function fetchVersion(repository: string, tagName: string) {
  return doAsyncActions(actions.fetchVersion, clients => {
    return clients.imageRepositoryClient.fetchTag(repository, tagName);
  });
}

export function fetchVersions(
  repository: string,
  type: ImageTagType,
  first: number,
  page: boolean = true,
  filter?: string
) {
  const defaultResponse = {
    paged: page,
    type,
    response: {
      name: ''
    }
  };
  return doAsyncActions(
    actions.fetchVersionsForType,
    async (clients, { versions }) => {
      const client = clients.imageRepositoryClient;
      const current = versions.types[type];
      if (page && !current.hasNextPage() && !filter) {
        return defaultResponse;
      }
      const cursor = page ? current.getCursor() : undefined;
      const response = filter
        ? await client.searchTagsPaged(repository, first, filter, cursor)
        : await client.findTagsPaged(repository, type, first, cursor);
      return {
        ...defaultResponse,
        response
      };
    }
  );
}

export function resetState(): AsyncAction {
  return dispatch => dispatch(actions.resetState());
}

export function clearStateForType(type: ImageTagType): AsyncAction {
  return dispatch => dispatch(actions.resetStateForType(type));
}

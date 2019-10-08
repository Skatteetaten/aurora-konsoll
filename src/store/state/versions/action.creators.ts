import { StateThunk } from 'store/types';
import { ImageTagType } from 'models/ImageTagType';
import {
  IImageTagsConnection,
  ITagsQuery
} from 'services/auroraApiClients/imageRepositoryClient/query';

import { actions } from './actions';
import { IGoboResult } from 'services/GoboClient';
import { addCurrentErrors } from 'screens/ErrorHandler/state/actions';

export const defaultImageTagsConnection: IImageTagsConnection = {
  edges: [],
  pageInfo: {
    endCursor: '',
    hasNextPage: true
  },
  totalCount: 0
};

export const fetchVersions = (
  repository: string,
  type: ImageTagType,
  first: number,
  page: boolean = true,
  filter?: string
): StateThunk => async (dispatch, getState, { clients }) => {
  const client = clients.imageRepositoryClient;
  const { versions } = getState();
  const current = versions.types[type];

  if (page && !current.hasNextPage() && !filter) {
    return;
  }

  dispatch(actions.isLoading(true));

  const cursor = page ? current.pageInfo.endCursor : undefined;

  let response: IGoboResult<ITagsQuery> | undefined;
  if (filter) {
    response = await client.searchTagsPaged(repository, first, filter, cursor);
  } else {
    response = await client.findTagsPaged(repository, type, first, cursor);
  }

  dispatch(addCurrentErrors(response));

  if (
    !(
      response &&
      response.data &&
      response.data.imageRepositories &&
      response.data.imageRepositories.length > 0
    )
  ) {
    dispatch(
      actions.fetchVersionsForType({
        type,
        data: defaultImageTagsConnection,
        paged: false
      })
    );
  } else {
    const { imageRepositories } = response.data;
    dispatch(
      actions.fetchVersionsForType({
        type,
        data: imageRepositories[0].tags,
        paged: page
      })
    );
  }

  dispatch(actions.isLoading(false));
};

export function resetState(): StateThunk {
  return dispatch => dispatch(actions.reset());
}

export function clearStateForType(type: ImageTagType): StateThunk {
  return dispatch => dispatch(actions.clearStateForType(type));
}

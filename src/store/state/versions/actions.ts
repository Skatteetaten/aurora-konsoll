import { StateThunk } from 'store/types';
import { ImageTagType } from 'models/ImageTagType';
import { IImageTagsConnection } from 'services/auroraApiClients/imageRepositoryClient/query';

import { actions } from './actions.type';

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
  first: number = 100,
  page: boolean = true
): StateThunk => async (dispatch, getState, { clients }) => {
  const client = clients.imageRepositoryClient;
  const { versions } = getState();
  const current = versions.types[type];

  if (page && !current.hasNextPage()) {
    return;
  }

  dispatch(actions.isLoading(true));

  const cursor = page ? current.pageInfo.endCursor : undefined;
  const response = await client.findTagsPaged(repository, type, first, cursor);

  // TODO: add error message

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

export const reset = (): StateThunk => (dispatch, getState, other) => {
  dispatch(actions.reset());
};

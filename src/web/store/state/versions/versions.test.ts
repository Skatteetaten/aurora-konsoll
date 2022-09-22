import { GraphQLSeverMock } from 'web/utils/GraphQLMock';
import { createTestStore } from 'web/utils/redux/test-utils';
import { ImageTagType } from 'web/models/ImageTagType';
import {
  ITagQuery,
  IImageTag,
} from 'web/services/auroraApiClients/imageRepositoryClient/query';

import { actions } from './actions';
import { fetchVersion } from './action.creators';

const server = new GraphQLSeverMock();

const { nextAction, dispatch, clearActionsAndResetState } =
  createTestStore(server);

afterAll((done) => {
  server.close(done);
});

afterEach(() => {
  clearActionsAndResetState();
});

describe('versions', () => {
  it('should handle null value in tag array', async () => {
    const mockTagQuery: { data: ITagQuery } = {
      data: {
        imageRepositories: [{ tag: [null] }],
      },
    };

    server.putResponse('getTag', mockTagQuery);

    await dispatch(fetchVersion('test', '1'));

    nextAction(actions.fetchVersion.request);
    nextAction(actions.fetchVersion.success, (state) => {
      expect(state.versions.configuredVersionTag).toBeUndefined();
    });
  });

  it('should set configured version', async () => {
    const version: IImageTag = {
      type: ImageTagType.MAJOR,
      name: '1',
    };

    const mockTagQuery: { data: ITagQuery } = {
      data: {
        imageRepositories: [{ tag: [version] }],
      },
    };

    server.putResponse('getTag', mockTagQuery);

    await dispatch(fetchVersion('test', '1'));

    nextAction(actions.fetchVersion.request);
    nextAction(actions.fetchVersion.success, (state) => {
      expect(state.versions.configuredVersionTag).toEqual(version);
    });
  });

  it('should set configuredVersionTag to undefined when tag is an empty list', async () => {
    const mockTagQuery: { data: ITagQuery } = {
      data: {
        imageRepositories: [
          {
            tag: [],
          },
        ],
      },
    };

    server.putResponse('getTag', mockTagQuery);

    await dispatch(fetchVersion('test', '1'));

    nextAction(actions.fetchVersion.request);
    nextAction(actions.fetchVersion.success, (state) => {
      expect(state.versions.configuredVersionTag).toBeUndefined();
    });
  });

  it('should set configuredVersionTag to undefined when imagerepositories is an empty list', async () => {
    const mockTagQuery: { data: ITagQuery } = {
      data: {
        imageRepositories: [],
      },
    };

    server.putResponse('getTag', mockTagQuery);

    await dispatch(fetchVersion('test', '1'));

    nextAction(actions.fetchVersion.request);
    nextAction(actions.fetchVersion.success, (state) => {
      expect(state.versions.configuredVersionTag).toBeUndefined();
    });
  });
});

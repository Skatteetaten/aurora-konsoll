import { GraphQLSeverMock } from 'web/utils/GraphQLMock';
import { createTestStore } from 'web/utils/redux/test-utils';

import { actions } from './actions';
import { fetchVersion } from './action.creators';
import {
  ITagQuery,
  IImageTag,
} from 'web/services/auroraApiClients/imageRepositoryClient/query';
import { ImageTagType } from '../../../models/ImageTagType';

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
});

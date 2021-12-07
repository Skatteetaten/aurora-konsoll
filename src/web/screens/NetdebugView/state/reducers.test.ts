import each from 'jest-each';
import {
  netdebugResultFactory,
  netdebugViewStateInitialState,
} from 'web/testData/testDataBuilders';
import {
  fetchNetdebugStatusResponse,
  fetchNetdebugStatusRequest,
} from './actions';
import { netdebugViewReducer } from './reducer';

describe('netdebug reducer', () => {
  each([
    [
      {
        name: 'fetchNetdebugStatusRequest',
        item: netdebugViewStateInitialState.build(),
      },
      {
        name: 'isFetching',
        item: fetchNetdebugStatusRequest(true),
      },
      netdebugViewStateInitialState.build({
        isFetching: true,
      }),
    ],
    [
      {
        name: 'fetchNetdebugStatusResponse',
        item: netdebugViewStateInitialState.build(),
      },
      {
        name: 'netdebugStatus',
        item: fetchNetdebugStatusResponse(
          netdebugResultFactory.build({
            failed: [],
            open: [{ message: 'beskjed' }],
            status: 'OPEN',
          })
        ),
      },
      netdebugViewStateInitialState.build({
        netdebugStatus: netdebugResultFactory.build({
          failed: [],
          open: [{ message: 'beskjed' }],
          status: 'OPEN',
        }),
      }),
    ],
  ]).describe.only('', (a, b, expected) => {
    test.only(`given defaultState and action ${a.name} with given value should change ${b.name} to given value`, () => {
      expect(netdebugViewReducer(a.item, b.item)).toEqual(expected);
    });
  });
});

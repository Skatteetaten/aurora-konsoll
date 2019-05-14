import each from 'jest-each';
import { netdebugResultFactory } from 'testData/testDataBuilders';
import {
  fetchNetdebugStatusRequest,
  fetchNetdebugStatusResponse
} from './actions';
import { netdebugViewReducer } from './reducer';

describe('certificate reducer', () => {
  each([
    [
      {
        name: 'fetchNetdebugStatusResponse',
        item: netdebugResultFactory.build()
      },
      {
        name: 'netdebugStatus',
        item: fetchNetdebugStatusResponse(
          netdebugResultFactory.build({
            failed: [],
            open: [{ message: 'message' }],
            status: 'OPEN'
          })
        )
      },
      netdebugResultFactory.build({
        failed: [],
        open: [{ message: 'message' }],
        status: 'OPEN'
      })
    ]
  ]).describe.only('', (a, b, expected) => {
    test.only(`given defaultState and action ${
      a.name
    } with given value should change ${b.name} to given value`, () => {
      expect(netdebugViewReducer(a.item, b.item)).toEqual(expected);
    });
  });
});

import each from 'jest-each';
import {
  errorStateManagerStateFactory,
  errorStateFactory,
  appErrorFactory
} from 'testData/testDataBuilders';
import { errorsAction, incrementErrorId, nextErrorAction } from './actions';
import { errorStateManagerReducer } from './reducer';

describe('errorStateManager reducer', () => {
  each([
    [
      {
        name: 'errorsAction',
        item: errorStateManagerStateFactory.build()
      },

      {
        name: 'errors',
        item: errorsAction(errorStateFactory.build())
      },

      errorStateManagerStateFactory.build({
        errors: errorStateFactory.build()
      })
    ],

    [
      {
        name: 'incrementErrorId',
        item: errorStateManagerStateFactory.build()
      },

      {
        name: 'errorCount',
        item: incrementErrorId(1)
      },

      errorStateManagerStateFactory.build({
        errorCount: 1
      })
    ],
    [
      {
        name: 'nextErrorAction',
        item: errorStateManagerStateFactory.build()
      },
      {
        name: 'nextError',
        item: nextErrorAction(
          appErrorFactory.build({
            id: 9,
            isActive: true,
            error: new Error('test')
          })
        )
      },
      errorStateManagerStateFactory.build({
        nextError: appErrorFactory.build({
          id: 9,
          isActive: true,
          error: new Error('test')
        })
      })
    ]
  ]).describe.only('', (a, b, expected) => {
    test.only(`given defaultState and action ${
      a.name
    } with given value should change ${b.name} to given value`, () => {
      expect(errorStateManagerReducer(a.item, b.item)).toEqual(expected);
    });
  });
});

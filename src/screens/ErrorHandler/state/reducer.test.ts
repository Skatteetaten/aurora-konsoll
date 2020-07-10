import each from 'jest-each';
import {
  errorsStateFactory,
  errorStateFactory,
  appErrorFactory
} from 'testData/testDataBuilders';
import { errorsResponse, incrementErrorId, nextErrorResponse } from './actions';
import { errorsReducer } from './reducer';

describe('errors reducer', () => {
  each([
    [
      {
        name: 'errorsResponse',
        item: errorsStateFactory.build()
      },

      {
        name: 'errors',
        item: errorsResponse(errorStateFactory.build())
      },

      errorsStateFactory.build({
        errors: errorStateFactory.build()
      })
    ],

    [
      {
        name: 'incrementErrorId',
        item: errorsStateFactory.build()
      },

      {
        name: 'errorCount',
        item: incrementErrorId(1)
      },

      errorsStateFactory.build({
        errorCount: 1
      })
    ],
    [
      {
        name: 'nextErrorResponse',
        item: errorsStateFactory.build()
      },
      {
        name: 'nextError',
        item: nextErrorResponse(
          appErrorFactory.build({
            id: 9,
            isActive: true,
            error: new Error('test')
          })
        )
      },
      errorsStateFactory.build({
        nextError: appErrorFactory.build({
          id: 9,
          isActive: true,
          error: new Error('test')
        })
      })
    ]
  ]).describe.only('', (a, b, expected) => {
    test.only(`given defaultState and action ${a.name} with given value should change ${b.name} to given value`, () => {
      expect(errorsReducer(a.item, b.item)).toEqual(expected);
    });
  });
});

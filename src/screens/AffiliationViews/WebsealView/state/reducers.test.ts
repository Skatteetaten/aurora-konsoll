import each from 'jest-each';
import {
  websealReduxStateFactory,
  websealStateFactory
} from 'testData/testDataBuilders';
import {
  fetchWebsealStatesRequest,
  fetchWebsealStatesResponse
} from './actions';
import { websealReducer } from './reducers';

describe('webseal reducer', () => {
  each([
    [
      {
        name: 'fetchWebsealStatesRequest',
        item: websealReduxStateFactory.build()
      },
      {
        name: 'isFetchingWebsealStates',
        item: fetchWebsealStatesRequest(true)
      },
      websealReduxStateFactory.build({
        isFetchingWebsealStates: true
      })
    ],
    [
      {
        name: 'fetchWebsealStatesResponse',
        item: websealReduxStateFactory.build()
      },
      {
        name: 'websealStates',
        item: fetchWebsealStatesResponse(websealStateFactory.buildList(2))
      },
      websealReduxStateFactory.build({
        websealStates: websealStateFactory.buildList(2)
      })
    ]
  ]).describe.only('', (a, b, expected) => {
    test.only(`given defaultState and action ${a.name} with given value should change ${b.name} to given value`, () => {
      expect(websealReducer(a.item, b.item)).toEqual(expected);
    });
  });
});

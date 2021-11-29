import { websealStateFactory } from 'web/testData/testDataBuilders';
import {
  fetchWebsealStatesRequest,
  fetchWebsealStatesResponse,
} from './actions';

describe('webseal actions', () => {
  it('should return type of action fetchSchemaRequest and payload', () => {
    expect(fetchWebsealStatesRequest(true)).toEqual({
      payload: true,
      type: 'webseal/FETCHED_WEBSEAL_STATES_REQUEST',
    });
  });

  it('should return type of action fetchSchemaResponse and payload', () => {
    expect(
      fetchWebsealStatesResponse(websealStateFactory.buildList(2))
    ).toEqual({
      payload: websealStateFactory.buildList(2),
      type: 'webseal/FETCHED_WEBSEAL_STATES_RESPONSE',
    });
  });
});

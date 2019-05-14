import {
  fetchNetdebugStatusRequest,
  fetchNetdebugStatusResponse
} from './actions';

describe('netdebugView schema actions', () => {
  it('should return type of action fetchNetdebugStatusRequest and payload', () => {
    expect(fetchNetdebugStatusRequest(true)).toEqual({
      payload: true,
      type: 'netdebugView/FETCH_NETDEBUG_REQUEST'
    });
  });

  it('should return type of action fetchNetdebugStatusResponse and payload', () => {
    expect(
      fetchNetdebugStatusResponse({
        failed: [],
        open: [],
        status: 'Noe gikk galt'
      })
    ).toEqual({
      payload: { failed: [], open: [], status: 'Noe gikk galt' },
      type: 'netdebugView/FETCH_NETDEBUG_RESPONSE'
    });
  });
});

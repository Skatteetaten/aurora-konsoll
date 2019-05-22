import { nextErrorResponse, incrementErrorId, errorsResponse } from './actions';
import { errorStateFactory, appErrorFactory } from 'testData/testDataBuilders';

describe('errors actions', () => {
  it('should return type of action errorsResponse and payload', () => {
    expect(errorsResponse(errorStateFactory.build())).toEqual({
      payload: errorStateFactory.build(),
      type: 'errors/ERRORS'
    });
  });

  it('should return type of action incrementErrorId and payload', () => {
    expect(incrementErrorId(3)).toEqual({
      payload: 3,
      type: 'errors/INCREMENT_ERROR_ID_COUNT'
    });
  });

  it('should return type of action nextErrorResponse and payload', () => {
    expect(
      nextErrorResponse(
        appErrorFactory.build({
          id: 5,
          error: new Error('test'),
          isActive: false
        })
      )
    ).toEqual({
      payload: appErrorFactory.build({
        id: 5,
        error: new Error('test'),
        isActive: false
      }),
      type: 'errors/NEXT_ERROR'
    });
  });
});

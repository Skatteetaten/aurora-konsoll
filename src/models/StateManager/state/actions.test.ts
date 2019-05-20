import { nextErrorAction, incrementErrorId, errorsAction } from './actions';
import { errorStateFactory, appErrorFactory } from 'testData/testDataBuilders';

describe('errorStateManager actions', () => {
  it('should return type of action errorsAction and payload', () => {
    expect(errorsAction(errorStateFactory.build())).toEqual({
      payload: errorStateFactory.build(),
      type: 'errorStateManager/ERRORS'
    });
  });

  it('should return type of action incrementErrorId and payload', () => {
    expect(incrementErrorId(3)).toEqual({
      payload: 3,
      type: 'errorStateManager/INCREMENT_ERROR_ID_COUNT'
    });
  });

  it('should return type of action nextErrorAction and payload', () => {
    expect(
      nextErrorAction(appErrorFactory.build({ id: 5, isActive: false }))
    ).toEqual({
      payload: appErrorFactory.build({ id: 5, isActive: false }),
      type: 'errorStateManager/NEXT_ERROR'
    });
  });
});

import {
  startupFactory,
  userAndAffiliationsFactory
} from 'testData/testDataBuilders';
import { fetchCurrentUserResponse } from './actions';
import { startupReducer } from './reducers';

describe('startup actions', () => {
  it('should return type of action fetchCurrentUserResponse and payload', () => {
    expect(
      fetchCurrentUserResponse(userAndAffiliationsFactory.build())
    ).toEqual({
      payload: userAndAffiliationsFactory.build(),
      type: 'currentUser/FETCHED_CURRENT_USER'
    });
  });
});

describe('startup reducer', () => {
  it('given defaultState and action fetchCurrentUserResponse with given values should change currentUser to given values', () => {
    expect(
      startupReducer(
        startupFactory.build(),
        fetchCurrentUserResponse(userAndAffiliationsFactory.build())
      )
    ).toEqual(
      startupFactory.build({
        currentUser: userAndAffiliationsFactory.build()
      })
    );
  });
});

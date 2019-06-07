import {
  startupFactory,
  userAndAffiliationsFactory,
  goboUserFactory,
  goboUsersFactory
} from 'testData/testDataBuilders';
import { fetchCurrentUserResponse, fetchGoboUsersResponse } from './actions';
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
  it('should return type of action fetchCurrentUserResponse and payload', () => {
    expect(fetchGoboUsersResponse([goboUserFactory.build()])).toEqual({
      payload: [goboUserFactory.build()],
      type: 'currentUser/FETCHED_GOBO_USERS'
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

  it('given defaultState and action fetchGoboUsersResponse with given values should change goboUsers to given values', () => {
    expect(
      startupReducer(
        startupFactory.build(),
        fetchGoboUsersResponse([
          goboUsersFactory.build({ count: 2, name: 'Ben' })
        ])
      )
    ).toEqual(
      startupFactory.build({
        goboUsers: [goboUsersFactory.build({ count: 2, name: 'Ben' })]
      })
    );
  });
});

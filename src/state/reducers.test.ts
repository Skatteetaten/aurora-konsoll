import { IUserAndAffiliations } from 'models/ApplicationDeployment';
import { FETCHED_CURRENT_USER } from './actions';

import { startupReducer as reducer } from './reducers';

const currentUser: IUserAndAffiliations = {
  id: 'b34534',
  user: 'batman',
  affiliations: ['sirius']
};

describe('startup reducer', () => {
  it('should return current user', () => {
    expect(
      reducer(undefined, {
        type: FETCHED_CURRENT_USER,
        payload: { currentUser }
      })
    ).toMatchObject({
      currentUser
    });
  });
});

import { handleAction, reduceReducers } from 'redux-ts-utils';
import { actions } from './actions';
import { ApplicationsConnection } from 'models/immer/ApplicationsConnection';

interface IApplicationsState {
  isFetching: boolean;
  applicationsConnection: ApplicationsConnection;
  errors: {
    requestApplications: Error[];
  };
}

const initialState: IApplicationsState = {
  isFetching: false,
  applicationsConnection: new ApplicationsConnection({}),
  errors: {
    requestApplications: []
  }
};

export const applicationsReducer = reduceReducers<IApplicationsState>(
  [
    handleAction(actions.requestApplications, state => {
      state.isFetching = true;
    }),
    handleAction(actions.requestApplicationsSuccess, (state, { payload }) => {
      state.isFetching = false;
      if (payload.data) {
        state.applicationsConnection.update(payload.data);
      }
      if (payload.errors) {
        state.errors.requestApplications.push(...payload.errors);
      }
    }),
    handleAction(actions.requestApplicationsFailure, (state, { payload }) => {
      state.isFetching = false;
      state.errors.requestApplications.push(payload);
    })
  ],
  initialState
);

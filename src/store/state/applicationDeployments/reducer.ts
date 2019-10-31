import { handleAction, reduceReducers } from 'redux-ts-utils';
import { actions } from './actions';
import { ApplicationsConnection } from 'models/immer/ApplicationsConnection';

interface IApplicationsState {
  isFetching: boolean;
  isDeploying: boolean;
  applicationsConnection: ApplicationsConnection;
  errors: {
    requestApplications: Error[];
  };
}

const initialState: IApplicationsState = {
  isFetching: false,
  isDeploying: false,
  applicationsConnection: new ApplicationsConnection({}),
  errors: {
    requestApplications: []
  }
};

export const applicationsReducer = reduceReducers<IApplicationsState>(
  [
    handleAction(actions.deployRequest, state => {
      state.isDeploying = true;
    }),

    handleAction(actions.fetchApplications.request, state => {
      state.isFetching = true;
    }),
    handleAction(actions.fetchApplications.success, (state, { payload }) => {
      state.isDeploying = false;
      state.isFetching = false;
      if (payload.data) {
        state.applicationsConnection.update(payload.data);
      }
      if (payload.errors) {
        state.errors.requestApplications.push(...payload.errors);
      }
    }),
    handleAction(actions.fetchApplications.failure, (state, { payload }) => {
      state.isDeploying = false;
      state.isFetching = false;
      state.errors.requestApplications.push(payload);
    })
  ],
  initialState
);

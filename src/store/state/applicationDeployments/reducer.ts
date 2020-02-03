import { handleAction, reduceReducers } from 'redux-ts-utils';
import { actions } from './actions';
import { ApplicationsConnection } from 'models/immer/ApplicationsConnection';
import { ApplicationDeployment } from 'models/immer/ApplicationDeployment';

interface IApplicationsState {
  isFetching: boolean;
  isDeploying: boolean;
  isRefreshing: boolean;
  isRefreshingForAffiliation: boolean;
  applicationsConnection: ApplicationsConnection;
  applicationDeployment?: ApplicationDeployment;
  errors: {
    requestApplications: Error[];
    requestApplicationDeployment: Error[];
  };
}

const initialState: IApplicationsState = {
  isFetching: false,
  isDeploying: false,
  isRefreshing: false,
  isRefreshingForAffiliation: false,
  applicationsConnection: new ApplicationsConnection({}),
  errors: {
    requestApplications: [],
    requestApplicationDeployment: []
  }
};

export const applicationsReducer = reduceReducers<IApplicationsState>(
  [
    handleAction(actions.deleteApplicationDeploymentRequest, state => {
      state.isRefreshingForAffiliation = true;
      state.isFetching = true;
    }),
    handleAction(actions.refreshAllDeploymentsForAffiliation, state => {
      state.isRefreshingForAffiliation = true;
      state.isFetching = true;
    }),
    handleAction(actions.refreshApplicationDeployment, state => {
      state.isRefreshing = true;
    }),
    handleAction(actions.resetApplicationDeploymentState, state => {
      state.applicationDeployment = undefined;
    }),
    handleAction(actions.deployRequest, state => {
      state.isDeploying = true;
    }),
    handleAction(
      actions.fetchApplicationDeploymentWithDetails.request,
      state => {
        state.isFetching = true;
      }
    ),
    handleAction(
      actions.fetchApplicationDeploymentWithDetails.success,
      (state, { payload }) => {
        state.isDeploying = false;
        state.isFetching = false;
        state.isRefreshing = false;
        if (payload.data) {
          const newDeployment = new ApplicationDeployment(payload.data);
          state.applicationDeployment = newDeployment;
          state.applicationsConnection.updateApplicationDeployment(
            newDeployment
          );
        }
        if (payload.errors) {
          state.errors.requestApplicationDeployment.push(...payload.errors);
        }
      }
    ),
    handleAction(
      actions.fetchApplicationDeploymentWithDetails.failure,
      (state, { payload }) => {
        state.isDeploying = false;
        state.isFetching = false;
        state.isRefreshing = false;
        state.errors.requestApplicationDeployment.push(payload);
      }
    ),

    handleAction(actions.fetchApplicationDeployments.request, state => {
      state.isFetching = true;
    }),
    handleAction(
      actions.fetchApplicationDeployments.success,
      (state, { payload }) => {
        state.isFetching = false;
        state.isRefreshingForAffiliation = false;
        if (payload.data) {
          state.applicationsConnection.update(payload.data);
        }
        if (payload.errors) {
          state.errors.requestApplications.push(...payload.errors);
        }
      }
    ),
    handleAction(
      actions.fetchApplicationDeployments.failure,
      (state, { payload }) => {
        state.isFetching = false;
        state.isRefreshingForAffiliation = false;
        state.errors.requestApplications.push(payload);
      }
    )
  ],
  initialState
);
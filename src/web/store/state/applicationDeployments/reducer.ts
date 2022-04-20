import { actions } from './actions';
import { ApplicationsConnection } from 'web/models/immer/ApplicationsConnection';
import { ApplicationDeployment } from 'web/models/immer/ApplicationDeployment';
import { createReducer } from '@reduxjs/toolkit';

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
  applicationDeploymentId?: string;
}

const initialState: IApplicationsState = {
  isFetching: false,
  isDeploying: false,
  isRefreshing: false,
  isRefreshingForAffiliation: false,
  applicationsConnection: new ApplicationsConnection({}),
  errors: {
    requestApplications: [],
    requestApplicationDeployment: [],
  },
};

export const applicationsReducer = createReducer(initialState, (builder) => {
  builder.addCase(actions.deleteApplicationDeploymentRequest, (state) => {
    state.isRefreshingForAffiliation = true;
    state.isFetching = true;
  });
  builder.addCase(actions.refreshAllDeploymentsForAffiliation, (state) => {
    state.isRefreshingForAffiliation = true;
    state.isFetching = true;
  });
  builder.addCase(actions.setApplicationDeploymentId, (state, { payload }) => {
    state.applicationDeploymentId = payload;
  });
  builder.addCase(actions.refreshApplicationDeployment, (state) => {
    state.isRefreshing = true;
  });
  builder.addCase(actions.resetApplicationDeploymentState, (state) => {
    state.applicationDeployment = undefined;
  });
  builder.addCase(actions.deployRequest, (state) => {
    state.isDeploying = true;
  });
  builder.addCase(
    actions.fetchApplicationDeploymentWithDetails.request,
    (state) => {
      state.isFetching = true;
    }
  );
  builder.addCase(
    actions.fetchApplicationDeploymentWithDetails.success,
    (state, { payload }) => {
      state.isDeploying = false;
      state.isFetching = false;
      state.isRefreshing = false;

      const isApplicationDeploymentIdFromPayloadSameAsCurrent =
        payload.data &&
        state.applicationDeploymentId &&
        state.applicationDeploymentId === payload.data.applicationDeployment.id;

      const branchDeleted =
        !!payload.errors &&
        payload.errors.some((it) =>
          it.message.includes('No git reference with refName')
        );

      if (payload.data && isApplicationDeploymentIdFromPayloadSameAsCurrent) {
        const newDeployment = new ApplicationDeployment(
          payload.data,
          branchDeleted
        );
        state.applicationDeployment = newDeployment;
        state.applicationsConnection.updateApplicationDeployment(newDeployment);
      }
      if (payload.errors) {
        state.errors.requestApplicationDeployment.push(...payload.errors);
      }
    }
  );
  builder.addCase(
    actions.fetchApplicationDeploymentWithDetails.failure,
    (state, { payload }) => {
      state.isDeploying = false;
      state.isFetching = false;
      state.isRefreshing = false;
      state.errors.requestApplicationDeployment.push(payload);
    }
  );
  builder.addCase(actions.fetchApplicationDeployments.request, (state) => {
    state.isFetching = true;
  });
  builder.addCase(
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
  );
  builder.addCase(
    actions.fetchApplicationDeployments.failure,
    (state, { payload }) => {
      state.isFetching = false;
      state.isRefreshingForAffiliation = false;
      state.errors.requestApplications.push(payload);
    }
  );
});

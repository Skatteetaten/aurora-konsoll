import { actions } from './actions';
import { createReducer } from '@reduxjs/toolkit';
import { AreasAndTenant } from 'web/services/auroraApiClients';

interface StorageGridState {
  isFetchingAreas: boolean;
  isFetchingAreasAndTenant: boolean;
  areasAndTenant?: AreasAndTenant;
  errors: Error[];
}

const initialState: StorageGridState = {
  isFetchingAreas: false,
  isFetchingAreasAndTenant: false,
  errors: [],
};

export const storageGridReducer = createReducer(initialState, (builder) => {
  builder.addCase(actions.fetchAreasAndTenant.request, (state) => {
    state.isFetchingAreasAndTenant = true;
  });
  builder.addCase(actions.fetchAreasAndTenant.success, (state, { payload }) => {
    state.isFetchingAreasAndTenant = false;
    if (payload.data) {
      state.areasAndTenant = payload.data;
    }
    if (payload.errors) {
      state.errors.push(...payload.errors);
    }
  });
  builder.addCase(actions.fetchAreasAndTenant.failure, (state, { payload }) => {
    state.isFetchingAreasAndTenant = false;
    state.errors.push(payload);
  });

  builder.addCase(actions.fetchAreas.request, (state) => {
    state.isFetchingAreas = true;
  });
  builder.addCase(actions.fetchAreas.success, (state, { payload }) => {
    state.isFetchingAreas = false;
    if (payload.data && state.areasAndTenant) {
      state.areasAndTenant.activeAreas =
        payload.data.affiliations.edges[0].node.storageGrid.objectAreas.active;
    }
    if (payload.errors) {
      state.errors.push(...payload.errors);
    }
  });
  builder.addCase(actions.fetchAreas.failure, (state, { payload }) => {
    state.isFetchingAreas = false;
    state.errors.push(payload);
  });
});

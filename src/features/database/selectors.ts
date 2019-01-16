import { IDatabaseState } from './reducers';

export const getLoading = (state: IDatabaseState) => state.isLoading;
export const getItems = (state: IDatabaseState) => state.items;
export const getError = (state: IDatabaseState) => state.hasErrored;

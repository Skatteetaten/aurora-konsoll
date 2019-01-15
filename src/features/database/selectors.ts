import { IDatabaseState } from './reducers';

export const getSchema = (state: IDatabaseState) => state.schema;

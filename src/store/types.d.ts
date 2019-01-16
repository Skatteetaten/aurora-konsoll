import { StateType } from 'typesafe-actions';
import { CountersAction } from '../features/counter';
import { SchemasAction } from '../features/database';
import rootReducer from './rootReducer';

export type RootState = StateType<typeof rootReducer>;
export type RootAction = CountersAction | SchemasAction;

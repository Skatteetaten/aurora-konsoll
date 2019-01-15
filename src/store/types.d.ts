import { StateType } from 'typesafe-actions';
import { CountersAction } from '../features/counter';
import { SchemaAction } from '../features/database';
import rootReducer from './rootReducer';

export type RootState = StateType<typeof rootReducer>;
export type RootAction = CountersAction | SchemaAction;

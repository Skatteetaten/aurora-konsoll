import { StateType } from 'typesafe-actions';
import { DatabaseSchemasAction } from 'screens/AffiliationViews/DatabaseView/state/reducers';
import rootReducer from './rootReducer';

export type RootState = StateType<typeof rootReducer>;
export type RootAction = DatabaseSchemasAction;

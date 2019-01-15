import { ActionType } from 'typesafe-actions';

import * as schemas from './actions';
export type SchemasAction = ActionType<typeof schemas>;

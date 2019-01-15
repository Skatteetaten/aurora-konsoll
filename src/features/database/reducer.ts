// import { combineReducers } from 'redux';
// import { ActionType } from 'typesafe-actions';
// import * as actions from './actions';
// import {
//   FETCHED_SCHEMA_FAILURE,
//   FETCHED_SCHEMA_REQUEST,
//   FETCHED_SCHEMA_SUCCESS
// } from './constants';

// export type SchemaAction = ActionType<typeof actions>;

// export interface ISchemaState {
//   readonly reduxState: boolean;
// }

// const initialState = {
//   loading: false,
//   schemas: []
// };

// export default combineReducers<ISchemaState, SchemaAction>({
//   reduxState: (state = false, action) => {
//     switch (action.type) {
//       case FETCHED_SCHEMA_REQUEST:
//         // tslint:disable-next-line:no-console
//         console.log(state);
//         return !state;
//       case FETCHED_SCHEMA_SUCCESS:
//         // tslint:disable-next-line:no-console
//         console.log(state && action.payload);
//         return state && action.payload;
//       case FETCHED_SCHEMA_FAILURE:
//         return state;
//       default:
//         return state;
//     }
//   }
// });

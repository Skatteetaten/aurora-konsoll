// import { Epic } from 'redux-observable';
// import { from, of } from 'rxjs';
// import { catchError, filter, map, switchMap } from 'rxjs/operators';
// import { getType, isOfType } from 'typesafe-actions';
// import * as Types from '../../store/types';
// import { SchemaAction } from './index';

// import { fetchSchema } from './actions';

// const fetchSchemasFlow: Epic<SchemaAction, SchemaAction, Types.RootState> = (
//   action$,
//   store
// ) =>
//   action$.pipe(
//     filter(isOfType(getType(fetchSchema.request))),
//     switchMap(action =>
//       from(getWeather(action.payload.lat, action.payload.lng)).pipe(
//         map(fetchSchema.success),
//         catchError(error => of(actions.weatherErrorAction(error)))
//       )
//     )
//   );

// export default [weatherGetEpic];

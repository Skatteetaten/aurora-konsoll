import { ICountersState } from './reducer';

export const getReduxCounter = (state: ICountersState) => state.reduxCounter;

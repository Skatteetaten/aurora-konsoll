import { IWebsealState } from 'models/Webseal';

import { IAuroraApiComponentProps } from 'components/AuroraApi';
import { ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { createAction } from 'redux-ts-utils';
import { RootAction, RootState } from 'store/types';

const websealAction = (action: string) => `webseal/${action}`;

export const fetchWebsealStatesRequest = createAction<boolean>(
  websealAction('FETCHED_WEBSEAL_STATES_REQUEST')
);
export const fetchWebsealStatesResponse = createAction<IWebsealState[]>(
  websealAction('FETCHED_WEBSEAL_STATES_RESPONSE')
);

export type Thunk = ActionCreator<
  ThunkAction<void, RootState, IAuroraApiComponentProps, RootAction>
>;

export const fetchWebsealStates: Thunk = (affiliation: string) => async (
  dispatch,
  getState,
  { clients }
) => {
  dispatch(fetchWebsealStatesRequest(true));
  const result = await clients.websealClient.getWebsealStates(affiliation);
  dispatch(fetchWebsealStatesRequest(false));
  dispatch(fetchWebsealStatesResponse(result));
};

export default {
  fetchWebsealStatesRequest,
  fetchWebsealStatesResponse
};

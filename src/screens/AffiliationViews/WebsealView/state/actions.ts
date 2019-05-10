import { IWebsealState } from 'models/Webseal';

import { IAuroraApiComponentProps } from 'components/AuroraApi';
import { addErrors } from 'models/StateManager/state/actions';
import { ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { createAction } from 'redux-ts-utils';
import { IWebsealStateEdge } from 'services/auroraApiClients/websealClient/query';
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

  const normalizeWebsealState = (
    edges: IWebsealStateEdge[]
  ): IWebsealState[] => {
    let states: IWebsealState[] = [];
    for (const edge of edges) {
      states = edge.node.websealStates;
    }
    return states;
  };

  if (result && result.errors) {
    dispatch(addErrors(result.errors));
  }

  if (result && result.data && result.data.affiliations.edges.length > 0) {
    const websealStates = normalizeWebsealState(result.data.affiliations.edges);
    dispatch(fetchWebsealStatesResponse(websealStates));
  } else {
    dispatch(fetchWebsealStatesResponse([]));
  }
};

export default {
  fetchWebsealStatesRequest,
  fetchWebsealStatesResponse
};

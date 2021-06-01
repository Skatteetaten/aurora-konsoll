import { IWebsealState } from 'models/Webseal';

import { addCurrentErrors } from 'screens/ErrorHandler/state/actions';
import { createAction } from '@reduxjs/toolkit';
import { IWebsealStateEdge } from 'services/auroraApiClients/websealClient/query';
import { Thunk } from 'store/types';

const websealAction = (action: string) => `webseal/${action}`;

export const fetchWebsealStatesRequest = createAction<boolean>(
  websealAction('FETCHED_WEBSEAL_STATES_REQUEST')
);
export const fetchWebsealStatesResponse = createAction<IWebsealState[]>(
  websealAction('FETCHED_WEBSEAL_STATES_RESPONSE')
);

export const fetchWebsealStates: Thunk =
  (affiliation: string) =>
  async (dispatch, getState, { clients }) => {
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
    dispatch(addCurrentErrors(result));

    if (result && result.data && result.data.affiliations.edges.length > 0) {
      const websealStates = normalizeWebsealState(
        result.data.affiliations.edges
      );
      dispatch(fetchWebsealStatesResponse(websealStates));
    } else {
      dispatch(fetchWebsealStatesResponse([]));
    }
  };

const actions = {
  fetchWebsealStatesRequest,
  fetchWebsealStatesResponse,
};

export default actions;

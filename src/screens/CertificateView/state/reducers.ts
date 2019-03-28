import { ICertificateResult } from 'models/certificates';
import { handleAction, reduceReducers } from 'redux-ts-utils';
import { ActionType } from 'typesafe-actions';
import actions, {
  fetchCertificatesRequest,
  fetchCertificatesResponse
} from './actions';

export type CertificateAction = ActionType<typeof actions>;

export interface ICertificateState {
  readonly isFetchingCertificates: boolean;
  readonly certificates: ICertificateResult;
}

const initialState = (): ICertificateState => {
  return {
    certificates: {
      certificates: [],
      totalCount: 0
    },
    isFetchingCertificates: false
  };
};

function updateStateWithPayload(name: string) {
  return (state: ICertificateState, { payload }: CertificateAction) => {
    state[name] = payload;
  };
}

export const certificateReducer = reduceReducers<ICertificateState>(
  [
    handleAction(
      fetchCertificatesRequest,
      updateStateWithPayload('isFetchingCertificates')
    ),
    handleAction(
      fetchCertificatesResponse,
      updateStateWithPayload('certificates')
    )
  ],
  initialState()
);

import { ICertificateResult } from 'models/certificates';
import { createReducer } from '@reduxjs/toolkit';
import { ActionType } from 'typesafe-actions';
import actions, {
  fetchCertificatesRequest,
  fetchCertificatesResponse,
} from './actions';

export type CertificateAction = ActionType<typeof actions>;

export interface ICertificateState {
  readonly isFetchingCertificates: boolean;
  readonly certificates: ICertificateResult;
}

const initialState: ICertificateState = {
  certificates: {
    certificates: [],
    totalCount: 0,
  },
  isFetchingCertificates: false,
};

function updateStateWithPayload(name: string) {
  return (state: ICertificateState, { payload }: CertificateAction) => {
    state[name] = payload;
  };
}

export const certificateReducer = createReducer(initialState, (builder) => {
  builder.addCase(
    fetchCertificatesRequest,
    updateStateWithPayload('isFetchingCertificates')
  );
  builder.addCase(
    fetchCertificatesResponse,
    updateStateWithPayload('certificates')
  );
});

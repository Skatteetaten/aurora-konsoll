import { IAuroraApiComponentProps } from 'components/AuroraApi';
import { ICertificateResult } from 'models/certificates';
import { ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { createAction } from 'redux-ts-utils';
import { RootAction, RootState } from 'store/types';

const certificateAction = (action: string) => `certificate/${action}`;

export const fetchCertificatesRequest = createAction<boolean>(
  certificateAction('FETCHED_CERTIFICATIONS_REQUEST')
);

export const fetchCertificatesResponse = createAction<ICertificateResult>(
  certificateAction('FETCHED_CERTIFICATIONS_RESPONSE')
);

export type Thunk = ActionCreator<
  ThunkAction<void, RootState, IAuroraApiComponentProps, RootAction>
>;

export const fetchCertificates: Thunk = () => async (
  dispatch,
  getState,
  { clients }
) => {
  dispatch(fetchCertificatesRequest(true));
  const result = await clients.certificateClient.getCertificates();
  dispatch(fetchCertificatesRequest(false));
  dispatch(fetchCertificatesResponse(result));
};

export default {
  fetchCertificatesRequest,
  fetchCertificatesResponse
};

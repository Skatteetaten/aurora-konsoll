import { IAuroraApiComponentProps } from 'components/AuroraApi';
import { ICertificateResult } from 'models/certificates';
import { addErrors } from 'models/StateManager/state/actions';
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

  if (result && result.errors) {
    dispatch(addErrors(result.errors, result.name));
  }

  if (result && result.data && result.data.certificates.edges.length > 0) {
    const certificates = {
      certificates: result.data.certificates.edges.map(edge => edge.node),
      totalCount: result.data.certificates.totalCount
    };
    dispatch(fetchCertificatesResponse(certificates));
  } else {
    dispatch(
      fetchCertificatesResponse({
        certificates: [],
        totalCount: 0
      })
    );
  }
};

export default {
  fetchCertificatesRequest,
  fetchCertificatesResponse
};

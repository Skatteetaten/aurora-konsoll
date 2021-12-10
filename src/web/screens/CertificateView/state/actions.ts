import { ICertificateResult } from 'web/models/certificates';
import { addCurrentErrors } from 'web/screens/ErrorHandler/state/actions';
import { createAction } from '@reduxjs/toolkit';
import { Thunk } from 'web/store/types';

const certificateAction = (action: string) => `certificate/${action}`;

export const fetchCertificatesRequest = createAction<boolean>(
  certificateAction('FETCHED_CERTIFICATIONS_REQUEST')
);

export const fetchCertificatesResponse = createAction<ICertificateResult>(
  certificateAction('FETCHED_CERTIFICATIONS_RESPONSE')
);

export const fetchCertificates: Thunk =
  () =>
  async (dispatch, getState, { clients }) => {
    dispatch(fetchCertificatesRequest(true));
    const result = await clients.certificateClient.getCertificates();
    dispatch(fetchCertificatesRequest(false));
    dispatch(addCurrentErrors(result));

    if (result && result.data && result.data.certificates.edges.length > 0) {
      const certificates = {
        certificates: result.data.certificates.edges.map((edge) => edge.node),
        totalCount: result.data.certificates.totalCount,
      };
      dispatch(fetchCertificatesResponse(certificates));
    } else {
      dispatch(
        fetchCertificatesResponse({
          certificates: [],
          totalCount: 0,
        })
      );
    }
  };

const actions = {
  fetchCertificatesRequest,
  fetchCertificatesResponse,
};

export default actions;

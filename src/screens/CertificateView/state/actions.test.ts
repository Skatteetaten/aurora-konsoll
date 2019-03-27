import { certificateResultFactory } from 'testData/testDataBuilders';
import { fetchCertificatesRequest, fetchCertificatesResponse } from './actions';

describe('certificate actions', () => {
  it('should return type of action fetchCertificatesRequest and payload', () => {
    expect(fetchCertificatesRequest(true)).toEqual({
      payload: true,
      type: 'certificate/FETCHED_CERTIFICATIONS_REQUEST'
    });
  });
  it('should return type of action fetchCertificatesResponse and payload', () => {
    expect(fetchCertificatesResponse(certificateResultFactory.build())).toEqual(
      {
        payload: certificateResultFactory.build(),
        type: 'certificate/FETCHED_CERTIFICATIONS_RESPONSE'
      }
    );
  });
});

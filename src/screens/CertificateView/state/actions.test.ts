import { certificateResultFactory } from 'testData/testDataBuilders';
import { fetchCertificatesRequest, fetchCertificatesResponse } from './actions';

describe('certificate actions', () => {
  it('should return type of action fetchCertificatesRequest and payload as true', () => {
    expect(fetchCertificatesRequest(true)).toEqual({
      payload: true,
      type: 'certificate/FETCHED_CERTIFICATIONS_REQUEST',
    });
  });
  it('should return type of action fetchCertificatesResponse and payload as given object', () => {
    expect(fetchCertificatesResponse(certificateResultFactory.build())).toEqual(
      {
        payload: certificateResultFactory.build(),
        type: 'certificate/FETCHED_CERTIFICATIONS_RESPONSE',
      }
    );
  });
  it('should return type of action fetchCertificatesResponse and payload as empty list', () => {
    expect(
      fetchCertificatesResponse(
        certificateResultFactory.build({ certificates: [], totalCount: 0 })
      )
    ).toEqual({
      payload: certificateResultFactory.build({
        certificates: [],
        totalCount: 0,
      }),
      type: 'certificate/FETCHED_CERTIFICATIONS_RESPONSE',
    });
  });
});

import {
  certificateResultFactory,
  certificateViewFactory,
} from 'testData/testDataBuilders';
import CertificateService from './CertificateService';

describe('CertificateService', () => {
  const certificateService = new CertificateService();

  it('should return list on certificate view form', () => {
    const updatedItems = certificateService.updatedItems(
      certificateResultFactory.build()
    );
    expect(updatedItems).toEqual(certificateViewFactory.buildList(1));
  });
});

import {
  certificateResultFactory,
  certificateViewFactory
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

  it('should only return filtered list element that contains test', () => {
    const updatedItems = certificateService.filteredItems('test', [
      certificateViewFactory.build(),
      certificateViewFactory.build({ dn: 'hallo' })
    ]);
    expect(updatedItems).toEqual(certificateViewFactory.buildList(1));
  });

  it('should return empty list when filter text does not apply to any item', () => {
    const updatedItems = certificateService.filteredItems('finnes ikke', [
      certificateViewFactory.build(),
      certificateViewFactory.build({ dn: 'hallo' })
    ]);
    expect(updatedItems).toEqual([]);
  });
});

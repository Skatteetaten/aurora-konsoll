import {
  certificateResultFactory,
  certificateViewFactory
} from 'testData/testDataBuilders';
import CertificateService, { certificateColumns } from './CertificateService';
import { SortDirection } from './DatabaseSchemaService';

describe('CertificateService', () => {
  const certificateService = new CertificateService();

  describe('Create columns', () => {
    it('Creates default columns given index -1', () => {
      const cols = certificateService.createColumns(-1, SortDirection.ASC);
      expect(cols).toEqual(certificateColumns());
    });

    it('Creates columns with icon name ascending updated at index', () => {
      const cols = certificateService.createColumns(0, SortDirection.ASC);
      expect(cols[0].iconName).toEqual('Up');
    });

    it('Creates columns with icon name descending updated at index', () => {
      const cols = certificateService.createColumns(0, SortDirection.DESC);
      expect(cols[0].iconName).toEqual('Down');
    });
  });

  it('should return list on certificate view form', () => {
    const updatedItems = certificateService.updatedItems(
      certificateResultFactory.build()
    );
    expect(updatedItems).toEqual(certificateViewFactory.buildList(1));
  });

  it('should only return filtered list element that contains test', () => {
    const updatedItems = certificateService.filteredItems('test', [
      certificateViewFactory.build(),
      certificateViewFactory.build({ cn: 'hallo' })
    ]);
    expect(updatedItems).toEqual(certificateViewFactory.buildList(1));
  });

  it('should return empty list when filter text does not apply to any item', () => {
    const updatedItems = certificateService.filteredItems('finnes ikke', [
      certificateViewFactory.build(),
      certificateViewFactory.build({ cn: 'hallo' })
    ]);
    expect(updatedItems).toEqual([]);
  });

  describe('sort items', () => {
    it('sort id column ascending', () => {
      const viewItem1 = certificateViewFactory.build({ id: 2 });
      const viewItem2 = certificateViewFactory.build({ id: 3 });
      const viewItem3 = certificateViewFactory.build({ id: 1 });
      const sortItems = certificateService.sortItems(
        [viewItem1, viewItem3, viewItem2],
        SortDirection.ASC,
        'id'
      );
      expect(sortItems[0].id).toEqual(1);
      expect(sortItems[1].id).toEqual(2);
      expect(sortItems[2].id).toEqual(3);
    });
    it('sort cn column descending', () => {
      const viewItem1 = certificateViewFactory.build({
        cn: 'a'
      });
      const viewItem2 = certificateViewFactory.build({
        cn: 'b'
      });
      const viewItem3 = certificateViewFactory.build({
        cn: 'c'
      });
      const sortItems = certificateService.sortItems(
        [viewItem1, viewItem3, viewItem2],
        SortDirection.DESC,
        'cn'
      );
      expect(sortItems[0].cn).toEqual('c');
      expect(sortItems[1].cn).toEqual('b');
      expect(sortItems[2].cn).toEqual('a');
    });
  });
});

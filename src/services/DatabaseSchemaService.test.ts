import { databaseSchemaViewFactory } from 'testData/testDataBuilders';
import DatabaseSchemaService, {
  defaultColumns,
  filterDatabaseSchemaView,
  SortDirection
} from './DatabaseSchemaService';

describe('DatabaseSchemaService', () => {
  const databaseSchemaService = new DatabaseSchemaService();

  describe('Create columns', () => {
    it('Creates default columns given index -1', () => {
      const cols = databaseSchemaService.createColumns(-1, SortDirection.ASC);
      expect(cols).toEqual(defaultColumns());
    });

    it('Creates columns with icon name ascending updated at index', () => {
      const cols = databaseSchemaService.createColumns(0, SortDirection.ASC);
      expect(cols[0].iconName).toEqual('Up');
    });

    it('Creates columns with icon name descending updated at index', () => {
      const cols = databaseSchemaService.createColumns(0, SortDirection.DESC);
      expect(cols[0].iconName).toEqual('Down');
    });
  });
  describe('sort items', () => {
    it('sort createdBy column descending', () => {
      const viewItem1 = databaseSchemaViewFactory.build({ createdBy: 'a' });
      const viewItem2 = databaseSchemaViewFactory.build({ createdBy: 'b' });
      const sortItems = databaseSchemaService.sortItems(
        [viewItem1, viewItem2],
        SortDirection.DESC,
        'createdBy'
      );
      expect(sortItems[0].createdBy).toEqual('b');
      expect(sortItems[1].createdBy).toEqual('a');
    });

    it('sort createdDate column ascending', () => {
      const viewItem1 = databaseSchemaViewFactory.build({
        createdDate: '23.01.2019'
      });
      const viewItem2 = databaseSchemaViewFactory.build({
        createdDate: '01.12.2018'
      });
      const sortItems = databaseSchemaService.sortItems(
        [viewItem1, viewItem2],
        SortDirection.ASC,
        'createdDate'
      );
      expect(sortItems[0].createdDate).toEqual('01.12.2018');
      expect(sortItems[1].createdDate).toEqual('23.01.2019');
    });

    it('sort sizeInMb column descending', () => {
      const viewItem1 = databaseSchemaViewFactory.build({
        sizeInMb: 0
      });
      const viewItem2 = databaseSchemaViewFactory.build({
        sizeInMb: 1
      });
      const sortItems = databaseSchemaService.sortItems(
        [viewItem1, viewItem2],
        SortDirection.DESC,
        'sizeInMb'
      );
      expect(sortItems[0].sizeInMb).toEqual(1);
      expect(sortItems[1].sizeInMb).toEqual(0);
    });

    it('do not sort lastUsedDate column given null values', () => {
      const viewItem1 = databaseSchemaViewFactory.build({
        lastUsedDate: null,
        createdBy: '56789'
      });
      const viewItem2 = databaseSchemaViewFactory.build({
        lastUsedDate: null,
        createdBy: '12345'
      });
      const sortItems = databaseSchemaService.sortItems(
        [viewItem1, viewItem2],
        SortDirection.ASC,
        'lastUsedDate'
      );
      expect(sortItems[0].createdBy).toEqual('56789');
      expect(sortItems[1].createdBy).toEqual('12345');
    });

    it('sort createdBy column ignoring case', () => {
      const viewItem1 = databaseSchemaViewFactory.build({
        createdBy: 'ABC'
      });
      const viewItem2 = databaseSchemaViewFactory.build({
        createdBy: 'bcd'
      });
      const sortItems = databaseSchemaService.sortItems(
        [viewItem1, viewItem2],
        SortDirection.DESC,
        'createdBy'
      );
      expect(sortItems[0].createdBy).toEqual('bcd');
      expect(sortItems[1].createdBy).toEqual('ABC');
    });
  });

  describe('Filter database schema view', () => {
    it('filter database schema for column values', () => {
      const viewItem1 = databaseSchemaViewFactory.build({
        createdBy: 'my-super-duper-user'
      });
      const viewItem2 = databaseSchemaViewFactory.build({
        createdBy: '123'
      });

      const createdFilter = filterDatabaseSchemaView('duper');
      const filteredItems = [viewItem1, viewItem2].filter(createdFilter);

      expect(filteredItems.length).toEqual(1);
      expect(filteredItems[0].createdBy).toEqual('my-super-duper-user');
    });
  });
});
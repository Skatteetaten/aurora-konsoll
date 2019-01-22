import DatabaseSchemaService, { defaultColumns, SortDirection } from "./DatabaseSchemaService";

describe('DatabaseSchemaService', () => {
  const databaseSchemaService = new DatabaseSchemaService();

  describe('Create columns', () => {
    it('Creates default columns given index -1', () => {
      const cols = databaseSchemaService.createColumns(-1, SortDirection.ASC);
      expect(cols).toEqual(defaultColumns);
    });
  
    it('Creates columns with icon name ascending updated at index', () => {
      const cols = databaseSchemaService.createColumns(0, SortDirection.ASC);
      expect(cols[0].iconName).toEqual('Up')
    });
  
    it('Creates columns with icon name descending updated at index', () => {
      const cols = databaseSchemaService.createColumns(0, SortDirection.DESC);
      expect(cols[0].iconName).toEqual('Down')
    });
  });

  describe('Sort next ascending', () => {
    it('Sort next ascending given SortDirection.DESC', () => {
      const sortNextAscending = databaseSchemaService.sortNextAscending(SortDirection.DESC);
      expect(sortNextAscending).toBeTruthy();
    });
  
    it('Do not sort next ascending given SortDirection.ASC', () => {
      const sortNextAscending = databaseSchemaService.sortNextAscending(SortDirection.ASC);
      expect(sortNextAscending).toBeFalsy();
    });
  });

  describe('Lower case if string', () => {
    it('Lower case value given string input', () => {
      const value = databaseSchemaService.lowerCaseIfString('TESTing');
      expect(value).toEqual('testing');
    })
  
    it('Return same value if input is not string', () => {
      const value = databaseSchemaService.lowerCaseIfString(123);
      expect(value).toEqual(123);
    });
  });

  describe('Is date', () => {
    it('Return true given valid date string', () => {
      const isDate = databaseSchemaService.isDate('22.1.2019');
      expect(isDate).toBeTruthy();
    });

    it('Return false given invalid date string', () => {
      const isDate = databaseSchemaService.isDate('abc');
      expect(isDate).toBeFalsy();
    });
  });
});
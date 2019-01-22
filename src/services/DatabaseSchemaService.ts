export enum SortDirection {
  ASC,
  DESC,
  NONE
}

export const defaultColumns = [
  {
    fieldName: 'type',
    isResizable: true,
    key: 0,
    maxWidth: 100,
    minWidth: 100,
    name: 'Type',
    iconName: ''
  },
  {
    fieldName: 'appDbName',
    isResizable: true,
    key: 1,
    maxWidth: 150,
    minWidth: 150,
    name: 'ApplikasjonsDB',
    iconName: ''
  },
  {
    fieldName: 'createdDate',
    isResizable: true,
    key: 2,
    maxWidth: 100,
    minWidth: 100,
    name: 'Opprettet',
    iconName: ''
  },
  {
    fieldName: 'lastUsedDate',
    isResizable: true,
    key: 3,
    maxWidth: 100,
    minWidth: 100,
    name: 'Sist brukt',
    iconName: ''
  },
  {
    fieldName: 'sizeInMb',
    isResizable: true,
    key: 4,
    maxWidth: 125,
    minWidth: 125,
    name: 'Størrelse (MB)',
    iconName: ''
  },
  {
    fieldName: 'createdBy',
    isResizable: true,
    key: 5,
    maxWidth: 100,
    minWidth: 100,
    name: 'Bruker',
    iconName: ''
  }
];

export const defaultSortDirections = new Array<SortDirection>(6).fill(
  SortDirection.NONE
);

export default class DatabaseSchemaService {

  public sortNextAscending(sortDirection: SortDirection) {
    return sortDirection === SortDirection.NONE ||
    sortDirection === SortDirection.DESC
  }

  public createColumns(index: number, sortDirection: SortDirection) {
    if (index > -1) {
      const currentCol = defaultColumns[index];
      if (
        sortDirection === SortDirection.NONE ||
        sortDirection === SortDirection.DESC
      ) {
        currentCol.iconName = 'Down';
      } else if (sortDirection === SortDirection.ASC) {
        currentCol.iconName = 'Up';
      }
    }
    return defaultColumns;
  };

  public lowerCaseIfString(value: any) {
      return typeof value === 'string' ? (value as string).toLowerCase() : value;
  }

  public isDate(value: any) {
    const dateValidator = /^\d{1,2}[.]\d{1,2}[.]\d{4}$/;
    return (typeof value === 'string' && (value as string).match(dateValidator));
  }

}
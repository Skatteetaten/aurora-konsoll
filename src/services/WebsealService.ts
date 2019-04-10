import { SortDirection } from './DatabaseSchemaService';

export const websealTableColumns = () => [
  {
    key: 0,
    name: 'Host',
    fieldName: 'host',
    minWidth: 500,
    maxWidth: 600,
    iconName: ''
  },
  {
    key: 1,
    name: 'Roller',
    fieldName: 'roles',
    minWidth: 800,
    maxWidth: 1000,
    iconName: ''
  }
];

export const websealDialogColumns = (
  onRender: (item: { key: string }) => JSX.Element
) => [
  {
    key: 0,
    fieldName: 'key',
    minWidth: 400,
    maxWidth: 400,
    onRender
  },
  {
    key: 1,
    fieldName: 'value',
    minWidth: 200,
    maxWidth: 200
  }
];

export interface IWebsealTableColumns {
  roles: string;
  host: string;
}

export const defaultSortDirections = new Array<SortDirection>(2).fill(
  SortDirection.NONE
);

export const filterWebsealView = (filter: string) => {
  return (v: IWebsealTableColumns): boolean =>
    v.host.includes(filter) || v.roles.includes(filter);
};

class WebsealService {
  public sortNextAscending(sortDirection: SortDirection) {
    return (
      sortDirection === SortDirection.NONE ||
      sortDirection === SortDirection.DESC
    );
  }

  public sortItems(
    viewItems: IWebsealTableColumns[],
    prevSortDirection: SortDirection,
    name: string | number | symbol
  ) {
    return viewItems.slice(0).sort((a: any, b: any) => {
      const valueA = this.lowerCaseIfString(a[name]);
      const valueB = this.lowerCaseIfString(b[name]);
      if (valueA === valueB) {
        return 0;
      } else if (this.isDate(valueA) || this.isDate(valueB)) {
        const dateA = this.createDate(valueA).getTime();
        const dateB = this.createDate(valueB).getTime();
        return this.sortNextAscending(prevSortDirection)
          ? dateB - dateA
          : dateA - dateB;
      } else {
        return (this.sortNextAscending(prevSortDirection)
        ? valueA < valueB
        : valueA > valueB)
          ? 1
          : -1;
      }
    });
  }

  public addProperties = (type: string): any[] => {
    const parsedType = JSON.parse(type);
    const ownProps = Object.keys(parsedType);
    let i = ownProps.length;
    const resArray = new Array(i);
    while (i--) {
      resArray[i] = {
        key: ownProps[i],
        value: parsedType[ownProps[i]]
      };
    }
    return resArray;
  };

  public createColumns(index: number, sortDirection: SortDirection) {
    const columns = websealTableColumns();
    if (index > -1) {
      const currentCol = columns[index];
      if (
        sortDirection === SortDirection.NONE ||
        sortDirection === SortDirection.DESC
      ) {
        currentCol.iconName = 'Down';
      } else if (sortDirection === SortDirection.ASC) {
        currentCol.iconName = 'Up';
      }
    }
    return columns;
  }

  private lowerCaseIfString(value: any) {
    return typeof value === 'string' ? (value as string).toLowerCase() : value;
  }

  private isDate(value: any) {
    const dateValidator = /^\d{2}[.]\d{2}[.]\d{4}$/;
    return typeof value === 'string' && (value as string).match(dateValidator);
  }

  private createDate(value: string | null) {
    if (value === null) {
      return new Date(0);
    } else {
      const values = value.split('.');
      return new Date(
        Number(values[2]),
        Number(values[1]) - 1,
        Number(values[0])
      );
    }
  }
}

export default WebsealService;

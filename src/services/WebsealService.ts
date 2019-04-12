import { IDetailsListContent } from 'models/DetailsList';
import { SortDirection } from 'models/SortDirection';
import { createDate, dateValidation } from 'utils/date';

export const websealTableColumns = (): IDetailsListContent[] => [
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
): IDetailsListContent[] => [
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
  public sortNextAscending(sortDirection: SortDirection): boolean {
    return (
      sortDirection === SortDirection.NONE ||
      sortDirection === SortDirection.DESC
    );
  }

  public sortItems(
    viewItems: IWebsealTableColumns[],
    prevSortDirection: SortDirection,
    name: string | number | symbol
  ): IWebsealTableColumns[] {
    return viewItems.slice(0).sort((a: any, b: any) => {
      const valueA = this.lowerCaseIfString(a[name]);
      const valueB = this.lowerCaseIfString(b[name]);
      if (valueA === valueB) {
        return 0;
      } else if (dateValidation(valueA) || dateValidation(valueB)) {
        const dateA = createDate(valueA).getTime();
        const dateB = createDate(valueB).getTime();
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

  public createColumns(
    index: number,
    sortDirection: SortDirection
  ): IDetailsListContent[] {
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

  private lowerCaseIfString(value: any): any {
    return typeof value === 'string' ? (value as string).toLowerCase() : value;
  }
}

export default WebsealService;

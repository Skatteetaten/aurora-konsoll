import {
  ICertificateResult,
  ICertificateView,
  IDetailsListContent
} from 'models/certificates';
import { createDate, getLocalDate, isDate } from 'utils/date';
import { SortDirection } from './DatabaseSchemaService';

export const certificateColumns = (): IDetailsListContent[] => [
  {
    fieldName: 'id',
    isResizable: true,
    key: 0,
    maxWidth: 150,
    minWidth: 100,
    name: 'ID',
    iconName: ''
  },
  {
    fieldName: 'dn',
    isResizable: true,
    key: 1,
    maxWidth: 500,
    minWidth: 400,
    name: 'DN',
    iconName: ''
  },
  {
    fieldName: 'revokedDate',
    isResizable: true,
    key: 2,
    maxWidth: 300,
    minWidth: 150,
    name: 'Revoked',
    iconName: ''
  },
  {
    fieldName: 'issuedDate',
    isResizable: true,
    key: 3,
    maxWidth: 300,
    minWidth: 150,
    name: 'Opprettet',
    iconName: ''
  },
  {
    fieldName: 'expiresDate',
    isResizable: true,
    key: 4,
    maxWidth: 300,
    minWidth: 150,
    name: 'Utløper',
    iconName: ''
  }
];

export const filterCertificateView = (filter: string) => {
  return (v: ICertificateView): boolean =>
    v.dn.includes(filter) ||
    v.id.toString().includes(filter) ||
    v.issuedDate.includes(filter) ||
    (!v.revokedDate || v.revokedDate === null
      ? false
      : v.revokedDate.includes(filter)) ||
    (!v.expiresDate || v.expiresDate === null
      ? false
      : v.expiresDate.includes(filter));
};

export const defaultSortDirections: SortDirection[] = new Array<SortDirection>(
  certificateColumns().length
).fill(SortDirection.NONE);

export default class CertificateService {
  public sortNextAscending(sortDirection: SortDirection): boolean {
    return (
      sortDirection === SortDirection.NONE ||
      sortDirection === SortDirection.DESC
    );
  }

  public createColumns(
    index: number,
    sortDirection: SortDirection
  ): IDetailsListContent[] {
    const columns = certificateColumns();
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

  public sortItems(
    viewItems: ICertificateView[],
    prevSortDirection: SortDirection,
    name: string | number | symbol
  ): ICertificateView[] {
    return viewItems.slice(0).sort((a: any, b: any) => {
      const valueA = this.lowerCaseIfString(a[name]);
      const valueB = this.lowerCaseIfString(b[name]);
      if (valueA === valueB) {
        return 0;
      } else if (isDate(valueA) || isDate(valueB)) {
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

  public updatedItems = (data: ICertificateResult): ICertificateView[] =>
    data.certificates.map(
      (it): ICertificateView => {
        return {
          id: it.id,
          dn: it.dn,
          issuedDate: getLocalDate(it.issuedDate),
          revokedDate: !!it.revokedDate ? getLocalDate(it.revokedDate) : '-',
          expiresDate: !!it.expiresDate ? getLocalDate(it.expiresDate) : '-'
        };
      }
    );

  public filteredItems = (
    filter: string,
    viewItems: ICertificateView[]
  ): ICertificateView[] => {
    return viewItems.filter(filterCertificateView(filter));
  };

  private lowerCaseIfString(value: any): any {
    return typeof value === 'string' ? (value as string).toLowerCase() : value;
  }
}

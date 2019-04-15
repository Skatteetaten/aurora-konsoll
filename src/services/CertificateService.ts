import { ICertificateResult, ICertificateView } from 'models/certificates';
import { IDetailsListContent } from 'models/DetailsList';
import { SortDirection } from 'models/SortDirection';
import { getLocalDate } from 'utils/date';

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
}

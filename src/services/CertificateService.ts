import { ICertificateResult, ICertificateView } from 'models/certificates';
import { getLocalDate } from 'utils/date';
import { IColumn } from '@fluentui/react';

const certificateColumns: IColumn[] = [
  {
    fieldName: 'id',
    isResizable: true,
    key: '0',
    minWidth: 75,
    name: 'ID',
    iconName: '',
  },
  {
    fieldName: 'dn',
    isResizable: true,
    key: '1',
    minWidth: 650,
    name: 'DN',
    iconName: '',
  },
  {
    fieldName: 'revokedDate',
    isResizable: true,
    key: '2',
    maxWidth: 300,
    minWidth: 150,
    name: 'Revoked',
    iconName: '',
  },
  {
    fieldName: 'issuedDate',
    isResizable: true,
    key: '3',
    maxWidth: 300,
    minWidth: 150,
    name: 'Opprettet',
    iconName: '',
  },
  {
    fieldName: 'expiresDate',
    isResizable: true,
    key: '4',
    maxWidth: 300,
    minWidth: 150,
    name: 'Utløper',
    iconName: '',
  },
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

export default class CertificateService {
  public static DEFAULT_COLUMNS = certificateColumns;

  public updatedItems = (data: ICertificateResult): ICertificateView[] =>
    data.certificates.map((it): ICertificateView => {
      return {
        id: Number(it.id),
        dn: it.dn,
        issuedDate: getLocalDate(it.issuedDate),
        revokedDate: !!it.revokedDate ? getLocalDate(it.revokedDate) : '-',
        expiresDate: !!it.expiresDate ? getLocalDate(it.expiresDate) : '-',
      };
    });
}

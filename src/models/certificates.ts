import { ICertificate } from 'services/auroraApiClients/certificateClient/query';

export interface IDetailsListContent {
  fieldName: string;
  isResizable: boolean;
  key: number;
  maxWidth: number;
  minWidth: number;
  name: string;
  iconName: string;
}

export interface ICertificateView {
  id: number;
  cn: string;
  issuedDate: string;
  revokedDate: null | string | number;
  expiresDate: null | string | number;
}

export interface ICertificateResponse {
  items: ICertificateResponseContent[];
}

export interface ICertificateResponseContent {
  id: number;
  cn: string;
  issuedDate: number;
  revokedDate: null | string;
  downloadLink: null;
  mounted: null;
}

export interface ICertificateResult {
  certificates: ICertificate[];
  totalCount: number;
}

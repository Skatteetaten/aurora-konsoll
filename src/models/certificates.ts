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
  revokedDate: null | string;
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

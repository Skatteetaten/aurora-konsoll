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

export interface ICertificateResult {
  certificates: ICertificate[];
  totalCount: number;
}

export interface ICertificatesQuery {
  certificates: {
    totalCount: number;
    edges: Array<{
      cursor: string;
      node: ICertificate;
    }>;
  };
}

export interface ICertificate {
  id: number;
  cn: string;
  issuedDate: number | null;
  revokedDate: number | null;
  expiresDate: number | null;
}

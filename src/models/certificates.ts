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
  dn: string;
  issuedDate: string;
  revokedDate: string;
  expiresDate: string;
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
  dn: string;
  issuedDate: Date;
  revokedDate: Date | null;
  expiresDate: Date | null;
}

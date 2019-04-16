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
  id: string;
  dn: string;
  issuedDate: Date;
  revokedDate: Date | null;
  expiresDate: Date | null;
}

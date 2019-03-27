import gql from 'graphql-tag';

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
  issuedDate: number;
  revokedDate: number | null;
  expiresDate: number | null;
}

export const CERTIFICATES_QUERY = gql`
  query getCertificates {
    certificates {
      totalCount
      edges {
        cursor
        node {
          id
          cn
          issuedDate
          revokedDate
          expiresDate
        }
      }
    }
  }
`;

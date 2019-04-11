import gql from 'graphql-tag';

export const CERTIFICATES_QUERY = gql`
  query getCertificates {
    certificates {
      totalCount
      edges {
        cursor
        node {
          id
          dn
          issuedDate
          revokedDate
          expiresDate
        }
      }
    }
  }
`;

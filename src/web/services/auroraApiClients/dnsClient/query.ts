import gql from 'graphql-tag';

export interface CnameQuery {
  affiliations: {
    edges: {
      node: {
        cname: {
          azure: Azure[];
          onPrem: OnPrem[];
        };
      };
    }[];
  };
}

export interface Azure {
  canonicalName: string;
  clusterId: string;
  namespace: string;
  ownerObjectName: string;
  ttlInSeconds: number;
}

export interface OnPrem {
  status: string;
  clusterId: string;
  appName: string;
  namespace: string;
  routeName: string;
  message: string;
  entry: {
    cname: string;
    host: string;
    ttl: number;
  };
}

export const CNAME_QUERY = gql`
  query getCnames($affiliation: String!) {
    affiliations(names: [$affiliation]) {
      edges {
        node {
          name
          cname {
            azure {
              canonicalName
              clusterId
              ttlInSeconds
              namespace
              ownerObjectName
            }
            onPrem {
              appName
              clusterId
              message
              namespace
              routeName
              status
              entry {
                cname
                host
                ttl
              }
            }
          }
        }
      }
    }
  }
`;

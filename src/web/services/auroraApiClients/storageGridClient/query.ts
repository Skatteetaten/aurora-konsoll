import gql from 'graphql-tag';

interface StorageGridObjectAreaStatus {
  message: string;
  reason: string;
  success: boolean;
}

export interface StorageGridObjectArea {
  bucketName: string;
  creationTimestamp: string;
  name: string;
  namespace: string;
  status: StorageGridObjectAreaStatus;
  tenantName: string;
}

export interface ObjectAreas {
  objectAreas: {
    active: StorageGridObjectArea[];
  };
}

export interface Tenant {
  tenant: {
    isRegistered: boolean;
  };
}

export interface StorageGridQuery<T extends Tenant | ObjectAreas> {
  affiliations: {
    edges: {
      node: {
        storagegrid: T;
      };
    }[];
  };
}

export const STORAGEGRID_TENANT_QUERY = gql`
  query getTenant($affiliation: String!) {
    affiliations(names: [$affiliation]) {
      edges {
        node {
          storagegrid {
            tenant {
              isRegistered
            }
          }
        }
      }
    }
  }
`;

export const STORAGEGRID_AREAS_QUERY = gql`
  query getAreas($affiliation: String!) {
    affiliations(names: [$affiliation]) {
      edges {
        node {
          storagegrid {
            objectAreas {
              active {
                name
                namespace
                bucketName
                creationTimestamp
                status {
                  message
                  reason
                  success
                }
              }
            }
          }
        }
      }
    }
  }
`;

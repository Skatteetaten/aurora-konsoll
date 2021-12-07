import gql from 'graphql-tag';

export interface IScanQuery {
  scan?: {
    status: string;
    open?: IScanStatusQuery;
    failed?: IScanStatusQuery;
  };
}

export interface IScanStatusQuery {
  totalCount: number;
  edges: IScanStatusEdge[];
}

export interface IScanStatusEdge {
  node: {
    status: string;
    message?: string;
    resolvedIp?: string;
    clusterNode?: {
      ip?: number;
    };
  };
}

export const NETDEBUG_QUERY = gql`
  query getNetdebugStatus($host: String!, $port: Int) {
    scan(host: $host, port: $port) {
      status
      open {
        totalCount
        edges {
          node {
            status
            message
            resolvedIp
            clusterNode {
              ip
            }
          }
        }
      }

      failed {
        totalCount
        edges {
          node {
            status
            message
            resolvedIp
            clusterNode {
              ip
            }
          }
        }
      }
    }
  }
`;

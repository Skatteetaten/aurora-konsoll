import gql from 'graphql-tag';

export interface CnameInfosQuery {
  cnameInfo?: CnameInfo[];
}

export interface CnameInfo {
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

export const CNAME_INFO_QUERY = gql`
  query getCnameInfo($affiliation: String!) {
    cnameInfo(affiliations: [$affiliation]) {
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
`;

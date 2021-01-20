import gql from 'graphql-tag';
import {
  IDatabaseSchema,
  IDatabaseInstance,
  IDatabaseSchemaData,
} from 'models/schemas';

export interface IPageInfo {
  endCursor: string;
  hasNextPage: boolean;
}

export interface IDatabaseSchemasQuery {
  databaseSchemas: {
    totalCount: number;
    edges: Array<{
      cursor: string;
      node: IDatabaseSchema;
    }>;
    pageInfo: IPageInfo;
  };
}

export interface IDatabaseInstancesQuery {
  databaseInstances?: IDatabaseInstance[];
}

export interface IRestorableDatabaseSchemasQuery {
  restorableDatabaseSchemas?: IDatabaseSchemaData[];
}

export const DATABASE_SCHEMAS_QUERY = gql`
  query getDatabaseSchemas(
    $affiliations: [String!]!
    $pageSize: Int!
    $after: String
  ) {
    databaseSchemas(
      affiliations: $affiliations
      first: $pageSize
      after: $after
    ) {
      totalCount
      edges {
        cursor
        node {
          jdbcUrl
          id
          type
          affiliation {
            name
          }
          name
          application
          environment
          discriminator
          description
          engine
          applicationDeployments {
            id
            name
            affiliation {
              name
            }
            namespace {
              name
            }
          }
          createdBy
          createdDate
          lastUsedDate
          sizeInMb
          users {
            username
            password
            type
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

export const DATABASE_INSTANCES_QUERY = gql`
  query getDatabaseInstances($affiliation: String!) {
    databaseInstances(affiliation: $affiliation) {
      engine
      instanceName
      host
      port
      createSchemaAllowed
      affiliation {
        name
      }
      labels {
        key
        value
      }
    }
  }
`;

export const RESTORABLE_DATABASE_SCHEMAS_QUERY = gql`
  query getRestorableDatabaseSchemas($affiliations: [String!]!) {
    restorableDatabaseSchemas(affiliations: $affiliations) {
      databaseSchema {
        id
        type
        jdbcUrl
        affiliation {
          name
        }
        name
        application
        environment
        description
        discriminator
        engine
        applicationDeployments {
          id
          name
          affiliation {
            name
          }
          namespace {
            name
          }
        }
        createdBy
        createdDate
        lastUsedDate
        sizeInMb
        users {
          username
          type
        }
      }
      deleteAfter
      setToCooldownAt
    }
  }
`;

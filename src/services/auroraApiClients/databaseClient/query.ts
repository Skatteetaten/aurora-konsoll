import gql from 'graphql-tag';
import {
  IDatabaseSchema,
  IDatabaseInstance,
  IRestorableDatabaseSchema
} from 'models/schemas';

export interface IDatabaseSchemasQuery {
  databaseSchemas?: IDatabaseSchema[];
}

export interface IDatabaseInstancesQuery {
  databaseInstances?: IDatabaseInstance[];
}

export interface IRestorableDatabaseSchemasQuery {
  restorableDatabaseSchemas?: IRestorableDatabaseSchema[];
}

export const DATABASE_SCHEMAS_QUERY = gql`
  query getDatabaseSchemas($affiliations: [String!]!) {
    databaseSchemas(affiliations: $affiliations) {
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
        application
        description
        environment
        discriminator
        createdDate
        lastUsedDate
        sizeInMb
        createdBy
        engine
        name
      }
      deleteAfter
      setToCooldownAt
    }
  }
`;

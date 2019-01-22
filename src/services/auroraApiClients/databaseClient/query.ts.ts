import gql from 'graphql-tag';
import { IDatabaseSchema } from 'models/schemas';

export interface IDatabaseSchemasQuery {
  databaseSchemas: IDatabaseSchema[];
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
      appDbName
      databaseEngine
      applicationDeployment {
        id
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

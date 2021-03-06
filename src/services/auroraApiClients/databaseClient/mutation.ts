import gql from 'graphql-tag';

export const UPDATE_DATABASESCHEMA_MUTATION = gql`
  mutation updateDatabaseSchema($input: UpdateDatabaseSchemaInput!) {
    updateDatabaseSchema(input: $input) {
      id
    }
  }
`;

export const DELETE_DATABASESCHEMAS_MUTATION = gql`
  mutation deleteDatabaseSchemas($input: DeleteDatabaseSchemasInput!) {
    deleteDatabaseSchemas(input: $input) {
      succeeded
      failed
    }
  }
`;

export const RESTORE_DATABASESCHEMAS_MUTATION = gql`
  mutation restoreDatabaseSchemas($input: RestoreDatabaseSchemasInput!) {
    restoreDatabaseSchemas(input: $input) {
      succeeded
      failed
    }
  }
`;

export const TEST_JDBC_CONNECTION_FOR_ID_MUTATION = gql`
  mutation testJdbcConnectionForId($id: String!) {
    testJdbcConnectionForId(id: $id) {
      hasSucceeded
      message
    }
  }
`;

export const TEST_JDBC_CONNECTION_FOR_JDBCUSER_MUTATION = gql`
  mutation testJdbcConnectionForJdbcUser($input: JdbcUserInput!) {
    testJdbcConnectionForJdbcUser(input: $input) {
      hasSucceeded
      message
    }
  }
`;

export const CREATE_DATABASE_SCHEMA_MUTATION = gql`
  mutation createDatabaseSchema($input: CreateDatabaseSchemaInput!) {
    createDatabaseSchema(input: $input) {
      id
      jdbcUrl
      users {
        username
        password
      }
    }
  }
`;

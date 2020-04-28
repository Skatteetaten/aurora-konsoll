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

export const TEST_JDBC_CONNECTION_FOR_ID_MUTATION = gql`
  mutation testJdbcConnectionForId($id: String!) {
    testJdbcConnectionForId(id: $id)
  }
`;

export const TEST_JDBC_CONNECTION_FOR_ID_MUTATION_V2 = gql`
  mutation testJdbcConnectionForIdV2($id: String!) {
    testJdbcConnectionForIdV2(id: $id) {
      hasSucceeded
      message
    }
  }
`;

export const TEST_JDBC_CONNECTION_FOR_JDBCUSER_MUTATION = gql`
  mutation testJdbcConnectionForJdbcUser($input: JdbcUserInput!) {
    testJdbcConnectionForJdbcUser(input: $input)
  }
`;

export const TEST_JDBC_CONNECTION_FOR_JDBCUSER_MUTATION_V2 = gql`
  mutation testJdbcConnectionForJdbcUserV2($input: JdbcUserInput!) {
    testJdbcConnectionForJdbcUserV2(input: $input) {
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

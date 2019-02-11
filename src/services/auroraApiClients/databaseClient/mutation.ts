import gql from 'graphql-tag';

export const UPDATE_DATABASESCHEMA_MUTATION = gql`
  mutation updateDatabaseSchema($input: DatabaseSchemaInput!) {
    updateDatabaseSchema(input: $input)
  }
`;

export const DELETE_DATABASESCHEMA_MUTATION = gql`
  mutation deleteDatabaseSchema($input: DeleteDatabaseSchemaInput!) {
    deleteDatabaseSchema(input: $input)
  }
`;

export const TEST_JDBC_CONNECTION_FOR_ID_MUTATION = gql`
  mutation testJdbcConnectionForId($id: String!) {
    testJdbcConnectionForId(id: $id)
  }
`;

export const TEST_JDBC_CONNECTION_FOR_JDBCUSER_MUTATION = gql`
  mutation testJdbcConnectionForJdbcUser($input: JdbcUserInput!) {
    testJdbcConnectionForJdbcUser(input: $input)
  }
`;

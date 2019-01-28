import gql from 'graphql-tag';

export const UPDATE_DATABASESCHEMA_MUTATION = gql`
  mutation updateDatabaseSchema($input: DatabaseSchemaInput!) {
    updateDatabaseSchema(input: $input)
  }
`;

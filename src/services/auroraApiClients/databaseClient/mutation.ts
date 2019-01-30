import gql from 'graphql-tag';

export const UPDATE_DATABASESCHEMA_MUTATION = gql`
  mutation updateDatabaseSchema($input: DatabaseSchemaInput!) {
    updateDatabaseSchema(input: $input)
  }
`;

export const DELETE_DATABASESCHEMA_MUTATION = gql`
  mutation deleteDatabaseSchema($input: DeleteDatabaseSchemaInput!){
    deleteDatabaseSchema(input: $input)
  }
`;

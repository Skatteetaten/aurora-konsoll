import GoboClient from 'services/GoboClient';

import {
  ICreateDatabaseSchemaInput,
  ICreateDatabaseSchemaResponse,
  IDatabaseSchemas,
  IDeleteDatabaseSchemasResponse,
  IJdbcUser,
  IUpdateDatabaseSchemaInputWithCreatedBy
} from 'models/schemas';
import { errorStateManager } from 'models/StateManager/ErrorStateManager';
import {
  CREATE_DATABASE_SCHEMA_MUTATION,
  DELETE_DATABASESCHEMAS_MUTATION,
  TEST_JDBC_CONNECTION_FOR_ID_MUTATION,
  TEST_JDBC_CONNECTION_FOR_JDBCUSER_MUTATION,
  UPDATE_DATABASESCHEMA_MUTATION
} from './mutation';
import { DATABASE_SCHEMAS_QUERY, IDatabaseSchemasQuery } from './query.ts';

export class DatabaseClient {
  private client: GoboClient;

  constructor(client: GoboClient) {
    this.client = client;
  }

  public async getSchemas(affiliations: string[]): Promise<IDatabaseSchemas> {
    const result = await this.client.query<IDatabaseSchemasQuery>({
      query: DATABASE_SCHEMAS_QUERY,
      variables: {
        affiliations
      }
    });
    if (result && result.data) {
      return result.data;
    }
    errorStateManager.addError(new Error(`Kunne ikke finne database skjemaer`));
    return { databaseSchemas: [] };
  }

  public async updateSchema(
    databaseSchema: IUpdateDatabaseSchemaInputWithCreatedBy
  ) {
    const result = await this.client.mutate<{
      updateDatabaseSchema: { id: string };
    }>({
      mutation: UPDATE_DATABASESCHEMA_MUTATION,
      variables: {
        input: databaseSchema
      }
    });

    if (result && result.data && result.data.updateDatabaseSchema) {
      return true;
    }

    return false;
  }

  public async deleteSchemas(ids: string[]) {
    const result = await this.client.mutate<{
      deleteDatabaseSchemas: IDeleteDatabaseSchemasResponse;
    }>({
      mutation: DELETE_DATABASESCHEMAS_MUTATION,
      variables: {
        input: {
          ids
        }
      }
    });
    if (result && result.data) {
      return result.data.deleteDatabaseSchemas;
    }

    return {
      failed: [],
      succeeded: []
    } as IDeleteDatabaseSchemasResponse;
  }

  public async testJdbcConnectionForId(id: string) {
    const result = await this.client.mutate<{
      testJdbcConnectionForId: boolean;
    }>({
      mutation: TEST_JDBC_CONNECTION_FOR_ID_MUTATION,
      variables: {
        id
      }
    });

    if (result && result.data) {
      return result.data.testJdbcConnectionForId;
    }

    return false;
  }

  public async testJdbcConnectionForJdbcUser(jdbcUser: IJdbcUser) {
    const result = await this.client.mutate<{
      testJdbcConnectionForJdbcUser: boolean;
    }>({
      mutation: TEST_JDBC_CONNECTION_FOR_JDBCUSER_MUTATION,
      variables: {
        input: jdbcUser
      }
    });

    if (result && result.data) {
      return result.data.testJdbcConnectionForJdbcUser;
    }

    return false;
  }

  public async createDatabaseSchema(
    databaseSchema: ICreateDatabaseSchemaInput
  ) {
    const result = await this.client.mutate<{
      createDatabaseSchema: {
        id: string;
        jdbcUrl: string;
        users: [{ username: string; password: string }];
      };
    }>({
      mutation: CREATE_DATABASE_SCHEMA_MUTATION,
      variables: {
        input: databaseSchema
      }
    });

    if (result && result.data && result.data.createDatabaseSchema) {
      const graphqlResult = result.data.createDatabaseSchema;
      const response: ICreateDatabaseSchemaResponse = {
        id: graphqlResult.id,
        jdbcUser: {
          jdbcUrl: graphqlResult.jdbcUrl,
          password: graphqlResult.users[0].password,
          username: graphqlResult.users[0].username
        }
      };
      return response;
    }

    return {
      id: '',
      jdbcUser: { jdbcUrl: '', username: '', password: '' }
    };
  }
}

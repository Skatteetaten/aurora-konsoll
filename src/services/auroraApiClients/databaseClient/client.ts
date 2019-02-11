import GoboClient from 'services/GoboClient';

import {
  ICreateDatabaseSchemaInput,
  IDatabaseSchemas,
  IJdbcUser,
  IUpdateDatabaseSchemaInputWithCreatedBy
} from 'models/schemas';
import { errorStateManager } from 'models/StateManager/ErrorStateManager';
import {
  CREATE_DATABASE_SCHEMA_MUTATION,
  DELETE_DATABASESCHEMA_MUTATION,
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
      updateDatabaseSchema: boolean;
    }>({
      mutation: UPDATE_DATABASESCHEMA_MUTATION,
      variables: {
        input: databaseSchema
      }
    });

    if (result && result.data) {
      return result.data.updateDatabaseSchema;
    }

    return false;
  }

  public async deleteSchema(id: string) {
    const result = await this.client.mutate<{
      deleteDatabaseSchema: boolean;
    }>({
      mutation: DELETE_DATABASESCHEMA_MUTATION,
      variables: {
        input: {
          id
        }
      }
    });

    if (result && result.data) {
      return result.data.deleteDatabaseSchema;
    }

    return false;
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
      createDatabaseSchema: boolean;
    }>({
      mutation: CREATE_DATABASE_SCHEMA_MUTATION,
      variables: {
        input: databaseSchema
      }
    });

    if (result && result.data) {
      return result.data.createDatabaseSchema;
    }

    return false;
  }
}

import GoboClient, { IDataAndErrors } from 'services/GoboClient';

import {
  ICreateDatabaseSchemaInput,
  IDeleteDatabaseSchemasResponse,
  IJdbcUser,
  IUpdateDatabaseSchemaInputWithCreatedBy
} from 'models/schemas';
import {
  CREATE_DATABASE_SCHEMA_MUTATION,
  DELETE_DATABASESCHEMAS_MUTATION,
  TEST_JDBC_CONNECTION_FOR_ID_MUTATION,
  TEST_JDBC_CONNECTION_FOR_JDBCUSER_MUTATION,
  UPDATE_DATABASESCHEMA_MUTATION
} from './mutation';
import {
  DATABASE_SCHEMAS_QUERY,
  IDatabaseSchemasQuery,
  DATABASE_INSTANCES_QUERY,
  IDatabaseInstancesQuery
} from './query';

export class DatabaseClient {
  private client: GoboClient;

  constructor(client: GoboClient) {
    this.client = client;
  }

  public async getSchemas(
    affiliations: string[]
  ): Promise<IDataAndErrors<IDatabaseSchemasQuery> | undefined> {
    return await this.client.query<IDatabaseSchemasQuery>({
      query: DATABASE_SCHEMAS_QUERY,
      variables: {
        affiliations
      }
    });
  }

  public async getInstances(
    affiliation: string
  ): Promise<IDataAndErrors<IDatabaseInstancesQuery> | undefined> {
    return await this.client.query<IDatabaseInstancesQuery>({
      query: DATABASE_INSTANCES_QUERY,
      variables: {
        affiliation
      }
    });
  }

  public async updateSchema(
    databaseSchema: IUpdateDatabaseSchemaInputWithCreatedBy
  ): Promise<
    IDataAndErrors<{ updateDatabaseSchema: { id: string } }> | undefined
  > {
    return await this.client.mutate<{ updateDatabaseSchema: { id: string } }>({
      mutation: UPDATE_DATABASESCHEMA_MUTATION,
      variables: {
        input: databaseSchema
      }
    });
  }

  public async deleteSchemas(
    ids: string[]
  ): Promise<
    | IDataAndErrors<{
        deleteDatabaseSchemas: IDeleteDatabaseSchemasResponse;
      }>
    | undefined
  > {
    return await this.client.mutate<{
      deleteDatabaseSchemas: IDeleteDatabaseSchemasResponse;
    }>({
      mutation: DELETE_DATABASESCHEMAS_MUTATION,
      variables: {
        input: {
          ids
        }
      }
    });
  }

  public async testJdbcConnectionForId(
    id: string
  ): Promise<
    | IDataAndErrors<{
        testJdbcConnectionForId: boolean;
      }>
    | undefined
  > {
    return await this.client.mutate<{ testJdbcConnectionForId: boolean }>({
      mutation: TEST_JDBC_CONNECTION_FOR_ID_MUTATION,
      variables: {
        id
      }
    });
  }

  public async testJdbcConnectionForJdbcUser(jdbcUser: IJdbcUser) {
    return await this.client.mutate<{
      testJdbcConnectionForJdbcUser: boolean;
    }>({
      mutation: TEST_JDBC_CONNECTION_FOR_JDBCUSER_MUTATION,
      variables: {
        input: jdbcUser
      }
    });
  }

  public async createDatabaseSchema(
    databaseSchema: ICreateDatabaseSchemaInput
  ) {
    return await this.client.mutate<{
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
  }
}

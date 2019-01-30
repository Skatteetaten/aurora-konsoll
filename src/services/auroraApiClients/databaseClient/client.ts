import GoboClient from 'services/GoboClient';

import {
  IDatabaseSchemaInputWithUserId,
  IDatabaseSchemas
} from 'models/schemas';
import { errorStateManager } from 'models/StateManager/ErrorStateManager';
import { DELETE_DATABASESCHEMA_MUTATION, UPDATE_DATABASESCHEMA_MUTATION } from './mutation';
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

  public async updateSchema(databaseSchema: IDatabaseSchemaInputWithUserId) {
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
}

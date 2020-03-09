import {
  ICreateDatabaseSchemaInput,
  IDatabaseSchema,
  IDatabaseSchemaInput,
  IJdbcUser,
  IUpdateDatabaseSchemaInputWithCreatedBy
} from 'models/schemas';

export default class DatabaseSchemaService {
  public trimJdbcUser = (
    jdbcUser: IJdbcUser | null | undefined
  ): IJdbcUser | null => {
    const defaultValues: IJdbcUser = {
      username: '',
      password: '',
      jdbcUrl: ''
    };
    if (!!jdbcUser) {
      return Object.keys(jdbcUser).reduce((acc, curr) => {
        acc[curr] = jdbcUser[curr].trim();
        return acc;
      }, defaultValues);
    }
    return null;
  };

  public trimLabelsAndJdbcUser(
    databaseSchema: ICreateDatabaseSchemaInput
  ): ICreateDatabaseSchemaInput {
    const defaultValues: ICreateDatabaseSchemaInput = {
      discriminator: '',
      createdBy: '',
      description: null,
      environment: '',
      application: '',
      affiliation: '',
      engine: ''
    };

    const trimLabels = (value: string): string => {
      return !!value ? value.trim() : value;
    };

    return Object.keys(databaseSchema).reduce((acc, curr) => {
      curr !== 'jdbcUser'
        ? (acc[curr] = trimLabels(databaseSchema[curr]))
        : (acc[curr] = this.trimJdbcUser(databaseSchema.jdbcUser));
      return acc;
    }, defaultValues);
  }

  public getSelectionDetails(deleteSelectionIds: string[]): string {
    if (deleteSelectionIds.length === 1) {
      return `Vil du slette dette skjemaet?`;
    }
    return `Vil du slette disse ${deleteSelectionIds.length} skjemaene?`;
  }

  public hasEmptyLabelValues(input: IDatabaseSchemaInput) {
    return (
      input.application.trim() === '' ||
      input.environment.trim() === '' ||
      input.discriminator.trim() === '' ||
      input.createdBy.trim() === ''
    );
  }

  public hasEmptyJdbcValues(input: IJdbcUser | null | undefined) {
    if (!input || !input.username || !input.password || !input.jdbcUrl) {
      return true;
    } else {
      return (
        input.jdbcUrl.trim() === '' ||
        input.password.trim() === '' ||
        input.username.trim() === ''
      );
    }
  }

  public isUpdateButtonDisabled(
    updatedSchemaValues: IUpdateDatabaseSchemaInputWithCreatedBy,
    schema?: IDatabaseSchema
  ) {
    const isUnchangedValues =
      schema &&
      schema.application === updatedSchemaValues.application &&
      (schema.description === updatedSchemaValues.description ||
        (schema.description === null &&
          updatedSchemaValues.description === '')) &&
      schema.environment === updatedSchemaValues.environment &&
      schema.discriminator === updatedSchemaValues.discriminator &&
      schema.createdBy === updatedSchemaValues.createdBy;

    const isEmpty = this.hasEmptyLabelValues(updatedSchemaValues);

    return isUnchangedValues || isEmpty;
  }
}

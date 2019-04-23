import {
  ICreateDatabaseSchemaInput,
  IDatabaseSchema,
  IDatabaseSchemaInput,
  IDatabaseSchemaView,
  IJdbcUser,
  IUpdateDatabaseSchemaInputWithCreatedBy
} from 'models/schemas';
import { IColumn } from 'office-ui-fabric-react/lib/DetailsList';

const deletionDialogColumns = [
  {
    key: 'column1',
    name: 'Applikasjon',
    fieldName: 'application',
    minWidth: 200,
    maxWidth: 200,
    isResizable: true
  },
  {
    key: 'column2',
    name: 'Miljø',
    fieldName: 'environment',
    minWidth: 200,
    maxWidth: 200,
    isResizable: true
  },
  {
    key: 'column3',
    name: 'Diskriminator',
    fieldName: 'discriminator',
    minWidth: 200,
    maxWidth: 200,
    isResizable: true
  }
];

const defaultColumns: IColumn[] = [
  {
    fieldName: 'type',
    isResizable: true,
    key: '0',
    maxWidth: 120,
    minWidth: 120,
    name: 'Type',
    iconName: ''
  },
  {
    fieldName: 'environment',
    isResizable: true,
    key: '1',
    maxWidth: 200,
    minWidth: 200,
    name: 'Miljø',
    iconName: ''
  },
  {
    fieldName: 'application',
    isResizable: true,
    key: '2',
    maxWidth: 200,
    minWidth: 200,
    name: 'Applikasjon',
    iconName: ''
  },
  {
    fieldName: 'discriminator',
    isResizable: true,
    key: '3',
    maxWidth: 200,
    minWidth: 200,
    name: 'Diskriminator',
    iconName: ''
  },
  {
    fieldName: 'createdDate',
    isResizable: true,
    key: '4',
    maxWidth: 120,
    minWidth: 120,
    name: 'Opprettet',
    iconName: ''
  },
  {
    fieldName: 'lastUsedDate',
    isResizable: true,
    key: '5',
    maxWidth: 120,
    minWidth: 120,
    name: 'Sist brukt',
    iconName: ''
  },
  {
    fieldName: 'sizeInMb',
    isResizable: true,
    key: '6',
    maxWidth: 175,
    minWidth: 175,
    name: 'Størrelse (MB)',
    iconName: ''
  },
  {
    fieldName: 'createdBy',
    isResizable: true,
    key: '7',
    maxWidth: 120,
    minWidth: 120,
    name: 'Bruker',
    iconName: ''
  },
  {
    fieldName: 'applicationDeploymentsUses',
    isResizable: true,
    key: '8',
    maxWidth: 120,
    minWidth: 120,
    name: 'I bruk av',
    iconName: ''
  }
];

export const filterDatabaseSchemaView = (filter: string) => {
  return (v: IDatabaseSchemaView) =>
    v.createdBy.includes(filter) ||
    v.application.includes(filter) ||
    v.environment.includes(filter) ||
    v.discriminator.includes(filter) ||
    v.createdDate.includes(filter) ||
    (!v.lastUsedDate || v.lastUsedDate === null
      ? false
      : v.lastUsedDate.includes(filter)) ||
    v.sizeInMb.toString().includes(filter) ||
    v.type.includes(filter);
};

export default class DatabaseSchemaService {
  public static DEFAULT_COLUMNS: IColumn[] = defaultColumns;
  public static DELETION_COLUMNS: IColumn[] = deletionDialogColumns;

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
      affiliation: ''
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
    switch (deleteSelectionIds.length) {
      case 1:
        return `Vil du slette dette skjemaet?`;
      default:
        return `Vil du slette disse ${deleteSelectionIds.length} skjemaene?`;
    }
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

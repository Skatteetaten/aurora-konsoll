export interface IDatabaseSchemas {
  databaseSchemas: IDatabaseSchema[];
}

export interface IDatabaseSchema {
  id: string;
  type: string;
  jdbcUrl: string;
  name: string;
  application: string;
  environment: string;
  description?: string | null;
  discriminator: string;
  affiliation: {
    name: string;
  };
  databaseEngine: string;
  createdBy: string;
  createdDate: Date;
  lastUsedDate?: Date | null;
  sizeInMb: number;
  users: Array<{
    username: string;
    type: string;
  }>;
}

export interface IDatabaseSchemaView {
  type: string;
  application: string;
  environment: string;
  discriminator: string;
  createdBy: string;
  createdDate: string;
  lastUsedDate?: string | null;
  sizeInMb: number;
  id: string;
}

export interface IDatabaseSchemaInput {
  discriminator: string;
  description?: string | null;
  environment: string;
  application: string;
  affiliation: string;
  createdBy: string;
}

export interface IUpdateDatabaseSchemaInputWithCreatedBy
  extends IDatabaseSchemaInput {
  id: string;
}

export interface ICreateDatabaseSchemaInput extends IDatabaseSchemaInput {
  jdbcUser?: IJdbcUser | null;
}

export interface IJdbcUser {
  username: string;
  password: string;
  jdbcUrl: string;
}

export enum Step {
  TYPE,
  NEW,
  EXTERNAL
}

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
  applicationDeployments: IDatabaseApplicationDeployment[];
  databaseEngine: string;
  createdBy: string;
  createdDate: Date;
  lastUsedDate?: Date | null;
  sizeInMb: number;
  users: Array<{
    username: string;
    type: string;
    password?: string;
  }>;
}

export interface IDatabaseApplicationDeployment {
  id: string;
  affiliation: {
    name: string;
  };
  name: string;
  namespace: {
    name: string;
  };
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
  applicationDeploymentsUses: number;
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

export interface ICreateDatabaseSchemaResponse {
  id: string;
  jdbcUser: IJdbcUser;
}

export interface IDeleteDatabaseSchemasResponse {
  succeeded: string[];
  failed: string[];
}

export enum Step {
  TYPE,
  NEW,
  EXTERNAL,
  SUMMARY
}

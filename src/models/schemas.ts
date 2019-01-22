export interface IDatabaseSchemas {
  databaseSchemas: IDatabaseSchema[];
}

export interface IDatabaseSchema {
  id: string;
  type: string;
  jdbcUrl: string;
  name: string;
  appDbName: string;
  affiliation: {
    name: string;
  };
  databaseEngine: string;
  createdBy: string;
  createdDate: Date;
  lastUsedDate?: Date;
  sizeInMb: number;
  users: Array<{
    username: string;
    type: string;
  }>;
}

export interface IDatabaseSchemaView {
  type: string;
  appDbName: string;
  createdBy: string;
  createdDate: string;
  lastUsedDate?: string;
  sizeInMb: number;
}

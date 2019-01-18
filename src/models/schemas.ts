export interface IDatabaseSchemas {
  databaseSchemas?: IDatabaseSchema[];
}

export interface IDatabaseSchema {
  id: string;
  type: string;
  jdbcUrl: string;
  name: string;
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
    password: string;
    type: string;
  }>;
}

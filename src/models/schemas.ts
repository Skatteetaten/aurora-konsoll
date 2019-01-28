export interface IDatabaseSchemas {
  databaseSchemas: IDatabaseSchema[];
}

export interface IDatabaseSchema {
  id: string;
  type: string;
  jdbcUrl: string;
  name: string;
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
  discriminator: string;
  createdBy: string;
  createdDate: string;
  lastUsedDate?: string | null;
  sizeInMb: number;
  id: string;
}

export interface IDatabaseSchemaInput {
  id: string;
  discriminator: string;
  userId: string;
  description?: string | null;
  environment: string;
  application: string;
  affiliation: string;
}

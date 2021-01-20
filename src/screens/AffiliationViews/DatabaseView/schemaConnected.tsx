import { connect } from 'react-redux';
import Schema from './Schema';

import {
  ICreateDatabaseSchemaInput,
  IDatabaseSchema,
  IJdbcUser,
  IPageInfo,
  IUpdateDatabaseSchemaInputWithCreatedBy,
} from 'models/schemas';
import { RootState } from 'store/types';
import {
  createDatabaseSchema,
  deleteSchema,
  deleteSchemas,
  fetchInstances,
  fetchNextSchemas,
  fetchSchemas,
  testJdbcConnectionForId,
  testJdbcConnectionForJdbcUser,
  updateSchema,
} from './state/actions';

const mapStateToProps = (state: RootState) => ({
  items: state.database.databaseSchemas,
  instances: state.database.databaseInstances,
  isFetchingInstances: state.database.isFetchingInstances,
  isFetching: state.database.isFetchingSchemas,
  isFetchingNext: state.database.isFetchingNextSchemas,
  testJdbcConnectionResponse: state.database.testJdbcConnectionResponse,
  createResponse: state.database.createDatabaseSchemaResponse,
  currentUser: state.startup.currentUser,
  deleteResponse: state.database.deleteSchemasResponse,
});

const mapDispatchToProps = {
  onFetch: (affiliations: string[]) => fetchSchemas(affiliations),
  onFetchNext: (
    affiliations: string[],
    databaseSchemas: IDatabaseSchema[],
    endCursor: string
  ) => fetchNextSchemas(affiliations, databaseSchemas, endCursor),
  onFetchInstances: (affiliation: string) => fetchInstances(affiliation),
  onUpdate: (databaseSchema: IUpdateDatabaseSchemaInputWithCreatedBy) =>
    updateSchema(databaseSchema),
  onDelete: (databaseSchema: IDatabaseSchema) => deleteSchema(databaseSchema),
  onTestJdbcConnectionForId: (id: string) => testJdbcConnectionForId(id),
  onTestJdbcConnectionForUser: (jdbcUser: IJdbcUser) =>
    testJdbcConnectionForJdbcUser(jdbcUser),
  onCreate: (databaseSchema: ICreateDatabaseSchemaInput) =>
    createDatabaseSchema(databaseSchema),
  onDeleteSchemas: (ids: string[]) => deleteSchemas(ids),
};
export const SchemaConnected = connect(
  mapStateToProps,
  mapDispatchToProps
)(Schema);

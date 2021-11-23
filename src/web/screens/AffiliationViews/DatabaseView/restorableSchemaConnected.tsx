import { connect } from 'react-redux';
import { RootState } from '../../../store/types';
import RestorableSchema from './RestorableSchema';
import {
  fetchRestorableSchemas,
  updateSchema,
  deleteSchema,
  testJdbcConnectionForId,
  testJdbcConnectionForJdbcUser,
  restoreSchemas,
  restoreSchema,
} from './state/actions';
import {
  IUpdateDatabaseSchemaInputWithCreatedBy,
  IDatabaseSchema,
  IJdbcUser,
} from 'web/models/schemas';

const mapStateToProps = (state: RootState) => ({
  items: state.database.restorableDatabaseSchemas,
  isFetching: state.database.isFetchingRestorableSchemas,
  testJdbcConnectionResponse: state.database.testJdbcConnectionResponse,
  restoreResponse: state.database.restoreSchemasResponse,
});
const mapDispatchToProps = {
  onFetch: (affiliations: string[]) => fetchRestorableSchemas(affiliations),
  onUpdate: (databaseSchema: IUpdateDatabaseSchemaInputWithCreatedBy) =>
    updateSchema(databaseSchema),
  onRestore: (databaseSchema: IDatabaseSchema) => deleteSchema(databaseSchema),
  onTestJdbcConnectionForId: (id: string) => testJdbcConnectionForId(id),
  onTestJdbcConnectionForUser: (jdbcUser: IJdbcUser) =>
    testJdbcConnectionForJdbcUser(jdbcUser),
  onRestoreDatabaseSchemas: (ids: string[], active: boolean) =>
    restoreSchemas(ids, active),
  onRestoreDatabaseSchema: (databaseSchema: IDatabaseSchema, active: boolean) =>
    restoreSchema(databaseSchema, active),
};

export const RestorableSchemaConnected = connect(
  mapStateToProps,
  mapDispatchToProps
)(RestorableSchema);

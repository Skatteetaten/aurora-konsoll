import { connect } from 'react-redux';
import { RootState } from '../../../store/types';
import RestorableSchema from './RestorableSchema';
import {
  fetchRestorableSchemas,
  fetchInstances,
  updateSchema,
  deleteSchema,
  testJdbcConnectionForId,
  testJdbcConnectionForJdbcUser
} from './state/actions';
import { ISchemasState } from './state/reducers';
import { IUpdateDatabaseSchemaInputWithCreatedBy, IDatabaseSchema, IJdbcUser } from 'models/schemas';

const mapStateToProps = (state: RootState) => ({
  items: state.database.restorableDatabaseSchemas,
  isFetching: state.database.isFetchingRestorableSchemas,
  testJdbcConnectionResponse: state.database.testJdbcConnectionResponse
});
const mapDispatchToProps = {
  onFetch: (affiliations: string[]) => fetchRestorableSchemas(affiliations),
  onUpdate: (databaseSchema: IUpdateDatabaseSchemaInputWithCreatedBy) =>
    updateSchema(databaseSchema),
  onRestore: (databaseSchema: IDatabaseSchema) => deleteSchema(databaseSchema),
  onTestJdbcConnectionForId: (id: string) => testJdbcConnectionForId(id),
  onTestJdbcConnectionForUser: (jdbcUser: IJdbcUser) =>
    testJdbcConnectionForJdbcUser(jdbcUser)
};

export const RestorableSchemaConnected = connect(
  mapStateToProps,
  mapDispatchToProps
)(RestorableSchema);

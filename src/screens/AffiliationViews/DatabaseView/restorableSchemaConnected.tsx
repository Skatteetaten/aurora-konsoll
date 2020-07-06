import { connect } from 'react-redux';
import { RootState } from '../../../store/types';
import RestorableSchema from './RestorableSchema';
import {
  fetchRestorableSchemas,
  fetchInstances,
  updateSchema,
  deleteSchema
} from './state/actions';
import { ISchemasState } from './state/reducers';
import { IUpdateDatabaseSchemaInputWithCreatedBy, IDatabaseSchema } from 'models/schemas';

const mapStateToProps = (state: RootState) => ({
  items: state.database.restorableDatabaseSchemas,
  isFetching: state.database.isFetchingRestorableSchemas
});
const mapDispatchToProps = {
  onFetch: (affiliations: string[]) => fetchRestorableSchemas(affiliations),
  onUpdate: (databaseSchema: IUpdateDatabaseSchemaInputWithCreatedBy) =>
    updateSchema(databaseSchema),
  onDelete: (databaseSchema: IDatabaseSchema) => deleteSchema(databaseSchema)
};

export const RestorableSchemaConnected = connect(
  mapStateToProps,
  mapDispatchToProps
)(RestorableSchema);

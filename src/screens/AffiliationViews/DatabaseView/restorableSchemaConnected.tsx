import { connect } from 'react-redux';
import { RootState } from '../../../store/types';
import RestorableSchema from './RestorableSchema';
import {
  fetchRestorableSchemas,
  fetchInstances,
  updateSchema
} from './state/actions';
import { ISchemasState } from './state/reducers';
import { IUpdateDatabaseSchemaInputWithCreatedBy } from 'models/schemas';

const mapStateToProps = (state: RootState) => ({
  items: state.database.restorableDatabaseSchemas,
  isFetching: state.database.isFetchingRestorableSchemas
});
const mapDispatchToProps = {
  onFetch: (affiliations: string[]) => fetchRestorableSchemas(affiliations),
  onUpdate: (databaseSchema: IUpdateDatabaseSchemaInputWithCreatedBy) =>
    updateSchema(databaseSchema)
};

export const RestorableSchemaConnected = connect(
  mapStateToProps,
  mapDispatchToProps
)(RestorableSchema);

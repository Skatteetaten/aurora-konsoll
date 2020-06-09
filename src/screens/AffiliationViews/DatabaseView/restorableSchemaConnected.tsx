import { connect } from 'react-redux';
import { RootState } from '../../../store/types';
import RestorableSchema from './RestorableSchema';
import { fetchRestorableSchemas, fetchInstances } from './state/actions';
import { ISchemasState } from './state/reducers';

const mapStateToProps = (state: RootState) => ({
  items: state.database.restorableDatabaseSchemas,
  isFetching: state.database.isFetchingRestorableSchemas
});
const mapDispatchToProps = {
  onFetch: (affiliations: string[]) => fetchRestorableSchemas(affiliations)
};

export const RestorableSchemaConnected = connect(
  mapStateToProps,
  mapDispatchToProps
)(RestorableSchema);

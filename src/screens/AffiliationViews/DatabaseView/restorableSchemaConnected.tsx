import { connect } from 'react-redux';
import { RootState } from '../../../store/types';
import { RestorableSchema } from './RestorableSchema';
import { fetchRestorableSchemas } from './state/actions';
import {ISchemasState} from "./state/reducers";

const getItems = (state: ISchemasState) => state.restorableDatabaseSchemas;

const mapStateToProps = (state: RootState) => ({
  restorableDatabaseSchemas: getItems(state.database),
});
const mapDispatchToProps = {
  onComponentMounted: (affiliation: string) =>
    fetchRestorableSchemas(affiliation)
};

export const RestorableSchemaConnected = connect(
  mapStateToProps,
  mapDispatchToProps
)(RestorableSchema);

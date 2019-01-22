import { connect } from 'react-redux';
import { Schema } from './schema';

import { RootState } from 'store/types';
import { fetchSchemas } from './state/actions';
import { ISchemasState } from './state/reducers';

const getLoadingStatus = (state: ISchemasState) => state.isLoading;
const getItems = (state: ISchemasState) => state.items;

const mapStateToProps = (state: RootState) => ({
  items: getItems(state.database),
  isLoading: getLoadingStatus(state.database)
});

export const SchemaConnected = connect(
  mapStateToProps,
  {
    onFetch: (affiliations: string[]) => fetchSchemas(affiliations)
  }
)(Schema);

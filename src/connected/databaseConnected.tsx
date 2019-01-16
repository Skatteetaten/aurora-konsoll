import { connect } from 'react-redux';
import { schema } from '../features/database/componenets/schema';

import { fetchSchemas } from '../features/database/asyncActions';
import { getError, getItems, getLoading } from '../features/database/selectors';
import { RootState } from '../store/types';

const mapStateToProps = (state: RootState) => ({
  error: getError(state.databaseSchemas),
  items: getItems(state.databaseSchemas),
  isLoading: getLoading(state.databaseSchemas)
});

export const SchemaConnected = connect(
  mapStateToProps,
  {
    onFetch: (host: string, port: string) => fetchSchemas(host, port)
  }
)(schema);

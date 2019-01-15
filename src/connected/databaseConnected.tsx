import { connect } from 'react-redux';
import { schema } from '../features/database/componenets/schema';

import { fetchSchemas } from '../features/database/functions';

import { RootState } from '../store/types';

import { getSchema } from '../features/database/selectors';

const mapStateToProps = (state: RootState) => ({
  result: getSchema(state.databaseSchemas)
});

export const SchemaConnected = connect(
  mapStateToProps,
  {
    onFetch: (host: string, port: string) => fetchSchemas(host, port)
  }
)(schema);

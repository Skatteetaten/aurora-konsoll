import { connect } from 'react-redux';
import { schema } from '../features/database/componenets/schema';

import { netDebugCall } from '../services/auroraApiClients/databaseClient/reducer';

import { RootState } from '../store/types';

const mapStateToProps = (state: RootState) => ({
  list: state.schemas
});

export const SchemaConnected = connect(
  mapStateToProps,
  {
    onFetch: (host: string, port: string) => netDebugCall(host, port)
  }
)(schema);

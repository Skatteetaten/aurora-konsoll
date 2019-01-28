import { connect } from 'react-redux';
import Schema from './DatabaseSchemaTable';

import { IDatabaseSchemaInput } from 'models/schemas';
import { RootState } from 'store/types';
import { fetchSchemas, updateSchema } from './state/actions';
import { ISchemasState } from './state/reducers';

const getFetchingStatus = (state: ISchemasState) => state.isFetchingSchemas;
const getItems = (state: ISchemasState) => state.databaseSchemas;
const getUpdatingStatus = (state: ISchemasState) => state.isUpdatingSchema;
const getUpdateResponse = (state: ISchemasState) => state.updateSchemaResponse;

const mapStateToProps = (state: RootState) => ({
  items: getItems(state.database),
  isFetching: getFetchingStatus(state.database),
  isUpdating: getUpdatingStatus(state.database),
  updateResponse: getUpdateResponse(state.database)
});

export const SchemaConnected = connect(
  mapStateToProps,
  {
    onFetch: (affiliations: string[]) => fetchSchemas(affiliations),
    onUpdate: (databaseSchema: IDatabaseSchemaInput) =>
      updateSchema(databaseSchema)
  }
)(Schema);

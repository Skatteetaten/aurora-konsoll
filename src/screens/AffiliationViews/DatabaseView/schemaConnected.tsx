import { connect } from 'react-redux';
import Schema from './DatabaseSchemaTable';

import { IDatabaseSchema, IDatabaseSchemaInputWithUserId } from 'models/schemas';
import { RootState } from 'store/types';
import { deleteSchema, fetchSchemas, updateSchema } from './state/actions';
import { ISchemasState } from './state/reducers';

const getFetchingStatus = (state: ISchemasState) => state.isFetchingSchemas;
const getItems = (state: ISchemasState) => state.databaseSchemas;
const getUpdateResponse = (state: ISchemasState) => state.updateSchemaResponse;

const mapStateToProps = (state: RootState) => ({
  items: getItems(state.database),
  isFetching: getFetchingStatus(state.database),
  updateResponse: getUpdateResponse(state.database)
});

export const SchemaConnected = connect(
  mapStateToProps,
  {
    onFetch: (affiliations: string[]) => fetchSchemas(affiliations),
    onUpdate: (databaseSchema: IDatabaseSchemaInputWithUserId) =>
      updateSchema(databaseSchema),
    onDelete: (databaseSchema: IDatabaseSchema) => deleteSchema(databaseSchema)
  }
)(Schema);

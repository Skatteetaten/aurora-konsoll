import { connect } from 'react-redux';
import Schema from './DatabaseSchemaTable';

import {
  IDatabaseSchema,
  IDatabaseSchemaInputWithUserId,
  IJdbcUser
} from 'models/schemas';
import { RootState } from 'store/types';
import {
  deleteSchema,
  fetchSchemas,
  testJdbcConnectionForId,
  testJdbcConnectionForJdbcUser,
  updateSchema
} from './state/actions';
import { ISchemasState } from './state/reducers';

const getFetchingStatus = (state: ISchemasState) => state.isFetchingSchemas;
const getItems = (state: ISchemasState) => state.databaseSchemas;
const getUpdateResponse = (state: ISchemasState) => state.updateSchemaResponse;
const getTestConnectionResponse = (state: ISchemasState) =>
  state.testJdbcConnectionResponse;

const mapStateToProps = (state: RootState) => ({
  items: getItems(state.database),
  isFetching: getFetchingStatus(state.database),
  updateResponse: getUpdateResponse(state.database),
  testJdbcConnectionResponse: getTestConnectionResponse(state.database)
});

export const SchemaConnected = connect(
  mapStateToProps,
  {
    onFetch: (affiliations: string[]) => fetchSchemas(affiliations),
    onUpdate: (databaseSchema: IDatabaseSchemaInputWithUserId) =>
      updateSchema(databaseSchema),
    onDelete: (databaseSchema: IDatabaseSchema) => deleteSchema(databaseSchema),
    onTestJdbcConnectionForId: (id: string) => testJdbcConnectionForId(id),
    onTestJdbcConnectionForUser: (jdbcUser: IJdbcUser) =>
      testJdbcConnectionForJdbcUser(jdbcUser)
  }
)(Schema);

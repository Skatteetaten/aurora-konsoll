import { connect } from 'react-redux';
import Schema from './Schema';

import {
  ICreateDatabaseSchemaInput,
  IDatabaseSchema,
  IJdbcUser,
  IUpdateDatabaseSchemaInputWithCreatedBy
} from 'models/schemas';
import { IStartupState } from 'state/reducers';
import { RootState } from 'store/types';
import {
  createDatabaseSchema,
  deleteSchema,
  deleteSchemas,
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
const getCreateDatabaseSchemaRespnse = (state: ISchemasState) =>
  state.createDatabaseSchemaResponse;
const getCurrentUser = (state: IStartupState) => state.currentUser;
const getDeletionInfo = (state: ISchemasState) => state.deleteSchemasResponse;

const mapStateToProps = (state: RootState) => ({
  items: getItems(state.database),
  isFetching: getFetchingStatus(state.database),
  updateResponse: getUpdateResponse(state.database),
  testJdbcConnectionResponse: getTestConnectionResponse(state.database),
  createResponse: getCreateDatabaseSchemaRespnse(state.database),
  currentUser: getCurrentUser(state.startup),
  deleteResponse: getDeletionInfo(state.database)
});

export const SchemaConnected = connect(
  mapStateToProps,
  {
    onFetch: (affiliations: string[]) => fetchSchemas(affiliations),
    onUpdate: (databaseSchema: IUpdateDatabaseSchemaInputWithCreatedBy) =>
      updateSchema(databaseSchema),
    onDelete: (databaseSchema: IDatabaseSchema) => deleteSchema(databaseSchema),
    onTestJdbcConnectionForId: (id: string) => testJdbcConnectionForId(id),
    onTestJdbcConnectionForUser: (jdbcUser: IJdbcUser) =>
      testJdbcConnectionForJdbcUser(jdbcUser),
    onCreate: (databaseSchema: ICreateDatabaseSchemaInput) =>
      createDatabaseSchema(databaseSchema),
    onDeleteSchemas: (ids: string[]) => deleteSchemas(ids)
  }
)(Schema);

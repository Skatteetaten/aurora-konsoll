import { connect } from 'react-redux';
import Schema from './Schema';

import {
  ICreateDatabaseSchemaInput,
  IDatabaseSchema,
  IJdbcUser,
  IUpdateDatabaseSchemaInputWithCreatedBy
} from 'models/schemas';
import { IStartupState } from 'store/state/startup/reducers';
import { RootState } from 'store/types';
import {
  createDatabaseSchema,
  deleteSchema,
  deleteSchemas,
  fetchSchemas,
  testJdbcConnectionForId,
  testJdbcConnectionForJdbcUser,
  updateSchema,
  fetchInstances,
  testJdbcConnectionForIdV2,
  testJdbcConnectionForJdbcUserV2
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
const getInstances = (state: ISchemasState) => state.databaseInstances;
const getFetchingStatusInstances = (state: ISchemasState) =>
  state.isFetchingInstances;

const mapStateToProps = (state: RootState) => ({
  items: getItems(state.database),
  instances: getInstances(state.database),
  isFetchingInstances: getFetchingStatusInstances(state.database),
  isFetching: getFetchingStatus(state.database),
  updateResponse: getUpdateResponse(state.database),
  testJdbcConnectionResponse: getTestConnectionResponse(state.database),
  testJdbcConnectionResponseV2: state.database.testJdbcConnectionResponseV2,
  createResponse: getCreateDatabaseSchemaRespnse(state.database),
  currentUser: getCurrentUser(state.startup),
  deleteResponse: getDeletionInfo(state.database)
});

export const SchemaConnected = connect(mapStateToProps, {
  onFetch: (affiliations: string[]) => fetchSchemas(affiliations),
  onFetchInstances: (affiliation: string) => fetchInstances(affiliation),
  onUpdate: (databaseSchema: IUpdateDatabaseSchemaInputWithCreatedBy) =>
    updateSchema(databaseSchema),
  onDelete: (databaseSchema: IDatabaseSchema) => deleteSchema(databaseSchema),
  onTestJdbcConnectionForId: (id: string) => testJdbcConnectionForId(id),
  onTestJdbcConnectionForIdV2: (id: string) => testJdbcConnectionForIdV2(id),
  onTestJdbcConnectionForUser: (jdbcUser: IJdbcUser) =>
    testJdbcConnectionForJdbcUser(jdbcUser),
  onTestJdbcConnectionForUserV2: (jdbcUser: IJdbcUser) =>
    testJdbcConnectionForJdbcUserV2(jdbcUser),
  onCreate: (databaseSchema: ICreateDatabaseSchemaInput) =>
    createDatabaseSchema(databaseSchema),
  onDeleteSchemas: (ids: string[]) => deleteSchemas(ids)
})(Schema);

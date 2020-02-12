import React from 'react';

import styled from 'styled-components';
import TextField from 'aurora-frontend-react-komponenter/TextField';

import Spinner from 'components/Spinner';

import { IUserAndAffiliations } from 'models/ApplicationDeployment';
import {
  ICreateDatabaseSchemaInput,
  ICreateDatabaseSchemaResponse,
  IDatabaseSchema,
  IDatabaseSchemas,
  IDeleteDatabaseSchemasResponse,
  IJdbcUser,
  IUpdateDatabaseSchemaInputWithCreatedBy
} from 'models/schemas';
import ConfirmDeletionDialog from './ConfirmDeletionDialog';
import DatabaseSchemaCreateDialog from './DatabaseSchemaCreateDialog';
import DatabaseSchemaUpdateDialog from './DatabaseSchemaUpdateDialog';
import { EnterModeThenConfirm } from './EnterModeThenConfirm';
import { DatabaseSchemaTable } from './DatabaseSchemaTable';

export interface ISchemaProps {
  onFetch: (affiliations: string[]) => void;
  onUpdate: (databaseSchema: IUpdateDatabaseSchemaInputWithCreatedBy) => void;
  onDelete: (databaseSchema: IDatabaseSchema) => void;
  onCreate: (databaseSchema: ICreateDatabaseSchemaInput) => void;
  onDeleteSchemas: (ids: string[]) => void;
  onTestJdbcConnectionForId: (id: string) => void;
  onTestJdbcConnectionForUser: (jdbcUser: IJdbcUser) => void;
  items: IDatabaseSchemas;
  createResponse: ICreateDatabaseSchemaResponse;
  isFetching: boolean;
  updateResponse: boolean;
  affiliation: string;
  className?: string;
  testJdbcConnectionResponse: boolean;
  currentUser: IUserAndAffiliations;
  deleteResponse: IDeleteDatabaseSchemasResponse;
}

interface ISchemaState {
  filter: string;
  selectedSchema?: IDatabaseSchema;
  selectedSchemas?: IDatabaseSchema[];
  schemaToCopy?: IDatabaseSchema;
  deleteMode: boolean;
  hasDeletionInformation: boolean;
  confirmDeletionDialogVisible: boolean;
}

export class Schema extends React.Component<ISchemaProps, ISchemaState> {
  public state: ISchemaState = {
    filter: '',
    selectedSchema: undefined,
    schemaToCopy: undefined,
    deleteMode: false,
    hasDeletionInformation: false,
    confirmDeletionDialogVisible: false
  };

  public componentDidMount() {
    const { affiliation, onFetch } = this.props;
    onFetch([affiliation]);
  }

  public componentDidUpdate(prevProps: ISchemaProps, prevState: ISchemaState) {
    const { affiliation, items, onFetch } = this.props;

    if (
      prevProps.affiliation !== affiliation ||
      (prevProps.items.databaseSchemas &&
        prevProps.items.databaseSchemas.length === 0 &&
        items.databaseSchemas &&
        items.databaseSchemas.length > 0)
    ) {
      onFetch([affiliation]);
      this.setState({
        filter: ''
      });
    }
  }

  public render() {
    const {
      isFetching,
      className,
      onUpdate,
      onDelete,
      onTestJdbcConnectionForId,
      testJdbcConnectionResponse,
      onCreate,
      createResponse,
      affiliation,
      onTestJdbcConnectionForUser,
      onFetch,
      currentUser
    } = this.props;
    const {
      filter,
      selectedSchema,
      selectedSchemas,
      schemaToCopy,
      deleteMode,
      confirmDeletionDialogVisible
    } = this.state;

    return (
      <div className={className}>
        <div className="styled-action-bar">
          <div className="styled-input-and-delete">
            <div className="styled-input">
              <TextField
                placeholder="Søk etter skjema"
                onChanged={this.onFilterChange}
                value={filter}
              />
            </div>
            <EnterModeThenConfirm
              confirmButtonEnabled={(selectedSchemas || []).length !== 0}
              confirmText="Slett valgte"
              inactiveIcon="Delete"
              inactiveText="Velg skjemaer for sletting"
              onEnterMode={this.onEnterDeletionMode}
              onExitMode={this.onExitDeletionMode}
              onConfirmClick={this.onDeleteSelectionConfirmed}
            />
          </div>
          <div className="styled-create">
            <DatabaseSchemaCreateDialog
              affiliation={affiliation}
              onCreate={onCreate}
              createResponse={createResponse}
              onTestJdbcConnectionForUser={onTestJdbcConnectionForUser}
              testJdbcConnectionResponse={testJdbcConnectionResponse}
              onFetch={onFetch}
              currentUser={currentUser}
              isFetching={isFetching}
              initialDatabaseSchemaInput={schemaToCopy}
            />
          </div>
        </div>
        {isFetching ? (
          <Spinner />
        ) : (
          <DatabaseSchemaTable
            filter={filter}
            schemas={this.props.items.databaseSchemas || []}
            multiSelect={deleteMode}
            onSingleSchemaSelected={this.onSingleSchemaSelected.bind(this)}
            onSchemaSelectionChange={this.onSchemaSelectionChange.bind(this)}
          />
        )}

        <DatabaseSchemaUpdateDialog
          schema={selectedSchema}
          clearSelectedSchema={this.onUpdateSchemaDialogClosed}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onTestJdbcConnectionForId={onTestJdbcConnectionForId}
          testJdbcConnectionResponse={testJdbcConnectionResponse}
          createNewCopy={this.onCreateCopyConfirmed}
        />
        <ConfirmDeletionDialog
          title="Slett databaseskjemaer"
          visible={confirmDeletionDialogVisible}
          onOkClick={this.onConfirmDeletionClick}
          onCancelClick={this.onCancelDeletionClick}
          schemasToDelete={this.state.selectedSchemas || []}
        />
      </div>
    );
  }

  private onSingleSchemaSelected(selectedSchema: IDatabaseSchema) {
    this.setState({ selectedSchema });
  }

  private onSchemaSelectionChange(selectedSchemas: IDatabaseSchema[]) {
    this.setState({ selectedSchemas });
  }

  private onCancelDeletionClick = () => {
    this.setState({
      hasDeletionInformation: false,
      confirmDeletionDialogVisible: false
    });
  };

  private onDeleteSelectionConfirmed = () => {
    this.setState({ confirmDeletionDialogVisible: true });
  };

  private onConfirmDeletionClick = () => {
    // deleteResponse,
    //   onDeleteSchemas

    //onDeleteSchemas(deleteSelectionIds);
    this.setState({
      hasDeletionInformation: true,
      confirmDeletionDialogVisible: false
    });
  };

  private onExitDeletionMode = () => {
    this.setState({ deleteMode: false });
  };

  private onEnterDeletionMode = () => {
    this.setState({ deleteMode: true });
  };

  private onFilterChange = (text: string) => {
    this.setState({ filter: text });
  };

  private onCreateCopyConfirmed = () => {
    const { selectedSchema } = this.state;
    this.setState({ schemaToCopy: selectedSchema });
  };

  private onUpdateSchemaDialogClosed = () => {
    this.setState({ selectedSchema: undefined });
  };
}

export default styled(Schema)`
  height: 100%;
  overflow-x: auto;

  .ms-DetailsRow {
    cursor: pointer;
  }

  .styled-action-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 20px 0 20px 20px;
  }

  .styled-input-and-delete {
    display: flex;
    align-items: center;
  }

  .styled-input {
    width: 300px;
  }

  .styled-create {
    margin-right: 20px;
  }

  .styledTable {
    margin-left: 20px;
    display: flex;
    grid-area: table;
    i {
      float: right;
    }
  }

  .jdbcurl-col {
    font-size: 14px;
  }
`;

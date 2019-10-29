import React from 'react';
import { IObjectWithKey } from 'office-ui-fabric-react/lib/Utilities';
import { Selection } from 'office-ui-fabric-react/lib/DetailsList';

import styled from 'styled-components';
import TextField from 'aurora-frontend-react-komponenter/TextField';

import Spinner from 'components/Spinner';
import { getLocalDate } from 'utils/date';

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
import {
  DatabaseSchemaTable,
  IDatabaseSchemaView
} from './DatabaseSchemaTable2';

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
  viewItems: IDatabaseSchemaView[];
  filter: string;
  selectedSchema?: IDatabaseSchema;
  schemaToCopy?: IDatabaseSchema;
  deleteMode: boolean;
  hasDeletionInformation: boolean;
  shouldResetSort: boolean;
  confirmDeletionDialogVisible: boolean;
}

export class Schema extends React.Component<ISchemaProps, ISchemaState> {
  public state: ISchemaState = {
    viewItems: [],
    filter: '',
    selectedSchema: undefined,
    schemaToCopy: undefined,
    deleteMode: false,
    hasDeletionInformation: false,
    shouldResetSort: false,
    confirmDeletionDialogVisible: false
  };

  private schemaSelection: SchemaSelection = new SchemaSelection(
    new Selection({
      onSelectionChanged: () => {
        // if (!this.state.deleteMode) {
        //   this.onUpdateRowClicked();
        // } else {
        //   this.setState({});
        // }
      }
    })
  );

  public componentDidMount() {
    const { affiliation, onFetch } = this.props;
    this.handleFetchDatabaseSchemas();
    onFetch([affiliation]);
  }

  public componentDidUpdate(prevProps: ISchemaProps, prevState: ISchemaState) {
    const { affiliation, items, onFetch } = this.props;
    const { filter } = this.state;

    if (prevState.filter !== filter) {
      // this.schemaSelection.clear();
    }

    if (prevProps.items !== items) {
      this.handleFetchDatabaseSchemas();
    }

    if (
      prevProps.affiliation !== affiliation ||
      (prevProps.items.databaseSchemas &&
        prevProps.items.databaseSchemas.length === 0 &&
        items.databaseSchemas &&
        items.databaseSchemas.length > 0)
    ) {
      onFetch([affiliation]);
      this.setState({
        filter: '',
        shouldResetSort: true
      });
    }
  }

  public handleFetchDatabaseSchemas = () => {
    let viewItems: IDatabaseSchemaView[] = [];
    this.schemaSelection.clear();

    const { items } = this.props;
    if (items.databaseSchemas && items.databaseSchemas.length > 0) {
      this.schemaSelection.setSchemas(items.databaseSchemas);
      viewItems = items.databaseSchemas.map(i => toViewSchema(i));
    }
    this.setState({
      viewItems
    });
  };

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
      schemaToCopy,
      deleteMode,
      hasDeletionInformation: hasDeletionResponse,
      viewItems,
      shouldResetSort,
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
              confirmButtonEnabled={!this.schemaSelection.isEmpty()}
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
            viewItems={viewItems}
            shouldResetSort={shouldResetSort}
            onSchemaListSortReset={this.onSchemaListSortReset}
            multiSelect={deleteMode}
            selection={this.schemaSelection.getSelection()}
            // TODO: Make schema selection event based.
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
          schemasToDelete={this.schemaSelection.getSelectedSchemas()}
        />
      </div>
    );
  }

  private onSchemaListSortReset = () => {
    this.setState({ shouldResetSort: false });
  };

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
    if (this.schemaSelection.isEmpty()) return;

    // deleteResponse,
    //   onDeleteSchemas

    //onDeleteSchemas(deleteSelectionIds);
    this.schemaSelection.clear();
    this.setState({
      hasDeletionInformation: true,
      confirmDeletionDialogVisible: false
    });
  };

  private onExitDeletionMode = () => {
    this.setState({ deleteMode: false });
    this.schemaSelection.clear();
  };

  private onEnterDeletionMode = () => {
    this.setState({ deleteMode: true });
  };

  private onFilterChange = (text: string) => {
    this.setState({ filter: text });
  };

  private onUpdateRowClicked = () => {
    const selectedSchema = this.schemaSelection.getSelectedSchema();
    this.setState({ selectedSchema });
  };

  private onCreateCopyConfirmed = () => {
    const { selectedSchema } = this.state;
    this.setState({ schemaToCopy: selectedSchema });
  };

  private onUpdateSchemaDialogClosed = () => {
    this.schemaSelection.clear();
    this.setState({ selectedSchema: undefined });
  };
}

class SchemaSelection {
  private readonly selection: Selection;
  private schemas: IDatabaseSchema[] = [];

  constructor(selection: Selection) {
    this.selection = selection;
  }

  getSelection(): Selection {
    return this.selection;
  }

  clear(): void {
    this.selection.setAllSelected(false);
  }

  isEmpty(): boolean {
    return this.selection.getSelectedCount() === 0;
  }

  setSchemas(schemas: IDatabaseSchema[]) {
    this.schemas = schemas;
  }

  getSelectedSchema(): IDatabaseSchema | undefined {
    if (!this.isEmpty()) {
      return this.getSelectedSchemas()[0];
    }
    return undefined;
  }

  getSelectedSchemas(): IDatabaseSchema[] {
    const selected: IObjectWithKey[] = this.selection.getSelection();
    const selectedSchemas: IDatabaseSchemaView[] = selected.map(
      it => it as IDatabaseSchemaView
    );

    return this.schemas.filter(
      schema => selectedSchemas.find(it => it.id === schema.id) !== undefined
    );
  }
}

const toViewSchema = (i: IDatabaseSchema): IDatabaseSchemaView => {
  const getJdbcUrlText = (prefix: string) =>
    i.jdbcUrl.substring(i.jdbcUrl.indexOf(prefix) + prefix.length);

  const jdbcUrl = i.jdbcUrl.includes('@')
    ? getJdbcUrlText('@')
    : getJdbcUrlText('://');

  return {
    id: i.id,
    environment: i.environment,
    application: i.application,
    createdDate: getLocalDate(i.createdDate),
    lastUsedDate: i.lastUsedDate && getLocalDate(i.lastUsedDate),
    discriminator: i.discriminator,
    type: i.type,
    applicationDeploymentsUses: i.applicationDeployments.length,
    sizeInMb: i.sizeInMb,
    createdBy: i.createdBy,
    jdbcUrl: jdbcUrl
  };
};

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

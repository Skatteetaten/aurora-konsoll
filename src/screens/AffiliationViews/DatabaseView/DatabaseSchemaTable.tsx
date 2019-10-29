import React from 'react';

import styled from 'styled-components';
import TextField from 'aurora-frontend-react-komponenter/TextField';

import Spinner from 'components/Spinner';
import {
  CheckboxVisibility,
  IObjectWithKey,
  Selection,
  SelectionMode,
  IColumn
} from 'office-ui-fabric-react/lib/DetailsList';
import { getLocalDate } from 'utils/date';

import SortableDetailsList from 'components/SortableDetailsList';
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
import DatabaseSchemaService from 'services/DatabaseSchemaService';
import ConfirmDeletionDialog from './ConfirmDeletionDialog';
import DatabaseSchemaCreateDialog from './DatabaseSchemaCreateDialog';
import DatabaseSchemaUpdateDialog from './DatabaseSchemaUpdateDialog';
import { EnterModeThenConfirm } from './EnterModeThenConfirm';

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
  private databaseSchemaService = new DatabaseSchemaService();

  private schemaSelection: SchemaSelection = new SchemaSelection(
    new Selection({
      onSelectionChanged: () => {
        if (!this.state.deleteMode) {
          this.onUpdateRowClicked();
        } else {
          this.setState({});
        }
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
      this.schemaSelection.clear();
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
          <div className="styledTable">
            <SortableDetailsList
              columns={this.defaultColumns}
              filterView={this.filterDatabaseSchemaView}
              selectionMode={SelectionMode.multiple}
              filter={filter}
              isHeaderVisible={true}
              items={viewItems}
              selection={this.schemaSelection.getSelection()}
              shouldResetSort={shouldResetSort}
              onResetSort={this.onSchemaListSortReset}
              checkboxVisibility={
                deleteMode
                  ? CheckboxVisibility.always
                  : CheckboxVisibility.hidden
              }
            />
          </div>
        )}

        <DatabaseSchemaUpdateDialog
          schema={selectedSchema}
          clearSelectedSchema={this.onUpdateSchemaDialogClosed}
          onUpdate={onUpdate}
          onDelete={onDelete}
          databaseSchemaService={this.databaseSchemaService}
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

  private defaultColumns: IColumn[] = [
    {
      fieldName: 'type',
      isResizable: true,
      key: '0',
      maxWidth: 85,
      minWidth: 85,
      name: 'Type',
      iconName: ''
    },
    {
      fieldName: 'environment',
      isResizable: true,
      key: '1',
      maxWidth: 200,
      minWidth: 200,
      name: 'Miljø',
      iconName: ''
    },
    {
      fieldName: 'application',
      isResizable: true,
      key: '2',
      maxWidth: 200,
      minWidth: 200,
      name: 'Applikasjon',
      iconName: ''
    },
    {
      fieldName: 'discriminator',
      isResizable: true,
      key: '3',
      maxWidth: 200,
      minWidth: 200,
      name: 'Diskriminator',
      iconName: ''
    },
    {
      fieldName: 'createdDate',
      isResizable: true,
      key: '4',
      maxWidth: 90,
      minWidth: 90,
      name: 'Opprettet',
      iconName: ''
    },
    {
      fieldName: 'lastUsedDate',
      isResizable: true,
      key: '5',
      maxWidth: 90,
      minWidth: 90,
      name: 'Sist brukt',
      iconName: ''
    },
    {
      fieldName: 'sizeInMb',
      isResizable: true,
      key: '6',
      maxWidth: 110,
      minWidth: 110,
      name: 'Størrelse (MB)',
      iconName: ''
    },
    {
      fieldName: 'createdBy',
      isResizable: true,
      key: '7',
      maxWidth: 80,
      minWidth: 80,
      name: 'Bruker',
      iconName: ''
    },
    {
      fieldName: 'applicationDeploymentsUses',
      isResizable: true,
      key: '8',
      maxWidth: 70,
      minWidth: 70,
      name: 'I bruk av',
      iconName: ''
    },
    {
      fieldName: 'jdbcUrl',
      isResizable: true,
      key: '9',
      maxWidth: 280,
      minWidth: 280,
      name: 'JDBC url',
      iconName: '',
      className: 'jdbcurl-col'
    }
  ];

  private filterDatabaseSchemaView = (filter: string) => {
    return (v: IDatabaseSchemaView) =>
      v.createdBy.includes(filter) ||
      v.application.includes(filter) ||
      v.environment.includes(filter) ||
      v.discriminator.includes(filter) ||
      v.createdDate.includes(filter) ||
      (!v.lastUsedDate || v.lastUsedDate === null
        ? false
        : v.lastUsedDate.includes(filter)) ||
      v.sizeInMb.toString().includes(filter) ||
      v.type.includes(filter) ||
      v.jdbcUrl.includes(filter) ||
      v.id.includes(filter);
  };

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

export interface IDatabaseSchemaView {
  type: string;
  application: string;
  environment: string;
  discriminator: string;
  createdBy: string;
  createdDate: string;
  lastUsedDate?: string | null;
  sizeInMb: number;
  applicationDeploymentsUses: number;
  id: string;
  jdbcUrl: string;
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

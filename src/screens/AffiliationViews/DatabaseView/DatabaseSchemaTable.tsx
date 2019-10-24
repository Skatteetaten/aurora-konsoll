import React from 'react';

import styled from 'styled-components';
import TextField from 'aurora-frontend-react-komponenter/TextField';

import Spinner from 'components/Spinner';
import {
  CheckboxVisibility,
  IObjectWithKey,
  Selection,
  SelectionMode
} from 'office-ui-fabric-react/lib/DetailsList';
import { getLocalDate } from 'utils/date';

import SortableDetailsList from 'components/SortableDetailsList';
import { IUserAndAffiliations } from 'models/ApplicationDeployment';
import {
  ICreateDatabaseSchemaInput,
  ICreateDatabaseSchemaResponse,
  IDatabaseSchema,
  IDatabaseSchemas,
  IDatabaseSchemaView,
  IDeleteDatabaseSchemasResponse,
  IJdbcUser,
  IUpdateDatabaseSchemaInputWithCreatedBy
} from 'models/schemas';
import DatabaseSchemaService, {
  filterDatabaseSchemaView
} from 'services/DatabaseSchemaService';
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
  deleteSelectionIds: string[];
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
    deleteSelectionIds: [],
    hasDeletionInformation: false,
    shouldResetSort: false,
    confirmDeletionDialogVisible: false
  };
  private databaseSchemaService = new DatabaseSchemaService();

  private selection = new Selection({
    onSelectionChanged: () => {
      this.state.deleteMode
        ? this.onSelectRowClicked()
        : this.onUpdateRowClicked();
    }
  });

  public componentDidMount() {
    const { affiliation, onFetch } = this.props;
    this.handleFetchDatabaseSchemas();
    onFetch([affiliation]);
  }

  public componentDidUpdate(prevProps: ISchemaProps, prevState: ISchemaState) {
    const { affiliation, items, onFetch } = this.props;
    const { filter } = this.state;

    if (prevState.filter !== filter) {
      this.deselect();
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

  public onResetSort = () => {
    this.setState({
      shouldResetSort: false
    });
  };

  public handleFetchDatabaseSchemas = () => {
    const { items } = this.props;
    let viewItems: IDatabaseSchemaView[];

    if (items.databaseSchemas && items.databaseSchemas.length > 0) {
      viewItems = items.databaseSchemas.map(i => {
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
      });
    } else {
      viewItems = [];
    }
    this.setState({
      viewItems
    });
  };

  public createNewCopy = () => {
    const { selectedSchema } = this.state;
    this.setState({
      schemaToCopy: selectedSchema
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
      currentUser,
      deleteResponse,
      onDeleteSchemas
    } = this.props;
    const {
      filter,
      selectedSchema,
      schemaToCopy,
      deleteMode,
      deleteSelectionIds,
      hasDeletionInformation: hasDeletionResponse,
      viewItems,
      shouldResetSort,
      confirmDeletionDialogVisible
    } = this.state;

    const onCancelDeletionClick = () => {
      this.setState({
        hasDeletionInformation: false,
        confirmDeletionDialogVisible: false
      });
    };

    const onDeleteSelectionConfirmed = () => {
      this.setState({
        confirmDeletionDialogVisible: true
      });
    };

    const onConfirmDeletionClick = () => {
      if (deleteSelectionIds.length == 0) return;

      //onDeleteSchemas(deleteSelectionIds);
      this.deselect();
      this.setState({
        hasDeletionInformation: true,
        deleteSelectionIds: [],
        confirmDeletionDialogVisible: false
      });
    };

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
              confirmButtonEnabled={deleteSelectionIds.length > 0}
              confirmText="Slett valgte"
              inactiveIcon="Delete"
              inactiveText="Velg skjemaer for sletting"
              onEnterMode={this.onEnterDeletionMode}
              onExitMode={this.onExitDeletionMode}
              onConfirmClick={onDeleteSelectionConfirmed}
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
              columns={DatabaseSchemaService.DEFAULT_COLUMNS}
              filterView={filterDatabaseSchemaView}
              selectionMode={SelectionMode.multiple}
              filter={filter}
              isHeaderVisible={true}
              items={viewItems}
              selection={this.selection}
              shouldResetSort={shouldResetSort}
              onResetSort={this.onResetSort}
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
          clearSelectedSchema={this.clearSelectedSchema}
          onUpdate={onUpdate}
          onDelete={onDelete}
          databaseSchemaService={this.databaseSchemaService}
          onTestJdbcConnectionForId={onTestJdbcConnectionForId}
          testJdbcConnectionResponse={testJdbcConnectionResponse}
          createNewCopy={this.createNewCopy}
        />
        <ConfirmDeletionDialog
          title="Slett databaseskjemaer"
          visible={confirmDeletionDialogVisible}
          onOkClick={onConfirmDeletionClick}
          onCancelClick={onCancelDeletionClick}
          schemasToDelete={this.getSchemasToDeleteFromSelectedIds()}
        />
      </div>
    );
  }

  public getSchemasToDeleteFromSelectedIds = () => {
    const { items } = this.props;
    const { deleteSelectionIds } = this.state;

    if (!items.databaseSchemas) return [];

    return items.databaseSchemas.filter(
      (it: IDatabaseSchema) => deleteSelectionIds.indexOf(it.id) > -1
    );
  };

  private deselect = () => this.selection.setAllSelected(false);

  private onExitDeletionMode = () => {
    this.setState({
      deleteMode: false,
      deleteSelectionIds: []
    });
    this.deselect();
  };

  private onEnterDeletionMode = () => {
    this.setState({
      deleteMode: true
    });
  };

  private onFilterChange = (text: string) => {
    this.setState({
      filter: text
    });
  };

  private onSelectRowClicked = () => {
    const selected: IObjectWithKey[] = this.selection.getSelection();
    const selectedIds = (selected as IDatabaseSchema[]).map(it => it.id);
    this.setState({
      deleteSelectionIds: selectedIds
    });
  };

  private onUpdateRowClicked = () => {
    const { items } = this.props;
    const selected: IObjectWithKey[] = this.selection.getSelection();
    let selectedSchema;
    if (selected && selected.length > 0) {
      const selectedId = (selected[0] as IDatabaseSchema).id;
      selectedSchema =
        items.databaseSchemas &&
        items.databaseSchemas.find((i: IDatabaseSchema) => i.id === selectedId);
    }
    this.setState({
      selectedSchema
    });
  };
  private clearSelectedSchema = () => {
    this.selection.setAllSelected(false);
    this.setState({
      selectedSchema: undefined
    });
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

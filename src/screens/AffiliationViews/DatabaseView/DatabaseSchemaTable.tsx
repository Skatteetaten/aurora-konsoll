import * as React from 'react';

import styled from 'styled-components';

import ActionButton from 'aurora-frontend-react-komponenter/ActionButton';
import DetailsList from 'aurora-frontend-react-komponenter/DetailsList';
import TextField from 'aurora-frontend-react-komponenter/TextField';
import Spinner from 'components/Spinner';
import {
  CheckboxVisibility,
  IObjectWithKey,
  Selection,
  SelectionMode
} from 'office-ui-fabric-react/lib/DetailsList';
import { getLocalDate } from 'utils/date';

import ConfirmationDialog from 'components/ConfirmationDialog';
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
  defaultSortDirections,
  filterDatabaseSchemaView,
  SortDirection
} from 'services/DatabaseSchemaService';
import DatabaseSchemaCreateDialog from './DatabaseSchemaCreateDialog';
import DatabaseSchemaUpdateDialog from './DatabaseSchemaUpdateDialog';

export interface ISchemaProps {
  onFetch: (affiliations: string[]) => void;
  onUpdate: (databaseSchema: IUpdateDatabaseSchemaInputWithCreatedBy) => void;
  onDelete: (databaseSchema: IDatabaseSchema) => void;
  onCreate: (databaseSchema: ICreateDatabaseSchemaInput) => void;
  onDeleteSchemas: (ids: string[]) => IDeleteDatabaseSchemasResponse;
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
  columnSortDirections: SortDirection[];
  selectedColumnIndex: number;
  filter: string;
  selectedSchema?: IDatabaseSchema;
  deleteMode: boolean;
  deleteSelectionIds: string[];
  prevIndices: number[];
}

export class Schema extends React.Component<ISchemaProps, ISchemaState> {
  public state: ISchemaState = {
    viewItems: [],
    columnSortDirections: defaultSortDirections,
    selectedColumnIndex: -1,
    filter: '',
    selectedSchema: undefined,
    deleteMode: false,
    deleteSelectionIds: [],
    prevIndices: []
  };
  private selectedIndices: any[] = [];
  private databaseSchemaService = new DatabaseSchemaService();

  private selection = new Selection({
    onSelectionChanged: () => {
      this.state.deleteMode
        ? this.onSelectRowClicked()
        : this.onUpdateRowClicked();
    }
  });

  public sortByColumn = (
    ev: React.MouseEvent<HTMLElement>,
    column: {
      key: number;
      fieldName: string;
    }
  ): void => {
    const { viewItems, columnSortDirections } = this.state;
    const name = column.fieldName! as keyof any;

    const newSortDirections = defaultSortDirections;
    const prevSortDirection = columnSortDirections[column.key];

    if (this.databaseSchemaService.sortNextAscending(prevSortDirection)) {
      newSortDirections[column.key] = SortDirection.ASC;
    } else if (prevSortDirection === SortDirection.ASC) {
      newSortDirections[column.key] = SortDirection.DESC;
    }
    const sortedItems = this.databaseSchemaService.sortItems(
      viewItems,
      prevSortDirection,
      name
    );

    this.setState({
      viewItems: sortedItems,
      columnSortDirections: newSortDirections,
      selectedColumnIndex: column.key,
      prevIndices: this.selectedIndices
    });
  };

  public componentDidMount() {
    const { affiliation, onFetch } = this.props;
    this.handleFetchDatabaseSchemas();
    onFetch([affiliation]);
  }

  public toListIndex(index: number) {
    const viewItems = this.selection.getItems();
    const viewItem = viewItems[index];
    return this.state.viewItems.findIndex(listItem => listItem === viewItem);
  }

  public toViewIndex(index: number) {
    const listItem = this.state.viewItems[index];
    const viewIndex = this.selection
      .getItems()
      .findIndex(viewItem => viewItem === listItem);
    return viewIndex;
  }

  public currentSelected = () => {
    const newIndices = this.selection
      .getSelectedIndices()
      .map(index => this.toListIndex(index))
      .filter(index => this.selectedIndices.indexOf(index) === -1);

    const unselectedIndices = this.selection
      .getItems()
      .map((item, index) => index)
      .filter(index => this.selection.isIndexSelected(index) === false)
      .map(index => this.toListIndex(index));

    this.selectedIndices = this.selectedIndices.filter(
      index => unselectedIndices.indexOf(index) === -1
    );
    this.selectedIndices = [...this.selectedIndices, ...newIndices];
  };

  public updateCurrentSelection() {
    const intersection = this.state.prevIndices.filter(element =>
      this.selectedIndices.includes(element)
    );

    if (this.state.prevIndices.length > 0) {
      for (const i of this.state.prevIndices) {
        if (!intersection.includes(i)) {
          this.selection.setIndexSelected(i, false, false);
        }
      }
    }

    const indices = this.selectedIndices
      .map(index => this.toViewIndex(index))
      .filter(index => index !== -1);

    for (const i of indices) {
      if (!intersection.includes(i)) {
        this.selection.setIndexSelected(i, true, false);
      }
    }
  }

  public componentDidUpdate(prevProps: ISchemaProps) {
    const { affiliation, items, onFetch } = this.props;
    this.updateCurrentSelection();
    if (prevProps.items !== items) {
      this.handleFetchDatabaseSchemas();
    }
    if (
      prevProps.affiliation !== affiliation ||
      (prevProps.items.databaseSchemas.length === 0 &&
        items.databaseSchemas.length > 0)
    ) {
      onFetch([affiliation]);
      this.setState({
        filter: '',
        columnSortDirections: defaultSortDirections,
        selectedColumnIndex: -1
      });
    }
  }
  public handleFetchDatabaseSchemas = () => {
    const { items } = this.props;
    let viewItems: IDatabaseSchemaView[];

    if (items.databaseSchemas.length > 0) {
      viewItems = items.databaseSchemas.map(i => {
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
          createdBy: i.createdBy
        };
      });
    } else {
      viewItems = [];
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
      // onDeleteSchemas
    } = this.props;
    const {
      viewItems,
      selectedColumnIndex,
      columnSortDirections,
      filter,
      selectedSchema,
      deleteMode,
      deleteSelectionIds
    } = this.state;

    const filteredItems = viewItems.filter(filterDatabaseSchemaView(filter));

    this.currentSelected();

    const renderConfirmationOpenButton = (open: () => void) => (
      <ActionButton
        iconSize={ActionButton.LARGE}
        color="green"
        icon="Completed"
        style={{
          minWidth: '120px',
          marginLeft: '15px',
          float: 'left'
        }}
        onClick={open}
      >
        Slett valgte
      </ActionButton>
    );

    const renderConfirmationFooterButtons = (close: () => void) => {
      const deleteSchemas = () => {
        if (deleteSelectionIds.length > 0) {
          // tslint:disable-next-line:no-console
          console.log(deleteSelectionIds);
          // onDeleteSchemas(deleteSelectionIds);
          close();
        }
      };
      return (
        <>
          <ActionButton
            iconSize={ActionButton.LARGE}
            icon="Check"
            color="black"
            onClick={deleteSchemas}
          >
            Ja
          </ActionButton>

          <ActionButton
            onClick={close}
            iconSize={ActionButton.LARGE}
            icon="Cancel"
            color="black"
          >
            Nei
          </ActionButton>
        </>
      );
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
            {!deleteMode && (
              <ActionButton
                iconSize={ActionButton.LARGE}
                color="red"
                icon="Delete"
                style={{ minWidth: '120px', marginLeft: '15px', float: 'left' }}
                onClick={this.enterDeletionMode}
              >
                Slett skjemaer
              </ActionButton>
            )}
            {deleteMode && (
              <ConfirmationDialog
                title="Slett databaseskjema"
                text={this.getSelectionDetails()}
                renderOpenDialogButton={renderConfirmationOpenButton}
                renderFooterButtons={renderConfirmationFooterButtons}
              />
            )}
            {deleteMode && (
              <ActionButton
                iconSize={ActionButton.LARGE}
                color="red"
                icon="Cancel"
                style={{
                  minWidth: '120px',
                  float: 'left'
                }}
                onClick={this.exitDeletionMode}
              >
                Avbryt
              </ActionButton>
            )}
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
            />
          </div>
        </div>
        {isFetching ? (
          <Spinner />
        ) : (
          <div className="styledTable">
            <DetailsList
              columns={this.databaseSchemaService.createColumns(
                selectedColumnIndex,
                columnSortDirections[selectedColumnIndex]
              )}
              selectionMode={SelectionMode.multiple}
              items={filteredItems}
              onColumnHeaderClick={this.sortByColumn}
              selection={this.selection}
              checkboxVisibility={
                this.state.deleteMode
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
        />
      </div>
    );
  }

  private deselect = () => this.selection.setAllSelected(false);

  private exitDeletionMode = () => {
    this.setState({
      deleteMode: false,
      deleteSelectionIds: []
    });
    this.deselect();
  };

  private getSelectionDetails(): string {
    switch (this.state.deleteSelectionIds.length) {
      case 0:
        return 'Ingen skjemaer valgt';
      default:
        return `Vil du slette ${
          this.state.deleteSelectionIds.length
        } skjemaer?`;
    }
  }

  private enterDeletionMode = () => {
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
    if (selected.length > 0) {
      const selectedId = (selected[0] as IDatabaseSchema).id;
      selectedSchema = items.databaseSchemas.find(
        (i: IDatabaseSchema) => i.id === selectedId
      );
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
`;

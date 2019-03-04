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
  deletionDialogColumns,
  filterDatabaseSchemaView,
  selectedIndices,
  SortDirection
} from 'services/DatabaseSchemaService';
import { StyledPre } from '../DetailsView/InformationView/HealthResponseDialogSelector/utilComponents';
import ConfirmDeletionDialog from './ConfirmDeletionDialog';
import DatabaseSchemaCreateDialog from './DatabaseSchemaCreateDialog';
import DatabaseSchemaUpdateDialog from './DatabaseSchemaUpdateDialog';
import DeletionSummary from './DeletionSummary';

export const renderDeletionSchemaInfo = (extendedInfo: IDatabaseSchema[]) => (
  <StyledPre>
    <DetailsList
      columns={deletionDialogColumns}
      items={extendedInfo.map(it => ({
        application: it.application,
        environment: it.environment,
        discriminator: it.discriminator
      }))}
    />
  </StyledPre>
);

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
  extendedInfo: IDatabaseSchema[];
  hasDeletionInformation: boolean;
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
    prevIndices: [],
    extendedInfo: [],
    hasDeletionInformation: false
  };
  private databaseSchemaService = new DatabaseSchemaService();

  private selection = new Selection({
    onSelectionChanged: () => {
      this.state.deleteMode
        ? this.onSelectRowClicked()
        : this.onUpdateRowClicked();
    }
  });

  public filteredItems = () =>
    this.state.viewItems.filter(filterDatabaseSchemaView(this.state.filter));

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
      prevIndices: selectedIndices
    });
  };

  public componentDidMount() {
    const { affiliation, onFetch } = this.props;
    this.handleFetchDatabaseSchemas();
    onFetch([affiliation]);
  }

  public componentDidUpdate(prevProps: ISchemaProps, prevState: ISchemaState) {
    const { affiliation, items, onFetch } = this.props;
    const { prevIndices, filter } = this.state;

    if (prevState.filter !== filter) {
      this.deselect();
    }

    this.databaseSchemaService.updateCurrentSelection(
      this.selection,
      prevIndices,
      this.filteredItems()
    );

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

  public getDatabaseSchemaInfoById = () => {
    for (const id of this.state.deleteSelectionIds) {
      const foundId = this.props.items.databaseSchemas.find(
        (it: IDatabaseSchema) => it.id === id
      );
      if (foundId) {
        this.setState(prevState => ({
          extendedInfo: [...prevState.extendedInfo, foundId]
        }));
      }
    }
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
      onDeleteSchemas,
      items
    } = this.props;
    const {
      selectedColumnIndex,
      columnSortDirections,
      filter,
      selectedSchema,
      deleteMode,
      deleteSelectionIds,
      extendedInfo,
      hasDeletionInformation
    } = this.state;

    this.databaseSchemaService.currentSelection(
      this.selection,
      this.filteredItems()
    );

    const renderConfirmationOpenButton = (open: () => void) => {
      const onClick = () => {
        open();
        this.getDatabaseSchemaInfoById();
      };

      return (
        <ActionButton
          iconSize={ActionButton.LARGE}
          color="green"
          icon="Completed"
          style={{
            minWidth: '120px',
            marginLeft: '15px',
            float: 'left'
          }}
          onClick={onClick}
          disabled={!(deleteSelectionIds.length > 0)}
        >
          Slett valgte
        </ActionButton>
      );
    };

    const renderConfirmationFooterButtons = (close: () => void) => {
      const onExit = () => {
        onCancel();
        onFetch([affiliation]);
      };

      const onCancel = () => {
        this.setState({
          extendedInfo: [],
          hasDeletionInformation: false
        });
        close();
      };

      const deleteSchemas = () => {
        if (deleteSelectionIds.length > 0) {
          onDeleteSchemas(deleteSelectionIds);
          this.setState({
            extendedInfo: [],
            hasDeletionInformation: true
          });
        }
      };
      return (
        <>
          {hasDeletionInformation ? (
            <ActionButton
              onClick={onExit}
              iconSize={ActionButton.LARGE}
              color="black"
            >
              Avslutt
            </ActionButton>
          ) : (
            <>
              <ActionButton
                onClick={deleteSchemas}
                iconSize={ActionButton.LARGE}
                icon="Check"
                color="black"
              >
                Ja
              </ActionButton>
              <ActionButton
                onClick={onCancel}
                iconSize={ActionButton.LARGE}
                icon="Cancel"
                color="black"
              >
                Nei
              </ActionButton>
            </>
          )}
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
                Velg skjemaer for sletting
              </ActionButton>
            )}
            {deleteMode && (
              <ConfirmDeletionDialog
                title="Slett databaseskjemaer"
                renderOpenDialogButton={renderConfirmationOpenButton}
                renderFooterButtons={renderConfirmationFooterButtons}
                isBlocking={true}
              >
                {extendedInfo &&
                  (hasDeletionInformation ? (
                    <DeletionSummary
                      deleteResponse={deleteResponse}
                      items={items}
                    />
                  ) : (
                    <>
                      {renderDeletionSchemaInfo(extendedInfo)}
                      <h4>{this.getSelectionDetails()}</h4>
                    </>
                  ))}
              </ConfirmDeletionDialog>
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
              items={this.filteredItems()}
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
      case 1:
        return `Vil du slette dette skjemaet?`;
      default:
        return `Vil du slette disse ${
          this.state.deleteSelectionIds.length
        } skjemaene?`;
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

import * as React from 'react';

import styled from 'styled-components';

import ActionButton from '@skatteetaten/frontend-components/ActionButton';
import DetailsList from '@skatteetaten/frontend-components/DetailsList';
import TextField from '@skatteetaten/frontend-components/TextField';

import Spinner from 'components/Spinner';
import {
  CheckboxVisibility,
  IObjectWithKey,
  Selection,
  SelectionMode
} from 'office-ui-fabric-react/lib-commonjs';
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
import DeletionSummary from './DeletionSummary';
import { StyledPre } from 'components/StyledPre';
import { TextFieldEvent } from 'types/react';

export const renderDetailsListWithSchemaInfo = (schemas: IDatabaseSchema[]) => (
  <StyledPre>
    <DetailsList
      columns={DatabaseSchemaService.DELETION_COLUMNS}
      items={schemas.map(it => ({
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
  extendedInfo: IDatabaseSchema[];
  hasDeletionInformation: boolean;
  shouldResetSort: boolean;
}

export class Schema extends React.Component<ISchemaProps, ISchemaState> {
  public state: ISchemaState = {
    viewItems: [],
    filter: '',
    selectedSchema: undefined,
    schemaToCopy: undefined,
    deleteMode: false,
    deleteSelectionIds: [],
    extendedInfo: [],
    hasDeletionInformation: false,
    shouldResetSort: false
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

  public getDatabaseSchemaInfoById = () => {
    const { items } = this.props;
    const { deleteSelectionIds } = this.state;
    for (const id of deleteSelectionIds) {
      const foundId =
        items.databaseSchemas &&
        items.databaseSchemas.find((it: IDatabaseSchema) => it.id === id);
      if (foundId) {
        this.setState(prevState => ({
          extendedInfo: [...prevState.extendedInfo, foundId]
        }));
      }
    }
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
      onDeleteSchemas,
      items
    } = this.props;
    const {
      filter,
      selectedSchema,
      schemaToCopy,
      deleteMode,
      deleteSelectionIds,
      extendedInfo,
      hasDeletionInformation: hasDeletionResponse,
      viewItems,
      shouldResetSort
    } = this.state;

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
          this.deselect();
          this.setState({
            extendedInfo: [],
            hasDeletionInformation: true,
            deleteSelectionIds: []
          });
        }
      };
      return (
        <>
          {hasDeletionResponse ? (
            <ActionButton
              onClick={onExit}
              iconSize={ActionButton.LARGE}
              icon="Completed"
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
                onChange={this.onFilterChange}
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
                {hasDeletionResponse ? (
                  <DeletionSummary
                    deleteResponse={deleteResponse}
                    items={items}
                  />
                ) : (
                  <>
                    {renderDetailsListWithSchemaInfo(extendedInfo)}
                    <h4>
                      {this.databaseSchemaService.getSelectionDetails(
                        deleteSelectionIds
                      )}
                    </h4>
                  </>
                )}
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

  private enterDeletionMode = () => {
    this.setState({
      deleteMode: true
    });
  };

  private onFilterChange = (event: TextFieldEvent, newValue?: string) => {
    this.setState({
      filter: newValue || ''
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

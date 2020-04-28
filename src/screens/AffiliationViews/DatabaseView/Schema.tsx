import React from 'react';

import styled from 'styled-components';
import TextField from '@skatteetaten/frontend-components/TextField';

import Spinner from 'components/Spinner';

import { Selection } from 'office-ui-fabric-react/lib-commonjs';
import { IUserAndAffiliations } from 'models/ApplicationDeployment';
import {
  ICreateDatabaseSchemaInput,
  ICreateDatabaseSchemaResponse,
  IDatabaseSchema,
  IDatabaseSchemas,
  IDeleteDatabaseSchemasResponse,
  IJdbcUser,
  IUpdateDatabaseSchemaInputWithCreatedBy,
  IDatabaseInstances,
  ITestJDBCResponse
} from 'models/schemas';
import ConfirmDeletionDialog from './ConfirmDeletionDialog';
import DatabaseSchemaCreateDialog from './DatabaseSchemaCreateDialog';
import DatabaseSchemaUpdateDialog from './DatabaseSchemaUpdateDialog';
import { EnterModeThenConfirm } from './EnterModeThenConfirm';
import {
  DatabaseSchemaTable,
  IDatabaseSchemaView
} from './DatabaseSchemaTable';
import { TextFieldEvent } from 'types/react';
import { StyledPre } from 'components/StyledPre';
import { DetailsList } from 'office-ui-fabric-react/lib-commonjs';

export const renderDetailsListWithSchemaInfo = (schemas: IDatabaseSchema[]) => (
  <StyledPre>
    <DetailsList
      columns={[
        {
          key: 'column1',
          name: 'Applikasjon',
          fieldName: 'application',
          minWidth: 200,
          maxWidth: 200,
          isResizable: true
        },
        {
          key: 'column2',
          name: 'Miljø',
          fieldName: 'environment',
          minWidth: 200,
          maxWidth: 200,
          isResizable: true
        },
        {
          key: 'column3',
          name: 'Diskriminator',
          fieldName: 'discriminator',
          minWidth: 200,
          maxWidth: 200,
          isResizable: true
        }
      ]}
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
  onFetchInstances: (affiliation: string) => void;
  onUpdate: (databaseSchema: IUpdateDatabaseSchemaInputWithCreatedBy) => void;
  onDelete: (databaseSchema: IDatabaseSchema) => void;
  onCreate: (databaseSchema: ICreateDatabaseSchemaInput) => void;
  onDeleteSchemas: (ids: string[]) => void;
  onTestJdbcConnectionForId: (id: string) => void;
  onTestJdbcConnectionForIdV2: (id: string) => void;
  onTestJdbcConnectionForUser: (jdbcUser: IJdbcUser) => void;
  onTestJdbcConnectionForUserV2: (jdbcUser: IJdbcUser) => void;
  items: IDatabaseSchemas;
  instances: IDatabaseInstances;
  createResponse: ICreateDatabaseSchemaResponse;
  isFetching: boolean;
  updateResponse: boolean;
  affiliation: string;
  className?: string;
  testJdbcConnectionResponse: boolean;
  testJdbcConnectionResponseV2: ITestJDBCResponse;
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
  shouldResetSort: boolean;
}

export class Schema extends React.Component<ISchemaProps, ISchemaState> {
  public state: ISchemaState = {
    filter: '',
    selectedSchema: undefined,
    schemaToCopy: undefined,
    deleteMode: false,
    hasDeletionInformation: false,
    confirmDeletionDialogVisible: false,
    shouldResetSort: false
  };

  public componentDidMount() {
    const { affiliation, onFetch, onFetchInstances } = this.props;
    onFetch([affiliation]);
    onFetchInstances(affiliation);
  }

  public componentDidUpdate(prevProps: ISchemaProps) {
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
        filter: '',
        shouldResetSort: true
      });
    }
  }

  public selection = new Selection({
    onSelectionChanged: () => {
      if (this.state.deleteMode) {
        this.onSchemaSelectionChange();
      } else {
        this.onSingleSchemaSelected();
      }
    }
  });

  public onResetSort = () => {
    this.setState({
      shouldResetSort: false
    });
  };

  public render() {
    const {
      isFetching,
      className,
      onUpdate,
      onDelete,
      onTestJdbcConnectionForId,
      onTestJdbcConnectionForIdV2,
      testJdbcConnectionResponse,
      testJdbcConnectionResponseV2,
      onCreate,
      createResponse,
      affiliation,
      onTestJdbcConnectionForUser,
      onTestJdbcConnectionForUserV2,
      onFetch,
      currentUser,
      deleteResponse,
      items,
      instances
    } = this.props;
    const {
      filter,
      selectedSchema,
      selectedSchemas,
      schemaToCopy,
      deleteMode,
      confirmDeletionDialogVisible,
      hasDeletionInformation,
      shouldResetSort
    } = this.state;

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
              onTestJdbcConnectionForUserV2={onTestJdbcConnectionForUserV2}
              testJdbcConnectionResponseV2={testJdbcConnectionResponseV2}
              onFetch={onFetch}
              currentUser={currentUser}
              isFetching={isFetching}
              initialDatabaseSchemaInput={schemaToCopy}
              instances={instances}
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
            selection={this.selection}
            onResetSort={this.onResetSort}
            shouldResetSort={shouldResetSort}
          />
        )}
        <DatabaseSchemaUpdateDialog
          schema={selectedSchema}
          clearSelectedSchema={this.onUpdateSchemaDialogClosed}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onTestJdbcConnectionForIdV2={onTestJdbcConnectionForIdV2}
          testJdbcConnectionResponseV2={testJdbcConnectionResponseV2}
          createNewCopy={this.onCreateCopyConfirmed}
        />
        <ConfirmDeletionDialog
          title="Slett databaseskjemaer"
          visible={confirmDeletionDialogVisible}
          onOkClick={this.onConfirmDeletionClick}
          onCancelClick={this.onCancelDeletionClick}
          onExitClick={this.onExitDeletionClick}
          schemasToDelete={this.state.selectedSchemas || []}
          hasDeletionInformation={hasDeletionInformation}
          deleteResponse={deleteResponse}
          items={items}
        />
      </div>
    );
  }

  private onCancelDeletionClick = () => {
    this.setState({
      hasDeletionInformation: false,
      confirmDeletionDialogVisible: false
    });
  };

  private onExitDeletionClick = () => {
    const { affiliation, onFetch } = this.props;
    onFetch([affiliation]);
  };

  private onDeleteSelectionConfirmed = () => {
    this.setState({ confirmDeletionDialogVisible: true });
  };

  private onConfirmDeletionClick = () => {
    const { selectedSchemas } = this.state;
    const { onDeleteSchemas } = this.props;
    if (selectedSchemas && selectedSchemas?.map(it => it.id).length > 0) {
      const dbIds = selectedSchemas?.map(it => it.id);

      onDeleteSchemas(dbIds);
      this.selection.setAllSelected(false);
      this.setState({
        hasDeletionInformation: true,
        confirmDeletionDialogVisible: false
      });
    }
  };

  private onExitDeletionMode = () => {
    this.setState({
      deleteMode: false,
      selectedSchemas: []
    });
    this.selection.setAllSelected(false);
  };

  private onEnterDeletionMode = () => {
    this.setState({ deleteMode: true });
  };

  private onFilterChange = (event: TextFieldEvent, newValue?: string) => {
    if (newValue && newValue !== this.state.filter) {
      this.selection.setAllSelected(false);
    }
    this.setState({ filter: newValue || '' });
  };

  private onCreateCopyConfirmed = () => {
    const { selectedSchema } = this.state;
    this.setState({ schemaToCopy: selectedSchema });
  };

  private onUpdateSchemaDialogClosed = () => {
    this.selection.setAllSelected(false);
    this.setState({ selectedSchema: undefined });
  };

  private onSchemaSelectionChange = () => {
    const selected: IDatabaseSchemaView[] = this.selection
      .getSelection()
      .map(it => it as IDatabaseSchemaView);
    const databaseSchemas = this.props.items.databaseSchemas || [];
    const selectedSchemas = databaseSchemas.filter(
      schema => selected.find(it => it.id === schema.id) !== undefined
    );

    this.setState({ selectedSchemas });
  };

  private onSingleSchemaSelected = () => {
    const selected: IDatabaseSchemaView = this.selection
      .getSelection()
      .map(it => it as IDatabaseSchemaView)[0];
    if (!selected) return;
    const databaseSchemas = this.props.items.databaseSchemas || [];
    const selectedSchema = databaseSchemas.find(
      schema => schema.id === selected.id
    );

    if (selectedSchema) this.setState({ selectedSchema });
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

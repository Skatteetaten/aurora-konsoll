import React, { useEffect, useState } from 'react';
import { Selection } from 'office-ui-fabric-react/lib-commonjs';
import styled from 'styled-components';
import TextField from '@skatteetaten/frontend-components/TextField';
import { TextFieldEvent } from '../../../types/react';
import {
  IDatabaseSchema,
  IRestorableDatabaseSchemas,
  IRestorableDatabaseSchema,
  IRestorableDatabaseSchemaData,
  IUpdateDatabaseSchemaInputWithCreatedBy,
  IJdbcUser,
  ITestJDBCResponse
} from '../../../models/schemas';
import { EnterModeThenConfirm } from './EnterModeThenConfirm';
import Spinner from 'components/Spinner';
import {
  RestorableDatabaseSchemaTable,
  IRestorableDatabaseSchemaView
} from './RestorableDatabaseSchemaTable';
import RestorableDatabaseSchemaUpdateDialog from './RestorableDatabaseSchemaUpdateDialog';
import LoadingButton from 'components/LoadingButton';

export interface IRestorableSchemaProps {
  className?: string;
  affiliation: string;
  isFetching: boolean;
  items: IRestorableDatabaseSchemas;
  testJdbcConnectionResponse: ITestJDBCResponse;
  onFetch: (affiliation: string[]) => void | undefined;
  onUpdate: (databaseSchema: IUpdateDatabaseSchemaInputWithCreatedBy) => void; //TODO mulig feil type her
  onRestore: (databaseSchema: IRestorableDatabaseSchema) => void;
  onTestJdbcConnectionForId: (id: string) => void;
  onTestJdbcConnectionForUser: (jdbcUser: IJdbcUser) => void;
}

interface IRestorableSchemaState {
  filter: string;
  selectedSchema?: IRestorableDatabaseSchemaData;
  selectedSchemas?: IRestorableDatabaseSchemaData[];
  restoreMode: boolean;
  confirmDeletionDialogVisible: boolean;
  shouldResetSort: boolean;
}

export class RestorableSchema extends React.Component<
  IRestorableSchemaProps,
  IRestorableSchemaState
> {
  public state: IRestorableSchemaState = {
    filter: '',
    selectedSchema: undefined,
    restoreMode: false,
    confirmDeletionDialogVisible: false,
    shouldResetSort: false
  };

  public componentDidMount() {
    const { affiliation, onFetch } = this.props;
    onFetch([affiliation]);
  }

  public onFilterChange = (event: TextFieldEvent, newValue?: string) => {
    this.setState({ filter: newValue || '' });
  };

  public onResetSort = () => {
    this.setState({
      shouldResetSort: false
    });
  };

  public closeAndFetch = () => {
    this.props.onFetch([this.props.affiliation]);
  };

  private onUpdateSchemaDialogClosed = () => {
    this.selection.setAllSelected(false);
    this.setState({ selectedSchema: undefined });
  };

  private onExitRestorationMode = () => {
    this.setState({
      restoreMode: false,
      selectedSchemas: []
    });
    this.selection.setAllSelected(false);
  };

  public onEnterRestorationMode = () => {
    this.setState({ restoreMode: true });
  };

  public onSchemaSelectionChange = () => {
    const selected: IRestorableDatabaseSchemaView[] = this.selection
      .getSelection()
      .map(it => it as IRestorableDatabaseSchemaView);
    const databaseSchemas = this.props.items.restorableDatabaseSchemas || [];
    const selectedSchemas = databaseSchemas.filter(
      schema =>
        selected.find(it => it.id === schema.databaseSchema.id) !== undefined
    );

    this.setState({ selectedSchemas });
  };

  public onSingleSchemaSelected = () => {
    const selected: IRestorableDatabaseSchemaView = this.selection
      .getSelection()
      .map(it => it as IRestorableDatabaseSchemaView)[0];
    if (!selected) return;
    const databaseSchemas = this.props.items.restorableDatabaseSchemas || [];
    const selectedSchema = databaseSchemas.find(
      schema => schema.databaseSchema.id === selected.id
    );
    if (selectedSchema) this.setState({ selectedSchema });
  };

  public onRestoreSelectionConfirmed = () => {};
  public selection = new Selection({
    onSelectionChanged: () => {
      if (this.state.restoreMode) {
        this.onSchemaSelectionChange();
      } else {
        this.onSingleSchemaSelected();
      }
    }
  });
  public render() {
    const {
      isFetching,
      className,
      onUpdate,
      onRestore,
      affiliation,
      onFetch,
      items,
      onTestJdbcConnectionForId,
      onTestJdbcConnectionForUser,
      testJdbcConnectionResponse
    } = this.props;
    const {
      filter,
      selectedSchema,
      selectedSchemas,
      restoreMode,
      confirmDeletionDialogVisible,
      shouldResetSort
    } = this.state;
    return (
      <div className={className}>
        <div className="styled-action-bar">
          <div className="styled-input-and-restore">
            <div className="styled-input">
              <TextField
                placeholder="Søk etter skjema"
                onChange={this.onFilterChange}
                value={filter}
              />
            </div>
            <EnterModeThenConfirm
              confirmButtonEnabled={[].length !== 0}
              confirmText="Gjennopprett valgte"
              inactiveIcon="History"
              inactiveText="Velg skjemaer for gjenoppretting"
              onEnterMode={this.onEnterRestorationMode}
              onExitMode={this.onExitRestorationMode}
              onConfirmClick={this.onRestoreSelectionConfirmed}
              iconColor="green"
            />
          </div>
          <div style={{marginRight: '20px'}}>
            <LoadingButton
              icon="Update"
              style={{ minWidth: '141px', marginLeft: '15px' }}
              loading={isFetching}
              onClick={this.closeAndFetch}
            >
              Oppdater
            </LoadingButton>
          </div>
        </div>
        {isFetching ? (
          <Spinner />
        ) : (
          <RestorableDatabaseSchemaTable
            filter={filter}
            schemas={items.restorableDatabaseSchemas || []}
            multiSelect={restoreMode}
            selection={this.selection}
            onResetSort={this.onResetSort}
            shouldResetSort={shouldResetSort}
          />
        )}
        <RestorableDatabaseSchemaUpdateDialog
          schema={selectedSchema}
          clearSelectedSchema={this.onUpdateSchemaDialogClosed}
          onUpdate={onUpdate}
          onDelete={onRestore}
          onTestJdbcConnectionForId={onTestJdbcConnectionForId}
          testJdbcConnectionResponse={testJdbcConnectionResponse}
        />
      </div>
    );
  }
}
export default styled(RestorableSchema)`
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

  .styled-input-and-restore {
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

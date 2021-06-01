import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import TextField from '@skatteetaten/frontend-components/TextField';
import { TextFieldEvent } from 'types/react';
import {
  IRestorableDatabaseSchemas,
  IDatabaseSchemaData,
  IUpdateDatabaseSchemaInputWithCreatedBy,
  ITestJDBCResponse,
  IChangeCooldownDatabaseSchemasResponse,
  IDatabaseSchema,
} from 'models/schemas';
import { EnterModeThenConfirm } from './EnterModeThenConfirm';
import {
  DatabaseSchemaTable,
  IDatabaseSchemaView,
} from './DatabaseSchemaTable';
import DatabaseSchemaUpdateDialog from './DatabaseSchemaUpdateDialog';
import LoadingButton from 'components/LoadingButton';
import ConfirmChangeCooldownDialog from './ConfirmChangeCooldownDialog';
import DetailsList from '@skatteetaten/frontend-components/DetailsList';
import { SpinnerSize } from '@fluentui/react';
import Spinner from '@skatteetaten/frontend-components/Spinner';

export interface IRestorableSchemaProps {
  className?: string;
  affiliation: string;
  isFetching: boolean;
  items: IRestorableDatabaseSchemas;
  testJdbcConnectionResponse: ITestJDBCResponse;
  restoreResponse: IChangeCooldownDatabaseSchemasResponse;
  onFetch: (affiliation: string[]) => void | undefined;
  onUpdate: (databaseSchema: IUpdateDatabaseSchemaInputWithCreatedBy) => void;
  onTestJdbcConnectionForId: (id: string) => void;
  onRestoreDatabaseSchemas: (ids: string[], active: boolean) => void;
  onRestoreDatabaseSchema: (
    databaseSchema: IDatabaseSchema,
    active: boolean
  ) => void;
}

// TODO: AOS-4750 Combine or refactor with Schema.tsx
export const RestorableSchema: React.FC<IRestorableSchemaProps> = ({
  className,
  affiliation,
  isFetching,
  items,
  testJdbcConnectionResponse,
  restoreResponse,
  onFetch,
  onUpdate,
  onRestoreDatabaseSchemas,
  onRestoreDatabaseSchema,
  onTestJdbcConnectionForId,
}) => {
  const [filter, setFilter] = useState('');
  const [selectedSchema, setSelectedSchema] = useState<
    IDatabaseSchemaData | undefined
  >(undefined);
  const [selectedSchemas, setSelectedSchemas] = useState<IDatabaseSchemaData[]>(
    []
  );

  const [selectedDetailsListItems, setSelectedDetailsListItems] = useState<
    IDatabaseSchemaView[] | undefined
  >(undefined);
  const [restoreMode, setRestoreMode] = useState(false);

  const [shouldResetSort, setShouldResetSort] = useState(false);
  const [
    confirmRestorationDialogVisible,
    setConfirmRestorationDialogVisible,
  ] = useState(false);
  const [hasRestorationInformation, setHasRestorationInformation] = useState(
    false
  );

  const selection = useMemo(
    () =>
      new DetailsList.Selection({
        onSelectionChanged: () => {
          setSelectedDetailsListItems(
            selection.getSelection().map((it) => it as IDatabaseSchemaView)
          );
        },
      }),
    []
  );

  useEffect(() => {
    onFetch([affiliation]);
    setFilter('');
    setShouldResetSort(true);
  }, [affiliation, onFetch]);

  const onFilterChange = (event: TextFieldEvent, newValue?: string) => {
    setFilter(newValue || '');
  };

  const onResetSort = () => {
    setShouldResetSort(false);
  };

  const closeAndFetch = () => {
    onFetch([affiliation]);
  };

  const onUpdateSchemaDialogClosed = () => {
    selection.setAllSelected(false);
    setSelectedSchema(undefined);
  };

  useEffect(() => {
    const onSchemaSelectionChange = () => {
      if (selectedDetailsListItems) {
        const databaseSchemas = items.restorableDatabaseSchemas || [];
        const selectedSchemas = databaseSchemas.filter(
          (schema) =>
            selectedDetailsListItems.find(
              (it) => it.id === schema.databaseSchema.id
            ) !== undefined
        );

        setSelectedSchemas(selectedSchemas);
      }
    };
    const onSingleSchemaSelected = () => {
      if (selectedDetailsListItems && selectedDetailsListItems[0]) {
        const databaseSchemas = items.restorableDatabaseSchemas || [];
        const selectedSchema = databaseSchemas.find(
          (schema) =>
            schema.databaseSchema.id === selectedDetailsListItems[0].id
        );
        if (selectedSchema) setSelectedSchema(selectedSchema);
      }
    };

    if (selectedDetailsListItems) {
      restoreMode ? onSchemaSelectionChange() : onSingleSchemaSelected();
    }
  }, [items, selectedDetailsListItems, restoreMode]);

  const onExitRestorationMode = () => {
    selection.setAllSelected(false);
    setSelectedDetailsListItems(undefined);
    setSelectedSchemas([]);
    setRestoreMode(false);
  };

  const onEnterRestorationMode = () => {
    selection.setAllSelected(false);
    setSelectedDetailsListItems(undefined);
    setSelectedSchema(undefined);
    setRestoreMode(true);
  };

  const onCancelRestorationClick = () => {
    setHasRestorationInformation(false);
    setConfirmRestorationDialogVisible(false);
  };

  const onExitRestorationClick = () => onFetch([affiliation]);

  const onConfirmRestorationClick = () => {
    if (
      selectedSchemas &&
      selectedSchemas?.map((it) => it.databaseSchema.id).length > 0
    ) {
      const dbIds = selectedSchemas?.map((it) => it.databaseSchema.id);

      onRestoreDatabaseSchemas(dbIds, true);
      selection.setAllSelected(false);
      setHasRestorationInformation(true);
      setConfirmRestorationDialogVisible(false);
    }
  };

  const onRestoreSelectionConfirmed = () =>
    setConfirmRestorationDialogVisible(true);

  return (
    <div className={className}>
      <div className="styled-action-bar">
        <div className="styled-input-and-restore">
          <div className="styled-input">
            <TextField
              placeholder="Søk etter skjema"
              onChange={onFilterChange}
              value={filter}
            />
          </div>
          <EnterModeThenConfirm
            confirmButtonEnabled={selectedSchemas.length !== 0}
            confirmText="Gjennopprett valgte"
            inactiveIcon="LockOutlineOpen"
            inactiveText="Velg skjemaer for gjenoppretting"
            onEnterMode={onEnterRestorationMode}
            onExitMode={onExitRestorationMode}
            onConfirmClick={onRestoreSelectionConfirmed}
            iconColor="green"
          />
        </div>
        <div style={{ marginRight: '20px' }}>
          <LoadingButton
            icon="Update"
            style={{ minWidth: '141px', marginLeft: '15px' }}
            loading={isFetching}
            onClick={closeAndFetch}
          >
            Oppdater
          </LoadingButton>
        </div>
      </div>
      {isFetching ? (
        <Spinner size={SpinnerSize.large} />
      ) : (
        <DatabaseSchemaTable
          filter={filter}
          schemas={items.restorableDatabaseSchemas || []}
          selection={selection}
          multiSelect={restoreMode}
          onResetSort={onResetSort}
          shouldResetSort={shouldResetSort}
          isRestoreTable={true}
          selectedSchemas={selectedSchemas}
        />
      )}
      <DatabaseSchemaUpdateDialog
        schema={selectedSchema?.databaseSchema}
        clearSelectedSchema={onUpdateSchemaDialogClosed}
        onUpdate={onUpdate}
        onTestJdbcConnectionForId={onTestJdbcConnectionForId}
        testJdbcConnectionResponse={testJdbcConnectionResponse}
        onChangeCooldownSchema={(schema) =>
          onRestoreDatabaseSchema(schema, true)
        }
        isRestoreDialog={true}
      />
      <ConfirmChangeCooldownDialog
        title="Gjenopprett databaseskjemaer"
        visible={confirmRestorationDialogVisible}
        changeCooldownType="gjenopprette"
        onOkClick={onConfirmRestorationClick}
        onCancelClick={onCancelRestorationClick}
        onExitClick={onExitRestorationClick}
        schemasToChange={selectedSchemas?.map((it) => it.databaseSchema) || []}
        hasChangeInformation={hasRestorationInformation}
        changeCooldownResponse={restoreResponse}
        items={{
          databaseSchemas: items.restorableDatabaseSchemas?.map(
            (it) => it.databaseSchema
          ),
        }}
      />
    </div>
  );
};

export default styled(RestorableSchema)`
  flex: 1;
  display: flex;
  flex-direction: column;
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
    display: flex;
    align-items: center;
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

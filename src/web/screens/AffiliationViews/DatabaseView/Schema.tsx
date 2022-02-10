import React, { useEffect, useMemo, useState } from 'react';

import styled from 'styled-components';
import { TextField } from '@skatteetaten/frontend-components/TextField';
import { DetailsList } from '@skatteetaten/frontend-components/DetailsList';
import { Spinner } from '@skatteetaten/frontend-components/Spinner';

import { IUserAndAffiliations } from 'web/models/ApplicationDeployment';
import {
  IChangeCooldownDatabaseSchemasResponse,
  ICreateDatabaseSchemaInput,
  ICreateDatabaseSchemaResponse,
  IDatabaseInstances,
  IDatabaseSchema,
  IDatabaseSchemaData,
  IDatabaseSchemasWithPageInfo,
  IJdbcUser,
  ITestJDBCResponse,
  IUpdateDatabaseSchemaInputWithCreatedBy,
} from 'web/models/schemas';
import DatabaseSchemaCreateDialog from './DatabaseSchemaCreateDialog';
import { EnterModeThenConfirm } from './EnterModeThenConfirm';
import { TextFieldEvent } from 'web/types/react';
import { StyledPre } from 'web/components/StyledPre';
import ConfirmChangeCooldownDialog from './ConfirmChangeCooldownDialog';
import {
  DatabaseSchemaTable,
  IDatabaseSchemaView,
} from './DatabaseSchemaTable';
import DatabaseSchemaUpdateDialog from './DatabaseSchemaUpdateDialog';
import { ScrollablePane, SpinnerSize } from '@fluentui/react';
import LoadingButton from 'web/components/LoadingButton';

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
          isResizable: true,
        },
        {
          key: 'column2',
          name: 'Miljø',
          fieldName: 'environment',
          minWidth: 200,
          maxWidth: 200,
          isResizable: true,
        },
        {
          key: 'column3',
          name: 'Diskriminator',
          fieldName: 'discriminator',
          minWidth: 200,
          maxWidth: 200,
          isResizable: true,
        },
      ]}
      items={schemas.map((it) => ({
        application: it.application,
        environment: it.environment,
        discriminator: it.discriminator,
      }))}
    />
  </StyledPre>
);

export interface ISchemaProps {
  onFetch: (affiliations: string[]) => void;
  onFetchNext: (
    affiliations: string[],
    databaseSchemas: IDatabaseSchema[],
    endCursor: string
  ) => void;
  onFetchInstances: (affiliation: string) => void;
  onUpdate: (databaseSchema: IUpdateDatabaseSchemaInputWithCreatedBy) => void;
  onDelete: (databaseSchema: IDatabaseSchema) => void;
  onCreate: (databaseSchema: ICreateDatabaseSchemaInput) => void;
  onDeleteSchemas: (ids: string[]) => void;
  onTestJdbcConnectionForId: (id: string) => void;
  onTestJdbcConnectionForUser: (jdbcUser: IJdbcUser) => void;
  items: IDatabaseSchemasWithPageInfo;
  instances: IDatabaseInstances;
  createResponse: ICreateDatabaseSchemaResponse;
  isFetching: boolean;
  isFetchingNext: boolean;
  affiliation: string;
  className?: string;
  testJdbcConnectionResponse: ITestJDBCResponse;
  currentUser: IUserAndAffiliations;
  deleteResponse: IChangeCooldownDatabaseSchemasResponse;
}

const Schema: React.FC<ISchemaProps> = ({
  className,
  deleteResponse,
  onTestJdbcConnectionForId,
  onTestJdbcConnectionForUser,
  onUpdate,
  onFetch,
  testJdbcConnectionResponse,
  items,
  isFetching,
  affiliation,
  currentUser,
  createResponse,
  instances,
  onCreate,
  onDelete,
  onDeleteSchemas,
  onFetchInstances,
  onFetchNext,
  isFetchingNext,
}) => {
  const [filter, setFilter] = useState('');
  const [selectedSchema, setSelectedSchema] = useState<
    IDatabaseSchema | undefined
  >(undefined);
  const [databaseSchemasData, setDatabaseSchemasData] = useState<
    IDatabaseSchemaData[]
  >([]);
  const [selectedSchemas, setSelectedSchemas] = useState<IDatabaseSchema[]>([]);
  const [selectedDetailsListItems, setSelectedDetailsListItems] = useState<
    IDatabaseSchemaView[] | undefined
  >(undefined);
  const [schemaToCopy, setSchemaToCopy] = useState<IDatabaseSchema | undefined>(
    undefined
  );
  const [deleteMode, setDeleteMode] = useState(false);
  const [hasDeletionInformation, setHasDeletionInformation] = useState(false);
  const [confirmDeletionDialogVisible, setConfirmDeletionDialogVisible] =
    useState(false);
  const [shouldResetSort, setShouldResetSort] = useState(false);

  useEffect(() => {
    onFetch([affiliation]);
    onFetchInstances(affiliation);
  }, [onFetch, onFetchInstances, affiliation]);

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
    const onSchemaSelectionChange = () => {
      if (selectedDetailsListItems) {
        const databaseSchemas = items.databaseSchemas || [];
        const selectedSchemas = databaseSchemas.filter(
          (schema) =>
            selectedDetailsListItems.find((it) => it.id === schema.id) !==
            undefined
        );

        setSelectedSchemas(selectedSchemas);
      }
    };
    const onSingleSchemaSelected = () => {
      if (selectedDetailsListItems && selectedDetailsListItems[0]) {
        const databaseSchemas = items.databaseSchemas || [];
        const selectedSchema = databaseSchemas.find(
          (schema) => schema.id === selectedDetailsListItems[0].id
        );
        if (selectedSchema) setSelectedSchema(selectedSchema);
      }
    };

    if (selectedDetailsListItems) {
      deleteMode ? onSchemaSelectionChange() : onSingleSchemaSelected();
    }
  }, [items, selectedDetailsListItems, deleteMode]);

  useEffect(() => {
    setDatabaseSchemasData(
      items.databaseSchemas?.map((schema) => ({
        databaseSchema: schema,
        deleteAfter: undefined,
        setToCooldownAt: undefined,
      })) || []
    );
  }, [items]);

  const onResetSort = () => {
    setShouldResetSort(false);
  };
  const onExitDeletionMode = () => {
    selection.setAllSelected(false);
    setSelectedDetailsListItems(undefined);
    setSelectedSchemas([]);
    setDeleteMode(false);
  };

  const onEnterDeletionMode = () => {
    selection.setAllSelected(false);
    setSelectedDetailsListItems(undefined);
    setSelectedSchema(undefined);
    setDeleteMode(true);
  };

  const onCancelDeletionClick = () => {
    setHasDeletionInformation(false);
    setConfirmDeletionDialogVisible(false);
  };

  const onExitDeletionClick = () => onFetch([affiliation]);

  const onDeleteSelectionConfirmed = () => {
    setConfirmDeletionDialogVisible(true);
  };

  const onFilterChange = (event: TextFieldEvent, newValue?: string) =>
    setFilter(newValue || '');

  const onCreateCopyConfirmed = () => setSchemaToCopy(selectedSchema);

  const onUpdateSchemaDialogClosed = () => {
    selection.setAllSelected(false);
    setSelectedSchema(undefined);
    setSelectedDetailsListItems(undefined);
  };

  const onConfirmDeletionClick = () => {
    if (selectedSchemas && selectedSchemas.length > 0) {
      const dbIds = selectedSchemas?.map((it) => it.id);

      onDeleteSchemas(dbIds);
      selection.setAllSelected(false);
      setHasDeletionInformation(true);
      setConfirmDeletionDialogVisible(false);
    }
  };

  return (
    <div className={className}>
      <div className="styled-action-bar">
        <div className="styled-input-and-delete">
          <div className="styled-input">
            <TextField
              placeholder="Søk etter skjema"
              onChange={onFilterChange}
              value={filter}
            />
          </div>
          <EnterModeThenConfirm
            confirmButtonEnabled={(selectedSchemas || []).length !== 0}
            confirmText="Slett valgte"
            inactiveIcon="Delete"
            inactiveText="Velg skjemaer for sletting"
            onEnterMode={onEnterDeletionMode}
            onExitMode={onExitDeletionMode}
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
            instances={instances}
          />
        </div>
      </div>
      {isFetching ? (
        <Spinner size={SpinnerSize.large} />
      ) : (
        <>
          <div style={{ position: 'relative', flex: 1 }}>
            <ScrollablePane>
              <DatabaseSchemaTable
                filter={filter}
                schemas={databaseSchemasData}
                multiSelect={deleteMode}
                selection={selection}
                onResetSort={onResetSort}
                shouldResetSort={shouldResetSort}
                isRestoreTable={false}
                selectedSchemas={selectedSchemas.map((selectedItem) => ({
                  databaseSchema: selectedItem,
                  deleteAfter: undefined,
                  setToCooldownAt: undefined,
                }))}
              />
            </ScrollablePane>
          </div>
          <div className="styled-load-more">
            <p>
              Viser {items.databaseSchemas?.length} av {items.totalCount}{' '}
              databaseskjemaer
            </p>
            <LoadingButton
              onClick={() =>
                items.databaseSchemas &&
                onFetchNext(
                  [affiliation],
                  items.databaseSchemas,
                  items.pageInfo.endCursor
                )
              }
              style={{
                minWidth: '225px',
              }}
              disabled={!items.pageInfo.hasNextPage || isFetchingNext}
              loading={isFetchingNext}
            >
              Hent flere databaseskjemaer
            </LoadingButton>
          </div>
        </>
      )}
      <DatabaseSchemaUpdateDialog
        schema={selectedSchema}
        clearSelectedSchema={onUpdateSchemaDialogClosed}
        onUpdate={onUpdate}
        onChangeCooldownSchema={onDelete}
        onTestJdbcConnectionForId={onTestJdbcConnectionForId}
        testJdbcConnectionResponse={testJdbcConnectionResponse}
        createNewCopy={onCreateCopyConfirmed}
        isRestoreDialog={false}
      />
      <ConfirmChangeCooldownDialog
        title="Slett databaseskjemaer"
        visible={confirmDeletionDialogVisible}
        onOkClick={onConfirmDeletionClick}
        onCancelClick={onCancelDeletionClick}
        onExitClick={onExitDeletionClick}
        schemasToChange={selectedSchemas || []}
        hasChangeInformation={hasDeletionInformation}
        changeCooldownResponse={deleteResponse}
        changeCooldownType={'slettet'}
        items={items}
      />
    </div>
  );
};

export default styled(Schema)`
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

  .styled-input-and-delete {
    display: flex;
    align-items: center;
  }

  .styled-input {
    width: 300px;
  }

  .styled-create {
    display: flex;
    align-items: center;
    margin-right: 20px;
  }

  .styled-load-more {
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-bottom: 10px;
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

import React, { useEffect, useState } from 'react';
import { Selection } from 'office-ui-fabric-react/lib-commonjs';
import styled from 'styled-components';
import TextField from '@skatteetaten/frontend-components/TextField';
import { TextFieldEvent } from '../../../types/react';
import {
  IDatabaseSchema,
  IRestorableDatabaseSchemas,
  IRestorableDatabaseSchema,
  IRestorableDatabaseSchemaData
} from '../../../models/schemas';
import { EnterModeThenConfirm } from './EnterModeThenConfirm';
import Spinner from 'components/Spinner';
import {
  RestorableDatabaseSchemaTable,
  IRestorableDatabaseSchemaView
} from './RestorableDatabaseSchemaTable';
import RestorableDatabaseSchemaUpdateDialog from './RestorableDatabaseSchemaUpdateDialog';

export interface IRestorableSchemaProps {
  className?: string;
  affiliation: string;
  isFetching: boolean;
  items: IRestorableDatabaseSchemas;
  onFetch: (affiliation: string[]) => void | undefined;
}

// export interface IRestorableSchemaState {
//   filter: string;
// }

function RestorableSchema({
  affiliation,
  onFetch,
  isFetching,
  items,
  className
}: IRestorableSchemaProps) {
  // public state: IRestorableSchemaState = {
  // filter: ''
  // };
  const [filter, setFilter] = useState<string>('');
  const [restoreMode, setRestoreMode] = useState<boolean>(false);
  const [selectedSchemas, setSelectedSchemas] = useState<
    IRestorableDatabaseSchemaData[] | undefined
  >(undefined);
  const [selectedSchema, setSelectedSchema] = useState<
    IRestorableDatabaseSchemaData | undefined
  >(undefined);
  const [shouldResetSort, setShouldResetSort] = useState<boolean>(false);

  useEffect(() => {
    onFetch([affiliation]);
  }, []);

  const onFilterChange = (event: TextFieldEvent, newValue?: string) => {
    setFilter(newValue || '');
  };

  const onResetSort = () => {
    setShouldResetSort(false);
  };

  const onExitRestorationMode = () => {
    setRestoreMode(false);
    setSelectedSchemas([]);
  };

  const onEnterRestorationMode = () => {
    setRestoreMode(true);
  };

  const onSchemaSelectionChange = () => {
    const selected: IRestorableDatabaseSchemaView[] = selection
      .getSelection()
      .map(it => it as IRestorableDatabaseSchemaView);
    const databaseSchemas = items.restorableDatabaseSchemas || [];
    const selectedSchemas = databaseSchemas.filter(
      schema =>
        selected.find(it => it.id === schema.databaseSchema.id) !== undefined
    );

    setSelectedSchemas(selectedSchemas);
  };

  const onSingleSchemaSelected = () => {
    const selected: IRestorableDatabaseSchemaView = selection
      .getSelection()
      .map(it => it as IRestorableDatabaseSchemaView)[0];
    console.log(selected);
    if (!selected) return;
    const databaseSchemas = items.restorableDatabaseSchemas || [];
    const selectedSchema = databaseSchemas.find(
      schema => schema.databaseSchema.id === selected.id
    );

    if (selectedSchema) setSelectedSchema(selectedSchema);
  };

  const selection = new Selection({
    onSelectionChanged: () => {
      if (restoreMode) {
        onSchemaSelectionChange();
      } else {
        onSingleSchemaSelected();
      }
    }
  });

  const onDeleteSelectionConfirmed = () => {};

  console.log(items);
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
            confirmButtonEnabled={[].length !== 0}
            confirmText="Gjennopprett valgte"
            inactiveIcon="History"
            inactiveText="Velg skjemaer for gjenoppretting"
            onEnterMode={onEnterRestorationMode}
            onExitMode={onExitRestorationMode}
            onConfirmClick={onDeleteSelectionConfirmed}
            iconColor="green"
          />
        </div>
      </div>
      {isFetching ? (
        <Spinner />
      ) : (
        <RestorableDatabaseSchemaTable
          filter={filter}
          schemas={items.restorableDatabaseSchemas || []}
          multiSelect={restoreMode}
          selection={selection}
          onResetSort={onResetSort}
          shouldResetSort={shouldResetSort}
        />
      )}
      <RestorableDatabaseSchemaUpdateDialog
        schema={selectedSchema}
        // clearSelectedSchema={onUpdateSchemaDialogClosed}
        // onUpdate={onUpdate}
        // onDelete={onDelete}
        // onTestJdbcConnectionForId={onTestJdbcConnectionForId}
        // testJdbcConnectionResponse={testJdbcConnectionResponse}
        // createNewCopy={onCreateCopyConfirmed}
      />
    </div>
  );
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

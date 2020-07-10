import * as React from 'react';
import palette from '@skatteetaten/frontend-components/utils/palette';
import styled from 'styled-components';
import {
  IRestorableDatabaseSchemaData,
  IUpdateDatabaseSchemaInputWithCreatedBy,
  IDatabaseSchema,
  ITestJDBCResponse,
  IChangeCooldownDatabaseSchemasResponse
} from 'models/schemas';
import { useState, useEffect, useRef } from 'react';
import Dialog from '@skatteetaten/frontend-components/Dialog';
import { Grid } from '@skatteetaten/frontend-components/Grid';
import { getLocalDatetime } from 'utils/date';
import JdbcConnection from './JdbcConnection';
import { TextFieldEvent } from 'types/react';
import Labels from './Labels';
import ConfirmationDialog from 'components/ConfirmationDialog';
import Button from '@skatteetaten/frontend-components/Button';
import ActionButton from '@skatteetaten/frontend-components/ActionButton';

const { skeColor } = palette;

interface IRestorableDatabaseSchemaUpdateDialogProps {
  schema?: IRestorableDatabaseSchemaData;
  className?: string;
  testJdbcConnectionResponse: ITestJDBCResponse;
  restoreResponse: IChangeCooldownDatabaseSchemasResponse;
  clearSelectedSchema: () => void;
  onUpdate: (databaseSchema: IUpdateDatabaseSchemaInputWithCreatedBy) => void;
  onDelete: (databaseSchema: IDatabaseSchema) => void;
  onTestJdbcConnectionForId: (id: string) => void;
  onRestoreDatabaseSchema: (schema: IDatabaseSchema, active: boolean) => void;
}

interface IUpdatedSchemaValues {
  id: string;
  discriminator: string;
  createdBy: string;
  engine: string;
  description: string;
  environment: string;
  application: string;
  affiliation: string;
}

function RestorableDatabaseSchemaUpdateDialog({
  schema,
  clearSelectedSchema,
  className,
  onTestJdbcConnectionForId,
  testJdbcConnectionResponse,
  onRestoreDatabaseSchema,
  restoreResponse
}: IRestorableDatabaseSchemaUpdateDialogProps) {
  const initialUpdatedSchemaValues: IUpdatedSchemaValues = {
    id: '',
    discriminator: '',
    createdBy: '',
    engine: '',
    description: '',
    environment: '',
    application: '',
    affiliation: ''
  };
  const [updatedSchemaValues, setUpdatedSchemaValues] = useState<
    IUpdatedSchemaValues
  >(initialUpdatedSchemaValues);

  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  const createNewCopy = () => {
    createNewCopy();
    clearSelectedSchema();
  };

  const handleLabelChange = (field: string) => (
    event: TextFieldEvent,
    newValue?: string
  ) => {
    setUpdatedSchemaValues(prevState => ({
      ...prevState,
      currentOrNewKey: newValue
    }));
  };

  const renderConfirmationOpenButton = (open: () => void) => (
    <ActionButton
      onClick={open}
      iconSize={ActionButton.LARGE}
      icon="Delete"
      color="black"
      style={{ float: 'left' }}
    >
      Gjenopprett
    </ActionButton>
  );

  const renderConfirmationFooterButtons = (close: () => void) => {
    const restoreSchema = () => {
      if (schema) {
        onRestoreDatabaseSchema(schema.databaseSchema, true);
        close();
        clearSelectedSchema();
      }
    };

    return (
      <>
        <ActionButton
          onClick={restoreSchema}
          iconSize={ActionButton.LARGE}
          icon="Check"
          color="black"
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

  const prevSchema = usePrevious(schema);

  useEffect(() => {
    if (schema) {
      if (typeof prevSchema === 'undefined') {
        const {
          id,
          environment,
          application,
          discriminator,
          engine,
          description,
          createdBy,
          affiliation
        } = schema.databaseSchema;
        setUpdatedSchemaValues({
          id: id,
          discriminator: discriminator,
          createdBy: createdBy,
          description: description ? description : '',
          engine: engine,
          environment: environment,
          application: application,
          affiliation: affiliation.name
        });
      }
    }
  }, [schema]);

  if (!!!schema) {
    return <div></div>;
  }

  const dateTimeFormat = (date?: Date | null) =>
    date ? getLocalDatetime(date) : '-';
  const user = schema.databaseSchema.users[0];

  console.log(restoreResponse);

  return (
    <Dialog
      hidden={!!!schema}
      onDismiss={clearSelectedSchema}
      minWidth="1000px"
      maxWidth="90%"
    >
      <div className={className}>
        <Grid>
          <Grid.Row>
            <Grid.Col lg={2} className="bold">
              <p>Id: </p>
              <p>Type: </p>
              <p>Engine: </p>
              <p>Opprettet: </p>
              <p>Sist brukt: </p>
            </Grid.Col>
            <Grid.Col lg={10}>
              <p>{schema.databaseSchema.id}</p>
              <p>{schema.databaseSchema.type}</p>
              <p>
                {schema.databaseSchema.type === 'EXTERNAL'
                  ? '-'
                  : schema.databaseSchema.engine}
              </p>
              <p>{dateTimeFormat(schema.databaseSchema.createdDate)}</p>
              <p>{dateTimeFormat(schema.databaseSchema.lastUsedDate)}</p>
            </Grid.Col>
          </Grid.Row>
          <hr />
          <Grid.Row>
            <Grid.Col lg={6}>
              <JdbcConnection
                username={user.username}
                jdbcUrl={schema.databaseSchema.jdbcUrl}
                id={schema.databaseSchema.id}
                onTestJdbcConnectionForId={onTestJdbcConnectionForId}
                testJdbcConnectionResponse={testJdbcConnectionResponse}
                isDisabledFields={true}
                hasPasswordField={false}
                canNotTest={true}
              />
            </Grid.Col>
            <Grid.Col lg={1} />
            <Grid.Col lg={5}>
              <Labels
                environment={updatedSchemaValues.environment}
                application={updatedSchemaValues.application}
                discriminator={updatedSchemaValues.discriminator}
                createdBy={updatedSchemaValues.createdBy}
                description={updatedSchemaValues.description}
                handleLabelChange={handleLabelChange}
                displayCreatedByField={true}
                isDisabledFields={true}
              />
            </Grid.Col>
          </Grid.Row>
        </Grid>
      </div>
      <div className={className}>
        <Dialog.Footer>
          <ConfirmationDialog
            title="Gjenopprett databaseskjema"
            text={`Ønsker du å gjenopprette databaseskjemaet til ${updatedSchemaValues.application}?`}
            renderOpenDialogButton={renderConfirmationOpenButton}
            renderFooterButtons={renderConfirmationFooterButtons}
          />
          <Button
            buttonStyle="primaryRoundedFilled"
            style={{ width: '120px', marginRight: '10px' }}
            icon="Clear"
            onClick={clearSelectedSchema}
          >
            Avbryt
          </Button>
        </Dialog.Footer>
      </div>
    </Dialog>
  );
}

export default styled(RestorableDatabaseSchemaUpdateDialog)`
  .bold {
    font-weight: bold;
  }

  .ms-TextField-wrapper {
    padding-bottom: 10px;
  }

  .ms-Button.is-disabled {
    color: ${skeColor.grey};
  }
`;

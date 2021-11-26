import * as React from 'react';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  IDatabaseApplicationDeployment,
  IDatabaseSchema,
  ITestJDBCResponse,
  IUpdateDatabaseSchemaInputWithCreatedBy,
} from 'web/models/schemas';
import {
  Dialog,
  Grid,
  Palette,
  Button,
  ActionButton,
} from '@skatteetaten/frontend-components';
import { getLocalDatetime } from 'web/utils/date';
import JdbcConnection from './JdbcConnection';
import { TextFieldEvent } from 'web/types/react';
import Labels from './Labels';
import ConfirmationDialog from 'web/components/ConfirmationDialog';
import SkeLink from '../../../components/SkeLink';
import DatabaseSchemaService from '../../../services/DatabaseSchemaService';
import { usePrevious } from 'utils/usePrevious';

const { skeColor } = Palette;

interface IDatabaseSchemaUpdateDialogProps {
  schema?: IDatabaseSchema;
  className?: string;
  testJdbcConnectionResponse: ITestJDBCResponse;
  clearSelectedSchema: () => void;
  onUpdate: (databaseSchema: IUpdateDatabaseSchemaInputWithCreatedBy) => void;
  onTestJdbcConnectionForId: (id: string) => void;
  onChangeCooldownSchema: (schema: IDatabaseSchema) => void;
  isRestoreDialog: boolean;
  createNewCopy?: () => void;
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

const DatabaseSchemaUpdateDialog = ({
  schema,
  clearSelectedSchema,
  className,
  onUpdate,
  onTestJdbcConnectionForId,
  testJdbcConnectionResponse,
  onChangeCooldownSchema,
  isRestoreDialog,
  createNewCopy,
}: IDatabaseSchemaUpdateDialogProps) => {
  const initialUpdatedSchemaValues: IUpdatedSchemaValues = {
    id: '',
    discriminator: '',
    createdBy: '',
    engine: '',
    description: '',
    environment: '',
    application: '',
    affiliation: '',
  };
  const [updatedSchemaValues, setUpdatedSchemaValues] =
    useState<IUpdatedSchemaValues>(initialUpdatedSchemaValues);
  const databaseService = new DatabaseSchemaService();

  const handleLabelChange =
    (field: string) => (event: TextFieldEvent, newValue?: string) => {
      setUpdatedSchemaValues((prevState) => ({
        ...prevState,
        [field]: newValue,
      }));
    };

  const renderConfirmationOpenButton = (open: () => void) => (
    <ActionButton
      onClick={open}
      iconSize={ActionButton.LARGE}
      icon="LockOutlineOpen"
      color="black"
      style={{ float: 'left' }}
    >
      {isRestoreDialog ? 'Gjenopprett' : 'Slett'}
    </ActionButton>
  );

  const updateLabels = () => {
    if (schema) {
      const newValues: IUpdateDatabaseSchemaInputWithCreatedBy = {
        affiliation: schema.affiliation.name,
        application: updatedSchemaValues.application,
        description: updatedSchemaValues.description,
        environment: updatedSchemaValues.environment,
        discriminator: updatedSchemaValues.discriminator,
        id: schema.id,
        createdBy: updatedSchemaValues.createdBy,
      };
      onUpdate(newValues);
      clearSelectedSchema();
    }
  };
  const renderConfirmationFooterButtons = (close: () => void) => {
    const changeCooldown = () => {
      if (schema) {
        onChangeCooldownSchema(schema);
        close();
        clearSelectedSchema();
      }
    };

    return (
      <>
        <ActionButton
          onClick={changeCooldown}
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
      if (prevSchema === undefined) {
        setUpdatedSchemaValues({
          id: schema.id,
          discriminator: schema.discriminator,
          createdBy: schema.createdBy,
          description: schema.description ? schema.description : '',
          engine: schema.engine,
          environment: schema.environment,
          application: schema.application,
          affiliation: schema.affiliation.name,
        });
      }
    }
  }, [prevSchema, schema]);

  const dateTimeFormat = (date?: Date | null) =>
    date ? getLocalDatetime(date) : '-';
  return (
    <>
      {!schema ? (
        <></>
      ) : (
        <Dialog
          hidden={!schema}
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
                  {!isRestoreDialog && <p>Brukes av: </p>}
                </Grid.Col>
                <Grid.Col lg={10}>
                  <p>{schema.id}</p>
                  <p>{schema.type}</p>
                  <p>{schema.type === 'EXTERNAL' ? '-' : schema.engine}</p>
                  <p>{dateTimeFormat(schema.createdDate)}</p>
                  <p>{dateTimeFormat(schema.lastUsedDate)}</p>

                  {!isRestoreDialog && (
                    <ApplicationLinks
                      applicationDeployments={schema.applicationDeployments}
                    />
                  )}
                </Grid.Col>
              </Grid.Row>
              <hr />
              <Grid.Row>
                <Grid.Col lg={6}>
                  <JdbcConnection
                    username={schema.users[0].username}
                    jdbcUrl={schema.jdbcUrl}
                    id={schema.id}
                    onTestJdbcConnectionForId={onTestJdbcConnectionForId}
                    testJdbcConnectionResponse={testJdbcConnectionResponse}
                    isDisabledFields={true}
                    hasPasswordField={false}
                    canNotTest={isRestoreDialog}
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
                    isDisabledFields={isRestoreDialog}
                  />
                </Grid.Col>
              </Grid.Row>
            </Grid>
          </div>
          <div className={className}>
            <Dialog.Footer>
              <ConfirmationDialog
                title={
                  isRestoreDialog
                    ? 'Gjenopprett databaseskjema'
                    : 'Slett databaseskjema'
                }
                text={`Ønsker du å ${
                  isRestoreDialog
                    ? 'gjenopprette databaseskjemaet'
                    : 'slette databaseskjemaet'
                } til ${updatedSchemaValues.application}?`}
                renderOpenDialogButton={renderConfirmationOpenButton}
                renderFooterButtons={renderConfirmationFooterButtons}
              />

              {!isRestoreDialog && createNewCopy && (
                <Button
                  buttonStyle="primaryRoundedFilled"
                  style={{ width: '162px', marginRight: '10px' }}
                  icon="Copy"
                  onClick={() => {
                    createNewCopy();
                    clearSelectedSchema();
                  }}
                >
                  Lag ny kopi
                </Button>
              )}
              <Button
                buttonStyle="primaryRoundedFilled"
                style={{ width: '120px', marginRight: '10px' }}
                icon="Clear"
                onClick={clearSelectedSchema}
              >
                Avbryt
              </Button>

              {!isRestoreDialog && (
                <Button
                  buttonStyle="primaryRoundedFilled"
                  style={{ width: '120px' }}
                  icon="Check"
                  onClick={updateLabels}
                  disabled={databaseService.isUpdateButtonDisabled(
                    updatedSchemaValues,
                    schema
                  )}
                >
                  Oppdater
                </Button>
              )}
            </Dialog.Footer>
          </div>
        </Dialog>
      )}
    </>
  );
};

interface IApplicationLinksProps {
  applicationDeployments: IDatabaseApplicationDeployment[];
  className?: string;
}

const ApplicationLinks = styled(
  ({ applicationDeployments, className }: IApplicationLinksProps) => {
    const title = (app: IDatabaseApplicationDeployment) => `
Miljø: ${app.namespace.name}
Affiliation: ${app.affiliation.name}
`;

    const links = applicationDeployments.map((it) => [
      <SkeLink
        key={it.id}
        title={title(it)}
        to={`/a/${it.affiliation.name}/deployments/${it.id}/info`}
      >
        {it.name}
      </SkeLink>,
    ]);

    if (links.length === 0) {
      return <p>Ingen</p>;
    }

    return <div className={className}>{links}</div>;
  }
)`
  a {
    margin-right: 5px;
  }
`;

export default styled(DatabaseSchemaUpdateDialog)`
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

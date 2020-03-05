import * as React from 'react';
import styled from 'styled-components';

import ActionButton from '@skatteetaten/frontend-components/ActionButton';
import Button from '@skatteetaten/frontend-components/Button';
import Dialog from '@skatteetaten/frontend-components/Dialog';
import Grid from '@skatteetaten/frontend-components/Grid';
import palette from '@skatteetaten/frontend-components/utils/palette';

import ConfirmationDialog from 'components/ConfirmationDialog';
import SkeLink from 'components/SkeLink';
import {
  IDatabaseApplicationDeployment,
  IDatabaseSchema,
  IUpdateDatabaseSchemaInputWithCreatedBy
} from 'models/schemas';
import DatabaseSchemaService from 'services/DatabaseSchemaService';
import { getLocalDatetime } from 'utils/date';
import JdbcConnection from './JdbcConnection';
import Labels from './Labels';
import { TextFieldEvent } from 'types/react';

const { skeColor } = palette;

export interface IDatabaseSchemaUpdateDialogProps {
  schema?: IDatabaseSchema;
  className?: string;
  clearSelectedSchema: () => void;
  onUpdate: (databaseSchema: IUpdateDatabaseSchemaInputWithCreatedBy) => void;
  onDelete: (databaseSchema: IDatabaseSchema) => void;
  onTestJdbcConnectionForId: (id: string) => void;
  testJdbcConnectionResponse: boolean;
  createNewCopy: () => void;
}

export interface IDatabaseSchemaUpdateDialogState {
  updatedSchemaValues: {
    id: string;
    discriminator: string;
    engine: string;
    createdBy: string;
    description?: string | null;
    environment: string;
    application: string;
    affiliation: string;
  };
}

class DatabaseSchemaUpdateDialog extends React.Component<
  IDatabaseSchemaUpdateDialogProps,
  IDatabaseSchemaUpdateDialogState
> {
  private databaseSchemaService = new DatabaseSchemaService();

  public state = {
    updatedSchemaValues: {
      id: '',
      discriminator: '',
      createdBy: '',
      engine: '',
      description: '',
      environment: '',
      application: '',
      affiliation: ''
    }
  };

  public componentDidUpdate(prevProps: IDatabaseSchemaUpdateDialogProps) {
    const { schema } = this.props;
    if (schema) {
      if (typeof prevProps.schema === 'undefined') {
        this.setState({
          updatedSchemaValues: {
            id: schema.id,
            discriminator: schema.discriminator,
            createdBy: schema.createdBy,
            description: schema.description ? schema.description : '',
            engine: schema.engine,
            environment: schema.environment,
            application: schema.application,
            affiliation: schema.affiliation.name
          }
        });
      }
    }
  }

  public hideDialog = () => {
    const { clearSelectedSchema } = this.props;
    clearSelectedSchema();
  };

  public createNewCopy = () => {
    const { createNewCopy } = this.props;
    createNewCopy();
    this.hideDialog();
  };

  public handleLabelChange = (field: string) => (
    event: TextFieldEvent,
    newValue?: string
  ) => {
    this.setState(state => ({
      updatedSchemaValues: {
        ...state.updatedSchemaValues,
        [field]: newValue
      }
    }));
  };

  public updateLabels = () => {
    const { schema, onUpdate } = this.props;
    const { updatedSchemaValues } = this.state;
    if (schema) {
      const newValues: IUpdateDatabaseSchemaInputWithCreatedBy = {
        affiliation: schema.affiliation.name,
        application: updatedSchemaValues.application,
        description: updatedSchemaValues.description,
        environment: updatedSchemaValues.environment,
        discriminator: updatedSchemaValues.discriminator,
        id: schema.id,
        createdBy: updatedSchemaValues.createdBy
      };
      onUpdate(newValues);
      this.hideDialog();
    }
  };

  public renderConfirmationOpenButton = (open: () => void) => (
    <ActionButton
      onClick={open}
      iconSize={ActionButton.LARGE}
      icon="Delete"
      color="black"
      style={{ float: 'left' }}
    >
      Slett
    </ActionButton>
  );

  public renderConfirmationFooterButtons = (close: () => void) => {
    const { schema, onDelete } = this.props;
    const deleteSchema = () => {
      if (schema) {
        onDelete(schema);
        close();
        this.hideDialog();
      }
    };

    return (
      <>
        <ActionButton
          onClick={deleteSchema}
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

  public render() {
    const {
      schema,
      className,
      testJdbcConnectionResponse,
      onTestJdbcConnectionForId
    } = this.props;
    const { updatedSchemaValues } = this.state;
    if (!schema) {
      return <div />;
    }

    const dateTimeFormat = (date?: Date | null) =>
      date ? getLocalDatetime(date) : '-';

    const user = schema.users[0];
    return (
      <Dialog
        hidden={!!!schema}
        onDismiss={this.hideDialog}
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
                <p>Brukes av: </p>
              </Grid.Col>
              <Grid.Col lg={10}>
                <p>{schema.id}</p>
                <p>{schema.type}</p>
                <p>{schema.engine}</p>
                <p>{dateTimeFormat(schema.createdDate)}</p>
                <p>{dateTimeFormat(schema.lastUsedDate)}</p>
                <ApplicationLinks
                  applicationDeployments={schema.applicationDeployments}
                />
              </Grid.Col>
            </Grid.Row>
            <hr />
            <Grid.Row>
              <Grid.Col lg={6}>
                <JdbcConnection
                  username={user.username}
                  jdbcUrl={schema.jdbcUrl}
                  id={schema.id}
                  onTestJdbcConnectionForId={onTestJdbcConnectionForId}
                  testJdbcConnectionResponse={testJdbcConnectionResponse}
                  isDisabledFields={true}
                  hasPasswordField={false}
                  canNotTest={false}
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
                  handleLabelChange={this.handleLabelChange}
                  displayCreatedByField={true}
                />
              </Grid.Col>
            </Grid.Row>
          </Grid>
        </div>
        <div className={className}>
          <Dialog.Footer>
            <ConfirmationDialog
              title="Slett databaseskjema"
              text={`Ønsker du å slette databaseskjemaet til ${updatedSchemaValues.application}?`}
              renderOpenDialogButton={this.renderConfirmationOpenButton}
              renderFooterButtons={this.renderConfirmationFooterButtons}
            />
            <Button
              buttonStyle="primaryRoundedFilled"
              style={{ width: '162px', marginRight: '10px' }}
              icon="Copy"
              onClick={this.createNewCopy}
            >
              Lag ny kopi
            </Button>
            <Button
              buttonStyle="primaryRoundedFilled"
              style={{ width: '120px', marginRight: '10px' }}
              icon="Clear"
              onClick={this.hideDialog}
            >
              Avbryt
            </Button>
            <Button
              buttonStyle="primaryRoundedFilled"
              style={{ width: '120px' }}
              icon="Check"
              onClick={this.updateLabels}
              disabled={this.databaseSchemaService.isUpdateButtonDisabled(
                updatedSchemaValues,
                schema
              )}
            >
              Oppdater
            </Button>
          </Dialog.Footer>
        </div>
      </Dialog>
    );
  }
}

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

    const links = applicationDeployments.map(it => [
      <SkeLink
        key={it.id}
        title={title(it)}
        to={`/a/${it.affiliation.name}/deployments/${it.id}/info`}
      >
        {it.name}
      </SkeLink>
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

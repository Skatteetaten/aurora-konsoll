import * as React from 'react';
import styled from 'styled-components';

import ActionButton from 'aurora-frontend-react-komponenter/ActionButton';
import Dialog from 'aurora-frontend-react-komponenter/Dialog';
import Grid from 'aurora-frontend-react-komponenter/Grid';
import palette from 'aurora-frontend-react-komponenter/utils/palette';

import ConfirmationDialog from 'components/ConfirmationDialog';
import {
  IDatabaseSchema,
  IUpdateDatabaseSchemaInputWithCreatedBy
} from 'models/schemas';
import DatabaseSchemaService from 'services/DatabaseSchemaService';
import { getLocalDatetime } from 'utils/date';
import JdbcConnection from './JdbcConnection';
import Labels from './Labels';

const { skeColor } = palette;

export interface IDatabaseSchemaUpdateDialogProps {
  schema?: IDatabaseSchema;
  className?: string;
  clearSelectedSchema: () => void;
  onUpdate: (databaseSchema: IUpdateDatabaseSchemaInputWithCreatedBy) => void;
  onDelete: (databaseSchema: IDatabaseSchema) => void;
  onTestJdbcConnectionForId: (id: string) => void;
  databaseSchemaService: DatabaseSchemaService;
  testJdbcConnectionResponse: boolean;
}

export interface IDatabaseSchemaUpdateDialogState {
  updatedSchemaValues: {
    id: string;
    discriminator: string;
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
  public state = {
    updatedSchemaValues: {
      id: '',
      discriminator: '',
      createdBy: '',
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

  public handleLabelChange = (field: string) => (value: string) => {
    this.setState(state => ({
      updatedSchemaValues: {
        ...state.updatedSchemaValues,
        [field]: value
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
          onClick={close}
          iconSize={ActionButton.LARGE}
          icon="Cancel"
          color="black"
        >
          Nei
        </ActionButton>
        <ActionButton
          onClick={deleteSchema}
          iconSize={ActionButton.LARGE}
          icon="Check"
          color="black"
        >
          Ja
        </ActionButton>
      </>
    );
  };

  public render() {
    const {
      schema,
      className,
      databaseSchemaService,
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
        dialogMinWidth="1000px"
        dialogMaxWidth="90%"
      >
        <div className={className}>
          <Grid>
            <Grid.Row>
              <Grid.Col lg={2} className="bold">
                <p>Id: </p>
                <p>Type: </p>
                <p>Opprettet: </p>
                <p>Sist brukt: </p>
              </Grid.Col>
              <Grid.Col lg={10}>
                <p>{schema.id}</p>
                <p>{schema.type}</p>
                <p>{dateTimeFormat(schema.createdDate)}</p>
                <p>{dateTimeFormat(schema.lastUsedDate)}</p>
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
                />
              </Grid.Col>
            </Grid.Row>
          </Grid>
        </div>
        <div className={className}>
          <Dialog.Footer>
            <ConfirmationDialog
              title="Slett databaseskjema"
              text={`Ønsker du å slette databaseskjemaet til ${
                updatedSchemaValues.application
              }?`}
              renderOpenDialogButton={this.renderConfirmationOpenButton}
              renderFooterButtons={this.renderConfirmationFooterButtons}
            />
            <ActionButton onClick={this.hideDialog}>Avbryt</ActionButton>
            <ActionButton
              onClick={this.updateLabels}
              disabled={databaseSchemaService.isUpdateButtonDisabled(
                updatedSchemaValues,
                schema
              )}
            >
              Oppdater
            </ActionButton>
          </Dialog.Footer>
        </div>
      </Dialog>
    );
  }
}

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

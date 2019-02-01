import * as React from 'react';
import styled from 'styled-components';

import ActionButton from 'aurora-frontend-react-komponenter/ActionButton';
import Button from 'aurora-frontend-react-komponenter/Button';
import Dialog from 'aurora-frontend-react-komponenter/Dialog';
import Grid from 'aurora-frontend-react-komponenter/Grid';
import TextField from 'aurora-frontend-react-komponenter/TextField';
import palette from 'aurora-frontend-react-komponenter/utils/palette';

import ConfirmationDialog from 'components/ConfirmationDialog';
import {
  IDatabaseSchema,
  IDatabaseSchemaInputWithUserId
} from 'models/schemas';
import DatabaseSchemaService from 'services/DatabaseSchemaService';

const { skeColor } = palette;

export interface IDatabaseSchemaDialogProps {
  schema?: IDatabaseSchema;
  className?: string;
  clearSelectedSchema: () => void;
  onUpdate: (databaseSchema: IDatabaseSchemaInputWithUserId) => void;
  onDelete: (databaseSchema: IDatabaseSchema) => void;
  databaseSchemaService: DatabaseSchemaService;
}

export interface IDatabaseSchemaDialogState {
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

class DatabaseSchemaDialog extends React.Component<
  IDatabaseSchemaDialogProps,
  IDatabaseSchemaDialogState
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

  public componentDidUpdate(prevProps: IDatabaseSchemaDialogProps) {
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
      const newValues: IDatabaseSchemaInputWithUserId = {
        affiliation: schema.affiliation.name,
        application: updatedSchemaValues.application,
        description: updatedSchemaValues.description,
        environment: updatedSchemaValues.environment,
        discriminator: updatedSchemaValues.discriminator,
        id: schema.id,
        userId: updatedSchemaValues.createdBy
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
    const { schema, className, databaseSchemaService } = this.props;
    const { updatedSchemaValues } = this.state;
    if (!schema) {
      return <div />;
    }
    const dateOptions = {
      minute: '2-digit',
      hour: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    };
    const dateTimeFormat = (date?: Date | null) =>
      date ? new Date(date).toLocaleDateString('nb-NO', dateOptions) : '';

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
              <Grid.Col lg={2} className="styled-labels">
                <p>Id: </p>
                <p>Type: </p>
                <p>Sist brukt: </p>
                <p>Opprettet: </p>
              </Grid.Col>
              <Grid.Col lg={10}>
                <p>{schema.id}</p>
                <p>{schema.type}</p>
                <p>{dateTimeFormat(schema.lastUsedDate)}</p>
                <p>{dateTimeFormat(schema.createdDate)}</p>
              </Grid.Col>
            </Grid.Row>
            <hr />
            <Grid.Row>
              <Grid.Col lg={6}>
                <h3>Tilkoblingsinformasjon</h3>
                <TextField
                  id={'username'}
                  label={'Brukernavn'}
                  value={user.username}
                  disabled={true}
                />
                <TextField
                  id={'jdbcUrl'}
                  label={'JDBC url'}
                  value={schema.jdbcUrl}
                  disabled={true}
                />
                <div className="styled-jdbc">
                  <Button buttonType="primary" style={{ width: '100%' }}>
                    TEST JDBC TILKOBLING
                  </Button>
                </div>
                <p>Gyldig JDBC tilkobling: </p>
              </Grid.Col>
              <Grid.Col lg={1} />
              <Grid.Col lg={5}>
                <h3>Labels</h3>
                <TextField
                  id={'environment'}
                  label={'Miljø'}
                  value={updatedSchemaValues.environment}
                  onChanged={this.handleLabelChange('environment')}
                />
                <TextField
                  id={'application'}
                  label={'Applikasjon'}
                  value={updatedSchemaValues.application}
                  onChanged={this.handleLabelChange('application')}
                />
                <TextField
                  id={'discriminator'}
                  label={'Diskriminator'}
                  value={updatedSchemaValues.discriminator}
                  onChanged={this.handleLabelChange('discriminator')}
                />
                <TextField
                  id={'createdBy'}
                  label={'Bruker'}
                  value={updatedSchemaValues.createdBy}
                  onChanged={this.handleLabelChange('createdBy')}
                />
                <TextField
                  id={'description'}
                  label={'Beskrivelse'}
                  value={updatedSchemaValues.description}
                  onChanged={this.handleLabelChange('description')}
                  multiline={true}
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

export default styled(DatabaseSchemaDialog)`
  .styled-labels {
    font-weight: bold;
  }
  .styled-jdbc {
    padding-top: 10px;
  }
  .ms-TextField-wrapper {
    padding-bottom: 10px;
  }

  .ms-Button.is-disabled {
    color: ${skeColor.grey};
  }
`;

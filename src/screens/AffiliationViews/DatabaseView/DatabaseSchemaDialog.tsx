import * as React from 'react';
import styled from 'styled-components';

import ActionButton from 'aurora-frontend-react-komponenter/ActionButton';
import Button from 'aurora-frontend-react-komponenter/Button';
import Dialog from 'aurora-frontend-react-komponenter/Dialog';
import Grid from 'aurora-frontend-react-komponenter/Grid';
import TextField from 'aurora-frontend-react-komponenter/TextField';
import palette from 'aurora-frontend-react-komponenter/utils/palette';

import { IDatabaseSchema, IDatabaseSchemaInput } from 'models/schemas';

const { skeColor } = palette;

export interface IDatabaseSchemaDialogProps {
  schema?: IDatabaseSchema;
  className?: string;
  clearSelectedSchema: () => void;
  onUpdate: (databaseSchema: IDatabaseSchemaInput) => void;
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
      const newValues: IDatabaseSchemaInput = {
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

  public isUpdateButtonDisabled = () => {
    const { schema } = this.props;
    const { updatedSchemaValues } = this.state;

    const isUnchangedValues = schema &&
    schema.application === updatedSchemaValues.application &&
    schema.description === updatedSchemaValues.description &&
    schema.environment === updatedSchemaValues.environment &&
    schema.discriminator === updatedSchemaValues.discriminator &&
    schema.createdBy === updatedSchemaValues.createdBy;

    const isEmptyValues = updatedSchemaValues.application === '' ||
    updatedSchemaValues.environment === '' ||
    updatedSchemaValues.discriminator === '' ||
    updatedSchemaValues.createdBy === '';

    return isUnchangedValues || isEmptyValues;
  };

  public render() {
    const { schema, className } = this.props;
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
    const dateTimeformat = (date?: Date | null) =>
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
                <p>{dateTimeformat(schema.lastUsedDate)}</p>
                <p>{dateTimeformat(schema.createdDate)}</p>
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
                />
              </Grid.Col>
            </Grid.Row>
          </Grid>
        </div>
        <div className={className}>
          <Dialog.Footer>
            <ActionButton onClick={this.hideDialog}>Avbryt</ActionButton>
            <ActionButton onClick={this.updateLabels} disabled={this.isUpdateButtonDisabled()}>Oppdater</ActionButton>
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
    padding-bottom: 7px;
  }

  .ms-Button.is-disabled {
    color: ${skeColor.grey};
  }
`;

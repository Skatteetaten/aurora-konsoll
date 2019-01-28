import * as React from 'react';
import styled from 'styled-components';

import ActionButton from 'aurora-frontend-react-komponenter/ActionButton';
import Button from 'aurora-frontend-react-komponenter/Button';
import Dialog from 'aurora-frontend-react-komponenter/Dialog';
import Grid from 'aurora-frontend-react-komponenter/Grid';
import TextField from 'aurora-frontend-react-komponenter/TextField';

import { IDatabaseSchema, IDatabaseSchemaInput } from 'models/schemas';

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

  public handleEnvironmentValue = (environment: string) => {
    this.setState(state => ({
      updatedSchemaValues: {
        ...state.updatedSchemaValues,
        environment
      }
    }));
  };

  public handleApplicationValue = (application: string) => {
    this.setState(state => ({
      updatedSchemaValues: {
        ...state.updatedSchemaValues,
        application
      }
    }));
  };

  public handleIdValue = (id: string) => {
    this.setState(state => ({
      updatedSchemaValues: {
        ...state.updatedSchemaValues,
        id
      }
    }));
  };

  public handleDiscriminatorValue = (discriminator: string) => {
    this.setState(state => ({
      updatedSchemaValues: {
        ...state.updatedSchemaValues,
        discriminator
      }
    }));
  };

  public handleUserIdValue = (createdBy: string) => {
    this.setState(state => ({
      updatedSchemaValues: {
        ...state.updatedSchemaValues,
        createdBy
      }
    }));
  };

  public handleDescriptionValue = (description: string) => {
    this.setState(state => ({
      updatedSchemaValues: {
        ...state.updatedSchemaValues,
        description
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

  public render() {
    const { schema, className } = this.props;

    if (!schema) {
      return <div />;
    }

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
                <p>Opprettet av: </p>
                <p>Sist brukt: </p>
                <p>Opprettet: </p>
                <p>Type: </p>
              </Grid.Col>
              <Grid.Col lg={10}>
                <p>{schema.id}</p>
                <p>{schema.createdBy}</p>
                <p>{schema.lastUsedDate}</p>
                <p>{schema.createdDate}</p>
                <p>{schema.type}</p>
              </Grid.Col>
            </Grid.Row>
            <Grid.Row>
              <Grid.Col lg={6}>
                <h3>Tilkoblingsinformasjon</h3>
                <TextField
                  id={'username'}
                  label={'Brukernavn'}
                  value={user.username}
                  readonly={true}
                />
                <TextField
                  id={'jdbcUrl'}
                  label={'jdbcUrl'}
                  value={schema.jdbcUrl}
                  readonly={true}
                />
                <Button buttonType="primary">TEST JDBC TILKOBLING</Button>
                <p>Gyldig JDBC tilkobling: </p>
              </Grid.Col>
              <Grid.Col lg={6}>
                <h3>Labels</h3>
                <TextField
                  id={'environment'}
                  label={'Miljø'}
                  value={schema.environment}
                  onChanged={this.handleEnvironmentValue}
                />
                <TextField
                  id={'application'}
                  label={'Applikasjon'}
                  value={schema.application}
                  onChanged={this.handleApplicationValue}
                />
                <TextField
                  id={'discriminator'}
                  label={'Diskriminator'}
                  value={schema.discriminator}
                  onChanged={this.handleDiscriminatorValue}
                />
                <TextField
                  id={'userId'}
                  label={'Bruker'}
                  value={schema.createdBy}
                  onChanged={this.handleUserIdValue}
                />
                <TextField
                  id={'description'}
                  label={'Beskrivelse'}
                  value={schema.description}
                  onChanged={this.handleDescriptionValue}
                />
              </Grid.Col>
            </Grid.Row>
          </Grid>
        </div>
        <Dialog.Footer>
          <ActionButton onClick={this.updateLabels}>Lagre</ActionButton>
          <ActionButton onClick={this.hideDialog}>Lukk</ActionButton>
        </Dialog.Footer>
      </Dialog>
    );
  }
}

export default styled(DatabaseSchemaDialog)`
  .styled-labels {
    font-weight: bold;
  }
`;
